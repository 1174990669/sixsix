//初始化大小类的展开按钮样式

class SubSort {

    static init(Max_Height = 45) {
        this.Max_Height = Max_Height;
        $('.sort-lists').each(function (index) {
            let tEl = $(this);
            let scrollH = tEl[0].scrollHeight;
            let extendBtn = tEl.find('.arrow-icon');
            if (scrollH > Max_Height) {
                extendBtn.css('display', 'inline-block');
            } else {
                extendBtn.css('display', 'none');
            }
            SubSort.bindToggle(extendBtn, scrollH, Max_Height);
        });
    }
    /**
     * 绑定事件
     * @param {elment} $el 按钮
     * @param {number} scrollH 
     */
    static bindToggle($el, scrollH, Max_Height) {
        let _parent = $el.parent();
        $el.toggle(function (e) {
            _parent.animate({
                "max-height": scrollH + "px"
            }, 300);
            _parent.addClass('expand');
        }, function (e) {
            _parent.stop();
            _parent.animate({
                "max-height": Max_Height + "px"
            }, 300);
            _parent.removeClass('expand');

        });
    }
}
export {
    SubSort
}