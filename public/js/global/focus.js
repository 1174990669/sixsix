objFocus = {};
//是否是数组对象
objFocus.isArray = function(v){
	if(Array.isArray()){
		return Array.isArray(v);
	}else{
		return Object.prototype.toString.call(v) === '[object Array]';
	}
}
//获取URL
objFocus.getUrl = function (obj) {
    var url = '';
    if (obj["ad_url"].length > 2) {
        url = objSite.getWwwUrl("/ad/index_detail?id=" + obj["ad_id"] + "&url=" + encodeURIComponent(obj["ad_url"]) + "&image=" + obj["ad_image"]);
    }
    return url;
};

//获取图片地址
objFocus.getImgSrc = function (obj) {
    return obj["ad_image"];
};
//获取文字
objFocus.getWordText = function (obj) {
    return obj["ad_word"];
};
//输出文字类型
objFocus.showWord = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            obj.append('<a href="' + url + '" rel="nofollow" target="_blank" class="focusUrl">' + r["ad_word"] + '</a>\n');
        });
    }
};
//jxl:文字类型广告
objFocus.showTextWord = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            if (url == '') {
				obj.append('<li><a rel="nofollow" target="_blank" >' + r["ad_word"] + '</a></li>\n');
            }else{
            	obj.append('<li><a href="' + url + '" rel="nofollow" target="_blank" >' + r["ad_word"] + '</a></li>\n');
            }
            
        });
    }
};

//jxl:输出QQ群文字和链接类型
objFocus.showQQLink = function(placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function(index, r) {
            var url = objFocus.getUrl(r);
            obj.append('<li><a href="' + url + '" rel="nofollow" target="_blank" class="focusUrl"><i class="qq-hollow-icon"></i>' + r["ad_word"] + '</a></li>\n');
        });
        //添加更多链接objSite.getServiceUrl("/league.html")
        obj.append('<li class="text-center"><a rel="nofollow" href="'+ objSite.getServiceUrl("/league.html") + '?id=' + placeId  +'" target="_blank">更多></a></li>')
    }
}

//jxl:输出图文和链接类型
objFocus.showTextAndImage = function(placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function(index, r) {
        	//一个链接 一个图标 两个文字
            var url = objFocus.getUrl(r);
			          
            var imageUrl = objFocus.getImgSrc(r);
            //这里需要分割字符串
            var textArr = objFocus.getWordText(r).split(';;');
            var textTitle = textArr[0] || '';
            var textDesc = textArr[1] || '';

            obj.append('<li><a href="' + url + '" rel="nofollow" target="_blank" class="focusUrl"><span class="round-bg"><img src="' + imageUrl
            	+ '" alt=""></span><p class="text-area"><span class="title">' + textTitle
            	+ '</span><span class="desc">' + textDesc
            	+ '</span></p></a></li>\n');
        });
        
    }
}

//输出单个图片
objFocus.showSingImg = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
            if (url == '') {
                obj.append('<a rel="nofollow" target="_blank"><img src="' + imgSrc + '" alt=""></a>');
                return;
            } else {
                obj.append('<a rel="nofollow" href="' + url + '" rel="nofollow" target="_blank"><img src="' + imgSrc + '" alt=""></a>');
                return;
            }
        });
    }
};

//输出Banner
objFocus.showBanner = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
            if (url == '') {
                obj.append('<li><a rel="nofollow"><img src="' + imgSrc + '" alt=""></a></li>\n');
            } else {
                obj.append('<li><a href="'+ url +'" rel="nofollow" target="_blank"><img src="' + imgSrc + '" alt=""></a></li>\n');
            }
        });
    }

};

