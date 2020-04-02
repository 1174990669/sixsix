class ListExpand {
    constructor(ulSelect, options) {
        this.ulSelect = ulSelect;
        this.options = {
            btnEl: '.js_Xg_lists',
            maxHeight: 800,
            parentEL: '.comm-wrap-item'
        };
        Object.assign(this.options, options);
        this.init(ulSelect);
    }
    init(ulSelect) {
        let xgLists = $(ulSelect).get(0);
        let xgScrollHegith = xgLists ? xgLists.scrollHeight : 0;
        let maxHeight = this.options.maxHeight;
        let btnDom = $(this.options.btnEl);
        if (xgScrollHegith > maxHeight) {
            btnDom.show();
        } else {
            btnDom.hide();
        }
        this.initEvent(btnDom);
    }
    initEvent(btnDom) {
        let parentEl = this.options.parentEL;
        btnDom.on('click', function (e) {
            let _this = $(this);
            let _parent = _this.parent(parentEl);
            if (_parent.hasClass('expand')) {
                _parent.removeClass('expand');
                _this.html(`展开全部&nbsp;<span class="arrow-down"></span>`);
            } else {
                _parent.addClass('expand');
                _this.html(`收起部分&nbsp;<span class="arrow-up"></span>`);
            }
        });
    }
}
export default ListExpand;
