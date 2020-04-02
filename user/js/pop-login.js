;$(function () {
    var isSent = false;
    var isVoice = false;
    var codeType = 0;

    // 国际区号
    areaCodeInt();
    // 切换密码明文与否
    switchPassword();

    // 行为验证-初始化-语音验证码
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
            layer.msg('验证服务异常')
        },
        onSuccess: function (validInfo, close) {
            // 成功回调
            var token = validInfo.token;
            var authenticate = validInfo.authenticate;
            var phone = getPhone(), telAreaCode = getTelAreaCode();

            // 验证手机号码
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var url = '/account/validate/sendCode';
            $.post(url, {
                m: encrypt('validate', getVoiceKey()),
                phone: phone,
                tel_area_code: telAreaCode,
                authenticate: authenticate,
                token: token
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.status) {
                    isSent = false;
                    isVoice = true;
                    codeType = 1;
                    $(".sendYzmvoice").text("60s");
                    $(".yzm-voice-1").hide();
                    $(".yzm-voice-2").show();
                    var t = 60;
                    var timer = null;
                    timer = setInterval(function () {
                        t--;
                        $(".sendYzmvoice").text(t + "s");
                        if (t == 0) {
                            isVoice = false;
                            clearInterval(timer);
                            $(".yzm-voice-2").hide();
                            $(".yzm-voice-1").show();
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
            var telAreaCode = getTelAreaCode(), phone = getPhone();
            if (telAreaCode !== '+86') {
                layer.msg("很抱歉，语音验证码服务暂时不支持该区域，请尝试使用短信验证码");
                return false;
            }

            if ($('#register').val()) {
                // ajax提交
                $.ajax({
                    url: '/account/validate/isSendSms',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        phone: getPhone(),
                    },
                    success: function (res) {
                        if (res.status != 1) {
                            layer.msg(res.msg);
                            return false;
                        } else {
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
                        }
                    }
                });
            } else {
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
            }
        },
        onExit: function () {}
    });

    // 行为验证-初始化-短信验证码
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
            var phone = getPhone(), telAreaCode = getTelAreaCode();

            // 验证手机号码
            var result = checkPhone(telAreaCode, phone);
            if (typeof result == 'string') {
                layer.msg(result);
                return false;
            }

            layer.load(2);

            var $codeBtn = $('#sendYzm span');
            var url = '/account/validate/sendCode';
            $.post(url, {
                m: encrypt('validate', getKey()),
                phone: phone,
                tel_area_code: telAreaCode,
                authenticate: authenticate,
                token: token,
            }, function (res) {
                layer.msg(res.msg);
                layer.closeAll('loading');

                if (res.status) {
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
                            $codeBtn.parent().width('115');
                            $codeBtn.html('收不到验证码？');
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
            if ($('#register').val()) {
                // ajax提交
                $.ajax({
                    url: '/account/validate/isSendSms',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        phone: getPhone(),
                    },
                    success: function (res) {
                        if (res.status != 1) {
                            layer.msg(res.msg);
                            return false;
                        } else {
                            // 如果已经发送验证码，倒计时未结束，禁止再次点击
                            if (isSent || isVoice) {
                                layer.msg('操作频繁，请稍等');
                                return false;
                            }
                            // 验证
                            var telAreaCode = getTelAreaCode(), phone = getPhone();
                            var result = checkPhone(telAreaCode, phone);
                            if (typeof result == 'string') {
                                layer.msg(result);
                                return false;
                            }
                            next();
                        }
                    }
                });
            } else {
                // 如果已经发送验证码，倒计时未结束，禁止再次点击
                if (isSent || isVoice) {
                    layer.msg('操作频繁，请稍等');
                    return false;
                }

                // 验证
                var telAreaCode = getTelAreaCode(), phone = getPhone();
                var result = checkPhone(telAreaCode, phone);
                if (typeof result == 'string') {
                    layer.msg(result);
                    return false;
                }
                next();
            }
        },
        onExit: function () {}
    });

    // 跳转到密码登录
    $(".normal").on("click", ".gotoCellphone", function () {
        if ($(".login-from").attr("data-login-switch") === "normal") {
            $(this).text("返回密码登录");
            loginNormal(); // 验证码登录
        } else {
            $(this).text("验证码登录");
            loginCellphone(); // 密码登录
        }
    });

    // 跳转到快速注册
    $(document).on("click", ".gotoCellphone2", function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/register', ['800px', '520px']);
    });
    // 跳转到快速注册
    $(document).on("click", ".gotoRegistered", function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/register', ['800px', '520px']);
    });
    // 跳转到返回登录
    $(document).on('click', '.gotoCellLogin', function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/login', ['800px', '520px']);
    });

    // 跳转到返回第三方登录页面
    $(document).on('click', '.gotologin4-1', function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/welcome', ['800px', '520px']);
    });

    // 登录按钮
    $(document).on('click', '#loginBtn', function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        login(codeType);
    });

    // 微信登录
    $(document).on("click", ".style-contant-wechat", function () {
        // 使用微信网页授权
        var wxurl = wechatUrl();
        parent.layer.closeAll();
        parent.window.location.href = objSite.getUserUrl(wxurl);
    });

    // 微信模块 其他方式登录
    $(document).on("click", ".wechat-login-other", function () {
        $(".login").removeClass("wechat-login-display");
    });

    // 忘记密码
    $(document).on("click", ".forget-pwd", function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/account/security/findPwd?source=user', ['800px', '520px']);
    });

    // 回车登录
    $('.monitor-input3,.monitor-input2').on('keydown', function (e) {
        if (e.keyCode === 13 && $('#loginBtn').hasClass('login-btn-active')) {
            login();
        }
    });

    // 二维码过期计时器，15分钟过期
    setTimeout(function () {
        var html = '<div class="qrcode-fade" style="width:142px;position:absolute;top:0;bottom:0;right:0;left:0;background-color:rgba(0,0,0,.4); display: flex;justify-content: center;align-items: center;text-align: center;color:white"><div>二维码失效<br>请点击刷新</div></div>';
        $('.wechat-login').find('.erweima-bg').append(html);
    }, 15 * 60 * 1e3);
});

