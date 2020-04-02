   // 入群交流点击弹框
   $('.js-course-group').on('click', function () {
       layer.open({
           type: 1,
           area: '900px',
           //maxmin: true,
           title: false,
           closeBtn: 2,
           zIndex: layer.zIndex, //重点1
           shadeClose: true,
           skin: 'my-close-skin',
           content: $('#dialogGroup'),
           success: function (layero) {
               //layer.setTop(layero); //重点2
           }
       });
   });
   $('.js-start-stu,.js-enter-gp').on('click', function () {
       layer.closeAll();
   });