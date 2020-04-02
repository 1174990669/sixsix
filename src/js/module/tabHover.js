const Pi = 3.14;
/**
 * @author jxl
 * @description 悬浮切换列表模块
 */
class TabHover {
    constructor(select, options) {
        this.options = {
            expandBtnClass: '.other-lists-extend', //展示更多按钮class
            parentClass: '.all-course-lists', //内容列表的父容器class
            tabUlClass: '.js-all-course', //切换的ul容器class
            listWrap: '.course-list-wrap', //包裹内容的class
            ulLists: '.ul-wrap', //内容的ul标签
            maxHeight: 117 //最高显示的行数高度
        }
        this.select = select;
        Object.assign(this.options, options);
        this.init(select);
        this.bindTabHover();
    }
    /**
     * 初始化展开按钮是否显示判断
     * @param {string} select  选择器
     */
    init(select) {
        let courseEl = $(select).eq(0);
        let ulListsEl = courseEl.find(this.options.ulLists);
        let scrollH = ulListsEl[0] ? ulListsEl[0].scrollHeight : 0;
        // console.log('sss'+select,scrollH);
        let expandBtn = this.options.expandBtnClass;
        if (scrollH > this.options.maxHeight) {
            //多行
            courseEl.find(expandBtn).show();
        } else {
            //隐藏
            courseEl.find(expandBtn).hide();
        }
        let parentEl = this.options.parentClass;
        let listWrapEl = this.options.listWrap;
        $(parentEl).find(expandBtn).toggle(function (e) {
            let _thisBtn = $(this);
            _thisBtn.parents(listWrapEl).addClass('expand');
            _thisBtn.html(`收起部分&nbsp;<span class="arrow-up"></span>`);
        }, function (e) {
            let _thisBtn = $(this);
            _thisBtn.parents(listWrapEl).removeClass('expand');
            _thisBtn.html(`展开全部&nbsp;<span class="arrow-down"></span>`);
        });
    }
    /**
     * 绑定鼠标点击事件
     */
    bindTabHover() {
        let tabUl = this.options.tabUlClass;
        let selectWrap = this.select;
        let listWrap = this.options.listWrap;
        let expandBtn = this.options.expandBtnClass;
        let maxHeight = this.options.maxHeight;
        let ulLists = this.options.ulLists;
        $(tabUl).children('li').on('mouseenter', function (e) {
            $(this).addClass('active').siblings().removeClass('active');
            let index = $(this).index();
            let wrapEl = $(selectWrap).eq(index);
            wrapEl.show().siblings(listWrap).hide();
            let ulListsEl = wrapEl.find(ulLists);
            if (!ulListsEl[0]) {
                return false;
            }
            let scrollH = ulListsEl[0].scrollHeight;
            if (scrollH > maxHeight) {
                //显示更多按钮
                wrapEl.find(expandBtn).show();
            } else {
                //隐藏更多按钮
                wrapEl.find(expandBtn).hide();
            }

        })
    }

}

TabHover.prototype.showMsg = function (msg) {
    console.log('msg:', msg);
}
window.TabHover = TabHover;
/**
 * 定义私有方法
 * @param {string} select 选择器
 */
function privateName(select) {
    console.log('select', select);
}

export {
    TabHover
}