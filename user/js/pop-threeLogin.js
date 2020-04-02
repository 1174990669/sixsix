$(function(){
    // 跳转到快速注册
    $("#threeRegister").click(function(){
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/register', ['800px', '520px']);
    });

    
    // 手机邮箱登录
    $(".three-login-phoneeml").click(function(){
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/login', ['800px', '520px']);
    });

    // 微信登录
    $(document).on("click", ".style-contant-wechat", function () {
        // 使用微信网页授权
        var wxurl = wechatUrl();
        parent.layer.closeAll();
        parent.window.location.href = objSite.getUserUrl(wxurl);
    });
});

// 获取微信登录地址
function wechatUrl() {
    var callBackUrl = window.parent.document.URL;
    return '/login/wx_login?llurl=' + encodeURIComponent(callBackUrl) + '&is_ground=1';

}
;