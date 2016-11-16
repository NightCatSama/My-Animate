var terrs = document.querySelector('.terr_group');
var switchBtn = document.querySelector('.switch-btn');
var initGroup = document.querySelector('.init-group');
var mouse = document.getElementById('mouse');
var confirmBtn = document.querySelector('.confirm-btn');
var player = {}

switchBtn.onclick = function(){
	initGroup.classList.toggle('off');
}

var map_masking = document.getElementById('map_masking');
var cxt = map_masking.getContext('2d');

confirmBtn.onclick = function(){
	if(!player.x){
		alert('请选择出生地');
		return false;
	}
	completeReady();
}

function addSelectEvent(){
	terrs.addEventListener('click', terrsOnclick);
	Game.addEventListener('click', GameOnclick);
	Game.addEventListener('mouseenter', GameOnmouseenter);
	Game.addEventListener('mousemove', GamOnmousemove);
	Game.addEventListener('mouseleave', GameOnmouseleave);
}

function removeSelectEvent(){
	terrs.removeEventListener('click', terrsOnclick);
	Game.removeEventListener('click', GameOnclick);
	Game.removeEventListener('mouseenter', GameOnmouseenter);
	Game.removeEventListener('mousemove', GamOnmousemove);
	Game.removeEventListener('mouseleave', GameOnmouseleave);
}

function terrsOnclick(evt){
	var el = evt.target;
	if(el.tagName !== 'SPAN' || el.classList.contains('select')) return false;
	var curEl = document.querySelector('.select');
	curEl.classList.remove('select');
	mouse.className = el.className;
	el.classList.add('select');
}

function GameOnmouseenter(){
	mouse.classList.add('show');
}

function GamOnmousemove(evt){
	var x = evt.pageX;
	var y = evt.pageY;
	var oLeft = Game.offsetLeft;
	var oTop = Game.offsetTop;

	mouse.style.cssText = 'left: ' + (x - oLeft + 2) + 'px; top: ' + (y - oTop + 2) +'px;';
	mouse.setAttribute('data-coord', (x - oLeft) + ', ' + (y - oTop))
}

function GameOnmouseleave(){
	mouse.classList.remove('show');
}

function GameOnclick(evt){
	var x = evt.offsetX;
	var y = evt.offsetY;
	var selected = document.querySelector('.select');
	var src = window.getComputedStyle(selected, null)['background-image'].match(/img.*png/)[0];
	var pArr =  window.getComputedStyle(selected, null)['background-position'].match(/\d+/g);
	var px = pArr[0];
	var py = pArr[1];
	var width = selected.offsetWidth;
	var height = selected.offsetHeight;
	var type = selected.className.split(' ')[0];
	player = {
		x: x,
		y: y,
		type: type
	};
	var image = new Image();
    image.src = src;
    image.onload = function () {
      cxt.clearRect(0, 0, map_masking.width, map_masking.height);
      cxt.drawImage(image, px, py, width, height, x, y, width, height);
    }
}
