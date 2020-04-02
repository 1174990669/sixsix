class ExpandHeight {
    constructor(options) {
        this.options = {
            MaxHeight: 96,
            listsSelect: '.label-lists-wrap .label-lists',
            listsWrapSelect: '.label-lists-wrap',
            btnSelect: '.label-lists-wrap .other-lists-extend'


        };
        Object.assign(this.options, options)
    }
    init() {
        // const options = this.options;
        const {
            MaxHeight,
            listsSelect,
            btnSelect
        } = this.options;
        let $lists = $(listsSelect)[0];
        let listsH = $lists ? $lists.scrollHeight : 0;
        let $btn = $(btnSelect);
        if (listsH > MaxHeight) {
            $btn.show();
        }else{
            return;
        }
        $btn.on('click', function (e) {
            let _this = $(this);
            let _thisP = _this.parent();
            if (_thisP.hasClass('expand')) {
                _thisP.removeClass('expand');
                _this.html(`展开全部&nbsp;<span class="arrow-down"></span>`);
            } else {
                _thisP.addClass('expand');
                _this.html(`收起部分&nbsp;<span class="arrow-up"></span>`);

            }
        })
    }
}
export default ExpandHeight;
//列表折叠
// const Soft_Lists_Max_H = 96;
// // scrollHeight
// let softUlH = $('.label-lists-wrap .label-lists')[0].scrollHeight;
// if (softUlH >= 96) {
//     $('.label-lists-wrap .other-lists-extend').show();
// }
// $('.label-lists-wrap .other-lists-extend').on('click', function (e) {
//     let _this = $(this);
//     let _thisP = _this.parent();
//     if (_thisP.hasClass('expand')) {
//         _thisP.removeClass('expand');
//         _this.html(`展开全部&nbsp;<span class="arrow-down"></span>`);
//     } else {
//         _thisP.addClass('expand');
//         _this.html(`收起部分&nbsp;<span class="arrow-up"></span>`);

//     }
// });