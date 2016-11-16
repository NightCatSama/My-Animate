var LEVET = 1;

//创建阵营和障碍物
var prots = [];
var enemys = [];
var barriers = [];
var camera;

var P1 = null;

var Game = document.getElementById('Game');
var Battleground = new BG(prots, enemys); //初始化战场 arr[ 阵营, 阵营 ]

function GameStart(){
	setCamera();
	Battleground.start();
	BackgroundState.start();
	EnemyState.start();
	ProtState.start();

	var obj = MapData.prots[0];
	var data;
	if(window.sessionStorage && sessionStorage.prot && sessionStorage.next === 'win'){
		sessionStorage.removeItem('next');
		data = JSON.parse(sessionStorage.prot);
	}
	else {
		data = TankData.prots[obj.type];
		sessionStorage.clear();
	}

	P1 = new Protagonist(obj.x, obj.y, data, prots, enemys);

	MapData.enemys.map(function(obj){
		createEnemy(obj);
	});
}

function createProt(obj){
	return new Protagonist(obj.x, obj.y, TankData.prots[obj.type], prots, enemys);
}

function createEnemy(obj){
	return new Enemy(obj.x, obj.y, TankData.enemys[obj.type], enemys, prots);
}

function GameWin(){
	level++;
	if(window.sessionStorage){
		var obj = {
			"image": P1.imageSrc,
			"sx": P1.initialSx || P1.sx,
			"sy": P1.sy,
			"width": P1.width,
			"height": P1.height,
			"hp": P1.hp,
			"ATK": P1.ATK,
			"speed": P1.speed,
			"ROF": P1.ROF,
			"interval": P1.interval,
			"gunshot": P1.gunshot,
			"shapeChange": P1.shapeChange,
			"maxForm": P1.maxForm,
			"changeGap": P1.changeGap,
			"status": "left/top"
	    }
	    sessionStorage['prot'] = JSON.stringify(obj);
	    sessionStorage['next'] = 'win';
	}
	alert('YOU WIN！');
	window.location.href="/?level=" + level;
}

function GameOver(){
	alert('GameOver!');
	window.location.href = '/home';
}

function setCamera(){
	camera = MapData.camera;
	camera.w = camera.w || document.body.offsetWidth;
	camera.h = camera.h || document.body.offsetHeight;
	Game.style.cssText = "width: " + camera.w + "px; height: " + camera.h + "px; overflow: hidden; position: absolute; left:0; right: 0; top:0; bottom:0; margin: auto; background: #333";
}