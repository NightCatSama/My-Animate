;(function(w, d, undefined) {
  var protagonist = d.getElementById('protagonist');
  var canvasWidth = 0;
  var canvasHeight = 0;

  var cxt = protagonist.getContext('2d');

  var Protagonist = function(x, y, config, prots, target, mode, id) {
    this.gameSign = null,
      this.moveSign = null,
      this.x = x,
      this.y = y,
      this.target = target,
      this.sx = config.sx || 0,
      this.sy = config.sy || 0,
      this.imageSrc = config.image,
      this.hp = config.hp || config.x,
      this.gunshot = config.gunshot || 300,
      this.width = config.width,
      this.height = config.height,
      this.speed = config.speed || 1,
      this.ROF = config.ROF || 2,
      this.ATK = config.ATK || 1,
      this.maxForm = config.maxForm || 1,
      this.interval = config.interval || 1000,
      this.barrierList = [],
      this.timer = null,
      this.shapeChange = config.shapeChange || false,
      this.changeGap = config.changeGap || 32,
      this.mode = mode,
      this.fireCommond = true,
      this.fire = false,
      this.mx = 0,
      this.my = 0,
      this.dir = 0;

    if (config.status) {
      this.status = new StatusBar(config.status, config.name);
    }

    if (config.shapeChange) {
      this.initialSx = this.sx;
      this.sx += config.changeGap * ((this.hp > this.maxForm ? this.maxForm : this.hp) - 1);
    }

    this.init();
    this.changePlace = this.changePlace.bind(this);
    this.stopChange = this.stopChange.bind(this);
    this.shoot = this.shoot.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
  };

  Protagonist.prototype = {
    init: function() {
      var that = this;
      this.status && this.status.setStatus(that);
      that.image = new Image();
      that.image.src = that.imageSrc;
      that.image.onload = function() {
        cxt.drawImage(that.image, that.sx, that.sy, that.width, that.height, that.x, that.y, that.width, that.height);

        that.start();
        that.number = prots.length;
        prots.push(that);
      }
    },
    render: function() {
      this.drawTK();
      this.shoot();
      if (this.mode === 'pvp') uploadingMine(this);
    },
    start: function() {
      var that = this;
      //绑定事件
      w.addEventListener('keydown', that.changePlace);
      w.addEventListener('keyup', that.stopChange);
      Game.addEventListener('mousedown', function() {
        that.fire = true;
      });
      d.addEventListener('mouseup', function() {
        that.fire = false;
      });
      Game.addEventListener('mousemove', that.changeDirection);
      d.addEventListener('mouseout', function() {
        that.fire = false;
      });
    },
    stop: function() {
      var that = this;
      w.removeEventListener('keydown', that.changePlace);
      w.removeEventListener('keyup', that.stopChange);
      Game.removeEventListener('mousedown', that.changeDirection);
      d.removeEventListener('mouseup', that.changeDirection);
      Game.removeEventListener('mousemove', that.changeDirection);
      d.removeEventListener('mouseout', function() {
        that.fire = false;
      });
    },
    drawTK: function(evt) {
      var tkx = this.x + this.width / 2;
      var tky = this.y + this.height / 2;
      var old = this.dir;
      cxt.save();
      this.dir = (Math.atan2(this.my - tky, this.mx - tkx)) + Math.PI / 2;
      cxt.translate(tkx, tky);
      cxt.rotate(this.dir);
      cxt.drawImage(this.image, this.sx, this.sy, this.width, this.height, -1 * this.width / 2, -1 * this.height / 2, this.width, this.height);
      cxt.restore();
    },
    destroy: function() {
      var i = prots.indexOf(this);
      if (i < 0) return false;
      this.stop();
      this.stopChange();
      prots.splice(i, 1);
      Battleground.judgeGame();
    },
    boom: function() {
      var that = this;
      var step = 0;
      that.image.src = 'img/Boom.png';
      cxt.drawImage(that.image, 0, 0, 64, 64, that.x, that.y, 32, 32);
      var boomSteps = function() {
        if (step === 5) return that.destroy();
        cxt.drawImage(that.image, step * 64, 0, 64, 64, that.x, that.y, 32, 32);
        step++;
        (window.requestAnimationFrame && requestAnimationFrame(arguments.callee)) || setTimeout(arguments.callee, 200);
      }
      that.image.onload = function() {
        boomSteps();
      }
    },
    wound: function(ATK) {
      this.hp -= ATK || 1;
      this.status.setHp(this.hp);
      if (this.hp <= 0) {
        this.boom();
      } else if (this.shapeChange && this.hp < this.maxForm) {
        this.sx -= this.changeGap;
      }
    },
    changePlace: function(evt) {
      var that = this,
        a = 0;
      evt.preventDefault();

      if (this.moveSign) {
        return false;
      }
      this.moveSign = setInterval(function() {
        var prevState = {};
        prevState.x = that.x;
        prevState.y = that.y;
        if (Math.abs((that.x + that.width / 2) - that.mx) <= 1) {
          clearInterval(that.moveSign);
          that.moveSign = null;
          return false
        }

        switch (evt.keyCode) {
          case 87:
            {
              a = 1;
              break;
            }
          case 83:
            {
              a = -1;
              break;
            }
          default:
            {
              return that.stopChange();
            }
        }
        var pyX = a * that.speed * Math.cos(that.dir - Math.PI / 2);
        var pyY = a * that.speed * Math.sin(that.dir - Math.PI / 2);
        that.x += pyX;
        that.y += pyY;
        var bool = that.isPass(prevState);
        if (bool && ((that.x < (camera.x + 300) && pyX < 0) || (that.x > (camera.x + camera.w - 300) && pyX > 0) || (that.y < (camera.y + 300) && pyY < 0) || (that.y > (camera.y + camera.h - 300) && pyY > 0))) {
          camera.x += pyX;
          camera.y += pyY;
          that.mx += pyX;
          that.my += pyY;
          Battleground.setScreen();
        }
      }, 16);
    },
    stopChange: function() {
      clearInterval(this.moveSign);
      this.moveSign = null;
    },
    changeDirection: function(evt) {
      if (evt.target.id === 'Game') return false;
      this.mx = evt.offsetX;
      this.my = evt.offsetY;
    },
    isPass: function(prev) {
      var bool = true;
      if ((this.x + this.width) > canvasWidth || (this.y + this.height) > canvasHeight || this.x < 0 || this.y < 0) {
        bool = false;
      }
      bool = bool && this.detection();
      if (!bool) {
        //状态回滚
        this.x = prev.x;
        this.y = prev.y;
      }
      return bool;
    },
    detection: function() {
      var that = this;
      var bool = !this.target.some(that.isCollision.bind(that)) && !barriers.some(that.isCollision.bind(that));
      return bool;
    },
    isCollision: function(barrier) {
      var coreX = this.x + this.width / 2;
      var coreY = this.y + this.height / 2;
      var barrierX = barrier.x + barrier.width / 2;
      var barrierY = barrier.y + barrier.height / 2;

      var dx = Math.abs(coreX - barrierX);
      var dy = Math.abs(coreY - barrierY);
      var d = Math.sqrt(Math.pow((coreX - barrierX), 2) + Math.pow((coreY - barrierY), 2));
      if (dx < (this.width / 2 + barrier.width / 2) && dy < (this.height / 2 + barrier.height / 2) && d < (this.height / 2 + barrier.height / 2)) {
        return true;
      }
      return false;
    },
    shoot: function() {
      var that = this;
      if (!that.fire) return;
      if (that.timer) {
        return false;
      }
      Battleground.addBullets(that, that.target);
      that.timer = setTimeout(function() {
        clearTimeout(that.timer);
        that.timer = null;
      }, that.interval);
    },
    beSuspend: function() {
      var that = this;
      this.fireCommond = false;
      that.stop();
      suspendTimer = setTimeout(function() {
        that.start();
        that.fireCommond = true;
      }, 3000);
    },
    addBuff: function(type) {
      this.gunshot += 20;
      switch (type) {
        case 'incrATK':
          {
            this.ATK++;
            this.status.setATK(this.ATK);
            break;
          }
        case 'incrHp':
          {
            this.hp++;
            if (this.shapeChange && this.hp <= this.maxForm) {
              this.sx = this.changeGap * (this.hp - 1);
            }
            this.status.setHp(this.hp);
            break;
          }
        case 'incrROF':
          {
            var num;
            if (this.ROF >= 8) num = 'max';
            else num = this.ROF += 1.5
            this.status.setROF(num);
            break;
          }
        case 'incrSpeed':
          {
            var num;
            if (this.speed >= 5) num = 'max';
            else num = this.speed += 0.3
            this.status.setSpeed(num);
            break;
          }
        case 'reduceInter':
          {
            var num;
            if (this.interval <= 300) num = 'max';
            else num = this.interval -= 50;
            this.status.setInter(num);
            break;
          }
        case 'suspendEnemys':
          {
            EnemyState.suspendEnemys();
            break;
          }
      }
    }
  }
  var ProtState = {
    gameSign: null,
    start: function() {
      canvasWidth = protagonist.width = Map_Width;
      canvasHeight = protagonist.height = Map_Height;
      ProtState.gameSign = true;
      (function() {
        if (!ProtState.gameSign) return false;
        cxt.clearRect(0, 0, canvasWidth, canvasHeight);
        ProtState.render();
        (window.requestAnimationFrame && requestAnimationFrame(arguments.callee)) || setTimeout(arguments.callee, 16);
      })();
    },
    stop: function() {
      clearTimeout(ProtState.gameSign);
      ProtState.gameSign = false;
      cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    render: function() {
      prots.forEach(function(obj) {
        obj.render();
      })
    },
    suspendEnemys: function() {
      prots.forEach(function(obj) {
        obj.beSuspend();
      })
    }
  }

  w['Protagonist'] = Protagonist;
  w['ProtState'] = ProtState;

})(window, document);