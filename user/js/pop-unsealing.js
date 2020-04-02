;$(function () {
    var isSent = false;
    var key1 = 'smsCodeForFindPwd';
    var key2 = 'emailCodeForFindPwd';
    var type = 'phone';
    var behavior = '';
    // 国际区号
    areaCodeInt();
    // 切换密码明文与否
    switchPassword();

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

            // 验证
            var telAreaCode = getTelAreaCode(), phone = getAccount(), email = getAccount();
            var result1 = checkPhone(telAreaCode, phone);
            var result2 = checkEmail(email);

            if (typeof result1 == 'string' && typeof result2 == 'string') {
                layer.msg('请输入手机号码或邮箱');
                return false;
            }

            layer.load(2);

            type = typeof result1 != 'string' ? 'phone' : 'email';
            var data = {
                authenticate: authenticate,
                token: token
            };

            var url = '';
            if (type === 'phone') {
                url = '/account/validate/sendCode';
                data['m'] = encrypt('validate', key1);
                data['tel_area_code'] = telAreaCode;
                data['phone'] = phone;
                behavior = telAreaCode.toString() + phone.toString();
            } else {
                url = '/account/validate/sendEmailCode';
                data['m'] = encrypt('validate', key2);
                data['email'] = email;
                behavior = email.toString();
            }

            $.post(url, data, function (res) {
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
            //console.log('出错啦：' + msg + ' code: ' + code);
            retry();
        },
        beforeStart: function (next) {
            // 如果已经发送验证码，倒计时未结束，禁止再次点击
            if (isSent) return false;

            // 验证
            var telAreaCode = getTelAreaCode(), phone = getAccount(), email = getAccount();
            var result1 = checkPhone(telAreaCode, phone);
            var result2 = checkEmail(email);

            if (typeof result1 == 'string' && typeof result2 == 'string') {
                layer.msg('请输入手机号码或邮箱');
                return false;
            }

            next();
        },
        onExit: function () {}
    });

    // 解封账号
    $('.normal').on('click', '#unsealingBtn', function (e) {
        // 阻止默认提交
        e.preventDefault();

        if (!$(this).hasClass('login-btn-active')) return false;

        layer.open({
            type: 1,
            title: '安全验证',
            area: ['352px', '300px'],
            content: $('#veri-login').html(),
            success: function (layero, index) {
                var layerClass = layero[0].childNodes[1];
                new YpRiddler({
                    expired: 10,
                    mode: 'flat',
                    container: layerClass,
                    appId: 'cd6822d29e88459394bf172cc94ca46d',
                    version: 'v1',
                    winWidth: 350,
                    onError: function (param) {
                        if (param.code == 429) {
                            layer.msg('请求过于频繁，请稍后再试！');
                            return false;
                        }
                        layer.msg('验证服务异常');
                    },
                    onSuccess: function (validInfo, close) {
                        var veri_token = validInfo.token;
                        var authenticate = validInfo.authenticate;

                        var telAreaCode = getTelAreaCode(),
                            phone = getAccount(),
                            email = getAccount(),
                            code = getCode(),
                            password = getPassword();
                        var result1 = checkPhone(telAreaCode, phone);
                        var result2 = checkEmail(email);

                        if (typeof result1 == 'string' && typeof result2 == 'string') {
                            layer.msg('请输入手机号码或邮箱');
                            return false;
                        }

                        if (code == '') {
                            layer.msg('请输入验证码');
                            return false;
                        }

                        var type = typeof result1 != 'string' ? 'phone' : 'email';
                        var key = type === 'phone' ? key1 : key2;
                        if (behavior === '') {
                            behavior = telAreaCode.toString() + phone.toString();
                        }

                        var formData = {
                            token: veri_token,
                            authenticate: authenticate,
                            type: encrypt('validate', type),
                            tel_area_code: telAreaCode,
                            code: code,
                            password: encrypt('password', password),
                            m: encrypt('validate', key),
                            v: encrypt('validate', behavior)
                        };
                        if (type == 'phone') {
                            formData['phone'] = phone;
                            formData['code'] = code;
                        } else {
                            formData['email'] = email;
                            formData['emailCode'] = code;
                        }

                        // ajax提交
                        $.ajax({
                            url: '/account/operation/unsealing',
                            type: 'POST',
                            dataType: 'json',
                            data: formData,
                            success: function (res) {
                                if (res.status == 1) {
                                    // 显示设置成功页面
                                    $(".login").addClass("res-success");
                                } else {
                                    layer.msg(res.msg);
                                }
                            }
                        });

                        layer.closeAll();
                        close()
                    },
                    onFail: function (code, msg, retry) {
                        console.log('出错啦：' + msg + ' code: ' + code);
                        layer.msg('验证失败，请重新验证');
                        retry()
                    },
                    beforeStart: function (next) {
                        console.log('验证马上开始');
                        next()
                    },
                    onExit: function () {
                        console.log('退出验证');
                    }
                })
            },

        });
        return false;
    });

    //  监听input值
    $(document).on("input propertychange", function () {
        if ($(".monitor-input1").val().length >= 6 && $(".monitor-input2").val().length >= 6 && $(".monitor-input3").val().length >= 6) {
            $(".login .normal .normal-login .login-btn a").addClass("login-btn-active");
        } else {
            $(".login .normal .normal-login .login-btn a").removeClass("login-btn-active");
        }
    });

    // 返回登录
    $(document).on("click", "#resSuccessBtn", function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/login', ['800px', '520px']);
    });

    // 解绑账号
    $('#resProhibitionBtn').on('click', function () {
        $(this).closest('.reset-result').addClass('prohibition-user');
        $('.normal').show();
    });
});

// 获取国家区号
function getTelAreaCode() {
    var areaCode = $('.selected-dial-code').text();
    return areaCode.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

// 获取账号
function getAccount() {
    return $('.monitor-input1').val();
}

// 获取账号
function getPassword() {
    return $('.monitor-input3').val();
}

// 验证短信验证码
function getCode() {
    return $('.monitor-input2').val();
}