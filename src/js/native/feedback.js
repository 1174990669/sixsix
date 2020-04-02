$(function () {

    // 意见反馈
    var feebbackIndex = -1;

    $("#FeedbackDialog #contact_dd").bind("input propertychange", function (event) {
        var val = $(this).val();
        $(this).val(val.replace(/[\u4e00-\u9fa5]/g, ''));
    });


    $(document).on('click', '#FeedbackDialog .checkbox-wrap >li', function () {
        var $this = $(this);
        var $input = $this.find('input');
        var checked = $input.is(':checked');
        $input.prop('checked', !checked);
    });
    var isFbSumbitting = false;
    $(document).on('click', '.js_FbSumbit', function () {
        //post提交意见反馈
        if (isFbSumbitting) {
            return;
        }
        var $wrap = $('#FeedbackDialog');
        var type = $wrap.find('input[name="fbType"]:checked').val();
        if (!type) {
            layer.msg('请选择反馈类型！');
            return;
        }
        var content = $wrap.find('textarea[name="content"]').val();
        if (!content) {
            layer.msg('请输入反馈内容！');
            return;
        }
        // if (content.length < 20) {
        //     layer.msg('反馈内容不能少于20字！');
        //     return;
        // }
        var contact = $wrap.find('input[name="contact"]').val();
        // type: int 反馈类型 只能单选，必填
        //   content: string 补充内容，必填
        //   contact: string 联系方式，非必填
        var paramObj = {
            tag: type,
            content: content,
            source: 1,
            contact: contact,
        }
        isFbSumbitting = true;
        $.ajax({
            type: "POST",
            // crossDomain: true,
            url: '/feedback/feedback/add',
            timeout: 10000,
            //  默认情况下，标准的跨域请求是不会发送cookie的
            // xhrFields: {
            //     withCredentials: true
            // },
            data: paramObj,
            dataType: 'json',
            error: function error(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
            success: function success(result) {
                // layer.msg(result.msg);
                if (result.code == 0) {
                    // layer.close(feebbackIndex);
                    parent.layer.closeAll();
                    parent.layer.msg('反馈成功！');

                } else {
                    parent.layer.msg(result.msg);
                }

            },
            complete: function () {
                setTimeout(function () {
                    isFbSumbitting = false;
                }, 500)
            }
        });

    });

    $(document).on('click', '.js_FbCancel', function () {
        parent.layer.closeAll();
    });

});