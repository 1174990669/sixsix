const Search_Cookie_Key = 'zixue_search_history';
class EsSearch {
    constructor(inputSelect, options) {
        this.inputSelect = inputSelect;
        this.options = {
            searchBtn: '#jsSearchBtn',
            maxHeight: 450,
            minChars: 0,
            zIndex: 999,
            appendTo: 'body'
        }
        Object.assign(this.options, options);
        // console.log('ooo',this.options);
        this.init(inputSelect);
        this.bindEvent(this.options.searchBtn, inputSelect);
    }
    init(inputSelect) {
        let maxHeight = this.options.maxHeight;
        let width = this.options.width;
        let minChars = this.options.minChars;
        let zIndex = this.options.zIndex;
        let appendTo = this.options.appendTo;
        $(inputSelect).autocomplete({
            lookup: function (query, done) {
                // Do Ajax call or lookup locally, when done,
                //console.log('query', query);
                var result = {};
                if (query == '') {
                    //没有输入内容的话就获取最近和热门数据
                    result.suggestions = getLocAndHots();
                    done(result);
                } else {
                    //ajax获取服务器数据
                    result.suggestions = [];
                    searchKeyAjax(query, function (data) {
                        data.forEach(function (v, item, arr) {
                            result.suggestions.push({
                                value: v.text,
                                data: item + ""
                            });
                        })
                        done(result);
                    });
                }

            },
            appendTo: appendTo,
            maxHeight: maxHeight,
            width: width,
            minChars: minChars,
            zIndex: zIndex,
            onSearchStart: function (param) {

            },
            groupBy: 'category',
            formatResult: function (suggestion) {
                return '<span>' + suggestion.value + '</span>';
            },
            onSearchComplete: function (q, suggestions) {
                // 			console.log('q', q);
                // 			console.log('sug', suggestions);
            },
            select: function (a) {
                //console.log(2222,a);
            },
            onSelect: function (suggestion) {
                addHistory(suggestion.value);
                toSearchPage(suggestion.value);
            }
        });
    }
    bindEvent(searchBtn, inputSelect) {
        // 点击搜索
        $(searchBtn).on('click', function (e) {
            let _thisValue = $(inputSelect).val();
            if (_thisValue.trim().length <= 0) {
                return false;
            }
            addHistory(_thisValue);
            toSearchPage(_thisValue);
        })

        // 回车搜索
        $(inputSelect).on('keydown', function (e) {
            let _thisValue = $(this).val();
            if (e.keyCode == 13) {
                if (_thisValue.trim().length > 0) {
                    $(this).blur();
                    addHistory(_thisValue);
                    toSearchPage(_thisValue);
                }

            } else if (e.keyCode == 71) {
                e.stopPropagation();
            }
        });
    }

}
/**
 *  保存搜索历史记录
 * @param {*} str
 */
function addHistory(str) {
    str = str.replace(/<[^<>]+>/g, '');
    var data = new Array();
    var cookie = $.cookie(Search_Cookie_Key);
    if (cookie != null) {
        data = JSON.parse(cookie);
    }
    //如果历史记录中有，就先删除，然后再添加（保持最近搜索的记录在最新），否则，直接添加
    var index = -1;
    if (data) {
        index = data.indexOf(str);
    }
    if (index > -1) {
        data.splice(index, 1); //删除原来的
    }

    //最多保留save_max_len条记录，超过最大条数，就把第一条删除
    if (data && data.length == 5) {
        data.splice(0, 1);
    }
    data.push(str);
    $.cookie(Search_Cookie_Key, JSON.stringify(data), {
        expires: 365
    }); //设置一年有效期
}
/**
 * 去搜索页
 * @param {*} searchKey 
 */
function toSearchPage(searchKey) {
    var url = '/search.html?k=' + (encodeURIComponent(searchKey));
    window.location.href = url;
}
/**
 * 获取搜索历史记录
 */
function getLocAndHots() {
    var textArray = [];

    var val = $('#hotKeys').val();
    var hotArray = val.split(';;');
    hotArray.forEach(v => {
        textArray.push({
            value: v,
            data: {
                category: '热门搜索'
            }
        })
    });

    var history_data = false;
    var cookie = $.cookie(Search_Cookie_Key); //获取cookie
    if (cookie != null) {
        history_data = JSON.parse(cookie); //从cookie中取出数组
    }
    if (history_data) {
        history_data.forEach(function (v) {
            textArray.unshift({
                value: v,
                data: {
                    category: '最近搜索'
                }
            });
        });
    }

    return textArray;
}

/**
 * 搜索接口
 * @param {*} query 
 * @param {*} callbacks 
 */
function searchKeyAjax(query, callbacks) {
    var dat = {
        key: query
    };
    $.ajax({
        type: "post",
        url: "/search/course/getHotSearch",
        data: dat,
        dataType: 'json',
        success: function (res) {
            callbacks(res.data);
        },
        error: function (res) {
            //console.log(res);
            callbacks(null);
        }
    });
}
export {
    EsSearch
}