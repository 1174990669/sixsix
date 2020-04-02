$(function () {

    var payWay = 0; //默认为第一种支付
    var courseid = $('.course').data('id')
    var packageid = $('.package').data('id')
    var isOpenVip = $('#zixueVip').is(':checked')
    var cz_channel = 10;
    var iframeDom = document.getElementById("iframeid");
    if (isOpenVip) {
        cz_channel = 22;
    }

    $('.js_Channels').children('div').on('click', function (e) {
        var _this = $(this);
        _this.addClass('checked').siblings('div').removeClass('checked');
        var payIndex = _this.index();
        payWay = payIndex;
        $('.js_AreaBody').children('.pay-pay-item').eq(payIndex).show().siblings('.pay-pay-item').hide();
        getPayPrice();

    });

    $('#zixueVip').on('change', function (e) {
        var _this = $(this);
        isOpenVip = _this.is(':checked');
        getPayPrice();
    });
    getPayPrice();
    //create_pay_order();
    function loadingShow() {
        $('.js_PayLoading').show();
    }

    function loadingHide() {
        $('.js_PayLoading').hide();
    }
    //ajax 获取价格
    function getPayPrice() {
        if (payWay != 2) {
            loadingShow();
        } else {
            loadingHide();
        }
        var url = objSite.getServiceUrl('/buy/course_web/getFee');

        cz_channel = 10;

        if (isOpenVip) {
            cz_channel = 22;
        }

        var cz_type = payWay;
        if(cz_type == 2){
            cz_type =3;
        }
        console.log('payway', payWay);
        $.post(url, {
            course_id: courseid,
            package_id: packageid,
            cz_type: cz_type,
            order_type: cz_channel,
        }, function (res) {
            var unit = "￥";
            if(cz_type == 3){
                var unit = "$";
            }
            // console.log("getPay: " + res.data);
            $('.js_TotalPrice').find(".js_Num").html(unit + res.data.total_fee);
            $('.js_Discount').find(".js_Num").html("-"+unit + res.data.discount_fee);
            if(res.data.discount_fee == 0){
                $('.js_Discount').hide();
            }else{
                $('.js_Discount').show();
            }
            $('.js_ActualPrice').find(".js_Num").html(unit + res.data.final_fee);

        }).error(function (error) {
            layer.msg('请求超时');
        });

        //切换成paypal时, 只显示价格
        if (payWay == 2) {
            return
        }

        create_pay_order();
    }

    function create_pay_order() {
        $('.qrcode-wx-wrap').empty();
        $("#paypalsubmit").remove();
        //参数
        var cz_type = payWay;

        var url = objSite.getServiceUrl('/payment/do_payment');

        var data = {
            course_id: courseid,
            package_id: packageid,
            cz_type: (cz_type == 2) ? 3 : cz_type,
            cz_source: 0,
            order_type: cz_channel,
        };
        // (data.cz_type == 2) && (data.cz_type = 3);
        //转json
        data = JSON.stringify(data);

        // console.log(data);

        $.ajaxSettings.timeout = 3000;
        $.post(url, {
            data: data,
        }, function (res) {
            //console.log(res);
            //console.log(res);
            if (res.status == 1) {
                //console.log(res.data.jkma);
                var result = res;
                console.log(cz_type);
                switch (cz_type) {
                    case 1:
                        // 支付宝扫码二维码
                        $('#jkma').val(res.data.jkma);
                        iframeDom.src = res.data.payurl;
                        iframeDom.onload = function () {
                            loadingHide();
                        }

                        break;
                    case 2:
                        // result = JSON.parse(res.msg);
                        //触发paypal支付
                        //console.log(res.data.payurl);
                        $('#jkma').val(res.data.jkma);
                        $('.ali-pay-div').append(res.data.payurl);
                        checkPay();
                        break;
                    case 0:
                    default:
                        //wechat
                        // console.log(res.data);
                        $('#jkma').val(res.data.jkma);
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
    }

    $('#cz_link').on('click', function (e) {
        create_pay_order();
    });

    function createQrCode(url) {
        //console.log(url);

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



    //检查支付
    function checkPay() {

        clearInterval(loadPay);
        var jkma = $('#jkma').val();
        //轮询
        loadPay = setInterval(function () {
            var url = objSite.getServiceUrl('/pay/check_pay');
            $.post(url, {
                service: "ll.order.check",
                jkma: jkma,
                cz_channel: cz_channel,
            }, function (res) {
                if (res.status === 200) {
                    // layer.msg('支付成功');
                    clearInterval(loadPay);
                    setTimeout(function () {
                        //todo 支付成功弹窗
                        // parent.window.location.href = objSite.getUserUrl('/pay/vip_list/index');
                        openSuccessDialog(courseid);
                        //window.location.href = objSite.getZixueUrl('/course/pay/success?course_id=' + courseid);
                    }, 1000);
                    //更新父级UI
                    updatedParentView();

                    $('#jkma').val(res.data);
                }
            }).error(function (error) {
                layer.msg('请求超时');
            })
        }, 2000);
    }

    function openSuccessDialog(courseId) {
        parent.layer.closeAll();
        let url =  objSite.getZixueUrl('/course/pay/success?course_id=' + courseId);
        parent.layer.open({
            type: 2,
            area: ['400px','260px'],
            closeBtn: 0,
            zIndex: parent.layer.zIndex,
            shadeClose: true,
            skin: 'my-close-skin',
            title: false,
            resize: false,
            content: [url, 'no'],
            success: function (layero,index) {
                // var body = layer.getChildFrame('body', index);
                // console.log(body.html());
                // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                 //得到iframe页的body内容
                // body.find('input').val('Hi，我是从父页来的');
            }
        });
    }
    /**
     * 更新父级ui
     */
    function updatedParentView() {
        $('.js_BuyWrap .open-course-lesson', window.parent.document).remove();
        var buyBtnEl = $('.js_BuyWrap .js_PayCourse', window.parent.document);
        buyBtnEl.removeClass('js_PayCourse').addClass('open-course-lesson');
        buyBtnEl.attr('data-lesson', 0);
        buyBtnEl.html('<div class="anim"></div>开始学习');
        //或者刷新
        // parent.window.location.reload();

    }

});