;(function(w, d, undefined){
	var states = 	'<div class="status"><i class="Hp_icon"></i><span class="Hp"></span></div>'+
					'<div class="status"><i class="Speed_icon"></i><span class="Speed"></span></div>'+
					'<div class="status"><i class="ATK_icon"></i><span class="ATK"></span></div>'+
					'<div class="status"><i class="ROF_icon"></i><span class="ROF"></span></div>'+
					'<div class="status"><i class="Gunshot_icon"></i><span class="Interval"></span></div>';

	var StatusBar = function(position){
		this.StatusBar = d.createElement('DIV');
		this.StatusBar.className = 'StatusBar';

		if(position){
			var arr = position.split('/');
			var wrap = d.querySelector('.StatusBarWrap-' + arr[0] + '-' + arr[1]);
			if(wrap){
				this.StatusBarWrap = wrap;
			}
			else {
				this.StatusBarWrap = d.createElement('DIV');
				this.StatusBarWrap.className = 'StatusBarWrap StatusBarWrap-' + arr[0] + '-' + arr[1];
				this.StatusBarWrap.style.cssText = arr[0] + ": 0; " + arr[1] + ": 0;";

				Game ? Game.appendChild(this.StatusBarWrap) : d.body.appendChild(this.StatusBarWrap);
			}
		}
		this.StatusBar.insertAdjacentHTML('afterbegin', states);

		this.StatusBarWrap.appendChild(this.StatusBar);
	}

	StatusBar.prototype = {
		setStatus: function(obj){
			this.setHp(obj.hp);
			this.setSpeed(obj.speed);
			this.setATK(obj.ATK);
			this.setROF(obj.ROF);
			this.setInter(obj.interval);
		},
		setHp: function(num){
			var status = this.StatusBar.querySelector('.Hp')
			status.innerText = num;
		},
		setSpeed: function(num){
			var status = this.StatusBar.querySelector('.Speed')
			status.innerText = typeof num === 'number' ? Math.round(num*10)/10 : num;
		},
		setATK: function(num){
			var status = this.StatusBar.querySelector('.ATK')
			status.innerText = num;
		},
		setROF: function(num){
			var status = this.StatusBar.querySelector('.ROF')
			status.innerText = num;
		},
		setInter: function(num){
			var status = this.StatusBar.querySelector('.Interval')
			status.innerText = num;
		},
		destroy: function(){
			this.StatusBarWrap.removeChild(this.StatusBar);
		}
	}

	w['StatusBar'] = StatusBar;
})(window, document)