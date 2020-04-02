const checkedArray = new Array();

$('.js_LabelChoose > li').on('click', function (e) {
    let _this = $(this);
    let input = _this.children('input');
    let isChecked = input.is(':checked');
    setChecked();
    if (checkedArray.length >= 4 && !isChecked) {
        layer.msg('最多选4个！');
        return;
    } else {
        input.prop('checked', !isChecked);
    }

});

function setChecked() {
    checkedArray.splice(0, checkedArray.length);
    $('.js_LabelChoose > li').children('input').each(function (index, el) {
        let _elThis = $(this);
        if (_elThis.is(':checked')) {
            checkedArray.push(_elThis.val());
        }
    })
}

$('.js_SetSure').on('click', function (e) {
    setChecked();
    if (checkedArray.length < 1) {
        layer.msg('请至少选1个！');
        return;
    }

    layer.closeAll();
    var postObj = {
        userCommended: checkedArray.join(',')
    }
    // console.log('postObj',postObj);
    postData(postObj).then(data => {
        // if(){
        // }
        //设置成功刷新页面
        // window.location.reload();
        //更新ui
        $(`.js_IntentionWrap`).hide();
        for (let v of checkedArray) {
            $(`.js_IntentionWrap[data-id=${v}]`).show();
        }
    }).catch(e => {
        layer.msg('设置失败！');

    }).finally(() => {

    })
})

$('.js_LabelChoose > li').find('input').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
})

function postData(obj) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/index/index/setUserCommended",
            dataType: "json",
            data: obj,
            success: function (res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            error: function (error) {
                reject(error)
            }
        })

    })

}