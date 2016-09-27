'use strict';

const _default = {
	min: 1,
	max: 100,
	interval: 6,
	default: 1
}

class RangeComponent {
	constructor(elem, option) {
		Object.assign(this, _default, option);
		this.elem = elem;
		if (option && option.width) {
			this.elem.style.width = typeof option.width === 'number' ? (option.width + 'px') : option.width;
		}
		this.left = this.elem.getBoundingClientRect().left;
		this.width = this.elem.offsetWidth;
		this.total = (this.max - this.min) / this.interval;
		this.gap = this.width / this.total;
		this.createDot();
		this.setValue(this.default);
		this.setPosition();
	}
	createDot() {
		this.dot = document.createElement('DIV');
		this.dot.className = 'range-dot';
		this.elem.appendChild(this.dot);
		this.dotWidth = this.dot.offsetWidth;
		this.bindEvent()
	}
	bindEvent() {
		this.dot.addEventListener('mousedown', (e) => {
			this.flag = true;
		})
		this.elem.addEventListener('click', (e) => {
			let x = e.clientX - this.left;
			this.setTransform(x);
			let v = Math.round(x / this.gap) * this.interval + this.min;
			this.setValue(v);
			this.setPosition();
		})
		document.addEventListener('mousemove', (e) => {
			if (!this.flag) return false;
			let x = e.clientX - this.left;
			if (x >= 0 && x <= this.width) {
				this.setTransform(x);
				let v = Math.round(x / this.gap) * this.interval + this.min;
				this.setValue(v);
			} else if (x < 0) {
				this.setTransform(0);
				this.setValue(this.min);
			} else {
				this.setTransform(this.width);
				this.setValue(this.max);
			}
		})
		document.addEventListener('mouseup', (e) => {
			this.flag = false;
			this.setPosition();
		})
		document.addEventListener('mouseleave', (e) => {
			this.flag = false;
			this.setPosition();
		})
	}
	setValue(val) {
		this.value = val;
		this.callback(val)
	}
	setPosition() {
		this.position = (this.value - this.min) / this.interval * this.gap;
		this.setTransform(this.position);
	}
	setTransform(val) {
		this.dot.style.transform = 'translateX(' + (val - (this.dotWidth / 2)) + 'px)';
		this.dot.style.WebkitTransform = 'translateX(' + (val - (this.dotWidth / 2)) + 'px)';
	}
}

const setRange = (elems, option) => {
	if (Array.isArray(elems)) {
		return Array.from(elems, (elem) => new RangeComponent(elem, option));
	}
	else {
		return new RangeComponent(elems, option);
	}
}

export {
	setRange,
	RangeComponent
}