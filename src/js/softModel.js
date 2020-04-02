import './module/fixNav.js';
import './module/rightExpand';
//导入轮播图
import './module/banner.js';
//导入查看大图功能
import PictureView from './module/pictureView';
//导入评论回复文本域
import {
    ReplyArea,
    RegisterAnswer as MyReply
} from './module/softReply';
//富文本编辑域模块导入
import {
    CommentEditor
} from './module/commentEditor';
// import StaticFun from './public/staticFun';
// //列表折叠展开
// import ListExpand from './module/listExpand';
import '../../libs/js/jquery.lazyload';


//富文本域创建
let layuiArrVal = $('#layuiArr').val();
let layuiArr = layuiArrVal ? (layuiArrVal.split(',')) : [];
new CommentEditor('commContentId', {
    idArray: layuiArr,
    ajaxSubmit: function (paramObj) {
        console.log('obj', paramObj);
        $.ajax({
            type: "POST",
            url: "/comment/index/comment",
            dataType: "json",
            data: paramObj,
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
                console.log('发表失败', e);
            }
        })
    }
});
//评论
new MyReply('.answer-reply-wrap', {
    children: '#jsReplyBtn',
    callback: function (paramObj) {
        console.log('回复', paramObj);
        $.ajax({
            type: "POST",
            url: "/comment/index/comment",
            dataType: "json",
            data: paramObj,
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
                console.log('发表失败', e);
            }
        })
    }
});

// 软件描述折叠
var softDescHeight = $('.soft-desc-container')[0] && $('.soft-desc-container')[0].scrollHeight;
var softDescEl = $('.soft-desc-container');
const Max_Soft_Desc_Height = 660;
if (softDescHeight > Max_Soft_Desc_Height) {
    $('.js_MoreDesc').show();
    softDescEl.css({
        "max-height": Max_Soft_Desc_Height + "px"
    });
} else {
    $('.js_MoreDesc').hide();
}
$('.js_MoreDesc').on('click', function (event) {
    //soft-desc-container
    if (softDescEl.hasClass('expand')) {
        $(this).html(`展开全部&nbsp;<span class="arrow-down"></span>`);
        softDescEl.removeClass('expand');
        softDescEl.animate({
            "max-height": Max_Soft_Desc_Height + "px"
        }, 0)
    } else {
        $(this).html(`<a href="#softDetailDesc">收起部分&nbsp;<span class="arrow-up"></span></a>`);
        softDescEl.addClass('expand');
        softDescEl.animate({
            "max-height": softDescHeight + "px"
        }, 200)

    }

});

//查看大图功能
//js_InstallSteps
new PictureView('.js_InstallSteps', {

});

$('.js_BaiduDon').on('click', function (e) {
    e.preventDefault();
    layer.open({
        type: 1,
        area: ['auto', 'auto'],
        //maxmin: true,
        title: false,
        closeBtn: 2,
        zIndex: layer.zIndex, //重点1
        shadeClose: true,
        skin: 'my-close-skin',
        content: $('.baidu-download-wrap'),
        success: function (layero) {
            layer.setTop(layero); //重点2
        }
    });
});
$('.js_DownloadOk').on('click', function () {
    layer.closeAll();
});

//动态刷新点击数据
let commentLikeInput = $('#commentLikeArr');
let backLikeInput = $('#backLikeArr');

// if (commentLikeInput.length) {
//     getSupportInputInfo(commentLikeInput);
// }
// if (backLikeInput.length) {
//     getSupportInputInfo(backLikeInput);
// }

function getSupportInputInfo(el) {
    let idsArr = el.val();
    let type = el.data('type');
    let paramObj = {
        evaluate_object: type,
        ids: idsArr
    }
    ajaxSupportNum(paramObj);
}
/**
 * 获取用户点赞信息
 * @param {*} supportArray 
 */
function ajaxSupportNum(paramObj) {
    $.ajax({
        type: "GET",
        url: "/index/comment/isLike",
        dataType: "json",
        data: paramObj,
        success: function (res) {
            if (res.code == 200) {
                updateSupportUI(res.data, paramObj.evaluate_object);
            }
        },
        error: function (e) {
            console.log('发表失败', e);
        }
    })
}

function updateSupportUI(arr, type) {
    arr.forEach(element => {
        let likeDom = null;
        if (type == 6) {
            //回复的回复的点赞
            likeDom = $('likes' + element.id);
        } else {
            likeDom = $('like' + element.id);
        }

        if (element.is_like) {
            likeDom.addClass('active');
        }
        likeDom.find('em').html(element.good_num);
    });
}

try {
    $('.js_InstallSteps img').lazyload({
        placeholder: "", //用图片提前占位
        // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
        effect: "fadeIn", // 载入使用何种效果
        //threshold: 1000, // 提前开始加载
    });
} catch (e) {
    console.error(e);
}

//溜云库弹框
$('.js-lyk-download').on('click', function (e) {
    layer.open({
        type: 1,
        area: '680px',
        title: false,
        closeBtn: 2,
        shadeClose: true,
        skin: 'lyk-layer-skin',
        content: $('#lykDownloadId')
    });
});
//相关问答列表展开折叠
// new ListExpand('.soft-lists-wrap > .ul-soft-lists', {
//     btnEl: '.js_Xg_lists',
//     maxHeight: 600,
//     parentEL: '.soft-lists-wrap'
// });

//点击回到顶部
$('.js_BackTop').click(function () {
    $('html,body').animate({
        scrollTop: 0
    }, 300);
});


//问题排序按钮点击
$('body').on('click', function () {
    let $popover = $('#popoverContent');
    if (!$popover.is(':hidden')) {
        $popover.hide();
    }
});

$('#sortPopBtn').on('click', function (e) {
    e.stopPropagation();
    let _this = $(this);
    let type = _this.data('type');
    let $popover = $('#popoverContent');
    if (type == 0) {
        //默认排序
        $popover.css({
            top: '28px'
        })
    } else {
        //时间排序
        $popover.css({
            top: '-15px'
        })
    }
    $popover.show();
})