;(function(w, d, undefined) {
  var enemy = d.getElementById('enemy');
  var canvasWidth = 0;
  var canvasHeight = 0;

  var cxt = enemy.getContext('2d');

  var Enemy = function(x, y, config, enemy, target, moveMode, id, position) {
    this.moveSign = null,
    this.changeDirSign = null,
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
    this.interval = config.interval || 1000,
    this.rangeStyle = 'rgba(0,170,70,.126)',
    this.maxForm = config.maxForm || 1,
    this.timer = null,
    this.number = 0,
    this.aim = {},
    this.buff = config.buff || false,
    this.shapeChange = config.shapeChange || false,
    this.changeGap = config.changeGap || 32,
    this.fireCommond = true,
    this.moveMode = moveMode || 'random',
    this.fire = false,
    this.id = id,
    this.dir = 0;

    if(config.shapeChange){
      this.sx += config.changeGap * ((this.hp > this.maxForm ? this.maxForm : this.hp) - 1);
    }
    if(position || config.status){
      this.status = new StatusBar(position || config.status);
    }

    this.init();
  };

  Enemy.prototype = {
    init: function(){
      var that = this;
      this.status && this.status.setStatus(that);
      that.image = new Image();
      that.image.src = that.imageSrc;
      that.image.onload = function () {
        cxt.drawImage(that.image,that.sx ,that.sy, that.width, that.height, that.x, that.y, that.width, that.height);

        that.number = enemys.length;
        enemys.push(that);
      }
    },
    render: function(){
      this.drawTK();
      this.shoot();
      if(range) this.drawAttackRange();
      if(this.moveMode !== 'pvp') {
        this.isInRange();
      }
    },
    drawAttackRange: function(){
      cxt.fillStyle = this.rangeStyle;

      cxt.beginPath();
      cxt.arc(this.x + this.width / 2, this.y + this.height / 2, this.gunshot + this.width / 2, 0, 2 * Math.PI, true);
      cxt.closePath();

      cxt.fill();
    },
    changePlace: function(evt){
      var that = this;
      var prevState = {};
      prevState.x = that.x;
      prevState.y = that.y;
      that.x = that.x + that.speed * Math.cos(that.dir - Math.PI / 2);
      that.y = that.y + that.speed * Math.sin(that.dir - Math.PI / 2);
      var bool = that.isPass(prevState);
    },
    stopChange: function(){
      clearInterval(this.moveSign);
      this.moveSign = null;
    },
    drawTK: function(x, y){
      var mx,my,tkx,tky,that = this;
      tkx = this.x + this.width / 2;
      tky = this.y + this.height / 2;
      if(this.moveMode === 'random'){
        if(!this.changeDirSign){
          var timerInterval = Math.floor(Math.random() * 3 + 0) * 1000;
          this.changeDirSign = setTimeout(function(){
            that.dir = (Math.random() * Math.PI * 2);
            that.changeDirSign = null;
          },timerInterval);
        }
      }
      else if(this.moveMode === 'attack'){
        this.aim = this.target[0] || this.aim;
        mx = this.aim.x + this.aim.width / 2;
        my = this.aim.y + this.aim.height / 2;
        this.dir = (Math.atan2(my-tky,mx-tkx)) + Math.PI / 2;
      } else if(this.moveMode === 'pvp'){

      }
      cxt.save();
      cxt.translate(tkx,tky);
      cxt.rotate(this.dir);
      cxt.drawImage(this.image,this.sx ,this.sy, this.width, this.height, -1*this.width/2, -1*this.height/2, this.width, this.height);
      cxt.restore();
    },
    destroy: function(){
      var i = enemys.indexOf(this);
      if( i < 0 ) return false;
      this.buff && Battleground.appearBuff();
      this.status && this.status.destroy();
      enemys.splice(i, 1);
      Battleground.judgeGame();
    },
    boom: function(){
      var that = this;
      var step = 0;
      that.image.src = 'img/Boom.png';
      cxt.drawImage(that.image, 0,0,64,64,that.x, that.y,32,32);
      var boomSteps = function(){
        if(step === 5) return that.destroy();
        cxt.drawImage(that.image, step * 64,0,64,64,that.x, that.y,32,32);
        step++;
        (window.requestAnimationFrame && requestAnimationFrame(arguments.callee)) || setTimeout(arguments.callee, 200);
      }
      that.image.onload = function () {
        boomSteps();
      }
    },
    wound: function(ATK){
      this.hp -= ATK || 1;
      this.status && this.status.setHp(this.hp);
      if(this.hp <= 0){
        this.boom();
      }
      else if(this.shapeChange && this.hp < this.maxForm){
        this.sx -= this.changeGap;
      }
    },
    isInRange: function(){
      if(this.target.length === 0) return false;
      var that = this;
      var mx = this.target[0].x + this.target[0].width / 2;
      var my = this.target[0].y + this.target[0].height / 2;
      var tkx = this.x + this.width / 2;
      var tky = this.y + this.height / 2;

      var d = Math.sqrt(Math.pow((tkx - mx), 2) + Math.pow((tky - my), 2));
      this.fireCommond && that.changePlace();
      if(d < that. gunshot + that.width / 2 && this.fireCommond){
        that.moveMode = 'attack';
        that.rangeStyle = "rgba(255,0,0,.06)";
        that.fire = true;
      }
      else {
        this.fire = false;
        this.moveMode = 'random';
        this.rangeStyle = this.rangeStyle = 'rgba(0,170,70,.126)';
      }
    },
    shoot: function(){
      var that = this;

      if(that.timer || !this.fire){
          return false;
      }
      Battleground.addBullets(that, that.target);
      that.timer = setTimeout(function(){
        clearTimeout(that.timer);
        that.timer = null;
      },that.interval);
    },
    isPass: function(prev){
      var bool = true;
      if((this.x + this.width) > canvasWidth || (this.y + this.height) > canvasHeight || this.x < 0 || this.y < 0){
        this.x = prev.x;
        this.y = prev.y;
        return  false;
      }
      bool = this.detection();
      if(!bool){
        this.x = prev.x;
        this.y = prev.y;
      }
      return bool;
    },
    detection: function(){
      var that = this;
      var i = enemys.indexOf(that);
      var otherEnemys = enemys.slice(0);
      otherEnemys.splice(i, 1);
      var bool = !this.target.some(that.isCollision.bind(that)) && !barriers.some(that.isCollision.bind(that)) && !otherEnemys.some(that.isCollision.bind(that));
      return bool;
    },
    isCollision: function(barrier){
      var coreX = this.x + this.width / 2;
      var coreY = this.y + this.height / 2;
      var barrierX = barrier.x + barrier.width / 2;
      var barrierY = barrier.y + barrier.height / 2;

      var dx = Math.abs(coreX - barrierX);
      var dy = Math.abs(coreY - barrierY);
      var d = Math.sqrt(Math.pow((coreX - barrierX), 2) + Math.pow((coreY - barrierY), 2));
      if(dx < (this.width / 2 + barrier.width / 2) && dy < (this.height / 2 + barrier.height / 2) && d < (this.height / 2 + barrier.height / 2) ){
        return true;
      }
      return false;
    },
    beSuspend: function(){
      var that = this;
      this.fireCommond = false;
      suspendTimer = setTimeout(function(){
        that.fireCommond = true;
      },3000);
    },
    addBuff: function(type){
      switch(type){
        case 'incrATK': {
          this.ATK++;
          this.status && this.status.setATK(this.ATK);
          break;
        }
        case 'incrHp': {
          this.hp++;
          if(this.shapeChange && this.hp <= this.maxForm){
            this.sx = this.changeGap * (this.hp - 1);
          }
          this.status && this.status.setHp(this.hp);
          break;
        }
        case 'incrROF': {
          this.ROF += 1.5;
          this.status && this.status.setROF(this.ROF);
          break;
        }
        case 'incrSpeed': {
          this.speed += 0.3;
          this.status && this.status.setSpeed(this.speed);
          break;
        }
        case 'reduceInter': {
          this.interval -= 50;
          this.status && this.status.setInter(this.interval);
          break;
        }
        case 'suspendEnemys': {
          ProtState.suspendEnemys();
          break;
        }
      }
    }
  }

  var EnemyState = {
    gameSign: null,
    start: function(){
      canvasWidth = enemy.width = Map_Width;
      canvasHeight = enemy.height = Map_Height;
      EnemyState.gameSign = true;
      (function() {
        if(!EnemyState.gameSign) return false;
        cxt.clearRect(0, 0, canvasWidth, canvasHeight);
        EnemyState.render();
        (window.requestAnimationFrame && requestAnimationFrame(arguments.callee)) || setTimeout(arguments.callee, 16);
      })();
    },
    stop: function(){
      EnemyState.gameSign = false;
      cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    render: function(){
      enemys.forEach(function(obj){
        obj.render();
      })
    },
    suspendEnemys: function(){
      enemys.forEach(function(obj){
        obj.beSuspend();
      })
    }
  }

  w['Enemy'] = Enemy;
  w['EnemyState'] = EnemyState;

})(window, document);