//输出背景图Banner
objFocus.showBgBanner = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
            if (url == '') {
                obj.append('<li><a rel="nofollow" style="background: url('+imgSrc+') no-repeat center center; background-size: cover;"></a></li>\n');
            } else {
                obj.append('<li><a href="'+url+'" rel="nofollow" target="_blank" style="background: url('+imgSrc+') no-repeat center center; background-size: cover;"></a></li>\n');
            }
        });
    }
};
//jxl:新版背景图banner
objFocus.showSwiperBanner = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
    
			var htmlStr = '';
			var renderName = objFocus.getWordText(r) || '';
			if(renderName.length > 0){
				renderName = 'Render by：' + renderName;
			}
            if (url == '') {
                 htmlStr += '<div class="swiper-slide"> <span class="swiper-img-bg" style="background: url(' + imgSrc
                 		+ ') no-repeat center;"></span> <p class="model-user"><a href="nofollow">' + renderName + '</a></p>' 
                        + '<div class="swiper-banner-download"><a href="nofollow"></a></div>'+'</div>\n';
            } else {
                htmlStr += '<div class="swiper-slide"> <span class="swiper-img-bg" style="background: url(' + imgSrc
                 		+ ') no-repeat center;"></span> <p class="model-user"><a rel="nofollow" href="' + url +'" target="_blank" >' + renderName + '</a></p>'
                        + '<div class="swiper-banner-download"><a rel="nofollow" href="' + url + '" target="_blank"></a></div>' +'</div>\n';
            }
            obj.append(htmlStr);
        });
    }
};

objFocus.showSwiperCommon = function (placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }

    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
    
            var htmlStr = '';
            var renderName = objFocus.getWordText(r) || '';

            if (url == '') {
                 htmlStr += '<a class="swiper-slide" rel="nofollow"> <span class="swiper-img-bg" style="background-image: url(' + imgSrc
                        + ')"></span></a>\n';
            } else {
                htmlStr += '<a rel="nofollow" class="swiper-slide"  href="' + url + '" target="_blank"> <span class="swiper-img-bg" style="background-image: url(' + imgSrc
                        + ')"></span></a>\n';
            }
            obj.append(htmlStr);
        });
        $('.swiper-button-prev,.swiper-button-next').show();
    }
};
//模型详情页两侧广告类型
objFocus.showTwoColumImage = function(placeId, obj) {
    if (typeof(focusJson) == "undefined") {
        return false;
    }
    //添加class方便捕捉点击
    obj.addClass("focus66");
    if (typeof(focusJson["place" + placeId]) != "undefined") {

    	var focusArray = focusJson["place" + placeId];
    	if(objFocus.isArray(focusArray) && focusArray.length <= 0){
    		//长度小于0
    		return ;
    	}
        var htmlColum = '<div class="background-img-child-left"><div></div></div><div class="background-img-child-center"></div><div class="background-img-child-right"><div></div></div>';
        obj.append(htmlColum);

        var countNumHalf = (Math.ceil($(window).height() / 138 + 1) * Math.ceil($(window).width() / 138 + 1)) / 2;
        var htmlLeftAndRight = "";
        
        for (var i = 0; i < countNumHalf; i++) {
        	var randomIndex = Math.floor(Math.random() * focusArray.length);
 			var url = objFocus.getUrl(focusArray[randomIndex]) || '';
            var imgSrc = objFocus.getImgSrc(focusArray[randomIndex]);
            var renderName = objFocus.getWordText(focusArray[randomIndex]) || '';

            htmlLeftAndRight += '<a rel="nofollow" href="' + url + '" class="gray-filter img" style="background: url(' + imgSrc + ') no-repeat center;" target="_blank"></a>';
        }

        $(".background-img-child-left > div, .background-img-child-right > div").html(htmlLeftAndRight);
   }
}

//课程排行榜广告位
objFocus.showCourseRank = function(placeId, obj){
    if (typeof(focusJson) == "undefined") {
        return false;
    }
    //添加class方便捕捉点击
    obj.addClass("focus66");

    if (typeof(focusJson["place" + placeId]) != "undefined") {
        $.each(focusJson["place" + placeId], function (index, r) {
            var url = objFocus.getUrl(r);
            var imgSrc = objFocus.getImgSrc(r);
            var textArr = objFocus.getWordText(r);
            var numSpanHtml = (index < 3)? ('<span class="num-bg"><span>' + (index+1) + '</span></span>'):('<span class="num-none">' + (index+1) + '</span>');

            if (url == '') {
                obj.append('<li><a rel="nofollow" target="_blank"> ' + numSpanHtml + '<span class="title-txt">' + textArr + ' </span></a></li>\n');
            } else {
                obj.append('<li><a rel="nofollow" href="' + url + '" target="_blank"> ' + numSpanHtml + '<span class="title-txt">' + textArr + ' </span></a></li>\n');
            }
        });
    }

}


