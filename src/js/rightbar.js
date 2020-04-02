 var rbarhtml =
     `<ul class="new-rightbar-wrapper js_Rightbar" style="display: none;">
     <li class="prefer-block">
         <a><i class="icon"></i><span class="text">特惠</span></a> </li>
     <li class="kefu-block"> <i class="icon"></i><span class="text">客服</span>
         <div class="pop-menu">
             <ul class="kefu-info">
                 <div class="arrow"></div>
                 <li class="qqbox">
                     <a rel="nofollow" href="" target="_blank">
                         <i class="contact-icon"></i>在线客服
                         <div class="anim"></div>
                     </a>
                 </li>
                 <li class="tell"><i class="tell-icon"></i>0755-2373 9413</li>
                 <li class="time-desc">
                     <p class="user" id="rightUserId">您还未登录</p>
                     <p>周一至周五：9:00-21:00</p>
                     <p>周末及节日：9:00-18:00</p>
                 </li>
             </ul>
         </div>
     </li>
     <li class="feedback-block js_ShowFeedBack"> <i class="icon"></i><span class="text">反馈</span></li>
     <li class="qqgroup-block js_FansDialog"><a> <i class="icon"></i><span class="text">粉丝群</span></a></li>
     <li class="gotop-block js_BackTop"><i class="icon"></i><span class="text">顶部</span></li>
 </ul>`;
 document.write(rbarhtml);

 $(document).ready(function () {
     var userid = '';
     if (objSite.isLogin()) {
         var userInfo = $.cookie('userCookieData');
         if (!userInfo || userInfo === 'null') {
             userid = '您还未登录';
         } else {
             var obj = JSON.parse(userInfo);
             userid = '（您的用户id：' + obj.user.user_id + '）';
         }
     } else {
         userid = '您还未登录';
     }
     $('p#rightUserId').text(userid);
     // rightbar 右侧栏固定
     var $jsRightbar = $('.js_Rightbar');
     var maxTop = 400;
     $(window).scroll(function () {
         if ($(document).scrollTop() >= maxTop) {
             if ($jsRightbar.is(':hidden')) {
                 //显示
                 //$('.rightbar-act').show();
                 $jsRightbar.fadeIn(300);
             } else {
                 //隐藏
             }
         } else {

             $jsRightbar.hide();
         }

     });

     if ($(document).scrollTop() >= maxTop) {
         $jsRightbar.fadeIn(300);
     }


     //点击回到顶部
     $('.js_BackTop').click(function () {
         $('html,body').animate({
             scrollTop: 0
         }, 300);
     });


     // 意见反馈
     var feebbackIndex = -1;
     $(document).on('click', '.js_ShowFeedBack', function () {
         feebbackIndex = layer.open({
             type: 2,
             area: ['550px', '620px'],
             //maxmin: true,
             title: false,
             closeBtn: 2,
             resize: false,
             content: ['/feedback/feedback/index', 'no'],
             // resize: false,
             // zIndex: layer.zIndex, //重点1
             shadeClose: false,
             skin: 'my-close-skin',
             success: function (layero) {
                 //layer.setTop(layero); //重点2
             }
         });
     });



 });