;
$(function () {
    //支付0表示微信支付，1表示支付宝支付
    var payWay = 0;
    var vip_id = $('.ul-pay .active').data('vip');
    var iframeDom = document.getElementById("iframeid");

    var payJkma = null;
    //切换支付种类
    $('.ul-pay >li').on('click', function (e) {
        vip_id = $(this).data('vip');
        var isHave = $(this).hasClass('active');
        if (isHave) {
            return;
        }
        $(this).addClass('active').siblings().removeClass('active');
        updateText();
        //TODO 更新二维码
        createPayOrder();
    });

    createPayOrder();

    //切换支付方式
    $('.pay-way-tab > .tab-pay').on('click', function (e) {
        var isHave = $(this).hasClass('active');
        if (isHave) {
            return;
        }
        $(this).addClass('active').siblings().removeClass('active');
        payWay = $(this).index();
        //TODO 更新二维码
        createPayOrder();
    });
    updateText();

    function updateText() {
        var price = $('.ul-pay > .active').data('price');
        var dayPrice = $('.ul-pay > .active').data('day_price');
        var unit = $('.ul-pay > .active').data('unit');
        // kind-txt
        // discount em
        $('.kind-txt').text(price + '' + unit);
        $('.discount>em').text(dayPrice + '元/天');
    }

    function loadingHide() {
        $('.js_PayLoading').hide();
    }
    
    //节流1s定时器timer
    var createOrderTimer = null;

    function createPayOrder() {
        createOrderTimer && clearTimeout(createOrderTimer);
        $('.js_CodeWrap').empty();
        $('.js_PayLoading').show();
        //参数
        var cz_type = payWay; // 支付方式 0.微信 1.支付宝 2. 易票联-微信
        var data = {
            vip_id: vip_id, // 购买的vip id
            cz_type: cz_type, // 支付方式 0.微信 1.支付宝 2. 易票联-微信
            source: 1,
            order_type: 1,
        };
        //转json
        data = JSON.stringify(data);
        $.ajaxSettings.timeout = 3000;
        createOrderTimer = setTimeout(function () {
            $.post('/payment/do_payment/index', {
                data: data,
            }, function (res) {
                console.log(res);
                if (res.status == 1) {
                    var result = res;
                    console.log(cz_type);
                    switch (cz_type) {
                        case 1:
                            // 支付宝扫码二维码
                            // 支付宝扫码二维码
                            $('.qrcode-ali-wrap').show().siblings('.code-wrap').hide();
                            // $('#jkma').val(res.data.jkma);
                            payJkma = res.data.jkma;
                            iframeDom.src = res.data.payurl;
                            iframeDom.onload = function () {
                                loadingHide();
                            }
                            break;
                        case 0:
                        default:
                            //wechat
                            console.log(res.data.qrcode);
                            $('.qrcode-wx-wrap').show().siblings('.code-wrap').hide();
                            // $('#jkma').val(res.data.jkma);
                            payJkma = res.data.jkma;
                            createQrCode(res.data.qrcode, "wechat");
                            loadingHide();
                            break;
                    }
                    //检查支付
                    checkPay();
                } else {
                    layer.msg(res.msg);
                }
            }).error(function (error) {
                layer.msg('请求超时');
            });
        }, 1000);

    }

    var loadPay = null;
    window.onbeforeunload = function (e) {
        loadPay && clearInterval(loadPay);
    }

    function checkPay() {
        if (!payJkma) {
            return;
        }
        loadPay && clearInterval(loadPay);
        var jkma = payJkma;
        //轮询
        loadPay = setInterval(function () {
            var url = '/payment/check_pay/index';
            $.get(url, {
                // service: "ll.order.check",
                jkma: jkma,
                // cz_channel: cz_channel,
            }, function (res) {
                if (res.code === 0) {
                    layer.msg('支付成功');
                    loadPay && clearInterval(loadPay);
                    setTimeout(function () {}, 1000);
                    payJkma = res.data;
                    $('#jkma').val(res.data);
                }
            }).error(function (error) {
                layer.msg('请求超时');
            })
        }, 2000);
    }

    function createQrCode(url) {
        // console.log(url);
        var DEFAULT_VERSION = "8.0";
        var ua = navigator.userAgent.toLowerCase();
        var isIE = ua.indexOf("msie") > -1;
        var safariVersion;
        if (isIE) {
            safariVersion = ua.match(/msie ([\d.]+)/)[1];
        }
        //判断IE8浏览器，qrcode使用table,其他版本使用canves
        $('.qrcode-wx-wrap').empty();
        if (safariVersion <= DEFAULT_VERSION) {
            //生成二维码
            $('.qrcode-wx-wrap').qrcode({
                render: 'table',
                width: 140,
                height: 140,
                text: url
            });
        } else {
            //生成二维码
            $('.qrcode-wx-wrap').qrcode({
                width: 140,
                height: 140,
                text: url
            });
        }
    }

});