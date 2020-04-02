;
$(function () {
    var isSent1 = false;
    var isSent2 = false;
    var key1 = 'smsCodeForModifyEmail';
    var key2 = 'emailCodeForNewEmail';
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

            var url = '/user/user/getModifyEmailPhoneCaptcha';
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
            // 失败回调
            // console.log('出错啦：' + msg + ' code: ' + code);
            retry()
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent1) return false;

            next();
        },
        onExit: function () {}
    });

    // 行为验证-初始化-邮箱验证码
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

            var url = '/user/user/getModifyEmailCaptcha';
            $.post(url, {
                m: encrypt('validate', key2),
                email: email,
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

    // 修改密保邮箱
    $(".login").on("click", "#resetPasswordBtn", function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        var code = getCode(),
            emailCode = getEmailCode(),
            email = getEmail();

        var result = checkEmail(email);
        if (typeof result == 'string') {
            layer.msg(result);
            return false;
        }

        if (code === '') {
            layer.msg('请输入短信验证码');
            return false;
        }
        if (emailCode === '') {
            layer.msg('请输入邮箱验证码');
            return false;
        }
        // email : 邮箱，必填    示例： 305139343@qq.com
        // captcha : 邮件中的验证码，必填    示例： 345346
        // phone_captcha : 手机验证码
        // ajax提交
        $.ajax({
            url: '/user/user/modifyEmail',
            type: 'POST',
            dataType: 'json',
            data: {
                email: email,
                captcha: emailCode,
                phone_captcha: code,
                m1: encrypt('validate', key1),
                m2: encrypt('validate', key2)
            },
            beforeSend: function () {
                layer.load(2);
            },
            success: function (res) {
                layer.closeAll('loading');
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
        if (getCode().length === 6 && getEmail().length >= 6 && getEmailCode().length === 6) {
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
    return $('.monitor-input2').val();
}

// 获取邮箱
function getEmail() {
    return $('.monitor-input3').val();
}

// 获取邮箱验证码
function getEmailCode() {
    return $('.monitor-input4').val();
}