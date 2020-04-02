$('.js_RefreshBtn').on('click', function (e) {
    let _this = $(this);
    // let $icon = _this.children('.refresh-icon');
    // $icon.addClass('refresh-animation');
    getRefreshData().then(data => {
        handerUI(data);
        // $icon.removeClass('refresh-animation');
    }).catch(e => {
        console.log(e);
        // $icon.removeClass('refresh-animation');
    })
})

function handerUI(data) {
    // console.log('data:', data);
    let html = '';
    // objSite.get
    data.forEach(obj => {
        html += `<li data-id="1163">
        <div class="wrap"></div>
        <a class="item-link" href="http://www.dev.yutu.cn/soft/play/1163_0_1.html" target="_blank">
            <div class="cover-img">
                <img class="main-course-img" src="https://img_test.3d66.com/soft/2020/20200314/bfe433e2e0388c483162bbd6e3b193d1.jpg">
            </div>
        </a>
        <div class="course-info">
            <a class="title" href="http://www.dev.yutu.cn/soft/play/1163_0_1.html" target="_blank">MAYA2018完全零基础入门教学</a>
            <div class="textarea-author">
                <a class="teacher" href="http://www.dev.yutu.cn/teacher_14.html" target="_blank">
                    <img src="https://img_test.3d66.com/soft/2020/20200314/976f19b1241435dd90089831a1f3eace.jpg">
                    <span class="author-name">王海鹏</span>
                </a>
                <div class="right-info">
                    <span class="time-num">0.2小时</span>
                    <span class="label-type">基础入门</span>
                </div>
            </div>
        
        </div>
    </li>`;
    });
    $('.js_NewsCLists').css({
        'display': 'none'
    })
    $('.js_NewsCLists').fadeIn(300);
    $('.js_NewsCLists').html(html);
}

function getRefreshData() {
    let p = new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/index/index/getNewCourse",
            dataType: "json",
            data: null,
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