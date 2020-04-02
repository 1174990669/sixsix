import TableLine from './module/tableLine';
$(function () {

    setTimeout(() => {
        let slideBar2 = new TableLine('#navSlideBar', {
            parentEl: '.js_LoginChange',
            itemEl: '.js_LoginChange > li',
            callback: function (index) {
                console.log('line:', index);
                // $('.catalog-nav-bg').eq(index).show().siblings('.catalog-nav-bg').hide();
                if (index == 1) {
                    //切换到了注册页面
                    $('.js_ChangeLoginWay').hide();
                    $('.js_RegisterBlock').show();
                    $('.js_LoginBlock').hide();
                } else {
                    $('.js_ChangeLoginWay').show();
                    $('.js_RegisterBlock').hide();
                    $('.js_LoginBlock').show();
                }
            }
        });
    }, 400);

    $('.passwordActive').on('click', function (e) {
        $(this).toggleClass('show');
        let isHas = $(this).hasClass('show');
        let $pwdInput = $(this).siblings('.input-pwd');
        if (isHas) {
            $pwdInput[0].setAttribute('type', 'text');
        } else {
            $pwdInput[0].setAttribute('type', 'password');
        }
    })
    $('#registerNum').on('keyup', function (e) {
        let value = $(this).val().replace(/\D+/g, '');
        $(this).val(value);
        if (value.length > 0) {
            $('.js_GetTelcode').addClass('active');
        } else {
            $('.js_GetTelcode').removeClass('active');
        }
    })
    // $('#registerNum').bind('input propertychange', function (e) {
    // })

    $('.js_LoginCode').on('click', function (e) {
        //验证码登录
        $('#loginBtn').removeClass('login-btn-active');
        $('input[name="login_type"]').val('phone_code');
        $('.login-form')[0].reset();
        $(this).parents('.js_SwitchItem').hide().siblings('.js_SwitchItem').show();
        $('#telNumber')[0].setAttribute('placeholder', '请输入手机号');
    });
    $('.js_loginPwd').on('click', function (e) {
        //密码登录
        $('#loginBtn').removeClass('login-btn-active');
        $('input[name="login_type"]').val('account');
        $('.login-form')[0].reset();
        $(this).parents('.js_SwitchItem').hide().siblings('.js_SwitchItem').show();
        $('#telNumber')[0].setAttribute('placeholder', '手机号');
    });

});