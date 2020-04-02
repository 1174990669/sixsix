$(function () {
    /* 轮播图 start*/
    try {
        var wwwSwiper = new Swiper('.swiper-container', {
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
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
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
        /* 轮播图 end*/

    } catch (e) {
        // console.log('swiper', e);
    }
});