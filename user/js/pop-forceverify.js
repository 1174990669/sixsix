;$(function () {
    var isSent = false;
    var key = 'forceverify';
    var data = {
        verify: $('#verify').val(),
        account: $('#account').val(),
        fv: $('#fv').val()
    };
    $('#verify').remove();
    $('#fv').remove();

    if (data.verify === 'phone') {
        var phoneInfo = data.account.split('-');
        data.area_code = phoneInfo[0];
        data.phone = phoneInfo[1];
        data.code_url = '/account/validate/sendCode';
    } else {
        data.email = data.account;
        data.code_url = '/account/validate/sendEmailCode';
    }

    // 行为验证-初始化
    new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('sendYzm'),
        appId: 'cd6822d29e88459394bf172cc94ca46d',
        version: 'v1',
        noButton: true,
        winWidth: 350,
        onError: function (param) {
            if (param.code == 429) {
                layer.msg('请求过于频繁，请稍后再试！');
                return
            }
            // 异常回调
            layer.msg('验证服务异常')
        },
        onSuccess: function (validInfo, close) {
            // 成功回调
            var token = validInfo.token;
            var authenticate = validInfo.authenticate;

            // 验证
            var result = check(data);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var payload = {
                m: encrypt('validate', key),
                authenticate: authenticate,
                token: token
            };
            if (data.verify === 'phone') {
                payload.phone = data.phone;
                payload.tel_area_code = data.area_code;
            } else {
                payload.email = data.email;
            }
            $.post(data.code_url, payload, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.status) {
                    var $codeBtn = $('#sendYzm span');
                    var i = 60;
                    $codeBtn.text(i + 's后获取');
                    isSent = true;
                    var timer = setInterval(function () {
                        i--;
                        $codeBtn.text(i + 's后获取');
                        if (i === 0) {
                            isSent = false;
                            clearInterval(timer);
                            $codeBtn.parent().width('115');
                            $codeBtn.html('收不到验证码？');
                        }
                    }, 1000);
                }
            });
            close();
        },
        onFail: function (code, msg, retry) {
            retry()
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent) return false;

            var result = check(data);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            next();
        },
        onExit: function () {}
    });

    // 安全验证
    $(document).on('click', '#submit.btn-active', function (e) {
        // 阻止默认提交
        e.preventDefault();

        forceverify();
        return false;
    });

    //  监听input值
    $(document).on('input propertychange', function () {
        if (getCode().length === 6) {
            $('#submit').addClass('btn-active');
        } else {
            $('#submit').removeClass('btn-active');
        }
    });
    //  监听input回车
    $(document).on('input keypress', function (e) {
        if (e.keyCode == 13 && getCode().length == 6) {
            forceverify();
        }
    });

    function forceverify() {
        // 验证
        var result = check(data);
        if (typeof result == 'string') {
            layer.msg(result);
            return false;
        }

        var code = getCode();
        if (code == '') {
            var name = data.verify === 'phone' ? '短信' : '邮箱';
            layer.msg('请输入' + name + '验证码');
            return false;
        }

        // ajax提交
        var submitForm = true;
        $.ajax({
            url: '/account/operation/forceverify',
            type: 'POST',
            dataType: 'json',
            data: {
                m: encrypt('validate', key),
                code: code,
                fv: data.fv
            },
            beforeSend: function () {
                submitForm = false;
            },
            success: function (res) {
                if (res.status == 0) {
                    layer.msg(res.msg);
                    return false;
                } else {
                    switch (res.data.scene) {
                        case 'login':
                            res.data = res.data.data;
                            parent.window.objSite.loginInHtml(res);
                            parent.layer.closeAll();
                            parent.window.location.reload();
                            break;
                        case 'lyk_offline_login':
                            window.location.href = res.data.data;
                            break;
                        default:
                            parent.layer.closeAll();
                            parent.window.location.reload();
                    }
                }
            },
            complete: function () {
                submitForm = true;
            }
        });
    }
});

/**
 * 验证
 * @param data
 * @returns {string|boolean}
 */
function check(data) {
    var result = true;
    if (data.verify === 'phone') {
        result = checkPhone(data.area_code, data.phone);
    } else {
        result = checkEmail(data.email);
    }

    return result;
}

/**
 * 验证手机号码
 * @param telAreaCode
 * @param phone
 * @param name
 * @returns {string|boolean}
 */
function checkPhone(telAreaCode, phone, name) {
    name = typeof name == 'undefined' ? '手机号码' : name;
    // 验证手机号码
    if (phone === '') {
        return '请输入' + name;
    }

    var wholePhone = telAreaCode === '+86' ? phone : telAreaCode + phone;
    var regular = objSite.phoneRegular(telAreaCode);
    if (!regular.test(wholePhone)) {
        return name + '格式错误';
    }
    return true;
}

/**
 * 验证邮箱
 * @param email
 * @returns {string|boolean}
 */
function checkEmail(email) {
    // 邮箱正则
    var regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

    // 验证
    if (email === '') {
        return '请输入邮箱';
    }
    if (!regEmail.test(email)) {
        return '您输入的邮箱有误';
    }

    return true;
}

// 验证短信验证码
function getCode() {
    return $('#word-valicode').val();
}