var Map_Width = 0;
var Map_Height = 0;

var XHR;
var TankData = {};
var MapData = {};
var Game = document.getElementById('Game');
var level = +document.body.getAttribute('data-level');
var range = +document.body.getAttribute('data-range');
var map = document.body.getAttribute('data-map');

var url = map ? ('diyMap/diy' + map) : 'officialMap/map' + level;

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
      ajaxXML('GET', './Map/' + url + '.json', true, getGameData);
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
      GameStart();
    }
    else{
      alert('没有这个地图呀喂！');
      window.location.href = '/home';
    }
  }
}
ajaxXML('GET', '../Map_Tool/Tank_Map.json', true, getTankData);