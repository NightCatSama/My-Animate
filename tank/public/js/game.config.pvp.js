//创建阵营和障碍物
var prots = [];
var enemys = [];
var P = {};
var E = {};
var barriers = [];
var camera;

var range = false;
var Battleground = new BG(prots, enemys); //初始化战场 arr[ 阵营, 阵营 ]
var map_masking = document.getElementById('map_masking');
var cxt = map_masking.getContext('2d');

function initMap(){
	setCamera();
	BackgroundState.start();
	enterSelected();
}

function startGame(){
	Battleground.start();
	EnemyState.start();
	ProtState.start();
	var loading = document.querySelector('.loading');
  	loading.style.display = 'none';

	P[unique_id] = new Protagonist(player.x,player.y,TankData.prots[player.type], prots, enemys, 'pvp', unique_id);

  	EnemysData.forEach(function(obj, index){
  		if(index === unique_id) return false;
		E[index] = {}
		E[index] = createEnemy(obj, index);
	});
}

function enterSelected(){
	addSelectEvent();
	var wait = document.querySelector('.wait');
  	wait.style.display = 'none';
  	initGroup.style.display = 'block';
  	map_masking.width = camera.w;
    map_masking.height = camera.h;
}

function leaveSelected(){
	removeSelectEvent();
  	initGroup.style.display = 'none';
  	map_masking.style.display = 'none';
  	mouse.style.display = 'none';
}


function createEnemy(obj, id){
	return new Enemy(obj.x, obj.y, TankData.enemys[obj.type], enemys, prots, 'pvp', id, "right/top");
}

function GameWin(){
	alert('YOU WIN!!!');
	window.location.href = '/home';
}

function GameOver(){
	alert('YOU LOST!!!');
	window.location.href = '/home';
}

function setCamera(){
	camera = MapData.camera;
	camera.w = camera.w || document.body.offsetWidth;
	camera.h = camera.h || document.body.offsetHeight;
	Game.style.cssText = "width: " + camera.w + "px; height: " + camera.h + "px; overflow: hidden; position: absolute; left:0; right: 0; top:0; bottom:0; margin: auto; background: #333";
}