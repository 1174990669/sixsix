;
$(function () {
    // 上传头像
    $('.round-img .fileinput').change(function () {
        var $this = $(this);
        var regex = /(.jpg|.jpeg|.png)$/gi;
        // 验证图片格式
        if (!regex.test(this.value.toLowerCase())) {
            // layer.tips('请选择jpg,png格式图片', '.user-photo', {
            //     tips: [2, '#ff0000']
            // });
            layer.msg('请选择jpg,png格式图片');
            return false;
        }
        var imgfile = this.files[0];
        // 验证大小
        if (imgfile.size > 1024 * 1024) {
            layer.msg('图片不能超过1M');
            return false;
        }
        $('.cropper-box').show();
        var fr = new FileReader();
        fr.readAsDataURL(imgfile);
        fr.onload = function (e) {
            $('#cropperImg').cropper('replace', e.target.result, false);
        };
        $('#cropperImg').cropper({
            aspectRatio: 1 / 1,
            viewMode: 2,
            dragMode: 'move',
            // dragMode: 'none',
            initialAspectRatio: 1,
            // preview: '.before',
            background: false,
            autoCropArea: 0.8,
            zoomOnWheel: false,
        });
    });

    // 提交按钮
    $('.js_Upsubmit').click(function () {
        var imgCanvas = $('#cropperImg').cropper('getCroppedCanvas', {
            width: 150,
            height: 150,
            fillColor: '#ffffff',
            imageSmoothingQuality: 'medium'
        });
        var imgBaseUrl = imgCanvas.toDataURL('image/jpeg');
        $('#userPhoto').attr('src', imgBaseUrl);
        $('.cropper-box').hide();

        //console.log(imgBaseUrl);
        //上传图片
        $.post('/upload/upload/base64Image', {
            file: imgBaseUrl,
            dir: 'head'
        }, function (res) {
            if (res.code == 0) {
                $('#userPhoto').attr('src', res.data.src);
            } else {
                layer.msg(res.msg);
            }
            return false;
        });
    });

    // 取消按钮
    $('.js_Upcancel').click(function () {
        $('.cropper-box').hide();
        $('#cropperImg').cropper('reset');
    });
});
$(function () {
    var form;
    layui.use(['form'], function () {
        form = layui.form;
        // form.on('select(sort1)', function (data) {
        // });

        function postFormData(data) {
            $.ajax({
                type: "POST",
                url: '/user/user/updatePersonInfo',
                data: data,
                dataType: 'json',
                beforeSend: function (request) {

                },
                success: function (obj) {
                    if (obj.code == 0) {
                        layer.msg('修改成功');
                        location.reload();
                    } else {
                        layer.msg(obj.msg);
                    }
                },
                error: function (e) {
                    console.error(e);
                },
                complete: function () {

                }
            });

        }
        $('.js_Keep').on('click',function () {
            var formData = form.val('pData');
            formData.user_img = $('#userPhoto').attr('src');
            //保存数据
            postFormData(formData);
        });

    });
});