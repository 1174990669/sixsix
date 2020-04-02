// 设置nav状态
function setPosition(position) {
    $('.navbar .nav > li').each(function (index) {
        var liObj = $('a', $(this)).eq(0);
        if (liObj.text().indexOf(position) > -1) {
            liObj.addClass('active');
            return false;
        }

        var liObj = $('span', $(this)).eq(0);
        if (liObj.text().indexOf(position) > -1) {
            liObj.addClass('active');
            return false;
        }
    });
}


String.prototype.myTrim = function () {
    return this.replace(/^\s*|\s*$/g, '')
}

var objSite = objSite || {};

//消息提示
objSite.msg = function (msg, icon) {
    if (typeof (icon) == 'undefined') {
        icon = 1;
    }
    layer.msg(msg, {
        icon: icon,
        time: 1000
    });
};

//提问消息
objSite.confirm = function (msg, callBack) {
    layer.confirm(msg, callBack);
};

//警告提示
objSite.alert = function (msg, icon) {
    if (typeof (icon) == 'undefined') {
        icon = 5;
    }
    layer.alert(msg, {
        icon: icon,
        time: 1000
    });
};

//格式化URL
objSite.formatUrl = function (url, domainUrl) {
    if (url == "") {
        return "";
    }
    if (url.substring(0, 4) == 'http') {
        return url;
    }

    if (url.substring(0, 5) == 'https') {
        return url;
    }

    if (url.substring(0, 1) == '/') {
        url = url.substring(1, url.length);
    }
    return domainUrl + url;

};

//获取静态站点URl
objSite.getStaticUrl = function (url) {
    return objSite.formatUrl(url, objSite.static_domain);
};




//判断是否验证
objSite.isLogin = function () {
    var flag = false;
    $.ajax({
        type: 'GET',
        url: '/user/user/userInfo',
        timeout: 10000,
        async: false,
        data: {},
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
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
            if (res.code == 300) {
                flag = false;
            } else if (res.code == 0) {
                flag = true;
            }
        }
    })

    return flag;

};

//活动充值页面模板判断是否验证
objSite.activityIsLogin = function () {
    if ($(".is_login").hasClass("logined")) {
        return true;
    } else {
        return false;
    }
};

// 打开用户页面
objSite.openUserWin = function (url, area, options) {
    // layer.open({
    //     type: 2,
    //     area: ['750px', '490px'],
    //     //maxmin: true,
    //     title: false,
    //     closeBtn: 2,
    //     // resize: false,
    //     // zIndex: layer.zIndex, //重点1
    //     shadeClose: false,
    //     skin: 'my-close-skin',
    //     content: loginUrl,
    //     success: function (layero) {
    //         //layer.setTop(layero); //重点2
    //     }
    // });
    // 尺寸
    var area = area || ['750px', '490px'];
    // 默认配置
    var defaults = {
        type: 2,
        title: false,
        closeBtn: 2,
        resize: false,
        shadeClose: false,
        skin: 'my-close-skin',
        content: [url, 'no'],
        area: area,
        checkLogin: false
    }
    var options = $.extend(defaults, options);
    // 如果需要检查认证
    if (options.checkLogin) {
        // if (!objSite.isLogin()) {
        //     // 如果没有验证打开登录窗口
        //     openLogin();
        //     return false;
        // }
    }
    // 标题
    layer.closeAll();
    layer.open(options);
    // 新增矫正偏移
    var is_mobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
    if (is_mobi) {
        var myarea = $(".layui-layer").width();
        $(".layui-layer").css("left", "50%");
        $(".layui-layer").css("margin-left", (-myarea) / 2);
    }

};
/**
 * 通用普通post请求
 */
objSite.ajaxPost = function (url, data, callback) {
    if (!url.length) {
        return false;
    }
    $.ajax({
        type: 'POST',
        url: url,
        timeout: 10000,
        data: data,
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    objSite.alert(textStatus);
                    break;
            }
        },
        success: function (result) {
            callback(result);
        },
        complete: function () {}
    })
}
/**
 * 通用普通get请求
 */
