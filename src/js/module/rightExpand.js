$(function () {

    //右侧列表的展开折叠
    initRightEvent();

    function initRightEvent() {
        const _MaxListHeight = 220;
        $('.right-lists').each(function (index) {
            let tEl = $(this).children('ul');
            
            let scrollH = tEl[0]? tEl[0].scrollHeight : 0;
            let extendEl = $(this).find('.js-btn-expand');
            let extendBtn = extendEl.find('.other-lists-extend');
            if (scrollH > _MaxListHeight) {
                extendEl.css('display', 'block');
            } else {
                extendEl.css('display', 'none');
            }
            bindToggle(extendBtn, scrollH, _MaxListHeight);
        });
    }
    //绑定事件
    function bindToggle($el, scrollH, maxH) {
        let _ulEl = $el.parent().siblings('ul');
        $el.toggle(function (e) {
            _ulEl.animate({
                "max-height": scrollH + "px"
            }, 300);
            _ulEl.addClass('expand');
            $(this).html(`收起&nbsp;<span class="arrow-up"></span>`);
        }, function (e) {
            _ulEl.stop();
            _ulEl.animate({
                "max-height": maxH + "px"
            }, 300);
            _ulEl.removeClass('expand');
            $(this).html(`展开&nbsp;<span class="arrow-down"></span>`);

        });
    }

});