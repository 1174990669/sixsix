class PageSwitch {
    constructor(options) {
        this.options = {
            pageNumSt: '.js_PageNum',
            preBtn: '.js_PreBtn',
            nextBtn: '.js_NextBtn',
            contentWrapSt: '.js_PageLists',
            contentListsSt: '.js_PageLists >li',
            showCount: 4 //一页显示的个数
        }
        Object.assign(this.options, options);
    }
    init() {
        let options = this.options;
        let $preBtn = $(options.pageNumSt).siblings(options.preBtn);
        let $nextBtn = $(options.pageNumSt).siblings(options.nextBtn);
        $preBtn.on('click', function (e) {
            handEvent.call(this, false, options);
        })
        $nextBtn.on('click', function (e) {
            handEvent.call(this, true, options)
        })
    }

}


function handEvent(isNext, options) {

    let _this = $(this);
    if (_this.hasClass('disabled')) {
        return;
    }
    let $pageTxt = $(options.pageNumSt);
    let $list = $(options.contentListsSt);
    let curNum = $pageTxt.data('count');
    let totalNum = $pageTxt.data('page');
    let showCount = options.showCount;
    let cNum = 0;
    if (isNext) {
        cNum = curNum + 1;
        if (cNum === totalNum) {
            _this.addClass('disabled');
        }
        _this.siblings(options.preBtn).removeClass('disabled');
    } else {
        cNum = curNum - 1;
        if (cNum === 1) {
            _this.addClass('disabled');
        }
        _this.siblings(options.nextBtn).removeClass('disabled');
        $list.removeClass('none');
    }

    $pageTxt.html(`${cNum}/${totalNum}`);
    $pageTxt.data('count', cNum);

    $(`${options.contentListsSt}:lt(${showCount * (cNum-1)})`).addClass('none');
}

export default PageSwitch;