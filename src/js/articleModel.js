import 'babel-polyfill';
import './module/fixNav.js';

$(function () {
    initHoverEvent($('.js_ChangeNav1 > a'), $('.js_RelevantBlock1 .js_Item'));
    initHoverEvent($('.js_ChangeNav2 > a'), $('.js_RelevantBlock2 .js_Item'));
    function initHoverEvent($eventSelect, $showSelect) {
        $eventSelect.on('mouseenter', function (e) {
            let _this = $(this);
            _this.addClass('active').siblings().removeClass('active');
            let index = $(this).index();
            $showSelect.eq(index).show().siblings().hide();
        })
    }
});