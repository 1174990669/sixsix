;$(function() {

    // 国际区号
    var areaCode = $("#selectAreaCode").attr("data-area");
    $("#selectAreaCode").intlTelInput({
        allowDropdown: true,
        nationalMode: false,
        preferredCountries: [areaCode, 'us'],
        separateDialCode: true
            //   utilsScript: "js/utils.js"
    });

    // 切换密码明文与否
    $(document).on("click", "#passwordActive", function() {
        if ($(this).attr("data-pwd") == "0") {
            $(this).attr("data-pwd", "1");
            $(this).addClass("seepwd");
            document.getElementById("password").type = "text";
        } else {
            $(this).attr("data-pwd", "0");
            $(this).removeClass("seepwd");
            document.getElementById("password").type = "password";
        }
    });

    // 表单交互
    // $("input").focus(function() {
    //     $(this).parent().css("border-bottom", "1px solid #3bc66f");
    //     // $(".login .normal .normal-login .login-from label").css("border-bottom","1px solid red");
    // });
    // $("input").blur(function() {
    //     if ($(this).val() == "" || $(this).val() == undefined) {
    //         $(this).parent().css("border-bottom", "1px solid #FDA333");
    //     } else {
    //         $(this).parent().css("border-bottom", "1px solid #e7e7e9");
    //     }
    // });

    //  监听input值
    $(document).on("input propertychange", function() {
        if ($(".monitor-input1").val().length >= 6 && $(".monitor-input2").val().length >= 6) {
            $(".login .normal .normal-login .login-btn a").addClass("login-btn-active");
        } else {
            $(".login .normal .normal-login .login-btn a").removeClass("login-btn-active");
        }
    });

    // 发送验证码
    // $(document).on("click", "#sendYzm", function() {
    //     if ($(".monitor-input1").val() == "" || $(".monitor-input1").val() == undefined) {
    //         layer.msg("请输入手机号");
    //     } else {
    //         var t = 60;
    //         var that = this;
    //         var timer = null;
    //         $(that).attr("disabled", true);
    //         timer = setInterval(function() {
    //             t--;
    //             $(that).text(t + "s");
    //             if (t == 0) {
    //                 $(that).attr("disabled", false);
    //                 clearInterval(timer);
    //                 $(that).text("重新获取");
    //             }
    //         }, 1000);
    //     }
    // });


});

// 国际区号方法
function getNumber() {
    console.log($('.selected-dial-code').text());
    // var tel_area = $('.selected-dial-code').text();
    // $('.area-code').attr('value', tel_area);
}