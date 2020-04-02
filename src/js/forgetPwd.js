;
$(function () {
    //初始化绑定手机区号
    initTelCountry($('#setNum'));

    function initTelCountry($tel) {
        var userCountry = $tel.data('area');
        var tel = $tel.val();
        if (!tel) {
            $tel.intlTelInput({
                initialCountry: userCountry, // 初始国家
                preferredCountries: ['cn', 'us'], // 优先显示的国家
                separateDialCode: true // 显示区号
            });
        }
    }

    $('.passwordActive').on('click', function (e) {
        $(this).toggleClass('show');
        var isHas = $(this).hasClass('show');
        var $pwdInput = $(this).siblings('.input-pwd');
        if (isHas) {
            $pwdInput[0].setAttribute('type', 'text');
        } else {
            $pwdInput[0].setAttribute('type', 'password');
        }
    })

    $('#setNum').on('keyup', function (e) {
        var value = $(this).val().replace(/\D+/g, '');
        $(this).val(value);
        if (value.length > 0) {
            $('.js_GetTelcode').addClass('active');
        } else {
            $('.js_GetTelcode').removeClass('active');
        }
    })


    $('#toLoginBtn').on('click', function (e) {
        toOpenLogin();
    });
    $('.js_BackLogin').on('click', function (e) {
        toOpenLogin();
    });

    function toOpenLogin() {
        parent.layer.closeAll();
        parent.openLogin();
    }

    //  监听input值
    $(document).on("input propertychange", function () {
        var data = {};
        var obj = $('.bind-form').serializeArray();
        $.each(obj, function () {
            data[this.name] = this.value;
        });
        //登录
        if (data.setNum.length > 0 && data.setPwd.length >= 6 && data.setCode.length > 0) {
            $('#setPwdBtn').addClass('login-btn-active');
        } else {
            $('#setPwdBtn').removeClass('login-btn-active');
        }

    });

    var isSent = false;
    var isVoice = false;
    var codeType = 0;
    var loginType = -1;
    // 注册的行为验证-短信验证码
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
            layer.msg('验证服务异常');
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
            var $codeBtn = $('#sendYzm>span');
            var url = '/login/password_login/getResetPwdCaptcha';
            $.post(url, {
                m: encrypt('validate', getKey()),
                phone: phone,
                area_code: telAreaCode,
                authenticate: authenticate,
                token: token,
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');
                if (res.code == 0) {
                    isVoice = false;
                    isSent = true;
                    codeType = 2;
                    var i = 60;
                    $codeBtn.text(i + 's后获取');
                    var timer = setInterval(function () {
                        i--;
                        $codeBtn.text(i + 's后获取');
                        if (i == 0) {
                            isSent = false;
                            clearInterval(timer);
                            $codeBtn.text('获取验证码');
                        }
                    }, 1000);
                }
            });
            close();
        },
        onFail: function (code, msg, retry) {
            retry();
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent || isVoice) {
                layer.msg('操作频繁，请稍等');
                return false;
            }
            // 验证
            var telAreaCode = getTelAreaCode(),
                phone = getPhone();
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }
            next();
        },
        onExit: function () {}
    });

    // 注册的行为验证-语音验证码
    new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('voiceBtn'),
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
            var phone = getPhone(),
                telAreaCode = getTelAreaCode();

            // 验证手机号码
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }
            layer.load(2);
            var url = '/login/password_login/getResetPwdVoiceCaptcha';
            $.post(url, {
                m: encrypt('validate', getKey()),
                phone: phone,
                area_code: telAreaCode,
                authenticate: authenticate,
                token: token,
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');
                if (res.code == 0) {
                    isSent = false;
                    isVoice = true;
                    codeType = 1;
                    $(".bind-form .sendYzmvoice").text("60s");
                    $(".bind-form .yzm-voice-1").hide();
                    $(".bind-form .yzm-voice-2").show();
                    var t = 60;
                    var timer = null;
                    timer = setInterval(function () {
                        t--;
                        $(".bind-form .sendYzmvoice").text(t + "s");
                        if (t == 0) {
                            isVoice = false;
                            clearInterval(timer);
                            $(".bind-form .yzm-voice-2").hide();
                            $(".bind-form .yzm-voice-1").show();
                        }
                    }, 1000);
                }
            });
            close();
        },
        onFail: function (code, msg, retry) {
            retry();
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent || isVoice) {
                layer.msg('操作频繁，请稍等');
                return false;
            }
            // 验证
            var telAreaCode = getTelAreaCode(),
                phone = getPhone();
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }
            next();
        },
        onExit: function () {}
    });

    //回车
    $('.bind-form').on('keydown', function (e) {
        if (e.keyCode === 13 && $('#setPwdBtn').hasClass('login-btn-active')) {
            toResetPwd();
        }
    });
    $(document).on('click', '#setPwdBtn', function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;
        toResetPwd();
    });

    function toResetPwd() {
        // var data = {};
        // var obj = $('.bind-form').serializeArray();
        // $.each(obj, function () {
        //     data[this.name] = this.value;
        // });
        var telAreaCode = getTelAreaCode(),
            phone = getPhone(),
            code = getPhoneCode(),
            password = getPassword();

        if (phone === '') {
            layer.msg('请输入手机号');
            return false;
        }
        if (password === '') {
            layer.msg('请输入密码');
            return false;
        } else if (password.length > 20 || password.length < 6) {
            layer.msg('请输入6-20位密码');
            return false;
        }

        if (code === '') {
            layer.msg('请输入验证码');
            return false;
        }
        var data = {
            phone: phone,
            password: password ? window.btoa(encrypt('password', password)) : '',
            // login_source: login_source,
            area_code: telAreaCode,
            captcha: code,
            // token: encrypt('validate', loginType),
        };

        var url = "/login/password_login/setPassword";
        $.post(url, data, function (res) {
            console.log(res);
            // var obj = JSON.parse(res);
            if (res.code == 0) {
                layer.msg('重置成功');

                //如果成功
                $('.login-container').hide();
                $('.set-success-container').show();

            } else {
                layer.msg(res.msg);
            }
        });
    }

});

// 获取国家区号
function getTelAreaCode() {
    var areaCode = $('.selected-dial-code').text();
    return areaCode.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

// 获取手机号码
function getPhone() {
    return $('input[name="setNum"]').val();
}

// 获取账号
function getAccount() {
    return $('input[name="setNum"]').val();
}

// 获取密码
function getPassword() {
    return $('input[name="setPwd"]').val();
}

// 验证短信验证码
function getPhoneCode() {
    return $('input[name="setCode"]').val();
}

// 获取key
function getKey() {
    return 'smsCodeForLogin';
}

// 获取语音key
function getVoiceKey() {
    return 'voiceCodeForLogin';
}
// 验证手机号码
function checkPhone(telAreaCode, phone) {
    if (phone == '') {
        return '请输入手机号码';
    }

    // 验证
    var wholePhone = telAreaCode + phone;
    var regular = objSite.phoneRegular(telAreaCode);
    if (telAreaCode === '+86') {
        wholePhone = phone;
    }

    if (!regular.test(wholePhone)) {
        return '手机号码格式错误';
    }

    return true;
}