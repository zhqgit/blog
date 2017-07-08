$(function() {

	//为sidebar按钮绑定点击事件
	var nav = $('.navigation'),
		mask = $('.mask'),
		sidebar = $('#sidebar');

	var navWidth = nav.width();

	function showSideBar() {
		nav.animate({
			right: '0px'
		}, 100);
		mask.fadeIn();
	}


	function hideSideBar() {
		nav.animate({
			right: '-' + navWidth + 'px'
		}, 100);
		mask.fadeOut();
	}
	sidebar.on('click', showSideBar);
	mask.on('click', hideSideBar);



	
});