objSite.ajaxGet = function (url, data, callback) {
    if (!url.length) {
        return false;
    }
    $.ajax({
        type: 'GET',
        url: url,
        timeout: 10000,
        data: data,
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    objSite.alert(textStatus);
                    break;
            }
        },
        success: function (result) {
            console.log(result);

        },
        complete: function () {

        }
    })
}
/**
 * ajaxUser公用函数
   checkLogin 必须认证为true
   jsonp跨域请求
 */
objSite.ajaxUser = function (url, data, callBack, checkLogin) {
    url = objSite.getUserUrl(url);
    if (url == "") {
        return false;
    }

    //Ajax调用处理
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url,
        timeout: 10000,
        data: data,
        dataType: 'jsonp',
        jsonp: 'callback',
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    objSite.alert("加载超时，请重试!");
                    break;
                case "error":
                    objSite.alert("请求异常，请稍后再试!");
                    break;
                default:
                    objSite.alert(textStatus);
                    break;
            }
        },
        success: function (result) {

            if (checkLogin == true && result.status == 100) {
                //打开登录窗口
                openLogin();
                return false;
            }
            if (result.status == "1" || result.code == "1") {
                //操作成功
                if (typeof (callBack) != "undefined" && callBack != "") {
                    if (typeof (callBack) == "function") {
                        //执行闭包
                        callBack(result);
                        return false;
                    } else if (callBack == "reload") {
                        //刷新页面
                        //提示返回信息
                        if (result.msg != "") {
                            objSite.msg(result.msg, 1);
                        }
                        setTimeout(function () {
                            objSite.ajaxReloadPage();
                        }, 1000);
                    } else {
                        setTimeout(function () {
                            objSite.msg(result.msg, 1);
                            objSite.ajaxGoPage(callBack);
                        }, 1000);
                    }
                } else {
                    //提示返回信息
                    if (result.msg != "") {
                        objSite.msg(result.msg, 1);
                    }
                }
            } else {
                callBack(result);
                return false;
            }
        }
    });
}

// 登录弹窗
var openLogin = function () {
    layer.closeAll();
    objSite.openUserWin('/login/login/account', ['750px', '490px']);
};
// 注册弹窗
var openRegister = function () {
    layer.closeAll();
    objSite.openUserWin('/login/login/account?type=1', ['750px', '490px']);
}
// 绑定手机弹框
var openBindPhone = function () {
    var bindUrl = '/login/login/bindPhone';
    layer.closeAll();
    objSite.openUserWin(bindUrl, ['750px', '490px']);
}
$(document).on('click', '.j_user-reg,.j_register', function () {
    openRegister();
});

//登录按钮点击事件
$(document).on('click', '.js_UserLogin', function () {
    var loginUrl = '/login/login/account';
    var $type = $(this).data('type');
    if ($type) {
        loginUrl += '?type=1';
    }
    layer.closeAll();
    objSite.openUserWin(loginUrl, ['750px', '490px']);
});

// 绑定手机的弹框
// 跨iframe接受数据处理
window.addEventListener('message', function (e) {
    // console.log(e.data);
    if (e.data.closeAll) {
        layer.closeAll();
    }
});
$(document).on('click', '.js_UserBind', function () {
    openBindPhone();
});

//退出登录（登出）
$(document).on('click', '.j_logout', function () {
    objSite.ajaxPost("/login/logout/out", {}, function (res) {
        if (res.code == 0) {
            objSite.loginOutHtml();
            window.location.reload();
        }
    });
});


$(document).on('click', '.j_findback', function () {
    openFindback();
});

//入群交流
$(document).on('click', '.js_FansDialog', function () {
    layer.closeAll();
    objSite.openUserWin('/fans/index/index', ['680px', '456px']);
});


