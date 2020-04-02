import 'babel-polyfill';

//富文本编辑域模块导入
import {
    CommentEditor
} from './module/commentEditor';

$("#quesTitle").bind("input propertychange", function (event) {
    //$("#quesContent").val()
    var length = $(this).val().length;
    $(this).siblings('.tips-nums').children('em').text(length);

    if (length > 100) {
        $('.tips-more').css('display', 'block');
    } else {
        $('.tips-more').css('display', 'none');
    }
});

new CommentEditor('commContentId', {
    wordNumber: 500,
    showTips: false,
    editorOpt: {
        tool: ['face', 'image'],
        height: 100
    }
});

$('.js_SumbitBtn').on('click', function (e) {
    let title = $('#quesTitle').val();
    console.log(title);
    if (!title.length) {
        layer.msg('请填写问题描述！');
        return;
    }
    let detail = layedit.getContent(1);
    let data = {
        title,
        detail
    };

    $.ajax({
        type: 'POST',
        url: '/question/question/add',
        timeout: 10000,
        data: data,
        dataType: 'json',
        error: function (jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case "timeout":
                    objSite.msg("加载超时，请重试!");
                    break;
                case "error":
                    objSite.msg("请求异常，请稍后再试!");
                    break;
                default:
                    objSite.msg(textStatus);
                    break;
            }
        },
        success: function (result) {
            if (result.code === 0) {
                parent.layer.closeAll();
                parent.layer.msg('提交成功！');
            } else {
                parent.layer.msg(result.msg);
            }
        },
        complete: function () {}
    })
});