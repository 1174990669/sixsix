;
$(function () {
    //初始化登录手机区号
    initTelCountry($('#telNumber'));
    //初始化注册手机区号
    initTelCountry($('#registerNum'));

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

});
$(function () {
    var isSent = false;
    var isVoice = false;
    var codeType = 0;
    var loginType = -1;

    // 行为验证-初始化-短信验证码
    new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('sendLoginYzm'),
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
            var $codeBtn = $('#sendLoginYzm>span');
            var url = '/login/password_login/getLoginCaptcha';

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

    // 行为验证-初始化-语音验证码
    new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('loginVoiceBtn'),
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
            var url = '/login/password_login/getLoginVoiceCaptcha';
            $.post(url, {
                m: encrypt('validate', getVoiceKey()),
                phone: phone,
                area_code: telAreaCode,
                authenticate: authenticate,
                token: token
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.code == 0) {
                    isSent = false;
                    isVoice = true;
                    codeType = 1;
                    $(".login-form .sendYzmvoice").text("60s");
                    $(".login-form .yzm-voice-1").hide();
                    $(".login-form .yzm-voice-2").show();
                    var t = 60;
                    var timer = null;
                    timer = setInterval(function () {
                        t--;
                        $(".login-form .sendYzmvoice").text(t + "s");
                        if (t == 0) {
                            isVoice = false;
                            clearInterval(timer);
                            $(".login-form .yzm-voice-2").hide();
                            $(".login-form .yzm-voice-1").show();
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
            var telAreaCode = getTelAreaCode(),
                phone = getPhone();
            if (telAreaCode !== '+86') {
                layer.msg("很抱歉，语音验证码服务暂时不支持该区域，请尝试使用短信验证码");
                return false;
            }
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent || isVoice) {
                layer.msg('操作频繁，请稍等');
                return false;
            }

            // 验证
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            next();
        },
        onExit: function () {}
    });

    // 注册的行为验证-短信验证码
    new YpRiddler({
        expired: 10,
        mode: 'dialog',
        container: document.getElementById('sendRegisterYzm'),
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
            var $codeBtn = $('#sendRegisterYzm>span');
            var url = '/login/register/getRegisterCaptcha';
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
        container: document.getElementById('registerVoiceBtn'),
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
            var url = '/login/register/getRegisterVoiceCaptcha';
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
                    $(".register-form .sendYzmvoice").text("60s");
                    $(".register-form .yzm-voice-1").hide();
                    $(".register-form .yzm-voice-2").show();
                    var t = 60;
                    var timer = null;
                    timer = setInterval(function () {
                        t--;
                        $(".register-form .sendYzmvoice").text(t + "s");
                        if (t == 0) {
                            isVoice = false;
                            clearInterval(timer);
                            $(".register-form .yzm-voice-2").hide();
                            $(".register-form .yzm-voice-1").show();
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

    // 跳转到返回第三方登录页面
    // $(document).on('click', '.gotologin4-1', function () {
    //     parent.layer.closeAll();
    //     parent.objSite.openUserWin('/login/popover/welcome', ['800px', '520px']);
    // });

    // 登录按钮
    $(document).on('click', '#loginBtn', function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;
        login(codeType);
    });
    //注册按钮
    $(document).on('click', '#registerBtn', function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;
        registerAccount();
    });

    // 微信登录
    // $(document).on("click", ".style-contant-wechat", function () {
    //     // 使用微信网页授权
    //     var wxurl = wechatUrl();
    //     parent.layer.closeAll();
    //     parent.window.location.href = objSite.getUserUrl(wxurl);
    // });
    // 微信模块 其他方式登录
    // $(document).on("click", ".wechat-login-other", function () {
    //     $(".login").removeClass("wechat-login-display");
    // });

    // 忘记密码
    $(document).on("click", ".js_LoginForget", function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/login/forgetPwd');
    });

    // 回车登录
    $('.login-form').on('keydown', function (e) {
        if (e.keyCode === 13 && $('#loginBtn').hasClass('login-btn-active')) {
            login();
        }
    });
    $('.register-form').on('keydown', function (e) {
        if (e.keyCode === 13 && $('#registerBtn').hasClass('login-btn-active')) {
            registerAccount();
        }
    });

    // 二维码过期计时器，15分钟过期
    // setTimeout(function () {
    //     var html = '<div class="qrcode-fade" style="width:142px;position:absolute;top:0;bottom:0;right:0;left:0;background-color:rgba(0,0,0,.4); display: flex;justify-content: center;align-items: center;text-align: center;color:white"><div>二维码失效<br>请点击刷新</div></div>';
    //     $('.wechat-login').find('.erweima-bg').append(html);
    // }, 15 * 60 * 1e3);


});


//  监听input值
$(document).on("input propertychange", function () {
    if (isLoginWay()) {
        //登录
        var data = {};
        var obj = $('.login-form').serializeArray();
        $.each(obj, function () {
            data[this.name] = this.value;
        });
        //登录
        if ((data.loginNum.length > 0 && data.loginPwd.length >= 6) || (data.loginNum.length > 0 && data.loginCode.length > 0)) {
            $('#loginBtn').addClass('login-btn-active');
        } else {
            $('#loginBtn').removeClass('login-btn-active');
        }
    } else {
        //注册
        var data = {};
        var obj = $('.register-form').serializeArray();
        $.each(obj, function () {
            data[this.name] = this.value;
        });
        //登录
        if (data.registerNum.length > 0 && data.registerCode.length > 0 && data.registerPwd.length >= 6) {
            $('#registerBtn').addClass('login-btn-active');
        } else {
            $('#registerBtn').removeClass('login-btn-active');
        }
    }


});

// 登录按钮显示隐藏

// 登录操作
function login(codeType) {
    var wxurl = wechatUrl(),
        loginType = getLoginType();

    if (typeof loginType == 'undefined' || (loginType !== 'account' && loginType !== 'phone_code')) return false;
    var telAreaCode = getTelAreaCode(),
        phone = getPhone(),
        code = getPhoneCode(),
        account = getAccount(),
        password = getPassword();
    var type = 1;
    // console.log(11111, telAreaCode);
    // 验证表单
    // console.log('loginType', loginType);
    if (loginType === 'account') {
        type = 1;
        if (account === '') {
            layer.msg('请输入账号');
            return false;
        }
        if (password === '') {
            layer.msg('请输入密码');
            return false;
        } else if (password.length > 20 || password.length < 6) {
            layer.msg('请输入6-20位密码');
            return false;
        }
    } else {
        type = 2;
        var result = checkPhone(telAreaCode, phone);
        if (typeof result == 'string') {
            layer.msg(result);
            return false;
        }

        if (code === '') {
            layer.msg('请输入短信验证码');
            return false;
        }
    }


    // 登录来源
    var login_source = $('input[name="login_source"]').val();
    var is_registered = !isLoginWay() ? 1 : 0;

    var data = {
        account: account,
        password: password ? window.btoa(encrypt('password', password)) : '',
        type: type,
        // login_source: login_source,
        area_code: telAreaCode,
        captcha: code,
        // token: encrypt('validate', loginType),
    };

    //获取客户端标识
    // var client = navigator.userAgent;

    var loginUrl = "/login/password_login/login";
    $.post(loginUrl, data, function (res) {
        // console.log(111, res);
        // var obj = JSON.parse(res);
        if (res['code'] == 0) {
            layer.msg('登录成功');
            parent.window.location.reload();
            //回调给公共方法执行
            parent.window.objSite.loginInHtml(res.data);
        } else if (res['code'] == 403) {
            // 需微信扫码验证
            layer.msg(obj['msg'], {
                time: 2e3
            }, function () {});
        } else {
            layer.msg(res['msg']);
        }
    });

}

var loginInterval = null;
$('.wechat-login').on('click', function (e) {
    $('.js_ChangeLoginWay').trigger('click');
});
$('.js_toAccountLogin').on('click', function (e) {
    $('.js_ChangeLoginWay').trigger('click');
});

initWechatLogin($('.js_ChangeLoginWay').hasClass('other'));

function initWechatLogin(isWechat) {
    if (isWechat) {
        //获取微信二维码
        $('.qrcode-login-content').show();
        $('.tel-login-content').hide();
        toGetWechatCode(function (res) {
            if (res.code == 0) {
                //   res.data.url
                var url = res.data.url;
                var key = res.data.key;
                $('.login-qrcode-wrap > img')[0].setAttribute('src', url);
                loginInterval && clearInterval(loginInterval);
                loginInterval = setInterval(function () {
                    pollingWechatLogin(key);
                }, 1000);
            } else {
                layer.msg(res.msg);
            }
        });

    } else {
        $('.qrcode-login-content').hide();
        $('.tel-login-content').show();
        loginInterval && clearInterval(loginInterval);

    }

}
window.onbeforeunload = function (e) {
    loginInterval && clearInterval(loginInterval);
}
/**
 * 切换微信二维码登录
 */
$('.js_ChangeLoginWay').on('click', function (e) {
    $(this).toggleClass('other');
    var isHas = $(this).hasClass('other');
    $('#loginBtn').removeClass('login-btn-active');
    initWechatLogin(isHas);

});
/**
 * 轮询公众号登录情况
 * @param {*} key 
 */
function pollingWechatLogin(key) {
    var data = {
        key: key
    }
    $.ajax({
        type: 'GET',
        url: '/login/wechat_official/checkLogin',
        timeout: 10000,
        data: data,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    // objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    // objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    // objSite.alert(textStatus);
                    break;
            }
        },
        success: function (res) {
            if (res.code == 0) {
                loginInterval && clearInterval(loginInterval);
                // console.log('bindPhone:',res.data.user.bind_phone);
                objSite.loginInHtml(res.data);
                parent.window.location.reload();
            } else if (res.code == 200) {
                loginInterval && clearInterval(loginInterval);
                layer.msg(res.msg);
            }
        },
        complete: function () {}
    })
}

function toGetWechatCode(callback) {
    var data = {
        behavior: 'login'
    }
    $.ajax({
        type: 'GET',
        url: '/login/Wechat_Official/getTicket',
        timeout: 10000,
        data: data,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    // objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    // objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    // objSite.alert(textStatus);
                    break;
            }
        },
        success: function (result) {
            callback(result);
        },
        complete: function () {}
    })
}