//广告点击
$(document).on('click', 'body .focus66 a', function (e) {
    e.stopPropagation();
    var href = $(this).attr("href");
    var id = $(this).data('id');
    if (!href) {
        return false;
    } else {
        //发送点击统计请求
        objSite.ajaxPost('/index/stats/adClick', {
            ad_id: id
        }, function (res) {});
    }
    // /course/play/inc?course_id=50
});
//课程点击统计
$(document).on('click', '.course-wrap .item-link,.course-wrap .title', function () {
    var id = $(this).parents('li').data('id');
    if (!id) {
        return false;
    } else {
        //发送点击统计请求
        objSite.ajaxPost('/course/play/inc', {
            course_id: id
        }, function (res) {});
    }
});


// 获取当前时间
objSite.getNowTime = function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
};


// 公钥
objSite.csrfToken = function () {
    var pubkey = '-----BEGIN PUBLIC KEY-----';
    pubkey += 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIKHrSGDj+e1bLD1GdIa0idrme';
    pubkey += '108lw0cLVA6LC4NWVKyBpioNvx95K4iDUK2Fb+39cAIm099AKsYPPIEmP6vVbaW0';
    pubkey += '161LSmZAKYe6gflgc+3Mp8bTCPS32P7XInnWo7Nyb2Gc1DRhN4yezIBeQCpVsumK';
    pubkey += 'BXYUPiYfW6dcTghsawIDAQAB';
    pubkey += '-----END PUBLIC KEY-----';
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubkey);
    var data = {
        t: '3d66login'
    };
    var rsadata = JSON.stringify(data);
    var encryptData = encrypt.encrypt(rsadata);
    return encryptData;
};

// 封装更新cookie方法
objSite.updateCookie = function (userCookieData) {
    var get_cookie_time = $.cookie('get_cookie_time');

    //新增更新cookie到期时间
    if (!get_cookie_time) {
        var timestamp = (Date.parse(new Date()) / 1000) + 12 * 60 * 60;
        $.cookie('get_cookie_time', timestamp, {
            expires: 2,
            path: '/',
            domain: 'yutu.cn'
        });
    } else {
        var now = Date.parse(new Date()) / 1000;
        //过期重新获取
        if (now >= get_cookie_time) {
            //重新设置过去cookie
            var timestamp = (Date.parse(new Date()) / 1000) + 12 * 60 * 60;
            $.cookie('get_cookie_time', timestamp, {
                expires: 2,
                path: '/',
                domain: 'yutu.cn'
            });
            //登录请求cookie
            objSite.ajaxUser("/login/index/userinfo", {}, function (res) {
                if (res.status == 1) {
                    //替换user_name的key
                    res.data.user_name = res.data.nick_name;
                    objSite.loginTopHtml(res.data);

                    //设置cookie
                    $.cookie('userCookieData', JSON.stringify(res.data), {
                        expires: 2,
                        path: '/',
                        domain: 'yutu.cn'
                    });
                    return false;
                } else {
                    objSite.loginOutHtml(res);
                }
            });
        }
    }
    objSite.ajaxUser("/login/index/userinfo", {}, function (res) {
        if (res.status == 1) {
            objSite.loginTopHtml(res.data);
        } else {
            objSite.loginOutHtml();
        }
    });
    // objSite.loginTopHtml(userCookieData);
};

// 封装前端手机号码正则
// telAreaCode:区号
objSite.phoneRegular = function (telAreaCode) {
    var regular = /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/;
    if (telAreaCode === '+86') {
        regular = /^1[3-9]{1}[0-9]{9}$/;
    }
    return regular;
};





$(document).on('click', '.js-open-sign', function () {
    parent.layer.closeAll();
    var token = "";
    parent.openSignNew(token);
});



$('.js_AskBtn').click(function () {
    //判断登录
    if (!objSite.isLogin()) {
        openLogin();
        return false;
    }

    layer.open({
        type: 2,
        area: ['720px', '594px'],
        //maxmin: true,
        title: false,
        closeBtn: 2,
        resize: false,
        // zIndex: layer.zIndex, 
        shadeClose: false,
        skin: 'my-close-skin',
        content: ['/question/question/askPop', 'no'],
        success: function (layero) {
            //layer.setTop(layero); 
        }
    });

});

