import 'babel-polyfill';
import './module/fixNav.js';
import {
    EsSearch
} from './module/esSearch';

let inputSearch = new EsSearch('#jsQASearchKey', {
    searchBtn: '#jsQuestionSearchBtn',
    // appendTo: '.search-box-wrap',
    maxHeight: 450,
    width: 940,
    minChars: 0,
    zIndex: 10001,
});
$(function () {
    try {
        var swiper = new Swiper('.js_MidSwiper .swiper-container', {
            loop: true,
            effect: 'fade',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                // renderBullet: function (index, className) {
                // 	return '<span class="' + className + '">' + '<i class="progress-line"></i>' +
                // 		'</span>';
                // }
            },
            autoplay: {
                delay: 5000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
            /* 事件 */
            on: {
                init: function () {
                    //鼠标放一侧 显示出两个切换的按钮
                    $('.swiper-button-prev,.swiper-button-next').on('mouseenter', function (event) {
                        //$('.swiper-button-prev .prev-icon').fadeIn();
                        //$('.swiper-button-next .next-icon').fadeIn();
                    })
                    $('.swiper-button-prev,.swiper-button-next').on('mouseleave', function (event) {
                        //$('.swiper-button-prev .prev-icon').fadeOut();
                        //$('.swiper-button-next .next-icon').fadeOut();
                    })
                },
                transitionEnd: function () {

                },
                slideChangeTransitionEnd: function () {

                },
                slideChange: function () {

                }
            }
        });
    } catch (error) {
        console.error(error);
    }


});