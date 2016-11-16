var express = require('express');
var fs = require('fs');
var url = require("url");
var queryString = require("querystring");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var queryUrl = url.parse(req.url).query;
  var data = queryString.parse(queryUrl);
  res.render('index', { level : data.level || 1, range : data.range || 0, map : data.map || ''});
});

router.get('/home', function(req, res, next) {
  res.render('home');
});


router.get('/build', function(req, res, next) {
  res.render('build_map');
});

router.get('/pvp', function(req, res, next) {
  var queryUrl = url.parse(req.url).query;
  var data = queryString.parse(queryUrl);
  res.render('pvp', {map : data.map || '', room : data.room});
});

router.post('/create_map', function(req, res) {
  var data = req.body;
  createMap(data);
  res.end('yeah');
});

function createMap(data){
	var mapName = data.mapName;
	data = JSON.stringify(data);
	fs.writeFile('./public/Map/diyMap/diy' + mapName + '.json', data, {flag: 'w+'}, function (err) {
	   if(err) {
	    console.error(err);
	    } else {
	       console.log('写入成功');
	    }
	});
}

module.exports = router;
