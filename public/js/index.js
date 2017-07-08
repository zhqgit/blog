// window.onload = function() {
// 	var config = {
// 		vx: 4,
// 		vy: 4,
// 		height: 2,
// 		width: 2,
// 		count: 100,
// 		color: '121, 162, 185',
// 		stroke: '100,200,180',
// 		dist: 6000,
// 		e_dist: 20000,
// 		max_conn: 10
// 	}
// 	CanvasParticle(config);
// }

$(function() {
//     var s0 = '以肮脏龌蹉的匠人之手，我必对你们痛加报复！'
//     var s1 = '弱小和无知不是生存的障碍，傲慢才是.';
//     var s2 = '这些残暴的欢愉，终将以残暴结局！';
//     var random = Math.floor(Math.random() * 3);
//     var con = $('#main');
//     var index = 0;

//     var the;
//     if (random === 0) {
//         the = s0;
//     }
//     if (random === 1) {
//         the = s1;
//     }
//     if (random === 2) {
//         the = s2;
//     }
//     var length = the.length;
//     var tId = null;

//     function start() {
//         con.text('');

//         tId = setInterval(function() {
//             con.append(the.charAt(index));
//             if (index++ === length) {
//                 clearInterval(tId);
//                 index = 0;
//                 start()
//             }
//         }, 200);
//     }

//     start();



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
