;
(function(window, document) {

  var WINDOW_WIDTH = document.body.offsetWidth;
  var WINDOW_HEIGHT = document.body.offsetHeight;

  var oldxPos, oldyPos;
  var xPy = 0,
    yPy = 0;
  var xPos, yPos;
  var model = 1;
  var Gradient = 0;
  var interval = 16.66;
  var balls = [];
  var colors = ["rgba(46,204,114,", "rgba(52,152,219,", "rgba(231,76,60,", "rgba(253,99,53,", "rgba(253,236,53,", "rgba(102,219,6,", "rgba(6,219,198,", "rgba(3,91,132,", "rgba(155,89,182,", "rgba(230,126,34,"];
  var start = null,
    timer = null;
  var addFlag = false;
  var firstTime = true;

  var canvas = document.getElementById('canvas');

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  var context = canvas.getContext('2d');

  var MyCanvas = function() {};

  MyCanvas.prototype = {

    //  绘制canvas动画
    render: function(cxt) {
      cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

      this.writeName(cxt);
      this.drawBalls(cxt);
      this.updateBalls(cxt);
    },

    //  画个球
    drawBalls: function(cxt) {
      for (var i = 0; i < balls.length; i++) {

        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
      }
    },

    //  加个球
    addBalls: function() {
      var aBall = {};
      switch (model) {
        case 1:
          aBall = {
            x: Math.floor(Math.random() * WINDOW_WIDTH),
            y: Math.floor(Math.random() * WINDOW_HEIGHT),
            g: 0,
            r: Math.floor(Math.random() * 7 + 3),
            vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3))
          };
          aBall.color = colors[Math.floor(Math.random() * colors.length)] + aBall.r * 0.1 + ")";
          break;

        case 2:
        case 4:
          aBall = {
            x: xPos,
            y: yPos,
            g: 0,
            r: Math.floor(Math.random() * 8 + 2),
            vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3)),
            vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 3))
          };
          aBall.color = colors[Math.floor(Math.random() * colors.length)] + aBall.r * 0.1 + ")";
          break;

        case 3:
          aBall = {
            x: xPos,
            y: yPos,
            g: 1.5 + Math.random(),
            r: Math.floor(Math.random() * 8 + 2),
            vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 5)),
            vy: Math.pow(-1, Math.ceil(Math.random() * 2)) * (Math.ceil(Math.random() * 5))
          };
          aBall.color = colors[Math.floor(Math.random() * colors.length)] + aBall.r * 0.1 + ")";
          break;
      }
      balls.push(aBall);
    },

    //  更新球的运动
    updateBalls: function(cxt) {
      switch (model) {

        case 1:
          for (var i = 0; i < balls.length; i++) {
            balls[i].x = balls[i].x - xPy * (balls[i].r * 0.03);
            balls[i].y = balls[i].y - yPy * (balls[i].r * 0.03);
          }
          xPy = 0;
          yPy = 0;
          break;

        case 2:
          for (var i = 0; i < balls.length; i++) {
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;

            if (balls[i].y >= WINDOW_HEIGHT - balls[i].r) {
              balls[i].y = WINDOW_HEIGHT - balls[i].r;
              balls[i].vy = -balls[i].vy * Math.floor(Math.random() * 3 + 7) * 0.1;
            }
            if (balls[i].y <= balls[i].r) {
              balls[i].y = balls[i].r;
              balls[i].vy = -balls[i].vy * Math.floor(Math.random() * 3 + 7) * 0.1;
            }
            if (balls[i].x >= WINDOW_WIDTH - balls[i].r) {
              balls[i].x = WINDOW_WIDTH - balls[i].r;
              balls[i].vx = -balls[i].vx * Math.floor(Math.random() * 3 + 7) * 0.1;
            }
            if (balls[i].x <= balls[i].r) {
              balls[i].x = balls[i].r;
              balls[i].vx = -balls[i].vx * Math.floor(Math.random() * 3 + 7) * 0.1;
            }
          }
          break;

        case 3:
          for (var i = 0; i < balls.length; i++) {
            balls[i].g = Math.random() * 0.5;
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;

            if (yPos > WINDOW_HEIGHT / 2) {
              balls[i].vy += balls[i].g;
            } else {
              balls[i].vy -= balls[i].g;
            }

            if (balls[i].y >= WINDOW_HEIGHT - balls[i].r) {
              balls[i].y = WINDOW_HEIGHT - balls[i].r;
              balls[i].vy = -balls[i].vy * 0.6;
            }
            if (balls[i].y <= balls[i].r) {
              balls[i].y = balls[i].r;
              balls[i].vy = -balls[i].vy * 0.6;
            }
            if (balls[i].x >= WINDOW_WIDTH - balls[i].r) {
              balls[i].x = WINDOW_WIDTH - balls[i].r;
              balls[i].vx = -balls[i].vx * 0.3;
            }
            if (balls[i].x <= balls[i].r) {
              balls[i].x = balls[i].r;
              balls[i].vx = -balls[i].vx * 0.3;
            }
          }
          break;

        case 4:
          for (var i = 0; i < balls.length; i++) {
            balls[i].g = Math.random() * 0.5;
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;

            if (balls[i].y > yPos) {
              balls[i].vy = balls[i].vy * 0.98 - balls[i].g;
            } else {
              balls[i].vy = balls[i].vy * 0.98 + balls[i].g;
            }

            if (balls[i].x > xPos) {
              balls[i].vx = balls[i].vx * 0.98 - balls[i].g;
            } else {
              balls[i].vx = balls[i].vx * 0.98 + balls[i].g;
            }
          }
          break;
      }
    },

    //  写个喵
    writeName : function(cxt) {
      /* 指定渐变区域 */
      var grad = cxt.createLinearGradient(WINDOW_WIDTH / 2 - 600, WINDOW_HEIGHT / 2 - 200, WINDOW_WIDTH / 2 + 600, WINDOW_HEIGHT / 2 + 200);
      /* 指定几个颜色 */
      Gradient += 0.01;
      grad.addColorStop(Gradient % 1, 'rgba(6,219,198,1)');
      grad.addColorStop((Gradient + 0.2) % 1, 'rgba(155,89,182,1)');
      grad.addColorStop((Gradient + 0.4) % 1, 'rgba(52,152,255,1)');
      grad.addColorStop((Gradient + 0.6) % 1, 'rgba(253,99,53,1)');
      grad.addColorStop((Gradient + 0.8) % 1, 'rgba(253,236,53,1)');
      grad.addColorStop((Gradient + 1) % 1, 'rgba(102,219,6,1)');

      var txt = 'NightCAT';
      cxt.font = "oblique 100px Courier New";
      var length = context.measureText(txt);
      cxt.textAlign = "center";
      cxt.fillStyle = grad;
      cxt.fillText(txt, WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);
      cxt.globalCompositeOperation = "destination-over";
    },


  //  Canvas动画入口
  start : function() {
    var that = this;
    for (var i = 0; i < 30; i++) {
      that.addBalls();
    }
    that.modelSelect(1);

    start = setTimeout(function() {
      that.render(context);
      setTimeout(arguments.callee, interval);
    }, interval);
  },

  //  运动模式选择
  modelSelect : function(num) {
    model = num;
    switch (num) {
      case 1:
        context.shadowColor = "rgba(255,255,255,.8)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 20;
        break;
      case 2:
        context.shadowColor = "rgba(0,0,0,.8)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 20;
        break;
      case 3:
        context.shadowColor = "rgba(123,0,253,.8)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 20;
        break;
      case 4:
        context.shadowColor = "rgba(255,255,255,.8)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 20;
        break;
    }
  }
};

  window.onmousemove = function(evt) {
    if (model !== 1 && addFlag) {
      if (firstTime) {
        this.addBalls();
        firstTime = false;
      } else if (!timer) {
        timer = setTimeout(function() {
          clearTimeout(timer);
          timer = null;
          this.addBalls();
        }, 100);
      }
    }

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

  window.onmousedown = function(evt) {
    addFlag = true;
  };
  window.onmouseup = function(evt) {
    addFlag = false;
  };

  window['MyCanvas'] = MyCanvas;
  window['addBalls'] = MyCanvas.prototype.addBalls;

})(window, document);