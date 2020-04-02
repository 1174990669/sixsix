import TableLine from './tableLine';

$(function () {
	const Empty_Bg_Class = 'my-empty-bg';
	//导航栏切换效果
	let isFirst = true;
	let slideBar1 = new TableLine('#navSlideBar', {
		parentEl: '.js_CourseNav',
		itemEl: '.js_CourseNav > li',
		callback: function (index) {
			// console.log('index',index);
			//判断是否为课程目录页
			index++;
			if (index == 1) {
				//课程介绍
				$(`.${Empty_Bg_Class}`).hide();
				$('.textarea-wrap').hide();
				$('.nav-page').show();
			} else {
				$(`.${Empty_Bg_Class}`).show();
				$('.textarea-wrap').show();
				showThisPage(index);
			}

			if (isFirst) {
				isFirst = false;
			} else {
				$("html,body").animate({
					scrollTop: '630px'
				}, 300)
			}

		}
	});

	$('.js_DownloadExe').on('click', function (e) {
		var $li3 = $('.js_CourseNav > li').eq(2);
		// slideBar1.moveSlider($li3);
		$li3.trigger('click');
		$("html,body").animate({
			scrollTop: '630px'
		}, 300)
	});

	var scTop = 0; //初始化垂直滚动的距离
	var leftNavTop = $('.js_CourseNav').offset().top + $('.js_CourseNav').height();
	$(document).scroll(function () {
		scTop = $(this).scrollTop(); //获取到滚动条拉动的距离
		if (scTop > leftNavTop) {
			//核心部分：当滚动条拉动的距离大于等于导航栏距离顶部的距离时，添加指定的样式
			$('.course-nav-wrap').addClass('fix-course-nav');
		} else {
			$('.course-nav-wrap').removeClass('fix-course-nav');
		}
	})



	$('.js_ToDown').on('click', function (e) {
		$('.left-course-nav > li').eq(2).trigger('click');
		$('body,html').animate({
			scrollTop: '520px'
		});
	});
	/**
	 * 显示对应的内容
	 */
	function showThisPage(id) {
		$('.nav-page').hide();
		//是否有空内容
		$('.nav-page[data-id=' + id + ']').show();

	}

});