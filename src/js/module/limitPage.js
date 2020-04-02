class LimitPage {
    constructor(pageElem, options) {
        //分页器的id
        this.pageElem = pageElem;
        this.options = {
            courseId: 0
        };
        this.data = null;
        Object.assign(this.options, options);
        this.init(pageElem);
    }
    init(pageElem) {
        this.data = getPageInfo(pageElem);
        // console.log('data', data);
        this.initLayPage();
    }
    initLayPage() {
        let count = this.data.count;
        let limit = this.data.limit;
        let curr = this.data.curr;
        let lessonid = this.data.lessonid;

        let pageElem = this.pageElem;
        let courseId = this.options.courseId;
        layui.use(['laypage'], function () {
            let laypage = layui.laypage;
            //测试数据
            laypage.render({
                elem: pageElem,
                count: count,
                limit: limit,
                /* first: '首页',
                last: '尾页', */
                prev: '<i class="iconfont">&#xe61c;</i>',
                next: '<i class="iconfont">&#xe8ce;</i>',
                curr: location.hash.replace('#!page=', ''),
                hash: 'page', //自定义hash值
                jump: function (obj, first) {
                    //渲染html
                    // console.log('jump obj:', obj);
                    if (!first) {
                        layer.load(2);
                    }
                    let paramObj = {
                        page: obj.curr,
                        course_id: courseId,
                        pageSize: limit,
                        video_id: lessonid
                    };
                    // if(lessonid){
                    //     Object.defineProperty(paramObj,'lesson_id',{
                    //         value: lessonid
                    //     })
                    // }
                    ajaxGetLists(paramObj).then(data => {
                        updateUI(data);
                        layer.closeAll('loading');
                    }).catch(error => {
                        console.log('获取分页数据失败', error);
                        layer.closeAll('loading');
                    });

                    //}
                }
            });

        });
    }

}


function updateUI(data) {
    data = data.list;
    if (Array.isArray(data)) {
        let listHtml = '';
        data.forEach(function (value, index) {
            listHtml += `<div class="comment-item clearfix">
            <div class="comm-avatar">
                <img class="header"
                    src="${value.user.user_img}"
                    onerror="this.src='${objSite.getStaticUrl('/yutu/images/defaultHead.jpg')}';this.onerror=null">
            </div>

            <div class="comm-container">
                <div class="head clearfix">
                    <span class="name">${value.user.nick_name}</span>
                    <span class="d-time">${value.add_time}</span>
                </div>
                <div class="comm-text">
                    <p>${value.content}</p>
                </div>
            `;
            if (value.reply && value.reply.content.trim().length > 0) {
                listHtml += `<div class="answer-content">
                <h3>羽兔客服回复：</h3>
                <p class="answer-text">${value.reply.content}</p>
            </div>
        </div>
    </div>`;
            } else {
                listHtml += ` </div>
                </div>`;
            }
        })
        $('#courseCommentList').html(listHtml);
    }
}

function ajaxGetLists(paramObj) {
    let p = new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/course/comment/getComments",
            dataType: "json",
            data: paramObj,
            success: function (res) {
                if (res.list) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            error: function (error) {
                reject(error)
            }
        })

    })
    return p;
}

function getPageInfo(pageElem) {
    let $pageElem = $("#" + pageElem);
    let count = $pageElem.data('count') || 10;
    let limit = $pageElem.data('limit') || 10;
    let curr = $pageElem.data('curr') || 1;
    let lessonid = $pageElem.data('lessonid') || 0;
    let data = {
        count,
        limit,
        curr,
        lessonid
    };
    return data;
}

export {
    LimitPage
}