// 国家区号选择
function getNumber() {
    var tel_area = $('.selected-dial-code').text();
    $('.tel-area-code').attr('value', tel_area);
}




// 检测ie低版本提示升级
$(function () {
    var ieDom = '<div class="mss-ie-bg" style="z-index:29891015;position: fixed;top: 0px;left: 0px;bottom: 0px;right: 0px;width: 100%;height: 100%;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000,endColorstr=#7f000000);"><div class="mss-ie" style="width: 530px;height: 400px;background: url(https://static.3d66.com/public/images/ieUpdate/bg.png) center no-repeat;z-index: 99;box-sizing: border-box;position: fixed;top: 50%;left: 50%;margin: -200px 0px 0px -265px;">' +
        '<div class="mss-ie-title" style="padding-top: 200px;">' +
        '<h2 style="font-size: 22px;line-height: 22px;color: #027848;text-align: center;">浏览器版本过低，请升级您的浏览器</h2>' +
        '<p style="line-height: 12px;font-size: 12px;color: #04b26c;padding: 15px 0 25px;text-align: center;">为了不影响您的浏览体验，建议您选择比较新的浏览器访问本站</p>' +
        '<h5 style="color: #24aa6f;font-size: 12px;line-height: 12px;padding:0px 0px 8px 100px;">您可以选择：</h5>' +
        '</div>' +
        '<div class="mss-ie-browser" style="width: 390px;text-align: center;margin: 0px auto;">' +
        '<a style="display: inline-block;width: 92px;height: 100px;color: #05a464;" href="http://down.360safe.com/se/360se10.0.1581.0.exe" target="_blank"><img src="https://static.3d66.com/public/images/ieUpdate/logo1.png" style="display: inline-block;" alt=""><span style="display: block;width: 92px;font-size: 12px;">360浏览器</span></a>' +
        '<a style="display: inline-block;width: 92px;height: 100px;color: #05a464;" href="https://dl.softmgr.qq.com/original/Browser/70.0.3538.110_chrome_installer.exe" target="_blank"><img src="https://static.3d66.com/public/images/ieUpdate/logo2.png" style="display: inline-block;" alt=""><span style="display: block;width: 92px;font-size: 12px;">谷歌浏览器</span></a>' +
        '<a style="display: inline-block;width: 92px;height: 100px;color: #05a464;" href="https://dldir1.qq.com/invc/tt/QQBrowser_Setup_QB10.exe" target="_blank"><img src="https://static.3d66.com/public/images/ieUpdate/logo3.png" style="display: inline-block;" alt=""><span style="display: block;width: 92px;font-size: 12px;">QQ浏览器</span></a>' +
        '<a style="display: inline-block;width: 92px;height: 100px;color: #05a464;" href="http://down.360safe.com/cse/360cse_9.5.0.138.exe" target="_blank"><img src="https://static.3d66.com/public/images/ieUpdate/logo4.png" style="display: inline-block;" alt=""><span style="display: block;width: 92px;font-size: 12px;">360急速浏览器</span></a>' +
        '</div>' +
        '</div></div>';
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        console.log(fIEVersion);
        if (fIEVersion <= 8) {
            $('body').append(ieDom);
            return;
        } else {
            //IE版本>8
            return;
        }
    } else if (isEdge) {
        //edge
        return;
    } else if (isIE11) {
        //IE11
        return;
    } else {
        return; //不是ie浏览器
    }
});