// 全站底部通栏
function showGlobalBotfocus() {
	try{
		var closed = false;
		// 如果设置了独立广告
		if ($('.botfocus').not('#botfocus-global').children('a').length >= 1) {
			return false;
		}
		// 如果广告为空
		if ($('#botfocus-global').children('a').length < 0){
			return false;
		}
		if (!$.cookie('botfocus-global')) {
			$('#botfocus-global').find('img').load(function(){
				$(window).scroll(function() {
					if ($(this).scrollTop() >= 200 && !closed) {
						$('#botfocus-global').fadeIn();
					}
				});
			});
		}
		$('#botfocus-global').children('.botfocus-close').click(function(){
			$.cookie('botfocus-global', 'showed', {expires: 1, domain: '3d66.com', path: '/'});
			closed = true;
			$(this).parents('.botfocus').hide();
		});
	} catch(e) {}
}

// 各二级站点底部通栏
function showBotfocus(id) {
	try{
		var closed = false;
		if ($('#'+id).children('a').length < 0){
			return false;
		}
		if (!$.cookie(id)) {
			$('#'+id).find('img').load(function(){
				$(window).scroll(function() {
					if ($(this).scrollTop() >= 200 && !closed) {
						$('#'+id).fadeIn();
					}
				});
			});
		}
		$('#'+id).children('.botfocus-close').click(function(){
			$.cookie(id, 'showed', {expires: 1});
			closed = true;
			$(this).parents('.botfocus').hide();
		});
	} catch(e) {}
}

// 首页弹窗广告
function openWinFocus() {
  // 图片加载后弹出
//   objSite.openUserWin('/www/www_index_layout/index', ['800px', '600px']);
//   return;

  // 一小时弹一次
  var IndexExp = new Date();
  IndexExp.setHours(IndexExp.getHours() + 1); //有效期1小时
  if(!$.cookie('openIndexLayout'))
  {
    // 图片加载后弹出
    objSite.openUserWin('/www/www_index_layout/index', ['800px', '600px']);

    $.cookie('openIndexLayout', 'showed', {expires: IndexExp});
  }
  else
  {
    // 如果广告为空
    if ($('#openWinFocus img').length < 1) {
      return false;
    }
    // 一小时弹一次
    var exp = new Date();
    exp.setHours(exp.getHours() + 1); //有效期1小时
    if (!$.cookie('openWinFocus')) {
      // 图片加载后弹出
      $('#openWinFocus img').load(function () {
        layer.open({
          skin: 'layer-nobg',
          type: 1,
          title: false,
          area: ['auto', 'auto'],
          content: $('#openWinFocus')
        });
        // // 新增矫正偏移
        var is_mobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
        if (is_mobi) {
            var myarea=$(".layui-layer").width();
            $(".layui-layer").css("left","50%");
            $(".layui-layer").css("margin-left",(-myarea)/2);
        }
        
      });
      $.cookie('openWinFocus', 'showed', {expires: exp});
    }
  }
}

// 列表弹窗广告
function openWinFocusList() {
    // 如果广告为空
    if ($('#openWinFocus img').length < 1) {
        return false;
    }
    // 一小时弹一次
    var exp = new Date();
    exp.setHours(exp.getHours() + 1); //有效期1小时
    if (!$.cookie('openWinFocusList')) {
        // 图片加载后弹出
        $('#openWinFocus img').load(function () {
            layer.open({
                skin: 'layer-nobg',
                type: 1,
                title: false,
                area: ['auto', 'auto'],
                content: $('#openWinFocus')
            });
        });
        $.cookie('openWinFocusList', 'showed', {expires: exp});
    }
}

