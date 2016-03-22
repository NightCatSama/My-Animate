;
(function(window, document) {

  var WINDOW_WIDTH = document.body.offsetWidth;
  var WINDOW_HEIGHT = document.body.offsetHeight;

  var oldxPos, oldyPos;
  var xPy = 0,
    yPy = 0;
  var xPos, yPos;
  var seaX = 1;
  var interval = 16.7;
  var balls = [];
  var start = null,
    timer = null;
  var addFlag = null;
  var firstTime = true;

  var canvas = document.getElementById('canvas');

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;


  var context = canvas.getContext('2d');

  var Snake = function() {};

  Snake.prototype = {

    //  绘制canvas动画
    render: function(cxt) {
      cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
      this.addBalls();
      this.drawBalls(cxt);
      this.updateBalls(cxt);
    },

    //  画个球
    drawBalls: function(cxt) {

      for (var i = 0; i < balls.length; i++) {
      	balls[i].g = balls[i].g - 0.006;
        cxt.fillStyle = balls[i].color + balls[i].g + ")";
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
      }
    },

    //  加个球
    addBalls: function() {
          var aBall = {
            x: xPos,
            y: yPos,
            cx: xPos-(WINDOW_WIDTH/2),
            cy: yPos-(WINDOW_HEIGHT/2),
            g: 0.5,
            r: 0,
            vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            color:"rgba(255,255,255,"
          };
        balls.push(aBall);
    },

    //  更新球的运动
    updateBalls: function(cxt) {
          for (var i = 0; i < balls.length; i++) {
            balls[i].x += (balls[i].cx)/12;
            balls[i].y += (balls[i].cy)/12;

            balls[i].r += 2;

            if(balls[i].r>=WINDOW_WIDTH/2){
              balls.shift();
            }
          }
      }
  };

  //  Canvas动画入口
  Snake.prototype.start = function() {
    var that = this;
    
    start = setTimeout(function() {
      that.render(context);
      that.calculatePosition();
      setTimeout(arguments.callee, interval);
    }, interval);
  };
  
  var startTime = Date.now();
  var r = 100, T = 1500;

  Snake.prototype.calculatePosition = function() {
    var p = Math.min(1.0, (Date.now() - startTime) / T);
    xPos = -r * Math.sin(2 * Math.PI * p)+WINDOW_WIDTH/2;
    yPos = -r * Math.cos(2 * Math.PI * p)+WINDOW_HEIGHT/2;

    this.addBalls();

    if(p === 1.0) {startTime = Date.now();}
  }

  window['Snake'] = Snake;

})(window, document);