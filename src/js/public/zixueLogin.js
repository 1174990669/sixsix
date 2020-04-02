//更新幻灯片里面课程和用户信息
var zixueCommonObj = {};
$(function () {

    $('.js_Myself').parents('.container').on('mouseleave', function (e) {
		$('.js_ZxVipTips').removeClass('show');
	})
	$('.js_Myself').on('mouseenter', function (e) {
		let _this = $(this);
		if(_this.hasClass('logined')){
			$('.js_ZxVipTips').addClass('show');
		}		
	})
	$('.js_ZxVipTips').on('mouseleave', function (e) {
		$(this).removeClass('show');
		// $('.js_ZxVipTips').removeClass('show')
	})

    function updateProgress() {
        let progressBar = $('.js-myprogress .myprogress-bar');
        progressBar.css('width', progressBar.data('percent') + '');
    }
    //退出登录
    objSite.zixueLoginOutHtml = function () {
        handlerLoginOut();
        //评论处
        $('.js-zixue-comm-notlogin').show().siblings('.js-zixue-comm-login').hide();

        ajaxGetCourseInfo();
    }

    function handlerLoginOut() {
        //退出自学登录
        $('.js_Myself').removeClass('logined');
        $('.js_Myself').html(`<i></i><span class="juser-login">登录</span>`);
        // $('.js_ZxVipTips').removeClass('is-logined');
        //清空用户信息
        // $('.js_ZxUserInfo').remove();
        $('.js_ZxVipTips').empty();
        $('.js_BottomTipsTxt').text('开通自学贵族');

    }
    //html登录刷新
    objSite.zixueLoginInHtml = function (res, user_img, user_name) {
        let target = $('#href_target').data('target');
        if (target && target == '_top') {
            window.location.reload();
            return;
        }
        handlerZixueUserInfo();
        ajaxGetCourseInfo();
    }

    function ajaxGetCourseInfo() {
        if ($('#course_id').length) {
            handlerCourseInfo();
        }
    }

    function handlerZixueUserInfo() {
        getzixueUserInfo(function (data) {
            let userImg = data.user_img;
            let userVipIcon = data.vipIcon;
            let remainDay = data.zixue_vip_remaining_day;
            let userName = data.user_name;
            let zixueVip = data.zixue_vip;
            let studyTime = data.studyTime;
            let courseLink = data.href;
            let courseName = data.course_name;
            let coursePercent = data.percent;
            let zixueIconHtml = data.zixue_icon ? `<img src="${data.zixue_icon}" class="zixue-vip">` : '';
            let courseHtml = '';
            if (studyTime <= 0 || zixueVip != 1) {
                courseHtml = `<p class="tips-unstudy">
                亲，快去学习吧！让我来跟<br />
                进您的学习进度吧~
            </p>`;
            } else {
                courseHtml = `<a class="study-info a-course-link" target="_blank"
                href="${courseLink}">
                <p class="duration"><span class="icon-play"></span><span>已学习：&nbsp;${studyTime}h</span></p>
                <p class="title">${courseName}</p>
                <div class="myprogress  js-myprogress">
                    <div class="myprogress-bar" data-percent="${coursePercent}%" style="width: ${coursePercent}%;"></div>
                </div>
            </a>`;
            }
            let bottomTip = '';
            switch (zixueVip) {
                case 0:
                    //未开通
                    bottomTip = '开通自学贵族';
                    break;
                case 1:
                    //
                    bottomTip = `自学贵族还剩${remainDay}天`;
                    break;
                case 2:
                    bottomTip = '续费自学贵族';
                    break;
                default:
                    bottomTip = '开通自学贵族';
                    break;
            }

            let userHtml = `<a href="${objSite.getUserUrl('/zixue/index/index.html')}" target="_blank" class="user-link">
            <img class="round-avater"
                src="${userImg}">
        </a>
        <div class="right-info">
            <p class="base-info">
                <span class="zx-user-name">${userName}</span>
                <img src="${userVipIcon}" class="ll-vip"> ${zixueIconHtml}
            </p>
            ${courseHtml}
        </div>`;

            //更新ui
            // $('.js_ZxVipTips').addClass('is-logined');
            // $('.js_ZxUserInfo').html(userHtml);
            // $('.js_BottomTipsTxt').text(bottomTip);

            $('.js_ZxVipTips').html(`<div class="header">
            <div class="zixue-user-info js_ZxUserInfo">${userHtml}</div>
        </div>

        <div class="center-tips">
            <h2 class="column-title">
                自学贵族尊享特权
            </h2>
            <ul class="privilege clearfix">
                <li><a> <span class="icon-study"></span>贵族课无限学</a></li>
                <li><a> <span class="icon-discount"></span>付费课享折扣</a></li>
                <li><a> <span class="icon-download"></span>资料免费下载</a></li>
                <li><a> <span class="icon-record"></span>课程优先录制</a></li>
            </ul>
        </div>

        <div class="bottom-btn-group">
            <a class="openbtn" href="${objSite.getVipUrl('/zixue.html')}" target="_blank">
                <div class="anim"></div>
                <span class="new-vip-icon-gray"></span>
                <span class="txt">${bottomTip}</span>
            </a>
            <p class="bottom-tips">亲，让我来跟进您学习的进度吧！</p>
        </div>`)

            $('.js_Myself').addClass('logined');
            $('.js_Myself').html(`<i></i><a href="${objSite.getUserUrl('/zixue/index/index?status=1')}" target="_blank">我的自学</a>`);
            
            //更新进度条
            //updateProgress();

            //其他用户信息设置更新ui
            setCommentUserInfo(data.user_name, data.user_img, data.zixue_icon, data.vipIcon);
        })

        //获取设置意向
        getZixueUserCommended(function (data) {
            let arr = data;
            if(arr && arr.length <= 0){
                $('#recommendedCourse h3').text(`未选择学习兴趣，无法获得个性化内容推荐`);
                $('.js_SetIntention').text(`设置意向>`);    
                return;
            }
            $('#recommendedCourse h3').text(`以下根据你的学习兴趣推荐`);
            $('.js_SetIntention').text(`更换意向>`);

            $(`.js_IntentionWrap`).hide();
            for (let v of arr) {
                $(`.js_IntentionWrap[data-id=${v}]`).show();
            }
            $('.js_LabelChoose > li').each(function (index, el) {
                let $this = $(this);
                let id = $this.data('id') + '';
                let input = $this.children('input');
                if (arr.includes(id)) {
                    //有该id
                    input.prop('checked', true);
                } else {
                    //没有该id
                    input.prop('checked', false);
                }
            })

        })
    }
    /**
     * 设置评论区域的用户信息
     */
    function setCommentUserInfo(userName, userImg, zixueIcon, vipIcon) {
        //js-zixue-comm-login
        //js-zixue-comm-notlogin
        //评论处
        $('.js-zixue-comm-login').show().siblings('.js-zixue-comm-notlogin').hide();

        $('.js-comm-user-name').each(function (index, v) {
            $(this).text(userName);
        });
        $('.js-comm-user-img').each(function (index, v) {
            $(this).attr('src', userImg);
        });

        // js-comm-vip-icon js-comm-zixue-icon
        $('.js-comm-zixue-icon').each(function (index, v) {
            if (zixueIcon && zixueIcon.length > 0) {
                $(this).attr('src', zixueIcon);
            } else {
                $(this).hide();
            }

        });
        $('.js-comm-vip-icon').each(function (index, v) {
            $(this).attr('src', vipIcon);
        });
    }

    /**
     * 
     * @param {*} callback 
     */
    function getZixueUserCommended(callback) {
        var url = '/index/index/getUserCommended';
        $.ajax({
            type: "GET",
            url: url,
            timeout: 10000,
            data: {},
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (result) {
                // console.log(result);
                if (result) {
                    callback(result);
                }
            }
        });
    }

    /**
     * ajax获取登录信息
     */
    function getzixueUserInfo(callback) {
        //Ajax调用处理
        var url = "/index/index/loginUserInfo";
        $.ajax({
            type: "GET",
            url: url,
            timeout: 10000,
            data: {},
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (result) {
                zixueCommonObj.limitCopy = result.in_black_list;
                window.zixueCommonObj = zixueCommonObj;
                console.log(result.in_black_list);
                if (result && result.user_name) {
                    callback(result);
                }

            }
        });
    }

    /**
     * 获取回调数据
     */
    function handlerCourseInfo() {
        getCourseInfo(function (data) {
            let id = data.status;
            let canComment = data.canComment;
            updateCourseUI(id, canComment);
        })
    }
    /**
     * 更新课程状态
     * @param {*} type 1是免费课程 2用户可以播放(购买/是贵族) 3是贵族课程，但是用户不是贵族 4是收费课程,用户没有购买
     */
    function updateCourseUI(type, canComment) {
        // console.log('courseType', type);
        var courseId = $('#course_id').val();
        if (canComment === 1) {
            $('.js-course-comment').show();
        } else {
            $('.js-course-comment').hide();
        }
        switch (type) {
            case 1:
            case 2:

                //开始学习按钮
                $('.js_BuyWrap .open-course-lesson').remove();
                var buyBtnEl = $('.js_BuyWrap .js_PayCourse');
                buyBtnEl.removeClass('js_PayCourse').addClass('open-course-lesson');
                buyBtnEl.attr('data-lesson', 0);
                buyBtnEl.html('<div class="anim"></div>开始学习');

                var html = `<a class="btn-solid open-course-lesson" data-course="${courseId}" data-lesson="0">
                <div class="anim"></div>
                开始学习
              </a>`;

                $('.course-right-area .js_BuyWrap').each(function (index) {
                    $(this).find('.open-course-lesson').remove();
                    $(this).prepend(html);
                });
                break;
            case 3:
            case 4:
                //购买课程
                var htmlBuy = `<a class="btn-hollow  open-course-lesson" data-course="${courseId}" data-lesson="0">免费试看</a>
                <a class="btn-solid js_PayCourse" data-course="${courseId}">
                <div class="anim"></div>
                购买课程
              </a>`;
                var buyWrap = $('.course-right-area .js_BuyWrap');
                buyWrap.each(function (index) {
                    var _wrapthis = $(this);
                    if (_wrapthis.hasClass('js_PlayCourse')) {
                        $(this).find('.js_PayCourse').remove();
                        _wrapthis.prepend(`<a class="btn-solid js_PayCourse" data-course="${courseId}"><div class="anim"></div>购买课程</a>`);
                    } else {
                        $(this).find('.js_PayCourse').remove();
                        $(this).find('.open-course-lesson').remove();
                        _wrapthis.prepend(htmlBuy);
                    }
                });

                break;
            default:
                throw new Error('错误的课程状态');
        }
    }

    /**
     * ajax获取课程信息
     */
    function getCourseInfo(callback) {
        //Ajax调用处理
        var url = "/course/play/userCourseStatus";
        var cId = $('#course_id').val();
        $.ajax({
            type: "GET",
            url: url,
            timeout: 10000,
            data: {
                course_id: cId
            },
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (result) {
                if (result && result.code == 200) {
                    callback(result);
                }

            }
        });
    }

    //页面刷新调用
    handlerZixueUserInfo();
    ajaxGetCourseInfo();


});