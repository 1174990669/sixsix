$('.js_RefreshCourse').on('click', function (e) {
    let _this = $(this);
    let data = {};
    getRefreshData(data).then(data => {
        handerUI.call(_this, data);
    }).catch(e => {
        console.error(e);
    })
})
function handerUI(data) {
    // console.log('data:', data);
    let html = '';
    let $Lists = this.parent().siblings('.c-lists');
    data.forEach(obj => {
        html += `<a href="" target="_blank">
        <div class="c-img-wrap">
            <img src="http://static.dev.3d66.com/yutu/images/test.jpg" alt="">
        </div>
        <div class="title">
            3dmax建筑动画入进阶教程
        </div>
    </a>`;
    });
    $('.js_NewsCLists').css({
        'display': 'none'
    })
    $('.js_NewsCLists').fadeIn(300);
    $('.js_NewsCLists').html(html);
}

function getRefreshData(data) {
    let p = new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/index/index/getNewCourse",
            dataType: "json",
            data: data,
            success: function (res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            error: function (error) {
                reject(error);
            }
        })

    })
    return p;
}