//点击行为触发事件
function codeVeri(msg) {
    layer.open({
        type: 1,
        title: msg,
        area: ['390px', '280px'],
        content: $('#cbox').html(),
        success: function (layero, index) {
            var layerClass = layero[0].childNodes[1];
            new YpRiddler({
                expired: 10,
                mode: 'flat',
                container: layerClass,
                appId: '0cc0c95b979b44b0a53126be94ae77ec',
                version: 'v1',
                winWidth: 350,
                onError: function (param) {
                    if (param.code == 429) {
                        layer.msg('请求过于频繁，请稍后再试！');
                    }
                    layer.msg('验证服务异常');
                },
                onSuccess: function (validInfo, close) {
                    console.log("验证通过!");
                    var token = validInfo.token;
                    var authenticate = validInfo.authenticate;
                    layer.load(1);
                    var url = objSite.getUserUrl('/validate/click_select_validate/checkBlackboxDownload');
                    $.post(url, {
                        token: token,
                        authenticate: authenticate
                    }, function (res) {
                        layer.closeAll('loading');
                        layer.msg(res.msg);
                        if (res.code == 1) {
                            setTimeout(function () {
                                layer.closeAll();
                                window.location.reload();
                            }, 1000);
                        }
                    });
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
        }
    });
};

//滑块行为触发事件
function sliderVeri(msg) {
    layer.open({
        type: 1,
        title: msg,
        area: ['390px', '300px'],
        content: $('#cbox').html(),
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
                        return
                    }
                    layer.msg('验证服务异常');
                },
                onSuccess: function (validInfo, close) {
                    var token = validInfo.token;
                    var authenticate = validInfo.authenticate;
                    layer.load(1);
                    var url = objSite.getUserUrl('/validate/Slider_Validate/check');
                    $.post(url, {
                        token: token,
                        authenticate: authenticate,
                    }, function (res) {
                        layer.closeAll('loading');
                        layer.msg(res.msg);
                        if (res.code == 1) {
                            setTimeout(function () {
                                layer.closeAll();
                            }, 1000);
                        }
                        return;
                    });
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
        }
    });
};

/**
 * 加密字符串
 * @param pubkeyName
 * @param value
 * @returns {string}
 */
function encrypt(pubkeyName, value) {
    var encrypt = new JSEncrypt();
    var pubKey = config('jsencrypt');
    if (!pubKey.hasOwnProperty(pubkeyName)) {
        throw 'There is no "' + pubkeyName + '" encryption string in the current configuration file.';
    }

    var dataType = typeof value;
    if (dataType !== 'string') {
        throw 'Invalid param: type check failed for param "format". Expected "string", got "' + dataType + '".';
    }

    encrypt.setPublicKey(pubKey[pubkeyName]);
    return encrypt.encrypt(value);
}

$('.course-wrap > li').mouseenter(function (e) {
    $(this).children('.wrap').animate({
        'opacity': 1
    }, 100);
})
$('.course-wrap > li').mouseleave(function (e) {
    $(this).children('.wrap').animate({
        'opacity': 0
    }, 100);
})

//新窗口打开
function newOpenWindow(url) {
    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('style', 'display:none');
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
};

/**
 * 获取url参数值
 * @param name 参数名
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/**
 * 判断是否是json格式
 * @param str
 * @returns {boolean}
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            return !!(typeof obj == 'object' && obj);
        } catch (e) {
            return false;
        }
    }
    new Error('It is not a string!');
}

/**
 * 禁止浏览器后退
 */
function noBackOff() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
}

/**
 * 一个简单的js页面对象
 * @param options
 * @returns {*}
 * @constructor
 */
function View(options) {
    this.$data = {};
    var defOptions = {
        construct: function () {
            this.beforeCreate();
            this.created();
            this.mounted();
            this.beforeUpdate();
            this.updated();
            this.beforeDestroy();
            this.destroyed();
        },
        data: function () {},
        computed: {},
        watch: {},
        beforeCreate: function () {},
        created: function () {},
        mounted: function () {},
        beforeUpdate: function () {},
        updated: function () {},
        beforeDestroy: function () {},
        destroyed: function () {},
        methods: {}
    };
    options = typeof options == 'object' ? options : {};
    this.options = Object.assign(defOptions, options);

    for (var attr in this.options) {
        if (!this.options.hasOwnProperty(attr)) continue;
        this[attr] = this.options[attr];
    }

    // 将 methos 里的方式绑定到 this 里
    var methods = this.methods;
    for (var method in methods) {
        if (!methods.hasOwnProperty(method)) continue;
        this[method] = methods[method];
    }

    // 将 data 里的数据绑定到 this 里
    var data = this.data();
    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        this.$data[key] = data[key];
    }
    return this.construct();
}