import 'babel-polyfill';
import './module/fixNav.js';

import './module/rightExpand';
import './module/refreshData';
//导入评论回复文本域
import {
    ReplyArea,
    RegisterAnswer as MyReply
} from './module/softReply';

import {
    Collapse
} from './module/collapse';

//富文本编辑域模块导入
import {
    CommentEditor
} from './module/commentEditor';

//导入查看大图功能
import PictureView from './module/pictureView';
//导入列表展开折叠
import ListExpand from './module/listExpand';

$(function () {

    //富文本域创建
    let layuiArr = $('#layuiArr').val().split(',');
    new CommentEditor('commContentId', {
        idArray: layuiArr,
        editorOpt: {
            tool: [
                'strong' //加粗
                , 'italic' //斜体
                , 'underline' //下划线
                , 'del' //删除线
                , '|' //分割线
                , 'left' //左对齐
                , 'center' //居中对齐
                , 'right' //右对齐
                , 'link' //超链接
                , 'unlink' //清除链接
                , 'face' //表情
                , 'image' //插入图片
            ],
            height: 500
        },
        wordNumber: 10000,
        ajaxSubmit: function (paramObj) {
            console.log('obj', paramObj);
            $.ajax({
                type: "POST",
                url: "/comment/index/comment",
                dataType: "json",
                data: paramObj,
                success: function (res) {
                    // console.log(res);
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

    //全部内容展开模块
    new Collapse('.js_AskContentArea', {
        maxHeight: 120
    });

    //溜溜问答item展开更多
    let itemsLength = $('.content-lists-wrap > .lists-item').length;
    if (itemsLength > 5) {
        $('.js_LL_Ask_expand').show();
        $('.content-lists-wrap > .lists-item:lt(5)').show();
        $('.content-lists-wrap > .lists-item:gt(4)').hide();
    }
    $('.js_LL_Ask_expand').on('click', function (e) {
        let _this = $(this);
        if (_this.hasClass('expand')) {
            _this.html(`展开全部&nbsp;<span class="arrow-down"></span>`);
            _this.removeClass('expand');
            _this.siblings('.content-lists-wrap').find('.lists-item:lt(5)').show().end().find('.lists-item:gt(4)').hide();
        } else {
            _this.html(`收起部分&nbsp;<span class="arrow-up"></span>`);
            _this.addClass('expand');
            _this.siblings('.content-lists-wrap').find('.lists-item').show();
        }

    });

    //相关问答列表展开
    new ListExpand('.comm-wrap-item > .comm-soft-lists', {
        btnEl: '.js_Xg_lists',
        maxHeight: 800,
        parentEL: '.comm-wrap-item'
    });


    //我要回答按钮点击
    $('.js_Ask_Question').on('click', function (e) {
        let _this = $(this);
        let aTop = $('.js_CommentArea').offset().top + 200;
        let dTop = $(document).scrollTop();
        if (_this.hasClass('active')) {
            _this.removeClass('active');
            _this.html('我来回答');
            $('.js_CommentArea').slideUp(200);

        } else {
            _this.addClass('active');
            _this.html('收起回答');

            $('.js_CommentArea').slideDown(200, function () {
                if (dTop < aTop) {
                    $('body,html').animate({
                        scrollTop: aTop
                    })
                }

            });
        }

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
                top: '-5px'
            })
        } else {
            //时间排序
            $popover.css({
                top: '-45px'
            })
        }
        $popover.show();
    })

    //关注按钮点击事件
    $('.js_Attention').on('click', function (e) {
        let _$this = $(this);
        let question_id = _$this.data('questionid');
        let paramObj = {
            question_id: question_id
        }
        $.ajax({
            type: "POST",
            url: "/question/question/attention",
            dataType: "json",
            data: paramObj,
            success: function (res) {
                if (res.code == 0) { //关注
                    // let num = res.data;
                    _$this.text('取消关注');
                    _$this.addClass('active');
                    layer.msg(res.msg);
                } else if (res.code == 201) { //取关
                    // var num = res.data;
                    _$this.removeClass('active');
                    _$this.text('关注问题');
                    layer.msg(res.msg);
                } else if (res.code == 300) {
                    openLogin();
                } else {
                    layer.msg(res.msg);
                }
            },
            error: function (e) {
                console.log('关注失败', e);
            }
        })
    });


    //查看大图功能
    //js_InstallSteps
    new PictureView('.js_Ask_Content_Inner', {

    });

});