$(function () {
	//输出banner类型
	$(".sysFocusBanner").each(function () {
		var placeId = $(this).attr('data-id');
		objFocus.showBanner(placeId, $(this));
	});

	//输出背景图banner类型
	$('.sysBgBanner').each(function(){
		var placeId = $(this).attr('data-id');
		objFocus.showBgBanner(placeId,$(this));
	});

	//输出单个图片类型
	$(".sysFocusImgSing").each(function () {
		var placeId = $(this).attr('data-id');
		objFocus.showSingImg(placeId, $(this));
	});

	//输出文字类型
	$(".sysFocusWord").each(function () {
		var placeId = $(this).attr('data-id');
		objFocus.showWord(placeId, $(this));
	});
	//输出文字链接类型li showTextWord
	$(".sysFocusTextWord").each(function () {
		var placeId = $(this).attr('data-id');
		objFocus.showTextWord(placeId, $(this));
	});
	//输出QQ链接类型
	$(".sysFocusQQLink").each(function(){
		var placeId = $(this).attr('data-id');
		objFocus.showQQLink(placeId,$(this));
	});
	//输出图文链接文字类型
	$(".sysFocusTextImage").each(function() {
    	var placeId = $(this).attr('data-id');
    	objFocus.showTextAndImage(placeId, $(this));
	});
	//输出swiper轮播图类型showSwiperBanner
	$(".sysFocusSwiperBanner").each(function() {
    	var placeId = $(this).attr('data-id');
    	objFocus.showSwiperBanner(placeId, $(this));
	});	
    $(".sysFocusSwiperCommon").each(function(){
        var placeId = $(this).attr('data-id');
        objFocus.showSwiperCommon(placeId, $(this));
    })
	//模型详情两侧的广告位类型
	$(".sysFocusTwoColumImage").each(function(){
		var placeId = $(this).attr('data-id');
    	objFocus.showTwoColumImage(placeId, $(this));
	});
     //自学课程排行榜广告位类型
    $(".sysFocusCourseRank").each(function(){
        var placeId = $(this).attr('data-id');
        objFocus.showCourseRank(placeId, $(this));
    });
    //广告点击
    $(document).on('click','body .focus66 a',function () {
        var href = $(this).attr("href");
        if (!href) {
            return false;
        } else {
            href += "&click_time=" + encodeURIComponent(objSite.getNowTime());
        }
        $(this).attr("href", href);        
    });
	// $("body .focus66 a").on("click", function () {
	// 	var href = $(this).attr("href");
	// 	if (!href) {
	// 		return false;
	// 	} else {
	// 		href += "&click_time=" + encodeURIComponent(objSite.getNowTime());
	// 	}
	// 	$(this).attr("href", href);
	// });


	// 全站底部通栏
	showGlobalBotfocus();

	// 各二级站点底部通栏
	showBotfocus('botfocus-res');
	showBotfocus('botfocus-mall');
	showBotfocus('botfocus-work');
	showBotfocus('botfocus-xr');
	showBotfocus('botfocus-vr');
	showBotfocus('botfocus-vip');
	showBotfocus('botfocus-user');
	showBotfocus('botfocus-so');
	showBotfocus('botfocus-service');
	showBotfocus('botfocus-magic');
	showBotfocus('botfocus-ku');
	showBotfocus('botfocus-soft');
	
	// 顶部tapbar 签到礼包
	$(".topbar .sign-in-gift b").click(function(){
		$(".topbar .sign-in-gift").css("display","none");
	});
});



