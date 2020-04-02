import 'babel-polyfill';
import './native/my-video-play';
import {
    LimitPage
} from './module/limitPage';
import TableLine from './module/tableLine';
import './module/courseFixNav';
import {
    CommentEditor
} from './module/commentEditor';
let courseId = $('#commentId').data('courseid');
let courseTarget = $('#href_target').data('target');
if (courseId) {
    new LimitPage('commentId', {
        courseId: courseId
    });
}
let slideBar2 = new TableLine('#infoSlideBar', {
    parentEl: '.js_CatalogChange',
    itemEl: '.js_CatalogChange > .item',
    callback: function (index) {
        // console.log('line:', index);
        $('.catalog-nav-bg').eq(index).show().siblings('.catalog-nav-bg').hide();
        if (index == 0) {
            $("#catalogId").nanoScroller({
                alwaysVisible: true,
                // scrollTop: $play.position().top + 'px'
            });
        }
    }
});

new CommentEditor('comm-content', {
    wordNumber: 300,
    ajaxSubmit: function (paramObj) {
        console.log('obj', paramObj);
        var data = {
            "course_id": paramObj.id,
            "video_id": paramObj.lesson_id,
            "content": paramObj.detail,
            'token': paramObj.index_detail_token,
            'rule': paramObj.rule
        }
        $.ajax({
            type: "POST",
            url: "/course/comment/create",
            dataType: "json",
            data: data,
            success: function (res) {
                if (res.code == 100) {
                    layer.msg(res.msg);
                } else if (res.code == 300) {
                    openLogin();
                } else if (res.code == 200) {
                    layer.msg(res.msg);
                } else {
                    layer.msg(res.msg);
                }
            },
            error: function (e) {
                console.log('课程评论失败', e);
            }
        })
    }
});

//课程目录的点击折叠
$('.catalog-nav .chapter-title').on('click', function (e) {
    var pEl = $(this).parent('.chapter');
    var iconEl = $(this).children('.iconfont');
    if (pEl.hasClass('extend')) {
        $(this).siblings('.chapter-children').slideUp(300, nanaoPaneCtr);
        iconEl.html('&#xe631;');
        pEl.removeClass('extend');
    } else {
        $(this).siblings('.chapter-children').slideDown(300, nanaoPaneCtr);
        iconEl.html('&#xe8cf;');
        pEl.addClass('extend');
    }
});

/* 课程目录点击 */
$('.course-item-wrap .chapter').on('click', function (e) {
    $(this).siblings('.sections').slideToggle(300);
    let _this = $(this);
    if (_this.hasClass('expand')) {
        _this.removeClass('expand');
    } else {
        _this.addClass('expand');
    }
});

/**
 * 控制滚动条的显示隐藏
 */
// let $play = $('#catalogId').find('.palying');
// let pageIndex = $play.parents('.chapter').index() + 1;
// let jieIndex = $play.index() + 1;
// let offTop = 1;
if ($("#catalogId").length) {
    $("#catalogId").nanoScroller({
        alwaysVisible: true,
        // scrollTop: $play.position().top + 'px'
    });
}

/**
 * 初始化章节
 */
var offTop = 0;
try {
    offTop = $("#catalogId").find('.palying').position().top
} catch (e) {

}
$("#catalogId .nano-content").scrollTop(offTop);

function nanaoPaneCtr() {
    var nanoHeight = $('#catalogId').height();
    var scrollH = $('#catalogId .catalog-nav')[0].scrollHeight;
    if (scrollH <= nanoHeight) {
        //隐藏滚动条
        $('.nano-pane').css({
            "visibility": 'hidden'
        });
    } else {
        //显示滚动条
        $('.nano-pane').css({
            "visibility": 'visible'
        });
    }
}


//折叠播放目录
const rightInfoWidth = $('.right-info-area').width();
$('#courseDrag').on('click', function (e) {
    let _this = $(this);
    if (_this.hasClass('extend')) {
        _this.removeClass('extend');
        $('.right-info-area').animate({
            'width': rightInfoWidth + 'px'
        }, 300)

    } else {
        _this.addClass('extend');
        $('.right-info-area').animate({
            'width': '0'
        }, 300)

    }
})
$('#notLoginTips').on('click', function () {
    openLogin();
});
if (!objSite.isLogin()) {
    openLogin();
}