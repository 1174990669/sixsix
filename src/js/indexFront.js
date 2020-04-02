import 'babel-polyfill';
import './module/fixNav.js';
import './module/banner.js';
// import {
//     TabHover
// } from './module/tabHover.js';

import '../../libs/js/jquery.lazyload';

import './module/bannerSlider';

//图片懒加载
try {
    $('.course-wrap .main-course-img').lazyload({
        // placeholder: "", //用图片提前占位
        // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
        effect: "fadeIn", // 载入使用何种效果
        //threshold: 1000, // 提前开始加载
    });

} catch (e) {
    //TODO handle the exception
    console.log('lazy', e);
}


$(function () {

    $('.js_CourseSwitch >li').on('click', function (e) {
        let index = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.common-course-wrap').eq(index).show().siblings('.common-course-wrap').hide();

        $('.course-wrap .main-course-img').lazyload({
            // placeholder: "", //用图片提前占位
            // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
            effect: "fadeIn", // 载入使用何种效果
            //threshold: 1000, // 提前开始加载
        });
    });

    $('.js_More').on('mouseenter', function (e) {
        $(this).siblings('.js_MoreBlock').fadeIn();
    })
    $('.js_MoreBlock').on('mouseleave', function (e) {
        $(this).fadeOut();
    })
    $('.right-col> a:not(.more)').on('mouseenter', function (e) {
        $(this).siblings('.js_MoreBlock').fadeOut();
    })

    $('.js_ListsNav > a').on('mouseenter', function (e) {
        let index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.js_ListsBlock .lists-content-block').eq(index).show().siblings().hide();
    })

});