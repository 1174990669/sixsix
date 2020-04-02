$(function () {
    // 入群交流点击弹框
    $('.js-course-group').on('click', function () {
        parent.layer.closeAll();
        parent.$('.js-course-group', parent.document).eq(0).trigger('click');
    });
});