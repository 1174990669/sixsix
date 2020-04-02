class Collapse {
    constructor(wrapSelect, options) {
        this.wrapSelect = wrapSelect;
        this.options = {
            expandBtn: 'js_Expand_Btn',
            innerContent: 'js_Ask_Content_Inner',
            collapsed: 'is-collapsed',
            maxHeight: 120
        }
        Object.assign(this.options, options);
        this.init(wrapSelect);
        this.initEvent();
    }
    init(wrapSelect) {
        let $wraps = $(wrapSelect);
        $wraps.each( (index,dom) => {
            let _this = $(dom);
            let $inner = _this.children(`.${this.options.innerContent}`);
            let scrollHeight = ($inner.get(0)) ? $inner.get(0).scrollHeight : 0;
            if (scrollHeight > this.options.maxHeight){
                _this.addClass(this.options.collapsed);
                $inner.css('max-height',this.options.maxHeight + 'px');
            }else{
                _this.removeClass(this.options.collapsed);
                $inner.css('max-height','');
            }
        });
    }
    initEvent(){
        let options = this.options;
        let wrapSelect = this.wrapSelect;
        $(wrapSelect).find(`.${this.options.expandBtn}`).on('click',function (e) {
            let $inner = $(this).siblings(`.${options.innerContent}`);
            let scrollHeight = $inner.get(0).scrollHeight;
            let $wraps = $(this).parent(wrapSelect);
            if($wraps.hasClass(options.collapsed)){
                $wraps.removeClass(options.collapsed);
                //$inner.css('max-height','');
                $inner.animate({
                    "max-height": scrollHeight + 'px'
                }, 300);
                $wraps.siblings('.comm-bottom').find('.js_collapse_fold').show();
            }
        });
        $(wrapSelect).parent().find('.js_collapse_fold').on('click',function (e) {
            let $inner = $(this).parents('.llask-comment-content').find(`.${options.innerContent}`);
            $inner.animate({
                "max-height": options.maxHeight + 'px'
            }, 300);
            $(this).parent('.comm-bottom').siblings(wrapSelect).addClass(options.collapsed);
            $(this).hide();
        })

    }

}


export {
    Collapse
}