function registerAccount() {

    var telAreaCode = getTelAreaCode(),
        phone = getPhone(),
        code = getPhoneCode(),
        password = getPassword();

    if (phone === '') {
        layer.msg('请输入手机号');
        return false;
    }
    // console.log(password);
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
        account: phone,
        password: password ? window.btoa(encrypt('password', password)) : '',
        // login_source: login_source,
        area_code: telAreaCode,
        captcha: code,
        // token: encrypt('validate', loginType),
    };


    var url = "/login/register/register";
    $.post(url, data, function (res) {
        console.log(res);
        // var obj = JSON.parse(res);
        if (res.code == 0) {
            layer.msg('注册成功');
            $('.js_LoginChange > li').eq(0).trigger('click');
        } else {
            layer.msg(res.msg);
        }
    });
}

// 判断是否是登录模式
function isLoginWay() {
    return ($('.js_LoginChange .active').index() == 0);
}
// 获取国家区号
function getTelAreaCode() {
    var areaCode = '';
    if (isLoginWay()) {
        areaCode = $('.selected-dial-code').eq(0).text();
    } else {
        areaCode = $('.selected-dial-code').eq(1).text();
    }
    return areaCode.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

// 获取手机号码
function getPhone() {
    if (isLoginWay()) {
        return $('input[name="loginNum"]').val();
    } else {
        return $('input[name="registerNum"]').val();
    }

}

// 获取账号
function getAccount() {
    if (isLoginWay()) {
        return $('input[name="loginNum"]').val();
    } else {
        return $('input[name="registerNum"]').val();
    }
}

// 获取密码
function getPassword() {
    if (isLoginWay()) {
        return $('input[name="loginPwd"]').val();
    } else {
        return $('input[name="registerPwd"]').val();
    }

}

// 验证短信验证码
function getPhoneCode() {
    if (isLoginWay()) {
        return $('input[name="loginCode"]').val();
    } else {
        return $('input[name="registerCode"]').val();
    }

}

// 设置登录类型
function setLoginType(value) {
    return $('input[name="login_type"]').val(value);
}

// 获取登录类型
function getLoginType() {
    return $('input[name="login_type"]').val();
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
// 获取微信登录地址
function wechatUrl() {
    var callBackUrl = window.parent.document.URL;
    return '/login/wx_login?llurl=' + encodeURIComponent(callBackUrl) + '&is_ground=1';

};