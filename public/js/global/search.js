// 搜索方法
objSite.search = function(){
  var dataRtype = $('.js-curtype').data('rtype');
  var keyword = $('.js-searchkey').val();
  if(keyword == '')
  {
    $('.js-searchkey').focus();
    return false;
  }

  //判断是否是网址
  var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  var objExp = new RegExp(Expression);
  var imgEnd = ['.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG'];
  if(objExp.test(keyword) == true)
  {
    $.each(imgEnd, function(i, item){
      if(keyword.indexOf(item) >= 0)
      {
        //判断是否登录
        // if(!objSite.isLogin()){
        //   openLogin();
        //   return false;
        // }
        var search_data = new FormData();
        search_data.append('urlFile', keyword);
        search_data.append('searchType', 3);
        sotuUpImg(search_data);
      }
    });
    return false;
  }

  //var url = objSite.so_domain + 'res_' + dataRtype + '_1.html?k=' + encodeURIComponent(keyword);
  var url = objSite.so_domain + 'res/' + encodeURI(encodeURI(keyword)) + '_' + dataRtype + '_1.html';

  // 获取相关词
  var relevant = '';
  $(".autocomplete-suggestions div").each(function(){
    relevant += ',' + $(this).text();
  });
  // 删除第一个字符
  relevant = relevant.substring(1);

  // 搜索日志
  $.post(objSite.getSoUrl('/res/so_log'), {k: encodeURIComponent(keyword), relevant: relevant, res_type: dataRtype});
  // window.open(url, 'search');
  window.location.href = url;
};

$(function(){
  // 搜索类型选择
  $('.js-selectbox li').click(function(){
    $('.js-curtype').text($(this).text());
    $('.js-curtype').data('rtype', $(this).data('rtype'));
    // 如果关键字不为空直接搜索
    if($('.js-searchkey').val() != '')
    {
      objSite.search();
    }
  });
  // 输入文字赋值给全部
  $('.js-searchkey').on('change', function(){
    $('.js-searchkey').val($(this).val());
  });

  // 点击搜索
  $('.js-search').click(function(){
    objSite.search();
  })

  // 回车搜索
  $('.js-searchkey').on('keydown', function(e){
    if(e.keyCode == 13)
    {
      $(this).blur();
      objSite.search();
    }
    else if(e.keyCode == 71)
    {
      e.stopPropagation();
    }
  });

  // 搜索关键字自动完成
  /*$('.js-searchkey').autocomplete({
      triggerSelectOnValidInput: false,
      serviceUrl: function() {
          return objSite.getSoUrl("/keywords/index_list");
      },
      transformResult: function (res) {
          res = $.parseJSON(res);
          if (typeof(res["data"] != "undefined")) {
              return {
                  suggestions: $.map(res['data'], function (dataItem) {
                      return {
                          value: dataItem.key_name,
                          data: dataItem.key_name
                      }
                  })
              }
          }
      },
      onSelect: function(item) {
          if (typeof(so_keyword) == "undefined" || so_keyword != item["value"]) {
              $('.js-searchkey').val(item["value"]);
              so_keyword = $('.js-searchkey').val();
              objSite.search();
          }
      }
  });
  */
  try
  {
    $('.js-searchkey').autocomplete({
      triggerSelectOnValidInput: false,
      serviceUrl: function(){
        return objSite.getSoUrl("/keywords/index_list")
      },
      transformResult: function(res){
        res = $.parseJSON(res);
        if(typeof (res["data"] != "undefined"))
        {
          return {
            suggestions: $.map(res['data'], function(dataItem){
              return {
                value: dataItem.key_name,
                data: dataItem.key_name
              }
            })
          }
        }
      },
      onSelect: function(item){
        if(typeof (so_keyword) == "undefined" || so_keyword != item["value"])
        {
          $('.js-searchkey').val(item["value"]);
          so_keyword = $('.js-searchkey').val();
          objSite.search();
        }
      }
    });
  }
  catch(e)
  {
  }
});