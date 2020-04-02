;
$(function () {
    var isSent = false;
    var key = 'smsCodeForBindPhone';
    // 国际区号
    areaCodeInt();
    // 表单效果
    // focusblur();

    // 初始化
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
            var phone = getPhone(),
                telAreaCode = getTelAreaCode();

            // 验证手机号码
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var url = '/user/user/getBindPhoneCaptcha';
            $.post(url, {
                m: encrypt('validate', key),
                phone: phone,
                area_code: telAreaCode,
                authenticate: authenticate,
                token: token
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.code == 0) {
                    var $codeBtn = $('#sendYzm span');
                    var i = 60;
                    $codeBtn.text(i + 's后获取');
                    isSent = true;
                    var timer = setInterval(function () {
                        i--;
                        $codeBtn.text(i + 's后获取');
                        if (i == 0) {
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
            // 失败回调
            // console.log('出错啦：' + msg + ' code: ' + code);
            retry()
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent) return false;

            next();
        },
        onExit: function () {
            // 退出验证 （仅限dialog模式有效）
        }
    });

    // 绑定密保手机
    $(".login").on("click", "#resetPasswordBtn", function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        var phone = getPhone(),
            code = $('#yzmInput').val(),
            telAreaCode = getTelAreaCode();


        // 验证手机号码
        var result = checkPhone(telAreaCode, phone);
        if (typeof result == 'string') {
            layer.msg(result);
            return false;
        }

        if (code === '') {
            layer.msg('请输入验证码');
            return false;
        }

        // ajax提交
        $.ajax({
            url: '/user/user/bindPhone',
            type: 'POST',
            dataType: 'json',
            data: {
                phone: phone,
                captcha: code,
                area_code: telAreaCode,
                m: encrypt('validate', key)
            },
            success: function (res) {
                if (res.code == 0) {
                    // 显示设置成功页面
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
        if ($(".monitor-input1").val().length >= 6 && $(".monitor-input2").val().length >= 6) {
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

function getPhone() {
    return $('#selectAreaCode').val();
}

function getTelAreaCode() {
    return $('.selected-dial-code').text();
}

/**
 * 验证手机号码
 * @param telAreaCode
 * @param phone
 * @returns {string|boolean}
 */
function checkPhone(telAreaCode, phone) {
    // 验证手机号码
    if (phone === '') {
        return '请输入手机号码';
    }

    var wholePhone = telAreaCode === '+86' ? phone : telAreaCode + phone;
    var regular = objSite.phoneRegular(telAreaCode);
    if (!regular.test(wholePhone)) {
        return '手机号码格式错误';
    }
    return true;
}