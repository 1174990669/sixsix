/**
 * 创建的拼接前缀字符
 */
const LAY_Layedit = 'LAY_layedit_';
//id前缀
const LayDemoId = "lay_demo_";
let oldTimestamp = 0;

class CommentEditor {

    constructor(commentId, options) {
        this.editorMap = new Map();
        this.commentId = commentId;
        this.options = {
            idArray: [],
            editorOpt: {
                tool: ['face', 'image'],
                height: 100
            },
            wordNumber: 140,
            submitBtnSelect: '.js_Submit',
            showTips: true,
            ajaxSubmit: function (paramObj) {}
        }
        Object.assign(this.options, options);
        this.initEdit(commentId);


    }
    initEdit(commentId) {
        //富文本编辑器
        let idArray = this.options.idArray;
        layui.use('layedit', () => {
            let layedit = layui.layedit;
            window.layedit = layedit;
            //上传图片,必须放在 创建一个编辑器前面
            layedit.set({
                uploadImage: {
                    url: '/upload/upload/uploadLayEditorImage', //接口url
                    type: 'post' //默认post
                }
            });

            this.initData(commentId, layedit, this.options.editorOpt, this.options.wordNumber);

            //遍历idArray进行文本域初始化
            idArray.forEach((value, index) => {
                let nameId = LayDemoId + value;
                this.initData(nameId, layedit, null, 140);
            })


            //绑定点击提交事件
            this.bindEvent();
        });
    }
    initData(textareaId, layedit, editorOpt, limitNum) {
        // tool: [
        //     'strong' //加粗
        //     , 'italic' //斜体
        //     , 'underline' //下划线
        //     , 'del' //删除线
        //     , '|' //分割线
        //     , 'left' //左对齐
        //     , 'center' //居中对齐
        //     , 'right' //右对齐
        //     , 'link' //超链接
        //     , 'unlink' //清除链接
        //     , 'face' //表情
        //     , 'image' //插入图片
        //     , 'help' //帮助
        // ]
        //建立编辑器
        editorOpt = editorOpt || {
            tool: ['face', 'image'],
            height: 100
        }
        let buildId = layedit.build(textareaId, editorOpt);
        //key为dom的id
        this.editorMap.set(textareaId, buildId);
        
        this.options.showTips && layedit.setContent(buildId, '<p id="placeholderId" style="color: #999">亲，来说两句呗！</p>');

        let lay_layeditId = LAY_Layedit + buildId;
        bindLayeditEvent(lay_layeditId, textareaId, limitNum);
    }
    bindEvent() {
        let editorMap = this.editorMap;
        let ajaxSubmit = this.options.ajaxSubmit;
        $(this.options.submitBtnSelect).on('click', (e) => {
            if (!objSite.isLogin()) {
                //如果没有验证打开登录窗口
                openLogin();
                return false;
            }

            let newTimestamp = new Date().getTime();
            if (newTimestamp - oldTimestamp < 1000) {
                return;
            } else {
                oldTimestamp = newTimestamp;
            }
            let _this = $(e.currentTarget);

            //文本编辑域id
            var contentId = _this.attr('content');
            if (!contentId) {
                throw new Error('content id not defined');
            }
            var tid = _this.data('id');
            var type = _this.data('type');

            var buildId = editorMap.get(contentId);
            var layId = LAY_Layedit + buildId;

            clearPlaceholderTips(layId, contentId);

            let pCommentId = _this.data('pcommentid') || '';
            let toUserId = _this.data('touserid') || '';
            let lessId = _this.data('lessonid') || 0;

            var getContent = layedit.getContent(buildId);
            // console.log('cc', getContent);
            if (getContent.length <= 0) {
                layer.msg('评论内容不能为空');
                return false;
            }
            clearEditorText(layId, contentId);

            getToken(token => {
                var objParam = {
                    type: type,
                    id: tid,
                    detail: getContent,
                    index_detail_token: token,
                    rule: "index_detail_token"
                };
                !!toUserId && (objParam['to_user_id'] = toUserId);
                !!pCommentId && (objParam['parent_comment_id'] = pCommentId);
                !!lessId && (objParam['lesson_id'] = lessId);

                (typeof ajaxSubmit === 'function') && ajaxSubmit.call(this, objParam);
            });

        })
    }
}

//js统计字符串中包含的特定字符个数
function getPlaceholderCount(strSource) {
    //统计字符串中包含{}或{xxXX}的个数
    var thisCount = 0;
    strSource.replace(/<br>+/g, function (m, i) {
        //m为找到的{xx}元素、i为索引
        thisCount++;
    });
    return thisCount;
}
/**
 * 给编辑域绑定事件
 * @param {*} name 
 * @param {*} id 
 */
function bindLayeditEvent(name, id, limitNum) {
    $('#' + name).contents().find("body").blur(function () {});
    $('#' + name).contents().find("body").focus(function () {
        if ($(this).find('#placeholderId')[0]) {
            $(this).find('#placeholderId').remove();
            $('#' + id).siblings('.popup-foot').children('.num-tips').find('span').text(0);
            return;
        }
    });
    $('#' + name).contents().find("body").on('keyup', function () {
        var htmlV = $(this).html();
        var textV = $(this).text();
        var htmlVlength = getPlaceholderCount(htmlV);
        var lengthCount = textV.length + htmlVlength;
        if (lengthCount > limitNum) {
            //layer.msg('不能超过limitNum字');
            $(this).text(textV.substring(0, limitNum));
            $(this).blur();
        } else {
            $('#' + id).siblings('.popup-foot').children('.num-tips').find('span').text(lengthCount);
        }
    })
}
/**
 * 清除编辑域内容
 * @param {*} layId 
 * @param {*} content 
 */
function clearEditorText(layId, content) {
    //重置文本域为空
    $('#' + layId).contents().find('body').html('');
    $('#' + content).siblings('.popup-foot').children('.num-tips').find('span').text(0);
}
/**
 * 	清除掉提示文字
 */
function clearPlaceholderTips(name, content) {
    if ($('#' + name).contents().find("body").find('#placeholderId')[0]) {
        $('#' + name).contents().find("body").find('#placeholderId').remove();
        $('#' + content).siblings('.popup-foot').children('.num-tips').find('span').text(0);
        return;
    }
}

/**
 * 获取临牌
 * @param {*} callback 
 */
function getToken(callback) {
    $.ajax({
        url: '/course/comment/createToken',
        type: "get",
        async: false,
        data: {
            'rule': 'index_detail_token'
        },
        dataType: "json",
        success: function (data) {
            //myToken = data;
            callback(data);
        },
        error: function (e) {
            console.log('获取token失败', e);
        }
    });
}

export {
    CommentEditor
}