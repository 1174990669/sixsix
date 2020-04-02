;
$(function () {
    var isSent = false;
    var key = 'emailCodeForBindEmail';
    // 表单效果
    // focusblur();

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
            var email = getEmail();

            // 验证
            var result = checkEmail(email);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var url = '/user/user/getBindEmailCaptcha';
            $.post(url, {
                m: encrypt('validate', key),
                email: email,
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

            // 验证邮箱
            var email = getEmail();
            var result = checkEmail(email);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            next();
        },
        onExit: function () {}
    });

    // 绑定密保邮箱
    $(".login").on("click", "#resetPasswordBtn", function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        // 验证
        var email = getEmail(),
            code = getEmailCode();
        var result = checkEmail(email);
        if (typeof result == 'string') {
            layer.msg(result);
            return false;
        }

        if (code === '') {
            layer.msg('请输入邮箱验证码');
            return false;
        }

        // ajax提交
        $.ajax({
            url: '/user/user/bindEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                m: encrypt('validate', key),
                email: email,
                captcha: code
            },
            success: function (res) {
                if (res.code == 0) {
                    // 显示设置成功页面
                    $('#email').html(res.data['email']);
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
        if (getEmail().length >= 6 && getEmailCode().length === 6) {
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

    /**
     * 验证邮箱
     * @param email
     * @returns {string|boolean}
     */
    var checkEmail = function (email) {
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
});

function getEmail() {
    return $('.monitor-input1').val();
}

function getEmailCode() {
    return $('.monitor-input2').val()
}