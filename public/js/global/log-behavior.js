$(function(){
  var data = {
    url: document.referrer
  };
  $.ajax({
    type: 'GET',
    data: {data: data},
    url: objSite.getSoUrl('/user/log_behavior'),
    dataType: 'jsonp',
  })
});