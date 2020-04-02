import 'babel-polyfill';
import './module/fixNav.js';
import '../../libs/js/jquery.lazyload';
import {
    SubSort
} from './module/subSort.js';
$(function () {
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

    $('.js_arrowShow').on('click', function (e) {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).parents('.course-info').siblings('.other-section-lists').show();
        } else {
            $(this).parents('.course-info').siblings('.other-section-lists').hide();
        }
    })
    $('.course-wrap >li').mouseleave(function (e) {
        $(this).find('.js_arrowShow').removeClass('active');
        $(this).find('.other-section-lists').hide();
    })
    SubSort.init();

});