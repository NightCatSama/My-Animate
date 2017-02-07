'use strict';

const _default = {
	size: 2,
	backgroundColor: '#fff'
}

const isPC = !/(iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone)/i.test(navigator.userAgent)

const eventType = {
	down: isPC ? 'mousedown' : 'touchstart',
	up: isPC ? 'mouseup' : 'touchend',
	move: isPC ? 'mousemove' : 'touchmove',
	cancel: isPC ? 'mouseleave' : 'touchcancel',
}

console.log(eventType)

export default class Particle {
	constructor(id, option) {
		Object.assign(this, _default, option);
		this.elem = document.getElementById(id);
		this.wrap = this.elem.parentNode;
		this.ctx = this.elem.getContext('2d');
		this.width = this.elem.width = this.elem.offsetWidth;
		this.height = this.elem.height = this.elem.offsetHeight;
		this.elem.classList.remove('full');
		this.getBound();
		this.setBackgroundColor();
		this.createMask();
		this.trashCanvas();
		this.bindEvent();
		this.clear = this.clear;

		this.color = option.color;
	}
	getBound() {
		this.left = this.elem.getBoundingClientRect().left;
		this.top = this.elem.getBoundingClientRect().top;
	}
	setBackgroundColor() {
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
	bindEvent() {
		this.mask.addEventListener(eventType['down'], (e) => {
			if (!isPC) {
				e = e.targetTouches[0]
			}

			this.flag = true;
			this.lastX = e.clientX;
			this.lastY = e.clientY;
			this.ctx.drawImage(this.mask, 0, 0);
			this.maskCtx.clearRect(0, 0, this.width, this.height);
		})
		this.mask.addEventListener(eventType['move'], (e) => {
			if (!isPC) {
				e = e.targetTouches[0]
			}

			if (!this.flag) return false;
			let x = e.clientX;
			let y = e.clientY;
			this.draw(x, y);
		})
		this.mask.addEventListener(eventType['up'], (e) => {
			if (!isPC) {
				e = e.targetTouches[0]
			}

			this.flag = false;
			this.clearFlag = false;
		})
		this.wrap.addEventListener(eventType['cancel'], (e) => {
			if (!isPC) {
				e = e.targetTouches[0]
			}

			this.flag = false;
			this.clearFlag = false;
		})
	}
	createMask() {
		this.mask = document.createElement('canvas');
		this.mask.className = 'canvas-mask';
		this.maskCtx = this.mask.getContext('2d');
		this.mask.width = this.width;
		this.mask.height = this.height;
		document.querySelector('.canvas-wrap').appendChild(this.mask);
	}
	trashCanvas() {
		this.trashCanvas = document.createElement('canvas');
		this.trashCanvasCtx = this.trashCanvas.getContext('2d');
		this.trashCanvas.width = this.width;
		this.trashCanvas.height = this.height;
	}
	draw(x, y) {
		this.maskCtx.beginPath();
        this.maskCtx.strokeStyle = this.color;
        this.maskCtx.lineWidth = this.size;
        this.maskCtx.lineJoin = "round";
        this.maskCtx.moveTo(this.lastX, this.lastY);
        this.maskCtx.lineTo(x, y);
        this.maskCtx.closePath();
        this.maskCtx.stroke();
        this.lastX = x;
        this.lastY = y;
	}
	repeal() {
		this.clearFlag && this.ctx.drawImage(this.trashCanvas, 0, 0);
		this.maskCtx.clearRect(0, 0, this.width, this.height);
	}
	clear() {
		this.clearFlag = true;
		this.trashCanvasCtx.drawImage(this.elem, 0, 0);
		this.trashCanvasCtx.drawImage(this.mask, 0, 0);
		this.maskCtx.clearRect(0, 0, this.width, this.height);
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.setBackgroundColor();
		if (this.img) {
			this.ctx.drawImage(this.img, 0, 0);
		}
	}
	loadImg(src) {
		this.clear();
		this.img = new Image()
		this.img.onload = () => {
			this.trashCanvas.width = this.mask.width = this.width = this.elem.width = this.img.width;
			this.trashCanvas.height = this.mask.height = this.height = this.elem.height = this.img.height;
			this.ctx.drawImage(this.img, 0, 0);
			this.getBound();
		}
		this.img.src = src
	}
	saveImg() {
		this.ctx.drawImage(this.mask, 0, 0);
		window.open(this.elem.toDataURL());
	}
}