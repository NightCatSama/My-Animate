;(function(w, d, undefined) {
  var battleground = d.getElementById('battleground');
  var canvasWidth = 0;
  var canvasHeight = 0;

  var cxt = battleground.getContext('2d');

  var Battleground = function(prots, enemys) {
    this.gameSign = false,
    this.prots = prots,
    this.enemys = enemys,
    this.bullets = [],
    this.buffs = [];
  };

  Battleground.prototype = {
    start: function(){
      var that = this;
      this.setScreen();
      this.setBuffs();
      canvasWidth = battleground.width = Map_Width;
      canvasHeight = battleground.height = Map_Height;
      this.gameSign = true;
      (function() {
        if(!that.gameSign) return false;
        cxt.clearRect(0, 0, canvasWidth, canvasHeight);
        that.render();
        (window.requestAnimationFrame && requestAnimationFrame(arguments.callee)) || setTimeout(arguments.callee, 16);
      })();
    },
    stop: function(){
      this.gameSign = false;
      // cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    render: function(){
      this.renderBullets();
      this.updateBullets();
      this.renderBuffs();
      this.updateBuffs();
    },
    judgeGame: function(){
      if(this.prots.length === 0){
        GameOver();
      }
      if(this.enemys.length === 0){
        GameWin();
      }
    },
    addBullets: function(obj, target){
      var x1 = obj.x + obj.width / 2;
      var y1 = obj.y;
      var x2 = obj.x + obj.width / 2;
      var y2 = obj.y + obj.height / 2;
      var X = x2 + (x1 - x2) * Math.cos(obj.dir) - (y1-y2) * Math.sin(obj.dir);
      var Y = y2 + (x1 - x2) * Math.sin(obj.dir) + (y1-y2) * Math.cos(obj.dir);
      var aBullet = {};
      aBullet = {
        target: target,
        x: X,
        y: Y,
        r: 1.5 + obj.ATK * 0.2,
        d: 0,
        ATK: obj.ATK,
        gunshot: obj.gunshot,
        vx: obj.ROF * Math.cos(obj.dir - Math.PI / 2),
        vy: obj.ROF * Math.sin(obj.dir - Math.PI / 2)
      };
      aBullet.color = 'rgba(255,255,255,1)';
      this.bullets.push(aBullet);
    },
    renderBullets: function(){
      cxt.save();
      for (var i = 0; i < this.bullets.length; i++) {
        cxt.fillStyle = this.bullets[i].color;

        cxt.beginPath();
        cxt.arc(this.bullets[i].x, this.bullets[i].y, this.bullets[i].r, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();
      }
      cxt.restore();
    },
    updateBullets: function() {
      var that = this;
      for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].x += this.bullets[i].vx;
        this.bullets[i].y += this.bullets[i].vy;
        this.bullets[i].d += Math.sqrt(Math.pow((this.bullets[i].vx - 0), 2) + Math.pow((this.bullets[i].vy - 0), 2));
        if(this.bullets[i].d >= this.bullets[i].gunshot){
          this.bullets.splice(i, 1);
          return false;
        }
        var barr = barriers.filter(that.isCollision.bind(that.bullets[i]))[0];
        if(barr){
          barr.hp -= that.bullets[i].ATK;
          this.bullets.splice(i, 1);
          if(barr.hp <= 0) BackgroundState.renderBg();
          return false;
        }
        var bool = this.bullets[i].target.some(function(obj){
          var coreX = obj.x + obj.width / 2;
          var coreY = obj.y + obj.height / 2;
          var bx = that.bullets[i].x;
          var by = that.bullets[i].y;
          var d = Math.sqrt(Math.pow((coreX - bx), 2) + Math.pow((coreY - by), 2));
          if(d < (obj.height / 2 + that.bullets[i].r)){
            obj.wound(that.bullets[i].ATK);
            that.bullets.splice(i, 1);
            return true;
          }
        })
      }
    },
    isCollision: function(barrier){
      var w, h;
      if(this.r){
        h = w = this.r;
      }
      else {
        w = this.width;
        h = this.height;
      }
      var coreX = this.x + w / 2;
      var coreY = this.y + h / 2;
      var barrierX = barrier.x + barrier.width / 2;
      var barrierY = barrier.y + barrier.height / 2;

      var dx = Math.abs(coreX - barrierX);
      var dy = Math.abs(coreY - barrierY);
      var d = Math.sqrt(Math.pow((coreX - barrierX), 2) + Math.pow((coreY - barrierY), 2));
      if(dx < (w / 2 + barrier.width / 2) && dy < (h / 2 + barrier.height / 2) && d < (h / 2 + barrier.height / 2) ){
        return true;
      }
      return false;
    },
    setBuffs: function(){
      var that = this;
      MapData.buffs.forEach(function(buff){
        that.appearBuff(buff.type, buff.x, buff.y)
      })
    },
    setScreen: function(){
      var canvass = document.querySelectorAll('canvas');
      Array.prototype.forEach.call(canvass, function(dom){
        dom.style.transform = 'translate(' + (-1 * camera.x) + 'px, ' + (-1 * camera.y) + 'px)';
      });
    },
    appearBuff: function(buffType, x, y){
      var that = this;
      var buffDatas = TankData.buffs;
      var buffKeyArr = Object.keys(buffDatas);
      var type = buffType || buffKeyArr[Math.floor(Math.random()*buffKeyArr.length)];
      var buff = buffDatas[type];
      var buffX = x || Math.round(Math.random()*((camera.w > Map_Width ? Map_Width : camera.w) - 32)) + camera.x;
      var buffY = y || Math.round(Math.random()*((camera.h > Map_Height ? Map_Height : camera.h) -32)) + camera.y;
      var aBuff = {};
      var img = new Image();
      img.src = buff.image;
      aBuff = {
        image: img,
        sx: buff.sx,
        sy: buff.sy,
        width: buff.width,
        height: buff.height,
        type: type,
        t: new Date(),
        time: 10000,
        x: buffX < 0 ? 0 : buffX,
        y: buffY < 0 ? 0 : buffY
      };
      img.onload = function(){
        that.buffs.push(aBuff);
      }
    },
    renderBuffs: function(){
      for (var i = 0; i < this.buffs.length; i++) {
        cxt.drawImage(this.buffs[i].image, this.buffs[i].sx ,this.buffs[i].sy ,this.buffs[i].width, this.buffs[i].height, this.buffs[i].x, this.buffs[i].y, this.buffs[i].width, this.buffs[i].height);
      }
    },
    updateBuffs: function(){
      var that = this;
      var nowTime = new Date();
      for (var i = 0; i < this.buffs.length; i++) {
        if(nowTime - this.buffs[i].t >= this.buffs[i].time){
          this.buffs.splice(i, 1);
          return false;
        }
        var prot = prots.filter(that.isCollision.bind(that.buffs[i]))[0];
        if(prot){
          prot.addBuff(that.buffs[i].type);
          this.buffs.splice(i, 1);
        }
        var enemy = enemys.filter(that.isCollision.bind(that.buffs[i]))[0];
        if(enemy){
          enemy.addBuff(that.buffs[i].type);
          this.buffs.splice(i, 1);
        }
      }
    }
  }

  w['BG'] = Battleground;

})(window, document);