'use strict';

let _default = {
	x: 10,
	y: 10,
	size: 20,
	color: '#3498DB',
	bgColor: '#ffffff',
	mode: 'draw',
	parent: document.body
}

export default class Canvas {
	constructor(option){
		Object.assign(this, _default, option)
		this.mouseDownFn = this.mouseDownFn.bind(this)
		this.mouseMoveFn = this.mouseMoveFn.bind(this)
		this.mouseEndFn = this.mouseEndFn.bind(this)

		this.init()
	}
	init() {
		this.createContainer()
		this.bindEvent()
		if (this.library) {
			this.setBlockStyle()
		}
		else {
			this.library = {}
		}
	}
	empty() {
		for (let i in this.library) {
			this.blocks[i].style.backgroundColor = 'transparent'
			delete this.library[i]
		}
	}
	reset() {
		this.library = {}
		this.removeEvent()
		this.parent.removeChild(this.container)
		this.createContainer()
		this.bindEvent()
	}
	setBlockStyle() {
		for (let i in this.library) {
			this.blocks[i].style.backgroundColor = this.library[i].color
		}
	}
	createContainer() {
		this.container = document.createElement('DIV')
		this.container.className = 'container'
		this.container.style.cssText = `width: ${this.size * this.x}px; height: ${this.size * this.y}px;`
		let divs = ''
		for (let i = 0, count = this.x * this.y; i < count; i++) {
			divs += `<div style="width: ${this.size}px; height: ${this.size}px;" data-num="${i}" class="block"></div>`
		}
		this.container.innerHTML = divs
		this.parent.appendChild(this.container)
		this.blocks = this.container.children
	}
	bindEvent() {
		this.container.addEventListener('mousedown', this.mouseDownFn, false)
		this.container.addEventListener('mousemove', this.mouseMoveFn, false)
		document.body.addEventListener('mouseup', this.mouseEndFn, false)
		document.body.addEventListener('mouseleave', this.mouseEndFn, false)
	}
	removeEvent() {
		this.container.removeEventListener('mousedown', this.mouseDownFn, false)
		this.container.removeEventListener('mousemove', this.mouseMoveFn, false)
		document.body.removeEventListener('mouseup', this.mouseEndFn, false)
		document.body.removeEventListener('mouseleave', this.mouseEndFn, false)
	}
	mouseDownFn(e) {
		let index = this.getIndex(e.target)
		index && this.setSomeBlock(index)
		this.flag = true
	}
	mouseMoveFn(e) {
		if (this.flag) {
			let index = this.getIndex(e.target)
			index && this.setSomeBlock(index)
		}
	}
	mouseEndFn() {
		this.flag = false
	}
	getIndex(elem) {
		if (!elem.classList.contains('block'))
			return false

		return elem.getAttribute('data-num')
	}
	setSomeBlock(index) {
		let obj = this.library[index]
		if (this.mode === 'draw') {
			if (obj) {
				if (obj.color !== this.color) {
					this.library[index].color = this.color
					this.blocks[index].style.backgroundColor = this.color
				}
			}
			else {
				this.library[index] = {
					x: index % this.x,
					y: ~~(index / this.x),
					color: this.color
				}
				this.blocks[index].style.backgroundColor = this.color
			}
		}
		else if (obj) {
			delete this.library[index]
			this.blocks[index].style.backgroundColor = 'transparent'
		}
	}
	setImage(src) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.x * this.size
		this.canvas.height = this.y * this.size
		this.cxt = this.canvas.getContext('2d')
		this.img = new Image()
		this.img.onload = () => {
			this.img.width = this.x * this.size
			this.img.height = this.y * this.size
			this.cxt.drawImage(this.img, 0, 0, this.img.width, this.img.height)
			this.getParticle()
		}
		this.img.src = src
	}
	getParticle() {
		let imageData = this.getImageData()
		let s_width = parseInt(this.img.width / this.x)
		let s_height = parseInt(this.img.height / this.y)
		let pos = 0
		for (let i = 0; i < this.x; i++) {
			for (let j = 0; j < this.y; j++) {
				pos = (j * s_height) * (this.img.width) + (i * s_width)
				if (imageData[pos] && imageData[pos][3] !== 0) {
					/*
					自定义过滤方法
					if (imageData[pos][0] === 255 && imageData[pos][1] === 255 && imageData[pos][2] === 255) {
						continue;
					}
					*/
					let particle = {
						x: i,
						y: j,
						color: `rgba(${imageData[pos].join(',')})`
					}
					let index = j * this.x + i
					this.library[index] = particle
					this.blocks[index].style.backgroundColor = `rgba(${imageData[pos].join(',')})`
				}
			}
		}
	}
	getImageData() {
		let imageData = this.cxt.getImageData(0, 0, this.img.width, this.img.height)
		let data = imageData.data
		let len = imageData.data.length
		let arr = []
		//迷之不相等？
		if (imageData.width !== this.img.width) this.img.width = imageData.width
		if (imageData.height !== this.img.height) this.img.height = imageData.height
		for (let i = 0; i < len / 4; i++) {
			arr.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]])
		}
		return arr
	}
};