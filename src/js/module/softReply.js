class ReplyArea {
    constructor(select, options) {

    }
}
let replyParentSelect = '.reply-operate';
let replyActive = 'reply-active';
bindReplyClick('.js_Reply', replyActive);
let $lastReply = null;
// let $lastReply = new Set();
/**
 * 评论内容的回复点击
 * @param {*} $el 
 * @param {*} rActive 
 */
function bindReplyClick(childEl, rActive) {
    $('.answer-reply-wrap').on('click', childEl, function (event) {
        let _this = $(this);

        var tid = _this.data('id');
        var type = _this.data('type');
        let pCommentId = _this.data('pcommentid') || '';
        let toUserId = _this.data('touserid') || '';
        let toUserName = _this.data('tousername') || '';

        let $ReplyBox = $('.js_ReplyBox');
        if (_this.hasClass(rActive)) {
            _this.removeClass(rActive);
            _this.find('span').text('回复');
            $ReplyBox.remove();
        } else {
            //先移除存在的box
            $ReplyBox.remove();
            if ($lastReply) {
                $lastReply.removeClass(rActive);
                $lastReply.find('span').text('回复');
            }

            _this.addClass(rActive);
            _this.find('span').text('收起');
            //添加回复域的Dom元素
            _this.parent().after(`<div class="reply-box js_ReplyBox" id="0000">
            <div class="reply-box-block">
                <textarea class="reply-box-textarea js_TextArea" placeholder="回复：${toUserName}" maxlength="140"></textarea>
            </div>
            <div class="reply-box-btn js_ReplyBtn" id="jsReplyBtn" data-type="${type}" data-id="${tid}" data-pcommentid="${pCommentId}" data-touserid="${toUserId}">回复</div>
            </div>`);
            $lastReply = _this;

        }


    });
}

/**
 * 显示文本编辑域
 */
$(".js_Answer").on('click', function (event) {
    let _this = $(this);
    if (_this.hasClass('active')) {
        _this.removeClass('active');
        _this.find('span').text('回复');
        _this.parent().siblings('.answer-textarea').hide();
    } else {
        _this.addClass('active');
        _this.find('span').text('收起');
        _this.parent().siblings('.answer-textarea').show();
    }
});

//点赞按钮
$('.js_SupportBlock').on('click', function (e) {
    toHttpSupport.apply(this);
});

// $('.answer-reply-wrap').on('click', '.js_ReplyUp', function (e) {
//     toHttpSupport.apply(this);
// })

function toHttpSupport() {
    //判断登录
    if (!objSite.isLogin()) {
        openLogin();
        return false;
    }

    let _this = $(this);
    let evaluateObject = _this.data('type');
    let keyId = _this.data('id');

    let paramObj = {
        evaluate_object: evaluateObject,
        key_id: keyId
    };
    let emEl = _this.find('em');
    ajaxSupportUp(paramObj).then(res => {
            // console.log('点赞接口返回', res);
            if (res.code == 0) {
                let num = res.data;
                _this.addClass('active');
                emEl.text(num);
                layer.msg(res.msg);
            } else if (res.code == 201) {
                let num = res.data;
                _this.removeClass('active');
                if (num <= 0) {
                    emEl.text('');
                } else {
                    emEl.text(num);
                }
                layer.msg(res.msg);
            } else {
                layer.msg(res.msg);
            }
        })
        .catch(e => {
            throw new Error(e);
        });
}
/**
 * 发送点赞请求
 * @param {*} paramObj 
 */
function ajaxSupportUp(paramObj) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/comment/index/like",
            dataType: "json",
            data: paramObj,
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
                console.log('点赞失败', e);
            }
        })
    })
}
expandAnswer();
/**
 * 展开和折叠回复内容
 */
function expandAnswer() {
    $('.js_ExpandAns').on('click', function (e) {
        let _this = $(this);
        let _thisP = _this.parent();
        _this.parent().hide();
        _thisP.siblings('.answer-reply-wrap').slideDown(300);
        _thisP.siblings('.fold-answer').show();

    });
    $('.js_FoldAnswer').on('click', function (e) {
        let _this = $(this);
        let _thisP = _this.parent();
        _this.parent().hide();
        _thisP.siblings('.answer-reply-wrap').slideUp(300);
        _thisP.siblings('.expand-wrap').show();

    });

}

/**
 * 获取临牌
 * @param {*} callback 
 */
function getToken() {
    return new Promise(function (resolve, reject) {
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
                // callback(data);
                resolve(data);
            },
            error: function (e) {
                console.log('获取token失败', e);
                reject(e)
            }
        });
    });

}

