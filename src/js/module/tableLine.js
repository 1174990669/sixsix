class TableLine {
    constructor(slide, options) {
        this.slide = slide;
        //父级容器ul
        // let pEL = $(slide).parent('ul');
        // let itemEl = $(slide).siblings('li');

        //兄弟容器li
        this.options = {
            parentEl: 'ul',
            itemEl: 'li',
            callback: null,
            hover: false
        };

        Object.assign(this.options, options);
        this.init(slide);
    }
    init(slide) {
        let itemEl = this.options.itemEl;
        let parentEl = this.options.parentEl;
        var liHeight = $(itemEl).outerHeight();
        let $slide = $(slide);
        if (!$slide.length) {
            return false;
        }
        // $slide.css({
        //     top: liHeight
        // });
        //console.log('liHeight', liHeight);
        //var outwidthmargin = $('.moveul li').eq(0).outerWidth(true);
        let activeEl = $(itemEl + '.active');
        moveSliderBar($slide, activeEl, parentEl);
        let callback = this.options.callback;
        callback && callback.call(this, activeEl.index());
        this.initEvent($slide, itemEl, parentEl);
    }
    initEvent($slide, itemEl, parentEl) {
        let hover = this.options.hover;
        let callback = this.options.callback;
        if (hover) {
            $(itemEl).on('mouseenter', function () {
                let _this = $(this);
                _this.addClass('active').siblings('li').removeClass('active');
                moveSliderBar($slide, _this, parentEl);
            });
        } else {

            $(itemEl).on('click', function () {
                let _this = $(this);
                callback && callback.call(this, _this.index());
                _this.addClass('active').siblings('li').removeClass('active');
                moveSliderBar($slide, _this, parentEl);
            })
        }



    }
    moveSlider(activeEl) {
        let $slide = $(this.slide);
        let parentEl = this.options.parentEl;
        moveSliderBar($slide, activeEl, parentEl);
        let callback = this.options.callback;
        callback && callback.call(this, activeEl.index());
    }
}

function initEvent() {

}

// $(".moveul li").mouseleave(function () {
//     $("#slidebar").css({
//         left: "0px"
//     })
// })

function moveSliderBar($slide, $el, parentEl) {
   
    let index = $el.index();
    let liHeight = $el.outerHeight() - 1;
    let barWidth = $el.innerWidth();
    // console.log(barWidth, $el);
    // let ulPl = $(parentEl).css('paddingLeft').replace('px', '');
    //let liPl = $el.css('paddingLeft').replace('px', '');
    // console.log('ulPl', ulPl);
    let ulPT = parseInt($(parentEl).css('paddingTop').replace('px', ''));
    //console.log('liPl', liPl);
    let marginV = ($el.outerWidth(true) - $el.outerWidth()) / 2;
    let liLeft = $el.position().left + marginV;
    $slide.css({
        left: liLeft,
        top: liHeight + ulPT,
        opacity: 1,
        width: barWidth
    });

}

export default TableLine;