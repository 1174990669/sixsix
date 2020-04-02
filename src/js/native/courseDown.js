$(function () {

    // var course_id = $('#course_id').val();
    //所需软件下载
    // $(".course_download_click").click(function (e) {

    //     //判断登录
    //     if (!objSite.isLogin()) {
    //         //如果没有验证打开登录窗口
    //         openLogin();
    //         return false;
    //     }
    //     var course_data_id = $(this).attr('data-id');
    //     var url = "/course/play/canDownload";
    //     $.ajax({
    //         url: url,
    //         type: "post",
    //         data: {
    //             "course_data_id": course_data_id
    //         },
    //         dataType: 'json',
    //         async: false,
    //         success: function (res) {
    //             if (res.code != 200 && res.code != 201) {
    //                 layer.msg(res.msg);
    //                 stopDefault(e);
    //             } else if (res.code == 200) {
    //                 //
    //             }
    //         }
    //     });
    // });

    // 练习题下载
    $(".dn-btn").click(function (e) {

        //判断登录
        if (!objSite.isLogin()) {
            //如果没有验证打开登录窗口
            openLogin();
            return false;
        }

        var exercise_id = $(this).attr('data-id');

        var url = "/course/exercise/download";
        $.ajax({
            url: url,
            type: "post",
            data: {
                "id": exercise_id
            },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.code == 300) {
                    openLogin();
                    return false;
                } else if(res.code == 0) {
                    newOpenWindow(res.data.url);
                    return false;
                } else {
                    layer.msg(res.msg);
                }

                // if (res.code != 200 && res.code != 201) {
                //     cantDownload = setTimeout(function () {
                //         pauseLui = layer.open({
                //             type: 2,
                //             skin: 'layer-nobg',
                //             title: false,
                //             resize: false,
                //             area: ['635px', '462px'],
                //             content: [objSite.getZixueUrl('/course/play/cantDownload') + "?course_id=" + course_id, 'no'],
                //         });
                //     }, 500)
                //     stopDefault(e);
                // } else if (res.code == 200) {
                //     //window.open(res.url, "_blank");
                //     newOpenWindow(res.url);
                // }
            }
        });
    });

    //新窗口打开
    function newOpenWindow(url) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('style', 'display:none');
        a.setAttribute('target', '_blank');
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
    }


    function stopDefault(e) {
        if (e && e.preventDefault)
            e.preventDefault();
        else
            window.event.returnValue = false;
    }

    // //返回软件下载地址
    // $(".down_soft").click(function () {
    //     $.post('/soft/soft_down/getSoftInfo', {soft_id: $('#soft_id').val()}, function (res) {
    //         window.location.href = res.data.yun_url;
    //     });
    // });

});