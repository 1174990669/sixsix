import 'babel-polyfill';
import './module/fixNav.js';
import {
    SubSort
} from './module/subSort.js';


SubSort.init(32);

//软件集张开
const Soft_Lists_Max_H = 298;
// scrollHeight

let softUlH = $('.soft-lists-wrap .soft-lists')[0] ? $('.soft-lists-wrap .soft-lists')[0].scrollHeight : 0;
if (softUlH >= Soft_Lists_Max_H) {
    $('.soft-lists-wrap .other-lists-extend').show();
}
$('.soft-lists-wrap .other-lists-extend').on('click', function (e) {
    let _this = $(this);
    let _thisP = _this.parent();
    if (_thisP.hasClass('expand')) {
        _thisP.removeClass('expand');
        _thisP.children('.soft-lists').animate({
            "max-height": Soft_Lists_Max_H + "px",
        }, 300);
        _this.html(`更多软件&nbsp;<span class="arrow-down"></span>`);
    } else {
        _thisP.addClass('expand');
        _thisP.children('.soft-lists').animate({
            "max-height": softUlH + "px"
        }, 300);
        _this.html(`收起部分&nbsp;<span class="arrow-up"></span>`);
    }
});

$(document).on('click', '.soft-lists > li > a', function (e) {
    let id = $(this).data('study_id');
    // console.log(id);
    $.post('/index/stats/softStudyClick', {
        id: id
    })
})

$('.js_DownloadOk').on('click', function (e) {
    let id = $(this).data('id');
    $.post('/soft/download/increase', {
        soft_id: id
    })
});