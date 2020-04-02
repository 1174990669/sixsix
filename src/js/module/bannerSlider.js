document.addEventListener("DOMContentLoaded", function () {
    // console.log("DOMContentLoaded");

});

var tearchSwiper = new Swiper('#TearchIntroduct', {
    loop: true,
    speed: 1500,
    slidesPerView: 5,
    spaceBetween: 20,
    centeredSlides: false,
    watchSlidesProgress: true,
    on: {},
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay
    },
});