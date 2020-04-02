;$(function () {
    // 国际区号
    areaCodeInt();
    // 表单效果
    // focusblur();
    // 个人中心（绑定手机弹窗）
    $(document).on("click", "#bindingUserBtn", function () {
        console.log("个人中心（绑定手机弹窗）");
        layer.msg("绑定成功");
    });

    // 发送验证码
    $(document).on("click", "#sendYzm", function () {
        if ($(".monitor-input1").val() == "" || $(".monitor-input1").val() == undefined) {
            layer.msg("请输入手机号");
        } else {
            var t = 60;
            var that = this;
            var timer = null;
            $(that).attr("disabled", true);
            timer = setInterval(function () {
                t--;
                $(that).text(t + "s");
                if (t == 0) {
                    $(that).attr("disabled", false);
                    clearInterval(timer);
                    $(that).text("重新获取");
                }
            }, 1000);
        }
    });

});

