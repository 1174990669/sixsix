let animClass = 'jxlview-anim-00';
class PictureView {
    constructor(wrapSelect, options) {
        this.wrapSelect = wrapSelect;
        this.options = {
            isWrap: true,
            isDataSrc: true
        };
        Object.assign(this.options, options);
        this.init();
        this.initEvent(wrapSelect);

    }

    init() {

    }
    initEvent(wrapSelect) {
        let $select;
        if (this.options.isWrap) {
            //找容器内所有的图片
            $select = $(wrapSelect).find('img');
        } else {
            $select = $(wrapSelect);
        }

        $select.on('click', function (e) {
            let _this = $(this);
            let imgSrc = _this.data('src');
            if(!imgSrc){
                imgSrc = _this.attr('src');
            }
            loadImage(imgSrc, function (img) {

                let imageArea = calculateImg(img);
                let left = ((document.documentElement.clientWidth - imageArea[0]) / 2) + 'px';
                let top = ((document.documentElement.clientHeight - imageArea[1]) / 2) + 'px';
                let width = imageArea[0] + 'px';
                let height = imageArea[1] + 'px';
                $('body').append(`<div class="picture-view-shade"></div>
                <div class="picture-view-wrap view-photos" style="width:${width};height:${height};left:${left};top:${top}">
                    <div class="picture-view-content" style="height:${height}">
                        <img src="${imgSrc}" alt="">
                    </div>
                </div>`);
                
                $('.picture-view-wrap').addClass(animClass).one(
                    'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function () {
                        $(this).removeClass(animClass);
                    });
                $('html').css({
                    'overflow': 'hidden'
                });
                $(window).on('resize', {
                    imageArea
                }, pictureViewResize);
                $('.picture-view-shade').on('click', function (e) {
                    $('body').children('.picture-view-shade').remove();
                    $('body').children('.picture-view-wrap').remove();
                    //$('html').removeAttr('style');
                    $('html').css({
                        overflow: ''
                    });
                    $(window).off('resize', pictureViewResize);
                });
            }, function (e) {
                //console.error('加载图片错误', e);
                throw new Error('load img error...');
            });
        });

    }

}


/**
 * 窗口缩放事件
 * @param {} event 
 */
function pictureViewResize(event) {
    let imageArea = event.data.imageArea;
    let left = ((document.documentElement.clientWidth - imageArea[0]) / 2) + 'px';
    let top = ((document.documentElement.clientHeight - imageArea[1]) / 2) + 'px';
    // console.log(left, top);
    $('.picture-view-wrap').css({
        left: left,
        top: top
    });

}
/**
 * 计算图片大小
 * @param {*} img 
 */
function calculateImg(img) {
    var imgarea = [img.width, img.height];
    var winarea = [document.documentElement.clientWidth - 100, document.documentElement.clientHeight - 100];
    //如果 实际图片的宽或者高比 屏幕大（那么进行缩放）
    if (imgarea[0] > winarea[0] || imgarea[1] > winarea[1]) {
        var wh = [imgarea[0] / winarea[0], imgarea[1] / winarea[1]]; //取宽度缩放比例、高度缩放比例
        if (wh[0] > wh[1]) { //取缩放比例最大的进行缩放
            imgarea[0] = imgarea[0] / wh[0];
            imgarea[1] = imgarea[1] / wh[0];
        } else if (wh[0] < wh[1]) {
            imgarea[0] = imgarea[0] / wh[1];
            imgarea[1] = imgarea[1] / wh[1];
        }
    }
    return [...imgarea];
}
/**
 * 加载load图片
 * @param {*} url 
 * @param {*} callback 
 * @param {*} error 
 */
function loadImage(url, callback, error) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        return callback(img);
    }
    img.onload = function () {
        img.onload = null;
        callback(img);
    }
    img.onerror = function (e) {
        img.onerror = null;
        error(e);
    }

}

export default PictureView;