class RegisterAnswer {
    // let anReplyWrap = '.answer-reply-wrap';
    // let childrenSelect = '#jsReplyBtn';
    constructor(parentS, options) {
        //this.$parents = $(parentS);
        this.options = {
            children: '#jsReplyBtn',
            data: {},
            callback: null
        }
        Object.assign(this.options, options);
        this.registerAnswer(parentS, this.options.children, this.options.data, this.options.callback);
    }

    /**
     * 回复点击事件
     * @param {*string} answerWrap 包裹的最外层容器
     * @param {*} cSelect 需要出发事件的子容器
     * @param {*} data 传递的数据
     * @param {*function} callback 回调
     */
    registerAnswer(answerWrapSelect, cSelect, data, callback) {
        $(answerWrapSelect).on('click', cSelect, data, function (event) {
            console.log(111, event.currentTarget);
            let textareaVal = $('.js_TextArea').val();
            let _this = $(this);
            // let targetId = $(this).data('targetid');
            let tid = _this.data('id');
            let type = _this.data('type');
            let pCommentId = _this.data('pcommentid');
            let toUserId = _this.data('touserid');

            getToken().then(data => {
                let token = data;
                let paramObj = {
                    type: type,
                    id: tid,
                    detail: textareaVal,
                    index_detail_token: token,
                    rule: "index_detail_token"
                };
                !!toUserId && (paramObj['to_user_id'] = toUserId);
                !!pCommentId && (paramObj['parent_comment_id'] = pCommentId);
                typeof callback === 'function' && callback.call(this, paramObj);
            }).catch(e => {
                console.error(e);
            });

        });
    }
}
/**
 * 点击查看更多回复
 */
// bindMoreAnswerEvent();

function bindMoreAnswerEvent() {
    $('.js_ReplyMoreBtn').on('click', function (e) {
        let paramObj = {};
        let _$this = $(this);
        // ajaxGetMoreAnswer(paramObj).then(data => {
        //     let html = updateUI(data);
        //     _$this.siblings('.reply-lists-wrap').append(html);
        // }).catch(error => {
        //     console.log(error);
        // })

        //简单做法交互不合理
        _$this.siblings('.reply-lists-wrap').find('.reply-block').show();
        _$this.hide();
    });
}

function updateUI(data) {
    let domHtml = '';
    if (Array.isArray(data)) {

        data.forEach(item => {
            domHtml += `<div class="reply-block"> <div class="reply-content">
            <a class="reply-user"> ${item.user1}</a>
            `;
            if (item.user2 && item.user2.trim().length > 0) {
                domHtml += `<i class="reply-reply">回复</i>
                <a class="reply-user"> 用户B</a>
                :&nbsp; ${item.answer}
            </div>`;
            } else {
                domHtml += `:&nbsp; ${item.answer}</div>`;
            }
            domHtml += `<div class="reply-operate">
            <span class="reply-operate-item js_ReplyUp">赞<em>100</em></span>
            <i class="reply-dot">·</i>
            <span class="reply-operate-item js_Reply" id="0000" data-nick="A" data-userid="961103954">回复</span>
            <i class="reply-dot">·</i>
            <span class="reply-date">5天前</span>
            </div> </div>`;

        });
    }
    return domHtml;
}

// function ajaxGetMoreAnswer(paramObj) {
//     let p = new Promise((resolve, reject) => {
//         $.ajax({
//             type: "GET",
//             url: "/",
//             dataType: "json",
//             data: paramObj,
//             success: function (res) {
//                 if (res.code == 200) {
//                     resolve(res.data);
//                 } else {
//                     reject(res);
//                 }
//             },
//             error: function (error) {
//                 //reject(error)
//                 let data = [{
//                     user1: '用户A',
//                     user2: '用户B',
//                     answer: '<p>怎么回怎么回事？怎么回</p><p><img src="https://img_test.3d66.com/focus/2019/20190521/e287642368341f8cea29bea309316f70.png" alt=""></p>   怎么回怎么回事？怎么回事？怎怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？么回事？怎么回事？怎么回事？怎么回事？事？'
//                 }, {
//                     user1: '用户AAAA',
//                     answer: '<p>sss怎么回怎么回事？怎么回</p>   怎么回怎么回事？怎么回事？怎怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？怎么回事？么回事？怎么回事？怎么回事？怎么回事？事？'
//                 }];
//                 resolve(data);
//             }
//         })
//     });

//     return p;
// }
export {
    ReplyArea,
    RegisterAnswer
}