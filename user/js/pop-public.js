;
$(function () {
    //检测上次登录方式
    // setLastLoginType();

    // 跳转到返回第三方登录页面
    $(document).on('click', '.gotologin4-1', function () {
        parent.layer.closeAll();
        parent.objSite.openUserWin('/login/popover/welcome', ['800px', '520px']);
    });
});


// 国际区号
function areaCodeInt() {
    var areaCode = $("#selectAreaCode,.selectAreaCode").attr("data-area");
    $("#selectAreaCode,.selectAreaCode").intlTelInput({
        allowDropdown: true,
        nationalMode: false,
        preferredCountries: [areaCode, 'us'],
        separateDialCode: true
        //   utilsScript: "js/utils.js"
    });
}

// 国际区号方法
function getNumber() {
    console.log($('.selected-dial-code').text());
    // var tel_area = $('.selected-dial-code').text();
    // $('.area-code').attr('value', tel_area);
}

// 切换密码明文与否
function switchPassword() {
    $(document).on("click", "#passwordActive", function () {
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
}

// input表单focus blur
// function focusblur() {
//     $("input").focus(function () {
//         $(this).parent().css("border-bottom", "1px solid #3bc66f");
//         // $(".login .normal .normal-login .login-from label").css("border-bottom","1px solid red");
//     });
//     $("input").blur(function () {
//         if ($(this).val() == "" || $(this).val() == undefined) {
//             $(this).parent().css("border-bottom", "1px solid #FDA333");
//         } else {
//             $(this).parent().css("border-bottom", "1px solid #e7e7e9");
//         }
//     });
// }

// 简单发送验证码倒计时
function sendYzm(that) {
    var t = 60;
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


//  监听input值
function monitorNumber() {
    $(document).on("input propertychange", function () {
        if ($(".monitor-input1").val().length >= 6 && $(".monitor-input2").val().length >= 6) {
            $(".monitor-bgcolor").addClass("login-btn-active");
        } else {
            $(".monitor-bgcolor").removeClass("login-btn-active");
        }
    });
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

//上次登录方式
function setLastLoginType() {
    try {
        var lastLoginType = $.cookie('last_login_type');
        if (lastLoginType) {
            if (lastLoginType == 1) {
                $('.login-type-qq').addClass('login-type-show');
                $('.login-type-qq').parent().siblings('span').children('em').removeClass('login-type-show');
            } else if (lastLoginType == 2) {
                $('.login-type-wx').addClass('login-type-show');
                $('.login-type-wx').parent().siblings('span').children('em').removeClass('login-type-show');
            } else {
                $('.login-type-other').addClass('login-type-show');
                $('.login-type-other').parent().siblings('span').children('em').removeClass('login-type-show');
            }
        }
    } catch (e) {

    }
};

// 验证手机号码
function checkEmail(email) {
    if (email == '') {
        return '请输入邮箱';
    }

    // 验证
    var regular = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");

    if (!regular.test(email)) {
        return '邮箱格式格式错误';
    }

    return true;
};