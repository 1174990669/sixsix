// $(function () {

//   $(".sumbit-commentxxx").click(function (e) {

//     //判断登录
//     if (!objSite.isLogin()) {
//       //如果没有验证打开登录窗口
//       openLogin();
//       return false;
//     }

//     var course_id = $(this).attr('data-courseid');
//     var video_id = $(this).attr('data-lessonid');
//     var content = $('#commentContentId').val();
//     if (content.length <= 0) {
//       return;
//     }
//     var url = "/course/comment/create";
//     $.ajax({
//       url: url,
//       type: "post",
//       data: {
//         "course_id": course_id,
//         "video_id": video_id,
//         "content": content,
//       },
//       async: false,
//       dataType: 'json',
//       success: function (res) {
//         if (res.code == 300) {
//           openLogin();
//           return false;
//         } else if (res.code == 0) {
//           $('#commentContentId').val('');
//           $('.textarea-wrap .num>em').text('0');
//           $(".sumbit-comment").removeClass('active');
//           layer.msg("评论已提交");
//           return false;
//         } else {
//           layer.msg(res.msg);
//         }
//       }
//     });
//   });

// });