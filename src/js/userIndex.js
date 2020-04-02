;
$(function () {
    $('.js_CancelCourse').on('click', function (e) {
        var id = $(this).data('id');
        var $item = $(this).parents('.item');
        $.ajax({
            type: 'POST',
            url: '/user/user_course/del',
            timeout: 10000,
            data: {
                course_id: id
            },
            error: function (jqXHR, textStatus, errorThrown) {},
            success: function (result) {
                if (result.code == 0) {
                    // window.location.reload();
                    $item.remove();
                } else {
                    layer.msg(result.msg);
                }
            },
            complete: function () {}
        })
    });

    if (!objSite.isLogin()) {
        openLogin();
    }
    
});