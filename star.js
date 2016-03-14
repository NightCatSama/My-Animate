;
(function(window, document) {

  var WINDOW_WIDTH = document.body.offsetWidth;
  var WINDOW_HEIGHT = document.body.offsetHeight;

  var oldxPos, oldyPos;
  var xPy = 0,
    yPy = 0;
  var xPos, yPos;
  var Gradient = 0;
  var interval = 16.66;
  var balls = [];
  var start = null,
    timer = null;
  var addFlag = false;
  var firstTime = true;

  var canvas = document.getElementById('canvas');

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;


  var context = canvas.getContext('2d');

  context.shadowColor = "rgba(255,255,255,1)";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 3;

  var Star = function() {};

  Star.prototype = {

    //  绘制canvas动画
    render: function(cxt) {
      cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

      this.drawBalls(cxt);
      this.updateBalls(cxt);
    },

    //  画个球
    drawBalls: function(cxt) {
      for (var i = 0; i < balls.length; i++) {

        cxt.fillStyle = "rgb(255,255,255)";
        if(balls[i].light){
          context.shadowBlur = 10;
        }
        else {
          context.shadowBlur = 3;
        }

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
      }
    },

    //  加个球
    addBalls: function() {
          var aBall = {
            x: Math.floor(Math.random() * WINDOW_WIDTH),
            y: Math.floor(Math.random() * WINDOW_HEIGHT),
            g: 0,
            r: Math.floor(Math.random()*35)/10,
            vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            light: false
          };
        balls.push(aBall);
    },

    //  更新球的运动
    updateBalls: function(cxt) {
          for (var i = 0; i < balls.length; i++) {
            balls[i].x = balls[i].x - xPy * (balls[i].r * 0.03);
            balls[i].y = balls[i].y - yPy * (balls[i].r * 0.03);

            if(Math.abs(balls[i].x - xPos) < 300 && Math.abs(balls[i].y - yPos) < 300){
              balls[i].light = true;
            }
            else {
              balls[i].light = false;
            }
          }
          xPy = 0;
          yPy = 0;
    }
  };

  //  Canvas动画入口
  Star.prototype.start = function() {
    var that = this;
    for (var i = 0; i < 100; i++) {
      that.addBalls();
    }

    start = setTimeout(function() {
      that.render(context);
      setTimeout(arguments.callee, interval);
    }, interval);
  };

  window.onmousemove = function(evt) {
    evt = evt || window.event;
    if (evt.pageX) {
      xPos = evt.pageX;
      yPos = evt.pageY;
    } else {
      xPos = evt.clientX + document.body.scrollLeft - document.body.clientLeft;
      yPos = evt.clientY + document.body.scrollTop - document.body.clientTop;
    }
    if (firstTime) {
      oldxPos = xPos;
      oldyPos = yPos;
      firstTime = false;
    }
    xPy = xPos - oldxPos;
    yPy = yPos - oldyPos;
    oldxPos = xPos;
    oldyPos = yPos;
  };

  window.onmouseout = function(evt) {
    xPy = 0;
    yPy = 0;
  };

  window['Star'] = Star;
  window['addBalls'] = Star.prototype.addBalls;

})(window, document);