import 'babel-polyfill';
import './module/fixNav.js';
import {
    SubSort
} from './module/subSort.js';
import {
    EsSearch
} from './module/esSearch';
$(function () {
    SubSort.init();
    let inputSearch = new EsSearch('#searchPageInput', {
        searchBtn: '#jsSearchPageBtn',
        appendTo: '.search-box-wrap',
        maxHeight: 450,
        width: 610,
        minChars: 0,
        zIndex: 10001,
    });

    //初始化效果
    $('.ul-search-nav .active').addClass('full');
    //相互赋值绑定搜索输入框
    $('.js-soft-searchkey').on('change', function () {
        $('.js-soft-searchkey').val($(this).val());
    });

    $('#jsSearchPageBtn').on('click', function (e) {
        if ($('#searchPageInput').val().trim().length <= 0) {
            window.location.href = objSite.getZixueUrl('/course.html');
        }
    })
    // 回车搜索
    $('#searchPageInput').on('keydown', function (e) {
        let _thisValue = $(this).val();
        if (e.keyCode == 13) {
            if (_thisValue.trim().length <= 0) {
                window.location.href = objSite.getZixueUrl('/course.html');
            }

        } else if (e.keyCode == 71) {
            e.stopPropagation();
        }
    });
    // 
});