import {
	EsSearch
} from './esSearch';

$(function () {
	//搜索
	let navSearch = new EsSearch('#jsSearchKey', {
		searchBtn: '.js-search',
		maxHeight: 450,
		width: 222,
		minChars: 0,
		zIndex: 10001,
	});

	let courseSearch = new EsSearch('#jsCourseSearchKey', {
		searchBtn: '.jsCourseSearchBtn',
		maxHeight: 450,
		width: 510,
		minChars: 0,
		zIndex: 10001,
	});

	//var banOffTop=$(".search-header").offset().top;//获取到距离顶部的垂直距离
	var scTop = 0; //初始化垂直滚动的距离
	$(document).scroll(function () {
		//输入框失去焦点;
		if ($('.js-soft-searchkey').is(":focus")) {
			$('.js-soft-searchkey').blur();
		}
		if ($('#searchPageInput').is(":focus")) {
			$('#searchPageInput').blur();
		}
		scTop = $(this).scrollTop(); //获取到滚动条拉动的距离
		if (scTop > 0) {
			//核心部分：当滚动条拉动的距离大于等于导航栏距离顶部的距离时，添加指定的样式
			if (!$(".soft-nav").hasClass('fixNav')) {
				// $('.soft-nav-outer').before('<div class="js_HeaderFill" style=" width:100%;height:60px;"></div>');
				$(".soft-nav").addClass("fixNav");
			}
		} else {
			$(".soft-nav").removeClass("fixNav");
			$('.js_HeaderFill').remove();
		}
	})

	/* 显示出导航，隐藏掉搜索 */
	function showNav() {
		$('.nav-search-btn').html('<i class="iconfont">&#xe64f;</i>');
		$('.search-nav-panel').hide();
		$('ul.js-nav').show();
	}


});