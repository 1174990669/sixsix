;
$(function () {
    var isSent1 = false;
    var isSent2 = false;
    var key1 = 'smsCodeForModifyPhone';
    var key2 = 'smsCodeForNewPhone';
    // 国际区号
    areaCodeInt();
    // 表单效果
    // focusblur();

    // 行为验证-短信验证码
    var YpRiddler1 = new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('sendYzm-1'),
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
            layer.msg('验证服务异常');
        },
        onSuccess: function (validInfo, close) {
            // 成功回调
            var token = validInfo.token;
            var authenticate = validInfo.authenticate;

            layer.load(2);

            var url = '/user/user/getBindedPhoneCaptcha';
            $.post(url, {
                m: encrypt('validate', key1),
                authenticate: authenticate,
                token: token
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.code == 0) {
                    var $codeBtn = $('#sendYzm-1 span');
                    var i = 60;
                    $codeBtn.text(i + 's后获取');
                    isSent1 = true;
                    var timer = setInterval(function () {
                        i--;
                        $codeBtn.text(i + 's后获取');
                        if (i == 0) {
                            isSent1 = false;
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
            if (isSent1) return false;

            next();
        },
        onExit: function () {}
    });

    // 行为验证-邮箱验证码
    var YpRiddler2 = new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('sendYzm-2'),
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
            layer.msg('验证服务异常');
        },
        onSuccess: function (validInfo, close) {
            // 成功回调
            var token = validInfo.token;
            var authenticate = validInfo.authenticate;
            var phone = getNewPhone(),
                telAreaCode = getNewTelAreaCode();

            // 验证手机号码
            var result = checkPhone(telAreaCode, phone, '新密保手机号码');
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var url = '/user/user/getNewBindPhoneCaptcha';
            $.post(url, {
                m: encrypt('validate', key2),
                phone: phone,
                area_code: telAreaCode,
                authenticate: authenticate,
                token: token
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.code == 0) {
                    var $codeBtn = $('#sendYzm-2 span');
                    var i = 60;
                    $codeBtn.text(i + 's后获取');
                    isSent2 = true;
                    var timer = setInterval(function () {
                        i--;
                        $codeBtn.text(i + 's后获取');
                        if (i == 0) {
                            isSent2 = false;
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
            // 失败回调
            // console.log('出错啦：' + msg + ' code: ' + code);
            retry()
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent2) return false;

            // 验证手机号码
            var phone = getNewPhone(),
                telAreaCode = getNewTelAreaCode();
            var result = checkPhone(telAreaCode, phone, '新密保手机号码');
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            next();
        },
        onExit: function () {}
    });

    // 绑定密保手机
    $(".login").on("click", "#resetPasswordBtn", function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        var oldCode = getOldCode();

        var phone = getNewPhone(),
            code = getNewCode(),
            telAreaCode = getNewTelAreaCode();

        // 验证新手机号码
        var result2 = checkPhone(telAreaCode, phone, '新密保手机号码');
        if (typeof result2 == 'string') {
            layer.msg(result2);
            return false;
        }

        if (oldCode === '') {
            layer.msg('请输入旧密保手机短信验证码');
            return false;
        }

        if (code === '') {
            layer.msg('请输入新密保手机短信验证码');
            return false;
        }

        phone = phone.toString();
        telAreaCode = telAreaCode.toString();

        //         phone   手机号
        // area_code    区号
        // bind_captcha    原来绑定的手机收到的短信验证码
        // captcha    
        var formData = {
            bind_captcha: oldCode,
            phone: phone,
            area_code: telAreaCode,
            captcha: code,
            m1: encrypt('validate', key1),
            m2: encrypt('validate', key2)
        };
        // ajax提交
        $.ajax({
            url: '/user/user/updateBindPhone',
            type: 'POST',
            dataType: 'json',
            data: formData,
            success: function (res) {
                if (res.code == 0) {
                    // 显示设置成功页面
                    $('#phone').html(res.data.phone);
                    $(".login").addClass("res-success");
                } else {
                    layer.msg(res.msg);
                }
            }
        });

        return false;
    });

    //  监听input值
    $(document).on("input propertychange", function () {
        var oldCode = getOldCode(),
            newPhone = getNewPhone(),
            newCode = getNewCode();
        if (oldCode.length === 6 && newPhone.length >= 6 && newCode.length === 6) {
            $(".login .normal .normal-login .login-btn a").addClass("login-btn-active");
        } else {
            $(".login .normal .normal-login .login-btn a").removeClass("login-btn-active");
        }
    });

    // 绑定手机号后关闭弹窗
    $(document).on("click", "#resSuccessBtn", function () {
        parent.layer.closeAll();
        parent.location.reload();
    });
});

function getNewPhone() {
    return $('.monitor-input3').val();
}

function getNewTelAreaCode() {
    return $('[data-type="new"]').find('.selected-dial-code').text();
}

function getOldCode() {
    return $('.monitor-input2').val();
}

function getNewCode() {
    return $('.monitor-input4').val();
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