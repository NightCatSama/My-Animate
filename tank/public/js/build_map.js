var width,height;
var curType = '';
var curImg = {};
var obj = {};
obj.camera = {};
obj.barriers = [];
obj.prots = [];
obj.enemys = [];
obj.buffs = [];

var map = document.getElementById('map');
var map_masking = document.getElementById('map_masking');
var cxt = map.getContext('2d');
var masking = map_masking.getContext('2d');

function resetMap(){
	curImg = {};
	var w = $('#width').val();
	var h = $('#height').val();
	map.width = w;
	map.height = h;
	map_masking.width = w;
	map_masking.height = h;

	setSecen($('#bg').val());
}

$('#bg').change(function(){
	var bg = $(this).val();

	setSecen(bg);
})

function cteateMap(){
	obj.camera = {
		x: +$('#camera_x').val() || 0,
		y: +$('#camera_y').val() || 0,
		w: +$('#camera_width').val() || 0,
		h: +$('#camera_height').val() || 0,
	}
	obj.scene = $('#bg').val();
	obj.width = map.width;
	obj.height = map.height;
	update();
	var data = JSON.stringify(obj);
	var name = $('#level').val();
	$.ajax({
		type: 'POST',
		url: '/create_map',
		data: {
			"data": data,
			"mapName": name || ''
		},
		success: function(data){
			alert('生成成功！你的地图名为' + name);
			window.location.reload();
		}
	})
}
$('.switch-btn').on('click', function(){
	$('.setting_group').toggleClass('off');
})

$('.terr_group').on('click', 'span', function(evt){
	if($(this).hasClass('select')){
		curType = '';
		$('#mouse').attr('class', '');
	}
	else {
		var className = $(this).attr('class');
		curType = $(this).attr('role');
		$('.setting_group').addClass('off');
		$('#mouse').attr('class', className);
	}
	$(this).toggleClass('select');
	$(this).siblings().removeClass('select');
})

$(map_masking).click(function(evt){
	if(curType === '')return ;
	var x = evt.offsetX;
	var y = evt.offsetY;
	if(curImg && curImg.image) {
		cxt.drawImage(curImg.image, curImg.px, curImg.py, curImg.width, curImg.height, curImg.x, curImg.y, curImg.width, curImg.height);
		update();
	}
	var src = $('.select').css('background-image').match(/img.*png/)[0];
	var pArr =  $('.select').css('background-position').match(/\d+/g);
	var px = pArr[0];
	var py = pArr[1];
	var width = $('.select').width();
	var height = $('.select').height();
	var type = $('#mouse').attr('class');
	curImg = {
		px: +px,
		py: +py,
		x: x,
		y: y,
		width: width,
		height: height,
		type: type,
		kind: curType
	};
	curImg.image = new Image();
    curImg.image.src = src;
    curImg.image.onload = function () {
      masking.clearRect(0, 0, map.width, map.height);
      masking.drawImage(curImg.image, px, py, width, height, x, y, width, height);
    }
})

function update(){
	var data = {
		x: curImg.x,
		y: curImg.y,
		type: curImg.type
	};
	obj[curImg.kind] || (obj[curImg.kind] = []);
	obj[curImg.kind].push(data);
}

function repeal(){
	masking.clearRect(0, 0, map.width, map.height);
	curImg = {};
}

map_masking.onmouseenter = function(){
	$('#mouse').css('display', 'block');
}

map_masking.onmousemove = function(evt){
	var x = evt.pageX;
	var y = evt.pageY;

	var map_coord = $(map).offset();
	$('#mouse').css({
		left: evt.pageX + 1 + 'px',
		top: evt.pageY + 1 +'px'
	}).attr('data-coord', Math.round(x-map_coord.left) + ', ' + Math.round(y-map_coord.top));
}

map_masking.onmouseleave = function(){
	$('#mouse').css('display', 'none');
}

$(function(){
  setSecen('grass');
})

function setSecen(type){
   var image = new Image();
  image.src = 'img/' + type + '.png';

  image.onload = function () {
    var ptrn = cxt.createPattern(image, 'repeat');
    cxt.fillStyle = ptrn;
    cxt.fillRect(0, 0, map.width, map.height);
  }
}