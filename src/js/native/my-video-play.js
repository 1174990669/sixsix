$(function () {
    // videojs.addLanguage('zh-CN', zhCNJson);
    $('#myPlayer').bind('contextmenu', function () {
        return false;
    });
    $('#myPlayer').show();
    $('#myPlayer_html5_api').show();
    var options2 = {
        fluid: true,
        //会用第一项技术去播放，不行再使用后面的选项 data-setup
        // techOrder: ["html5", "flash", "other supported tech"],
        aspectRatio: "16:9",
        language: 'zh-CN',
        autoplay: false,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
            volumePanel: {
                inline: false,
                vertical: true
            }, //竖着的音量条
        },
        /*autoplay:true */
    };
    // var lastPlayTime = -5 ;
    var currentTime = $('#video_data').data('playtime');
    currentTime = currentTime > 3 ? (currentTime - 3) : currentTime;
    var currenturl = $('#video_data').data('currenturl');
    var nextUrl = $('#video_data').data('nexturl');
    var videoType = $('#video_data').data('videotype');
    var courseId = $('#video_data').data('courseid');
    var lessonId = $('#video_data').data('lessonid');

    //0不能播放下一节, 1可以播放下一节, 2没有下一节,3是没有权限,4是可以免费试看
    var playNextStatus = 0;
    var playNextMsg = '';
    var nextLessonId = 0;
    var nextLessonName = '';
    var startPlayTime = currentTime;
    var endPlayTime = currentTime;

    var havePlay = false;
    var countInterval;
    var isFirstPlay = true;
    // var watermarkLogo = objSite.getStaticUrl('/yutu/images/watermark-logo.png');
    try {
        var player = videojs('myPlayer', options2, function onPlayerReady() {
            //console.log('ready', 'Your player is ready!');
            //加入下一节按钮
            var nextDiv = document.createElement('div');
            nextDiv.id = '';
            nextDiv.className = 'nextDivStyle vjs-control';
            nextDiv.innerHTML =
                '<button class="vjs-control vjs-next-panel" id="nextButton" ><i class="iconfont fa fa-expand" title="下一节">&#xe652;</i></button>';
            var controlBar = document.getElementsByClassName('vjs-control-bar')[0];
            var insertBeforeNode = document.getElementsByClassName('vjs-play-control')[0];
            controlBar.insertBefore(nextDiv, insertBeforeNode.nextSibling);
            //加入选择画质按钮(暂时先去掉)
            //         var qualityDiv = document.createElement('div');
            //         qualityDiv.id = '';
            //         qualityDiv.className = 'qualityStyle vjs-control';
            //         qualityDiv.innerHTML =
            //             '<button class="vjs-control vjs-quality-panel" id="qualityButton" >超清</button>';
            //         var rateNode = $('div.vjs-playback-rate')[0];
            //         controlBar.insertBefore(qualityDiv, rateNode);
            /* 替换位置 */
            $("div.vjs-playback-rate").after($("div.vjs-volume-panel"));
            // $('.vjs-text-track-display').parent().append('<img class="watermark-logo" src="' + watermarkLogo + '">');
            /* 点击下一节按钮(必须放到ready后面) */
            $('#nextButton').click(function (e) {
                getNextPromise().then(handerNextPromise).then(function (status) {
                    // 0不能播放下一节, 1可以播放下一节, 2没有下一节,3是没有权限,4是可以免费试看
                    switch (status) {
                        case 1:
                            playVideo(nextUrl, false, videoType);
                            //修改数据
                            changeLessonActive(nextLessonId);
                            changeParam(nextUrl, nextLessonId);
                            break;
                        case 4:
                            playVideo(nextUrl, true, videoType);
                            //修改数据
                            changeLessonActive(nextLessonId);
                            changeParam(nextUrl, nextLessonId);
                            break;
                        case 2:
                        case 3:
                        default:
                            //为空或者其他
                            layer.msg(playNextMsg);
                            break;
                    }
                }).catch(e => {
                    console.error(e);
                })

            });
            $('#qualityButton').click(function (e) {
                // console.log('超清');
            });
            //player.currentTime(time);
            //this.play();
            // 	this.amuted = false;
            // 	this.volume(0.5);

        });
    } catch (error) {
        console.log(error);
    }


    if (window.location.hash == '#catalog') {
        $('.js_CatalogChange > li').eq(0).trigger('click');
    } else {
        $('.js_CatalogChange > li').eq(1).trigger('click');
    }

    player.on('play', function () {
        if (isFirstPlay) {
            isFirstPlay = false;
            $('.js_CatalogChange > li').eq(0).trigger('click');
        }
        havePlay = true;
        setCurrentTime(currentTime);
        setTimeout(() => {
            saveHistory();
        }, 1000);
        startPlayTime = player.currentTime();

    });
    player.on('pause', function () {
        //console.log(endPlayTime - startPlayTime);
        // zixuePlayRecord(endPlayTime - startPlayTime);
        saveHistory();

    });
    player.on('ended', function () {
        havePlay = false;
        saveHistory();
        getNextPromise().then(handerNextPromise).then(function (status) {
            // 0不能播放下一节, 1可以播放下一节, 2没有下一节,3是没有权限,4是可以免费试看
            switch (status) {
                case 1:
                    //跳转下一页
                    exitFullScreen();
                    $('#nextTips').show();
                    countDown();
                    break;
                case 4:
                    //跳转下一页
                    exitFullScreen();
                    $('#nextTips').show();
                    countDown();
                    break;
                case 2:
                    //没有下一节
                    exitFullScreen();
                    $('#allTips').show();
                    break;
                case 3:
                    exitFullScreen();
                    //没有权限
                    $('#notAllowTips').show();
                    $('#surplusNum').hide();
                    break;
                default:
                    //为空或者其他
                    layer.msg(playNextMsg);
                    break;
            }
        }).catch(e => {
            console.error(e);
        })

    });
    player.on('timeupdate', function () {

    })

    player.on('progress', function () {
        endPlayTime = player.currentTime();
    })

    function scrollNanoTop() {
        // var offTop =  $("#catalogId .nano-content").scrollTop() + 50;
        // $("#catalogId .nano-content").scrollTop(offTop);
        var $play = $('#catalogId').find('.palying');
        var pageIndex = $play.parents('.chapter').index();
        var pH = 0;
        for (var i = 0; i < pageIndex; i++) {
            pH += $('#catalogId').find('.chapter').eq(i).height();
        }
        // console.log('ph:',pH);
        var jieIndex = $play.index() + 1;
        pH = pH + jieIndex * 70 + 50;
        // var offTop = 1;
        $("#catalogId .nano-content").scrollTop(pH);
    }

    /**
     * @param {*} url 
     * @param {*} isDialog 是否弹框
     * @param {*} type 
     */
    function playVideo(url, isDialog, type) {
        // player.src({
        //     type: type,
        //     src: url
        // });
        player.src(url);
        if (!isDialog) {
            player.play();
        } else {
            showSureStudyDialog();
        }
    }
    /* 全屏切换的方法可以调用 */
    //退出全屏
    function exitFullScreen() {
        player.exitFullscreen();
    }

    //进入全屏
    function openFullScreen() {
        player.enterFullScreen();
    }

    function hiddenTips() {
        $('#nextTips').hide();
        $('#notAllowTips').hide();
        $('#allTips').hide();
    }

    player.on('timeupdate', function () {
        //console.log(player.currentTime());
        //解决Android好像有不触发ended的bug方案
        // 如果 currentTime() === duration()，则视频已播放完毕
        if (player.duration() != 0 && player.currentTime() === player.duration()) {
            // 播放结束
        }
    });
    /* 重新播放按钮 */
    $(".js_RePlay").click(function () {
        // player.pause()
        // player.load();
        hiddenTips();
        setCurrentTime(0);
        countInterval && clearInterval(countInterval);
        player.play();
    });

    $('.paly-next-btn').click(function () {
        // player.pause()
        // player.load();
        countInterval && clearInterval(countInterval);
        hiddenTips();
        // 0不能播放下一节, 1可以播放下一节, 2没有下一节,3是没有权限,4是可以免费试看
        switch (playNextStatus) {
            case 1:
                playVideo(nextUrl, false, videoType);
                //修改数据
                changeLessonActive(nextLessonId);
                changeParam(nextUrl, nextLessonId);
                break;
            case 4:
                playVideo(nextUrl, true, videoType);
                //修改数据
                changeLessonActive(nextLessonId);
                changeParam(nextUrl, nextLessonId);
                break;
            case 2:
            case 3:
            default:
                //为空或者其他
                layer.msg(playNextMsg);
                break;
        }

    });
    /* 当前播放提示文字关闭按钮 */
    $('#closeTips').click(function () {
        $('.lasted-progress-tips').hide();
    });


    //确认学习一次付费课程
    $('.js_SureStudy,#freeBgTips').on('click', function (e) {
        layer.closeAll();
        $.ajax({
            type: "POST",
            url: '/course/play/getFreeVipVideoUrl',
            dataType: "json",
            data: {
                video_id: lessonId,
            },
            success: function (res) {
                if (res.code == 203) {
                    var url = res.url;
                    player.src(url);
                    player.play();
                    $('#freeBgTips').fadeOut(800);
                } else if (res.code == 502) {
                    $('#notAllowTips').show();
                    $('#surplusNum').hide();
                    $('#notAllowTitle').html(res.name);
                } else {
                    layer.msg(res.msg);
                }
            },
            error: function () {

            }
        })
    });

    /**
     * 设置当前播放时间 time单位为秒s
     */
    function setCurrentTime(time) {
        //player.currentTime();
        //显示提示文字
        if (time > 0) {
            player.currentTime(time);
            $('.lasted-progress-tips').show();
            $('.lasted-progress-tips > p > span').text(formatSeconds(time));

            var t = setTimeout(function () {
                $('.lasted-progress-tips').hide();
                clearTimeout(t);
            }, 3000)
            //设置为-1 播放暂停不会进去当前分支
            currentTime = -1;
        }

    }

    function formatSeconds(a) {
        var hh = parseInt(a / 3600);
        hh = hh < 10 ? ('0' + hh) : hh;
        var mm = parseInt((a - hh * 3600) / 60);
        mm = mm < 10 ? ('0' + mm) : mm;
        var ss = parseInt((a - hh * 3600) % 60);
        ss = ss < 10 ? ('0' + ss) : ss;
        var length = '';
        if (hh > 0) {
            length = hh + ":" + mm + ":" + ss;
        } else {
            length = mm + ":" + ss;
        }
        if (a > 0) {
            return length;
        } else {
            return "NaN";
        }
    }

    /**
     *倒计时自动播放下一节
     */
    function countDown() {
        var num = 5;
        $("#countId").text(num);
        countInterval = setInterval(function () {
            num--;
            $("#countId").text(num);
            if (num === 0) {
                countInterval && clearInterval(countInterval);
                // scrollNanoTop();
                //播放下一节可以
                hiddenTips();
                //记录播放次数+1
                playVideo(nextUrl, (playNextStatus == 4), videoType);
                //修改数据
                changeLessonActive(nextLessonId);
                changeParam(nextUrl, nextLessonId);

            }
        }, 1000);
    }
    let playTime;

    function saveHistory() {
        // console.log(havePlay);
        if (!havePlay) {
            return;
        }
        playTime = player.currentTime();
        // if(lastPlayTime - playTime < 5 && lastPlayTime - playTime > -5){
        //     return;
        // }
        // lastPlayTime = playTime
        // course_id=1&video_id=1&play_time=10.89
        $.ajax({
            type: "POST",
            url: '/course/play/playRecord',
            dataType: "json",
            data: {
                play_time: playTime,
                course_id: courseId,
                video_id: lessonId,
            },
            success: function (res) {
                //console.log(res);
            }
        })

    }

    function handerNextPromise(res) {
        return new Promise(resolve => {
            //console.log(res);
            playNextMsg = res.msg;
            if (res.code == 200) {
                nextUrl = res.url;
                playNextStatus = 1;
                $('#next-lesson-name').html(res.name)
                $('#next-lesson-time').html(res.time);
                nextLessonId = res.id;
                nextLessonName = res.name;
                resolve(1);
            } else if (res.code == 201) {
                playNextStatus = 2;
                resolve(2);
            } else if (res.code == 502) {
                playNextStatus = 3;
                $('#surplusNum').hide();
                $('#notAllowTitle').html(res.name);
                resolve(3);
            } else if (res.code == 203) {
                playNextStatus = 4;
                nextUrl = res.url;
                $('#next-lesson-name').html(res.name)
                $('#next-lesson-time').html(res.time);
                nextLessonId = res.id;
                nextLessonName = res.name;
                resolve(4);
            } else {
                playNextStatus = 0;
                resolve(0);
            }
        })
    }

    function getNextPromise() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: '/course/play/getNextUrl',
                dataType: "json",
                data: {
                    course_id: courseId,
                    video_id: lessonId,
                },
                success: function (res) {
                    resolve(res);
                },
                error: function () {
                    reject(new Error('网络错误'));
                }
            })
        });
    }

    window.onbeforeunload = function (e) {
        //关闭窗口
        saveHistory();

    }


    function changeParam(url, lid) {
        history.replaceState(null, document.title, '/soft/play/' + courseId + '_' + lid + '_1.html');
        // currentTime = $('#video_data').data('playtime');
        currentTime = 0;
        $('#video_data').data('playtime', 0);
        currenturl = url;
        $('#video_data').data('currenturl', url);
        nextUrl = '';
        $('#video_data').data('lessonid', url);
        lessonId = nextLessonId;
        //0不能播放下一节, 1可以播放下一节, 2没有下一节 
        playNextStatus = 0;
        playNextMsg = '';
        nextLessonId = 0;
        nextLessonName = '';
    }

    function changeLessonActive(lId) {
        var classid = 'lesson_id_' + lId;
        $('.palying').removeClass('palying');
        $('.' + classid).addClass('palying');
        $('.js-video-name').html(nextLessonName)

    }


    var sureIndex = -1;
    var havedStudyIndex = -1;
    //弹框学习确认弹框
    var studyFlag = $('#study_flag').val();
    if (studyFlag == 1) {
        showSureStudyDialog();
    } else if (studyFlag == 2) {
        showHavedStudyDialog();
    } else {
        // showHavedStudyDialog();
    }
    $('.js_CancelStudy').on('click', function (e) {
        layer.close(sureIndex);
    });

    function showSureStudyDialog() {
        $('#freeBgTips').show();
        sureIndex = layer.open({
            type: 1,
            area: '[auto,auto]',
            scrollbar: false,
            //maxmin: true,
            title: false,
            closeBtn: 2,
            resize: false,
            zIndex: layer.zIndex, //重点1
            // shadeClose: true,
            skin: 'my-close-skin',
            content: $('#sureStudyDialog'),
            success: function (layero) {
                //layer.setTop(layero); //重点2
            }
        });

    }
    $('.js_ToOpenVip').on('click', function () {
        layer.closeAll();
    });
    //开始学习
    $('.js_PayCourse').on('click', function () {
        if (objSite.isLogin()) {
            player.play();
            $('.js_CatalogChange>.item').eq(0).trigger('click');
        } else {
            openLogin();
        }

    });

    function showHavedStudyDialog() {
        havedStudyIndex = layer.open({
            type: 1,
            area: '[auto,auto]',
            scrollbar: false,
            //maxmin: true,
            title: false,
            closeBtn: 2,
            resize: false,
            zIndex: layer.zIndex, //重点1
            // shadeClose: true,
            skin: 'my-close-skin',
            content: $('#havedStudyDialog'),
            success: function (layero) {
                //layer.setTop(layero); //重点2
            }
        });
    }
});