;
$(function () {
    var clickTimeLimit = false;
    // 绑定、更换手机
    $('.js-modify-phone').click(function () {
        var type = getType($(this));
        layer.open({
            type: 2,
            title: false,
            resize: false,
            area: ['400px', '490px'],
            content: [type ? '/user/user_account/modifyPhone' : '/user/user_account/bindPhone', 'no']
        });

    });

    function getType(target) {
        var type = target.data('type');
        //0为新绑定 1为修改
        return (type == 1);
    }

    // 设置、修改密码
    $('.js-modify-password').click(function () {
        if (clickTimeLimit) {
            return;
        }
        clickTimeLimit = true;
        var type = getType($(this));
        $.post('/user/user/userInfo', {}, function (res) {
            if (res.code == 300) {
                openLogin();
                return false;
            } else if (res.code == 0) {
                if (res.data.user.bind_phone == 1) {
                    layer.open({
                        type: 2,
                        title: false,
                        resize: false,
                        area: ['400px', '490px'],
                        content: [type ? '/user/user_account/modifyPassword' : '/user/user_account/setPassword', 'no'],
                        cancel: function (index, layero) {
                            var body = layer.getChildFrame('body', index);
                            // console.log(body);
                            // var iframeWin = window[layero.find('iframe')[0]['name']];
                            if ($(body).find('.res-success').length) {
                                parent.location.reload();
                            }
                        }
                    });
                } else {
                    layer.msg('请先绑定手机', {
                        time: 1500
                    }, function () {
                        showBindPhone();
                    });
                }

            }
        }).complete(function () {
            clickTimeLimit = false;
        });
    });

    // 更换邮箱
    $('.js-modify-email').click(function () {
        if (clickTimeLimit) {
            return;
        }
        clickTimeLimit = true;
        var type = getType($(this));
        $.post('/user/user/userInfo', {}, function (res) {

            if (res.code == 300) {
                openLogin();
                return false;
            } else if (res.code == 0) {
                if (res.data.user.bind_phone == 1) {
                    layer.open({
                        type: 2,
                        title: false,
                        resize: false,
                        area: ['400px', '490px'],
                        content: [type ? '/user/user_account/modifyEmail' : '/user/user_account/bindEmail', 'no']
                    });
                } else {
                    layer.msg('请先绑定手机', {
                        time: 1500
                    }, function () {
                        showBindPhone();
                    });
                }
            }
        }).complete(function () {
            clickTimeLimit = false;
        });

    });

    /**
     * 绑定微信
     */
    var wechatKey = null;
    var wechatScan = null;


    $(document).on('click', '.jweixin', function () {
        if (clickTimeLimit) {
            return;
        }
        clickTimeLimit = true;
        $.post('/user/user/userInfo', {}, function (res) {
            if (res.code == 0) {
                var url = '';
                var desc = '';
                var data = {};
                if (res.data.user.bind_wx == 0) {
                    desc = '绑定微信';
                    data = {
                        behavior: 'bind'
                    }
                } else {

                    desc = '解绑微信';
                    data = {
                        behavior: 'cancelBind'
                    }
                }
                postWechat(data, function (res) {
                    if (res.code == 0) {
                        wechatKey = res.data.key;
                        var imgUrl = res.data.url;

                        $('.v3-erweima-show img').attr('src', imgUrl);
                        $('.v3-erweima-show img')[0].onload = function (e) {

                        }
                        layer.open({
                            type: 1,
                            title: desc,
                            resize: false,
                            area: ['500px', '498px'],
                            content: $('#bindWechatDialog'),
                            success: function (e) {

                            },
                            end: function (e) {
                                wechatScan && clearInterval(wechatScan);
                            }
                        });

                        wechatScan && clearInterval(wechatScan);
                        wechatScan = setInterval(function () {
                            pollingWechatScan(wechatKey);
                        }, 1000);
                    } else {
                        layer.msg(res.msg);
                    }
                })

            }
        }).complete(function () {
            clickTimeLimit = false;
        });
    });

    function postWechat(data, callback) {
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
            complete: function () {
                clickTimeLimit = false;
            }
        })
    }

    /**
     * 轮询公众号登录情况
     * @param {*} key 
     */
    function pollingWechatScan(key) {
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
                    wechatScan && clearInterval(wechatScan);
                    // console.log('bindPhone:',res.data.user.bind_phone);
                    layer.closeAll();
                    window.location.reload();
                }
            },
            complete: function () {}
        })
    }

    // 绑定qq
    $(document).on('click', '.jqq', function () {
        if (clickTimeLimit) {
            return;
        }
        clickTimeLimit = true;
        $.post('/login/bind_status/bind_qq', {}, function (res) {
            if (res.status == 0) {
                if (res.data.pwd_status == 0) {
                    if ($(".js-pwd-info").hasClass('main-color')) {
                        $(".js-pwd-info").removeClass('main-color');
                    }
                    $(".js-pwd-gouhecha").html('×');
                } else {
                    if (!$(".js-pwd-info").hasClass('main-color')) {
                        $(".js-pwd-info").addClass('main-color');
                    }
                    $(".js-pwd-gouhecha").html('√');
                }

                if (res.data.email_status == 0 && res.data.phone_status == 0) {
                    if ($(".js-other-info").hasClass('main-color')) {
                        $(".js-other-info").removeClass('main-color');
                    }
                    $(".js-other-gouhecha").html('×');
                } else {
                    if (!$(".js-other-info").hasClass('main-color')) {
                        $(".js-other-info").addClass('main-color');
                    }
                    $(".js-other-gouhecha").html('√');
                }

                layer.open({
                    type: 1,
                    title: '解绑条件',
                    resize: false,
                    area: ['300px', '190px'],
                    content: $('.offtips-layer'),
                    btn: '去设置',
                    btnAlign: 'c'
                });

            } else {
                $.post('/user/check_login/index', {}, function (res) {
                    if (res.status == 0) {
                        openLogin();
                        return false;
                    } else {
                        window.location.href = '/login/qq_Login/index?bind=1';
                    }
                });
            }
        }).complete(function () {
            clickTimeLimit = false;
        });
        
    });

    function showBindPhone() {
        layer.open({
            type: 2,
            title: false,
            resize: false,
            area: ['400px', '490px'],
            content: ['/user/user_account/bindPhone', 'no']
        });
    }

});