/*广告位曝光数据上传start**/
(function(undefined) {!function(){function e(e,t){for(var n=-1,o=e.length;++n<o;)if(n in e&&e[n]===t)return n;return-1}var t={click:1,dblclick:1,keyup:1,keypress:1,keydown:1,mousedown:1,mouseup:1,mousemove:1,mouseover:1,mouseenter:1,mouseleave:1,mouseout:1,storage:1,storagecommit:1,textinput:1};if("undefined"!=typeof document&&"undefined"!=typeof window){var n=window.Event&&window.Event.prototype||null;window.Event=Window.prototype.Event=function(e,t){if(!e)throw new Error("Not enough arguments");var n;if("createEvent"in document){n=document.createEvent("Event");var o=!(!t||t.bubbles===undefined)&&t.bubbles,i=!(!t||t.cancelable===undefined)&&t.cancelable;return n.initEvent(e,o,i),n}return n=document.createEventObject(),n.type=e,n.bubbles=!(!t||t.bubbles===undefined)&&t.bubbles,n.cancelable=!(!t||t.cancelable===undefined)&&t.cancelable,n},n&&Object.defineProperty(window.Event,"prototype",{configurable:!1,enumerable:!1,writable:!0,value:n}),"createEvent"in document||(window.addEventListener=Window.prototype.addEventListener=Document.prototype.addEventListener=Element.prototype.addEventListener=function(){var n=this,o=arguments[0],i=arguments[1];if(n===window&&o in t)throw new Error("In IE8 the event: "+o+" is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.");n._events||(n._events={}),n._events[o]||(n._events[o]=function(t){var o,i=n._events[t.type].list,r=i.slice(),c=-1,a=r.length;for(t.preventDefault=function(){!1!==t.cancelable&&(t.returnValue=!1)},t.stopPropagation=function(){t.cancelBubble=!0},t.stopImmediatePropagation=function(){t.cancelBubble=!0,t.cancelImmediate=!0},t.currentTarget=n,t.relatedTarget=t.fromElement||null,t.target=t.target||t.srcElement||n,t.timeStamp=(new Date).getTime(),t.clientX&&(t.pageX=t.clientX+document.documentElement.scrollLeft,t.pageY=t.clientY+document.documentElement.scrollTop);++c<a&&!t.cancelImmediate;)c in r&&(o=r[c],-1!==e(i,o)&&"function"==typeof o&&o.call(n,t))},n._events[o].list=[],n.attachEvent&&n.attachEvent("on"+o,n._events[o])),n._events[o].list.push(i)},window.removeEventListener=Window.prototype.removeEventListener=Document.prototype.removeEventListener=Element.prototype.removeEventListener=function(){var t,n=this,o=arguments[0],i=arguments[1];n._events&&n._events[o]&&n._events[o].list&&-1!==(t=e(n._events[o].list,i))&&(n._events[o].list.splice(t,1),n._events[o].list.length||(n.detachEvent&&n.detachEvent("on"+o,n._events[o]),delete n._events[o]))},window.dispatchEvent=Window.prototype.dispatchEvent=Document.prototype.dispatchEvent=Element.prototype.dispatchEvent=function(e){if(!arguments.length)throw new Error("Not enough arguments");if(!e||"string"!=typeof e.type)throw new Error("DOM Events Exception 0");var t=this,n=e.type;try{if(!e.bubbles){e.cancelBubble=!0;var o=function(e){e.cancelBubble=!0,(t||window).detachEvent("on"+n,o)};this.attachEvent("on"+n,o)}this.fireEvent("on"+n,e)}catch(i){e.target=t;do{e.currentTarget=t,"_events"in t&&"function"==typeof t._events[n]&&t._events[n].call(t,e),"function"==typeof t["on"+n]&&t["on"+n].call(t,e),t=9===t.nodeType?t.parentWindow:t.parentNode}while(t&&!e.cancelBubble)}return!0},document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&document.dispatchEvent(new Event("DOMContentLoaded",{bubbles:!0}))}))}}();!function(t,e){"use strict";function n(t){this.time=t.time,this.target=t.target,this.rootBounds=t.rootBounds,this.boundingClientRect=t.boundingClientRect,this.intersectionRect=t.intersectionRect||a();try{this.isIntersecting=!!t.intersectionRect}catch(r){}var e=this.boundingClientRect,n=e.width*e.height,o=this.intersectionRect,i=o.width*o.height;this.intersectionRatio=n?i/n:this.isIntersecting?1:0}function o(t,e){var n=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(n.root&&1!=n.root.nodeType)throw new Error("root must be an Element");this._checkForIntersections=r(this._checkForIntersections.bind(this),this.THROTTLE_TIMEOUT),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(n.rootMargin),this.thresholds=this._initThresholds(n.threshold),this.root=n.root||null,this.rootMargin=this._rootMarginValues.map(function(t){return t.value+t.unit}).join(" ")}function i(){return t.performance&&performance.now&&performance.now()}function r(t,e){var n=null;return function(){n||(n=setTimeout(function(){t(),n=null},e))}}function s(t,e,n,o){"function"==typeof t.addEventListener?t.addEventListener(e,n,o||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function h(t,e,n,o){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,o||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,n)}function c(t,e){var n=Math.max(t.top,e.top),o=Math.min(t.bottom,e.bottom),i=Math.max(t.left,e.left),r=Math.min(t.right,e.right),s=r-i,h=o-n;return s>=0&&h>=0&&{top:n,bottom:o,left:i,right:r,width:s,height:h}}function u(t){var e;try{e=t.getBoundingClientRect()}catch(n){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):a()}function a(){return{top:0,bottom:0,left:0,right:0,width:0,height:0}}function l(t,e){for(var n=e;n;){if(n==t)return!0;n=p(n)}return!1}function p(t){var e=t.parentNode;return e&&11==e.nodeType&&e.host?e.host:e}if(!("IntersectionObserver"in t&&"IntersectionObserverEntry"in t&&"intersectionRatio"in t.IntersectionObserverEntry.prototype)){var f=[];o.prototype.THROTTLE_TIMEOUT=100,o.prototype.POLL_INTERVAL=null,o.prototype.observe=function(t){if(!this._observationTargets.some(function(e){return e.element==t})){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections()}},o.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter(function(e){return e.element!=t}),this._observationTargets.length||(this._unmonitorIntersections(),this._unregisterInstance())},o.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorIntersections(),this._unregisterInstance()},o.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},o.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter(function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]})},o.prototype._parseRootMargin=function(t){var e=t||"0px",n=e.split(/\s+/).map(function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}});return n[1]=n[1]||n[0],n[2]=n[2]||n[0],n[3]=n[3]||n[1],n},o.prototype._monitorIntersections=function(){this._monitoringIntersections||(this._monitoringIntersections=!0,this._checkForIntersections(),this.POLL_INTERVAL?this._monitoringInterval=setInterval(this._checkForIntersections,this.POLL_INTERVAL):(s(t,"resize",this._checkForIntersections,!0),s(e,"scroll",this._checkForIntersections,!0),"MutationObserver"in t&&(this._domObserver=new MutationObserver(this._checkForIntersections),this._domObserver.observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}))))},o.prototype._unmonitorIntersections=function(){this._monitoringIntersections&&(this._monitoringIntersections=!1,clearInterval(this._monitoringInterval),this._monitoringInterval=null,h(t,"resize",this._checkForIntersections,!0),h(e,"scroll",this._checkForIntersections,!0),this._domObserver&&(this._domObserver.disconnect(),this._domObserver=null))},o.prototype._checkForIntersections=function(){var t=this._rootIsInDom(),e=t?this._getRootRect():a();this._observationTargets.forEach(function(o){var r=o.element,s=u(r),h=this._rootContainsTarget(r),c=o.entry,a=t&&h&&this._computeTargetAndRootIntersection(r,e),l=o.entry=new n({time:i(),target:r,boundingClientRect:s,rootBounds:e,intersectionRect:a});c?t&&h?this._hasCrossedThreshold(c,l)&&this._queuedEntries.push(l):c&&c.isIntersecting&&this._queuedEntries.push(l):this._queuedEntries.push(l)},this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)},o.prototype._computeTargetAndRootIntersection=function(n,o){if("none"!=t.getComputedStyle(n).display){for(var i=u(n),r=i,s=p(n),h=!1;!h;){var a=null,l=1==s.nodeType?t.getComputedStyle(s):{};if("none"==l.display)return;if(s==this.root||s==e?(h=!0,a=o):s!=e.body&&s!=e.documentElement&&"visible"!=l.overflow&&(a=u(s)),a&&!(r=c(a,r)))break;s=p(s)}return r}},o.prototype._getRootRect=function(){var t;if(this.root)t=u(this.root);else{var n=e.documentElement,o=e.body;t={top:0,left:0,right:n.clientWidth||o.clientWidth,width:n.clientWidth||o.clientWidth,bottom:n.clientHeight||o.clientHeight,height:n.clientHeight||o.clientHeight}}return this._expandRectByRootMargin(t)},o.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map(function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100}),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},o.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,o=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==o)for(var i=0;i<this.thresholds.length;i++){var r=this.thresholds[i];if(r==n||r==o||r<n!=r<o)return!0}},o.prototype._rootIsInDom=function(){return!this.root||l(e,this.root)},o.prototype._rootContainsTarget=function(t){return l(this.root||e,t)},o.prototype._registerInstance=function(){f.indexOf(this)<0&&f.push(this)},o.prototype._unregisterInstance=function(){var t=f.indexOf(this);-1!=t&&f.splice(t,1)},t.IntersectionObserver=o,t.IntersectionObserverEntry=n}}(window,document);}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});