// 验证码登录
function loginNormal() {
    $('.monitor-input2').val('');
    $('.monitor-input3').val('');

    $(".login-from").attr("data-login-switch", "cellphone");
    $(".gotoCellphone2").hide();
    $("#selectAreaCode").attr("placeholder", "手机号");
    $(".normal").addClass("other-normal");
    $(".login-operation").hide();
    $(".login-yzm-voice-display").show();
    // 切换按钮显示隐藏
    toggleBtnShow();
    // 设置登录类型
    setLoginType('phone_code');
}

// 密码登录
function loginCellphone() {
    $('.monitor-input2').val('');
    $('.monitor-input3').val('');

    $(".login-from").attr("data-login-switch", "normal");
    $(".gotoCellphone2").show();
    $("#selectAreaCode").attr("placeholder", "手机/邮箱/用户名");
    $(".normal").removeClass("other-normal");

    // 切换按钮显示隐藏
    toggleBtnShow();
    // 设置登录类型
    setLoginType('account');
}

//  监听input值
$(document).on("input propertychange", function () {
    toggleBtnShow();
});

// 登录按钮显示隐藏
function toggleBtnShow() {
    // 区分快速注册和多方式登录
    if ($('.monitor-input2').length > 0) {
        var mode1 = ($('.monitor-input1') && $('.monitor-input1').val() && $('.monitor-input1').val().length >= 3)
            && ($('.monitor-input2') && $('.monitor-input2') && $('.monitor-input2').val().length >= 6);
        var mode2 = ($('.monitor-input1') && $('.monitor-input1').val() && $('.monitor-input1').val().length >= 3)
            && ($('.monitor-input3') && $('.monitor-input3') && $('.monitor-input3').val().length >= 6);
        if ($('#loginBtn').html() == '注册') {
            mode2 = '';mode1 = '';
            mode2 = ($('.monitor-input1') && $('.monitor-input1').val() && $('.monitor-input1').val().length >= 3)
                && ($('.monitor-input3') && $('.monitor-input3') && $('.monitor-input3').val().length >= 6)
                && ($('.monitor-input2') && $('.monitor-input2') && $('.monitor-input2').val().length >= 6);
        }
    } else {
        var mode1 = 0;
        var mode2 = ($('.monitor-input1') && $('.monitor-input1').val() && $('.monitor-input1').val().length >= 3)
            && ($('.monitor-input3') && $('.monitor-input3') && $('.monitor-input3').val().length >= 6);
    }
    if (mode1 || mode2) {
        $('.login .normal .normal-login .login-btn a').addClass('login-btn-active');
    } else {
        $('.login .normal .normal-login .login-btn a').removeClass('login-btn-active');
    }
}

