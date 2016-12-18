$(function(){
    var timer = null;
    var isTop = true;

    $(window).bind('scroll', function() {
        var osTop = $(document).scrollTop();
        if (osTop > 300) {
            // alert('!');
            // $('#back_top').attr('display','block');
            $('#back_top').show();
            // alert(osTop);
        } else {
            $('#back_top').hide();
        }


        if (!isTop) {
            clearInterval(timer);
        }
        isTop = false;
    });


    $('#back_top').bind('click', function() {

        timer = setInterval(function() {
            var osTop = document.body.scrollTop;
            var ispeed = Math.floor(-osTop / 10);
            document.body.scrollTop = osTop + ispeed;

            isTop = true;
            if (osTop == 0) {
                clearInterval(timer);
            }
        }, 30);
    });
})