function isEqual(arr1, arr2) {
    return (arr1.sort().join()) === ((arr2.sort().join()));
}

function differArray(total, array) {
    return array.filter(function(v, index) {
        return (total.indexOf(v) === -1);
    });
}

var doneFocusIds = [];
var myFocusIds = [];
var myTimer = null;
var options = {
    root: null, 
    // rootMargin: "10px 10px 10px 10px",
    threshold: [0.5], //阈值
}
var intersectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(v) {
        if (v.isIntersecting) {
            //到交叉状态
            var thisId = parseInt(v.target.getAttribute('data-id'));
            if (myFocusIds.indexOf(thisId) === -1) {
                //不存在
                myFocusIds.push(thisId);
            }
        }
    })
    myTimer && clearTimeout(myTimer);
    myTimer = setTimeout(function() {
        handlerIdsData(myFocusIds);
    }, 1000);
}, options);

function focuseObserve() {
    var nodes = document.querySelectorAll(".focus66");
    for (var i = 0; i < nodes.length; i++) {
        intersectionObserver.observe(nodes[i]);
    }
}

$(document).ready(function() {
    setTimeout(function(argument) {
        // focuseObserve();
    }, 1000)
})

/**
 * 处理数据
 * @param {*} ids 
 */
function handlerIdsData(ids) {
    //求跟doneIds的差集然后发送
    var differIds = differArray(doneFocusIds, ids);
    // console.log('处理后的提交ids:', differIds);
    if (differIds.length <= 0) return;

    //判断登录
    // if (!objSite.isLogin()) {
    //     //如果没有验证打开登录窗口
    //     return false;
    // }
  
    // console.log('focus data',data);
  //jsonpFocusData(differIds);
}

/**
 * 提交广告位曝光数据data
 * @param {*} differIds 
 */
function postFocusData(differIds) {
   // var idsObj = {
   //   'll_id_arr': differIds
   // }
   //  var data = JSON.stringify(idsObj);
   //  $.post(objSite.getWwwUrl('/ad/index_detail/ad_exposure'), {
   //      data: data
   //  }, function(res) {
   //      if (res.code == 200) {
   //          differIds.forEach(function(v) {
   //              doneFocusIds.push(v);
   //          })
   //      } else {
   //          //console.log(res.msg);
   //      }
   //  });
}

/**
 * 跨域GET请求
 * @param {Array} differIds 上报的广告位id数组
 */
function jsonpFocusData(differIds) {
    var idsObj = {
      'll_id_arr': differIds
    }
    var data = JSON.stringify(idsObj);
    var url = objSite.getWwwUrl('/ad/index_detail/ad_exposure');
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url,
        timeout: 10000,
        data: idsObj,
        dataType: 'jsonp',
        jsonp: 'callback',
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(res) {
            if (res.code == 200) {
                differIds.forEach(function(v) {
                    doneFocusIds.push(v);
                })
            } else {
                //console.log(res.msg);
            }
        }
    });
}
/*广告位曝光数据上传end**/