// 登录操作
function login(codeType) {
    var wxurl = wechatUrl(), loginType = getLoginType();

    if (typeof loginType == 'undefined' || (loginType !== 'account' && loginType !== 'phone_code')) return false;

    var telAreaCode = getTelAreaCode(), phone = getPhone(), code = getPhoneCode(), account = getAccount(), password = getPassword();

    // 验证表单
    if (loginType === 'account') {
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

    //是否语音验证码
    if (codeType == 1) {
      var encryptKey = encrypt('validate', getVoiceKey());
    } else {
      var encryptKey = encrypt('validate', getKey());
    }

  // 登录来源
    var login_source = $('input[name="login_source"]').val();
    var is_registered = $('#loginBtn').html() == '注册' ? 1 : 0;
    var data = {
        user_name: account,
        user_pwd: password ? encrypt('password', password) : '',
        is_ground: 1,
        login_source: login_source,
        tel_area_code: telAreaCode,
        is_registered:is_registered,
        code: code,
        token: encrypt('validate', loginType),
        m: encryptKey
    };

    //获取客户端标识
    var client = navigator.userAgent;

    var loginUrl = '';
    if (client === '3d66') {
        loginUrl = "/login/index/clientLoginIn";
        $.post(loginUrl, data, function (res) {
            var obj = eval('(' + res + ')');
            if (obj['status'] == 200) {
                layer.msg('登录成功');
                try {
                    WebLoginWnd.LoginInfo(res);
                } catch (error) {
                    layer.msg('登录成功');
                }
            } else if (obj['status'] == 403) {
                // 需微信扫码验证
                layer.msg(obj['msg'], { time: 2e3 }, function () {
                    // 关闭所有弹窗层
                    window.location.href = objSite.getUserUrl(wxurl);
                });
            } else {
                layer.msg(obj['msg']);
            }
        });
    } else if (client === 'MssPlug3') {
        loginUrl = "/login/index/plugLoginIn";
        $.post(loginUrl, data, function (res) {
            var userInfo = {};
            if (res.status) {
                userInfo = res.data;
            }
            var jsonObj = {
                status: res.status,
                data: userInfo,
                msg: res.msg
            };
            var jsonStr = JSON.stringify(jsonObj);
            CSharp.htmlLogin(jsonStr);
        });
    } else if (client === '3DPlug') {
        loginUrl = "/login/index/plugLoginIn";
        $.post(loginUrl, data, function (res) {
            var userInfo = {};
            if (res.status) {
                userInfo = res.data;
            }
            var jsonObj = {
                status: res.status,
                data: userInfo,
                msg: res.msg
            };
            var jsonStr = JSON.stringify(jsonObj);
            window.external.getPlugUser(jsonStr);
        })
    } else {
        loginUrl = '/login/login_service';
        $.post(loginUrl, data, function (res) {
            if (res.code == 1) {
                // 判断是落地页登录还是弹窗登录
                if (parent.window.location.origin + '/' == parent.window.objSite.user_domain) {
                    parent.window.location.reload();
                } else {
                    // 修改登入HTML
                    try {
                        parent.window.objSite.loginInHtml(res);
                        if(parent.window.location.href == objSite.getWwwUrl('/'))
                        {
                            parent.objSite.openUserWin('/www/www_index_layout/index', ['800px', '600px']);
                            return;
                        }
                        if (parent.window.location.host.indexOf('ku') >= -1) {
                            parent.window.location.reload();
                        }
                        parent.layer.closeAll();
                    } catch (e) {
                        //防止个人中心登录报错
                        parent.window.location.reload();
                    }
                }

            } else if (res.code == 2) {
                parent.window.objSite.loginInHtml(res);
                parent.layer.closeAll();
                //绑定手机
                parent.layer.open({
                    type: 2,
                    area: ['380px', '370px'],
                    content: [objSite.getUserUrl('/login/bind_phone'), 'no'],
                    title: false,
                });
            } else if (res.code == 3) {
                parent.layer.closeAll();
                // 安全验证
                parent.layer.open({
                    type: 2,
                    area: ['380px', '322px'],
                    content: [objSite.getUserUrl('/account/security/forceverify?fv=' + res.data), 'no'],
                    title: false,
                    closeBtn: 0
                });
            } else if (res.code == 4) {
                parent.layer.closeAll();
                //冻结用户
                parent.layer.open({
                    type: 2,
                    area: ['380px', '274px'],
                    content: [objSite.getUserUrl('/validate/Phone_Code_Validate/index?data=' + res.data  + '&k=' + res.k), 'no'],
                    title: false,
                    closeBtn: 0
                });
            } else if (res.code == 5) {
                parent.layer.closeAll();
                //强制绑定手机
                parent.layer.open({
                    type: 2,
                    area: ['380px', '271px'],
                    content: [objSite.getUserUrl('/login/must_bind_phone/index?data=' + res.data + '&k=' + res.k), 'no'],
                    title: false,
                });
            } else if (res.code == 6) {
                parent.layer.open({
                    type: 2,
                    skin: 'layer-nobg',
                    area: ['802px', '541px'],
                    content: [objSite.getUserUrl('/user/coming_home'), 'no'],
                    title: false,
                    cancel: function (index, layero) {
                        parent.layer.closeAll();
                        parent.location.reload();
                    }
                });
            }  else if (res.code == 401) {
                parent.layer.closeAll();
                //冻结用户
                parent.layer.open({
                    type: 2,
                    area: ['400px', '520px'],
                    content: [objSite.getUserUrl('/account/security/unsealing?m=1&t=' + (new Date()).valueOf()), 'no'],
                    title: false,
                    closeBtn: 0
                });
            } else if (res.code == 402) {
                parent.layer.closeAll();
                //冻结用户
                parent.layer.open({
                    type: 2,
                    area: ['400px', '520px'],
                    content: [objSite.getUserUrl('/account/security/unsealing?m=1&l=1&t=' + (new Date()).valueOf()), 'no'],
                    title: false,
                    closeBtn: 0
                });
            } else if (res.code == 403) {
                // 需微信扫码验证
                layer.msg(res.msg, { time: 2e3 }, function () {
                    // 关闭所有弹窗层
                    parent.layer.closeAll();
                    var callBackUrl = window.parent.document.URL;
                    var url = '/login/wx_login?llurl=' + encodeURIComponent(callBackUrl) + '&is_ground=1';
                    parent.window.location.href = objSite.getUserUrl(url);
                });
            } else {
                layer.msg(res.msg);
            }
        });
    }
}

// 获取国家区号
function getTelAreaCode() {
    var areaCode = $('.selected-dial-code').text();
    return areaCode.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

// 获取手机号码
function getPhone() {
    return $('.monitor-input1').val();
}

// 获取账号
function getAccount() {
    return $('.monitor-input1').val();
}

// 获取账号
function getPassword() {
    return $('.monitor-input2').val();
}

// 验证短信验证码
function getPhoneCode() {
    return $('.monitor-input3').val();
}

// 设置登录类型
function setLoginType(value) {
    return $('[name="login_type"]').val(value);
}

// 获取登录类型
function getLoginType() {
    return $('[name="login_type"]').val();
}

// 获取key
function getKey() {
    return 'smsCodeForLogin';
}

// 获取语音key
function getVoiceKey() {
    return 'voiceCodeForLogin';
}

// 获取微信登录地址
function wechatUrl() {
    var callBackUrl = window.parent.document.URL;
    return '/login/wx_login?llurl=' + encodeURIComponent(callBackUrl) + '&is_ground=1';

}
;