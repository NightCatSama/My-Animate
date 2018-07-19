;(function($) {
	$(function() {
		var myCanvas = new MyCanvas();

		myCanvas.start();

		$(".main").onepage_scroll({
			sectionContainer: "section", // 插件开关
			easing: "ease-in-out", // 滚动速度曲线 such "ease", "linear", "ease-in","ease-out", "ease-in-out", or s"cubic-bezier(0.175, 0.885, 0.420,1.310)"
			animationTime: 1000, // 每部分滚动时间
			pagination: true, // 显示或隐藏的分页
			updateURL: false, // URL自动更新滚动到的那一页
			beforeMove: function(index) {
				myCanvas.modelSelect(index);
				$('#nav ul li').removeClass('active');
				$('#nav ul li').eq(index - 1).addClass('active');
			}, // 移动前函数
			afterMove: function(index) {
			}, // 移动后函数
			loop: false, // 是否循环滚动
			keyboard: true, // 键盘控制
			responsiveFallback: false, // 你可以回退到正常页面滚动通过定义的浏览器的宽度你想要触发响应回退。例如,设置这个600,无论何时浏览器的宽度小于600会回退。
			direction: "vertical" // "vertical"(垂直) and "horizontal"（水平）
		});

		//  绑定导航条点击事件
		$('#nav').on('click', 'li', function(evt) {
			if (!$(this).hasClass('active')) {
				var index = $(this).index();
				$('.main').moveTo(index + 1);
				$('#nav ul li').removeClass('active');
				$(this).addClass('active');
			}
		});
	});

})(jQuery);