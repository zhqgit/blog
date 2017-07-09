

$(function() {
    $('.fileupload').change(function(event) {
        //当元素的值发生改变时，会发生 change 事件
        /* Act on the event */
        if ($('.fileupload').val().length) {
            var fileName = $('.fileupload').val();
            var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
            if (extension == '.jpg' || extension == '.png') {
                var data = new FormData();
                data.append('upload', $('#fileToUpload')[0].files[0]);
                $.ajax({
                    url: '/aupload',
                    type: 'POST',
                    data: data,
                    cache: false,
                    contentType: false, //不可缺参数
                    processData: false, //不可缺参数
                    success: function(data) {
                        console.log(data);
                        $('#j_imgPic').attr('src', data);
                    },
                    error: function() {
                        console.log('error');
                    }
                });
            }
        }
    });


    var Img = $('#inputImg');
    var ii = $('#j_imgPic');
    Img.on('click', function() {
        Img.val(ii.attr('src'));
    });

    var options = {
        currentPage: 2,
        totalPages: 5,
        numberOfPages: 5
    }
    $('#page1').bootstrapPaginator(options);

    // $('.wangEditor-menu-shadow').css({'position':'relative'});
})
