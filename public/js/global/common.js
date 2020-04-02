var myDomain = 'yutu.cn';
// var myDomain = 'yutu.cn';
$(function () {
    if (!Object.values) Object.values = function (obj) {
        if (obj !== Object(obj))
            throw new TypeError('Object.values called on a non-object');
        var val = [],
            key;
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                val.push(obj[key]);
            }
        }
        return val;
    }
    // tab选项卡
    try {
        $('.tab').each(function () {
            $(this).find('.tab-body').eq(0).show();
            $(this).find('.tab-body:gt(0)').hide();
        });
        $('.tab-head li').hover(function () {
            var n = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parents('.tab').find('.tab-body').eq(n).show().siblings('.tab-body').hide();
        });
    } catch (e) {}

    // 延迟加载
    try {
        $('.product img').lazyload({
            threshold: 0
        });
    } catch (e) {}


    //设置用户信息cookie
    objSite.setUserCookie = function (res) {
        $.cookie('userCookieData', JSON.stringify(res), {
            expires: 15,
            path: '/',
            domain: myDomain
        });
    }

    //获取用户信息cookie
    objSite.getUserCookie = function () {
        return $.cookie('userCookieData');
    }

    // 点击登录html赋值
    objSite.loginInHtml = function (data) {
        $.cookie('bindFlag', 'true', {
            expires: 15,
            path: '/',
            domain: myDomain
        });
        $.cookie('userCookieData', JSON.stringify(data), {
            expires: 15,
            path: '/',
            domain: myDomain
        });
        //新版更新用户信息
        // refreshTopUserInfo(res.data);

    };
    //首页用户登录下拉显示层

    // 登出html
    objSite.loginOutHtml = function () {
        $.cookie("userCookieData", null, {
            expires: -1,
            path: '/',
            domain: myDomain
        }); //删除用户cookie
        // var userCookieData = $.cookie('userCookieData');
    };

    //重新刷新的时候获取用户cooki信息判断
    var userCookieData = $.cookie('userCookieData');
    // console.log('getCookie', userCookieData);
    if (userCookieData && userCookieData.length) {
        try {
            var userCookieObj = JSON.parse(userCookieData);
            if (userCookieObj.user && userCookieObj.user.bind_phone == 0) {
                var bindFlag = $.cookie('bindFlag');
                if (bindFlag) {
                    //弹出绑定手机弹框
                    openBindPhone();
                    $.cookie("bindFlag", null, {
                        expires: -1,
                        path: '/',
                        domain: myDomain
                    }); //删除用户cookie
                }
            } else {
                // console.log('绑定了手机');
            }
        } catch (e) {
            console.error(e);
        }
    }

});