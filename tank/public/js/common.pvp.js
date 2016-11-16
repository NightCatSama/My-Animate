var Map_Width = 0;
var Map_Height = 0;

var XHR;
var TankData = {};
var MapData = {};
var EnemysData = [];
var unique_id;
var Game = document.getElementById('Game');
var room = document.body.getAttribute('data-room');
var map = document.body.getAttribute('data-map');

var url = map ? ('diyMap/diy' + map) : 'officialMap/map0';
var socket = io.connect('http://localhost:3000/');

function createXMLHttpRequest(){
  if(window.XMLHttpRequest){
    XHR = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    XHR = new ActiveXObject('Microsoft.XMLHTTP');
  }
  else {
    XHR = null;
  }
}


function ajaxXML(type,url,async, callback){
  createXMLHttpRequest();
  XHR.open("GET", url, async);
  XHR.send(null);
  XHR.onreadystatechange = callback;
}

function getTankData(){
  if(XHR.readyState==4){
    if(XHR.status==200){
      TankData = JSON.parse(XHR.responseText);
      joinRoom();
    }
    else{
      console.log('error load TankData');
    }
  }
}

function getGameData(){
  if(XHR.readyState==4){
    if(XHR.status==200){
      MapData = JSON.parse(JSON.parse(XHR.responseText).data);
      Map_Width = MapData.width;
      Map_Height = MapData.height;
      initMap();
    }
    else{
      alert('没有这个地图呀喂！');
      window.location.href = '/home';
    }
  }
}
ajaxXML('GET', '../Map_Tool/Tank_Map.json', true, getTankData);

function joinRoom(){
  socket.emit('join room', {room:room,map:map});
}

socket.on('ready' + room, function(obj) {
  ajaxXML('GET', './Map/' + url + '.json', true, getGameData);
});

socket.on('start' + room, function(obj) {
  EnemysData = obj;
  startGame();
});

socket.on('exit' + room, function(obj) {
  alert('您的对手离开了游戏；');
});

function completeReady(){
  socket.emit('ready', {
    room: room,
    id: unique_id,
    status: player
  });

  leaveSelected();
  var loading = document.querySelector('.loading');
  loading.style.display = 'block';
}

socket.on('id', function(id) {
  unique_id = id;
})

socket.on('at full strength', function(id) {
  alert('房间已满');
  window.location.href = '/home';
})

function uploadingMine(obj){
  var status = {
          "x": obj.x,
          "y": obj.y,
          "sx": obj.initialSx,
          "sy": obj.sy,
          "dir": obj.dir,
          "fire": obj.fire,
          "hp": obj.hp,
          "ATK": obj.ATK,
          "speed": obj.speed,
          "ROF": obj.ROF,
          "fireCommond": obj.fireCommond,
          "interval": obj.interval
        }
  socket.emit('upload', {
    room: room,
    id: unique_id,
    tank: status
  });
}

socket.on('update' + room, function(obj) {
  if(!E[obj.id]) return false;
  for(var key in obj.obj){
    E[obj.id][key] = obj.obj[key];
  };
});