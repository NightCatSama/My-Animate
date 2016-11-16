;(function(w, d) {
  var canvas = d.getElementById('background');
  var cxt = canvas.getContext('2d');

  var BackgroundState = {
    start: function(){
      canvas.width = Map_Width;
      canvas.height = Map_Height;
      BackgroundState.renderBg();
    },
    renderBg: function(){
      var image = new Image();
      image.onload = function () {
        var ptrn = cxt.createPattern(image, 'repeat');
        cxt.fillStyle = ptrn;
        cxt.fillRect(0, 0, Map_Width, Map_Height);

        barriers = BackgroundState.renderBarrier();
      }
      image.src = TankData.scene[MapData.scene].image;
    },
    renderBarrier: function(){
      var barrs = [];
      var arr = barriers.length ? barriers : MapData.barriers;
      arr.forEach(function(barr){
        var data = TankData.barriers[barr.type];
        var image = new Image();
        var src = data.image;
        if(barr.hp <= 0) return false;
        image.onload = function () {
          cxt.drawImage(image, data.sx, data.sy, data.width, data.height, barr.x, barr.y, data.width, data.height);
        }
        image.src = src;
        barrs.push({
          x: barr.x,
          y: barr.y,
          width: data.width,
          height: data.height,
          type: barr.type,
          hp: data.hp
        })
      })

      return barrs;
    }
  }

  w['BackgroundState'] = BackgroundState;
})(window, document);