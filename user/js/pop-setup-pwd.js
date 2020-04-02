;
$(function () {
    var isSent = false;
    var key = 'smsCodeForSetPassword';
    // 国际区号
    areaCodeInt();
    // 表单效果
    // focusblur();
    //切换密码明文与否
    switchPassword();

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

            layer.load(2);

            var url = '/user/user/getSetPasswordCaptcha';
            $.post(url, {
                m: encrypt('validate', key),
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
            //console.log('退出验证')
        }
    });

    // 设置登录密码
    $(".login").on("click", "#resetPasswordBtn", function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        var code = getCode();
        var password = $('#password').val();

        // ajax提交
        $.ajax({
            url: '/user/user/setPassword',
            type: 'POST',
            dataType: 'json',
            data: {
                captcha: code,
                password: window.btoa(encrypt('password', password)),
                m: encrypt('validate', key)
            },
            success: function (res) {
                if (res.code == 0) {
                    // 设置成功标识
                    parent.$('.password-state').attr('data-state', '1');
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
        var code = getCode(),
            password = getPassword();
        if (code.length === 6 && password.length >= 6) {
            $(".login .normal .normal-login .login-btn a").addClass("login-btn-active");
        } else {
            $(".login .normal .normal-login .login-btn a").removeClass("login-btn-active");
        }
    });

    // 设置/修改密码后，重新登录
    $(document).on("click", "#resSuccessBtn", function () {
        parent.layer.closeAll();
        parent.location.reload();
    });
});

function getCode() {
    return $('#yzmInput').val();
}

function getPassword() {
    return $('#password').val();
}