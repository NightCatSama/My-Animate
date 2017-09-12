'use strict'

const _default = {
	width: document.body.offsetWidth, //canvas的宽度，默认窗口宽度
	height: document.body.offsetHeight, //canvas的高度，默认窗口高度
	x: 0,
	y: 0,
	r: 1
}

import Wave from 'wave';

export default class Canvas {
	constructor(el, option) {
		Object.assign(this, _default, option)
		this.canvas = el
		this.particles = []
		this.cxt = this.canvas.getContext('2d')
		this.isAnimate = false
		this.init()
	}
	init() {
		this.setSize(this.canvas)
		this.createMask()
		this.createColorCanvas()
		this.bounds = this.canvas.getBoundingClientRect()
	}
	createMask() {
		this.wrap = document.createElement('span')
		this.wrap.style.position = 'relative'
		this.mask = new Wave({
			width: this.width,
			height: this.height
		})

		this.mask.fn = this.updateColors.bind(this)
		// this.mask.cb = this.renderColors.bind(this)

		let parentNode = this.canvas.parentNode
		this.wrap.appendChild(this.canvas)
		this.wrap.appendChild(this.mask.canvas)
		parentNode.appendChild(this.wrap)
	}
	createColorCanvas() {
		this.colorCanvas = document.createElement('canvas')
		this.setSize(this.colorCanvas)
		this.colorCanvas.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 1;'
		this.colorCanvasCxt = this.colorCanvas.getContext('2d')
		this.wrap.appendChild(this.colorCanvas)
	}
	destory() {
		this.cxt.clearRect(0, 0, this.width, this.height)
		this.stop()
	}
	getMousePos(e) {
	  this.mx = e.clientX - this.bounds.left
		this.my = e.clientY - this.bounds.top
		this.update()
	}
	setSize(el) {
		el.width = this.width
		el.height = this.height
	}
	start() {
		if (this.isAnimate) return false

		this.isAnimate = true
		const step = () => {
			if (!this.isAnimate) return false
			this.render()
			this.update()
			requestAnimationFrame(step)
		}
		requestAnimationFrame(step)
	}
	stop() {
		this.isAnimate = false
	}
	render() {
		this.cxt.clearRect(0, 0, this.width, this.height)

		Array.from(this.particles, (particle) => {
			this.cxt.fillStyle = 'rgba(' + particle.grayColor + ')'

			this.cxt.beginPath()
			this.cxt.arc(particle.x, particle.y, this.r, 0, 2 * Math.PI, true)
			this.cxt.closePath()

			this.cxt.fill()
		})
	}
	renderColors(canvas) {
		this.cxt.drawImage(canvas, this.x, this.y)
	}
	updateColors() {
		if (this.mask.wave.length === 0) return false
		// 离屏渲染
		let now = Date.now()
		this.colorCanvasCxt.clearRect(0, 0, this.width, this.height)
		Array.from(this.mask.wave, obj => {
			obj.canvas.width = this.width
			obj.canvas.height = this.height
			let cxt = obj.cxt
			cxt.beginPath()
			let v = obj.arc[0]
			let tr = (1 - (now - obj.timeStamp) / obj.live) * (obj.initialTr - obj.lastTr) + obj.lastTr
			cxt.globalAlpha = tr < 0 ? 0 : tr
			// cxt.globalAlpha = v.opacity
			cxt.arc(obj.x, obj.y, v.r, 0, 2 * Math.PI, true)
			cxt.closePath()
			cxt.clip()
			if (obj.main) {
				this.color_img && cxt.drawImage(this.color_img, this.x, this.y, this.img_width, this.img_height)
				cxt.drawImage(this.img , this.x, this.y, this.img_width, this.img_height)
			}
			else {
				cxt.drawImage(this.img , this.x, this.y, this.img_width, this.img_height)
				this.color_img && cxt.drawImage(this.color_img, this.x, this.y, this.img_width, this.img_height)
			}
			this.colorCanvasCxt.drawImage(obj.canvas, this.x, this.y)
		})
	}
	setImage(src, type) {
		let img = new Image()
		img.onload = () => {
			if (type === 'colors') {
				this.color_img = img
				this.color_img.width = this.width
				this.color_img.height = this.height
			}
			else {
				this.img = img
				this.img_width = this.img.width = this.width
				this.img_height = this.img.height = this.height
				this.cxt.drawImage(this.img, this.x, this.y, this.img_width, this.img_height)
				this.setGrayImage()
				/* 图片粒子化, 目前未用到 */
				// this.getParticle()
				// this.render()
			}
		}
		img.src = src
	}
	getParticle() {
		this.particles = []
		let { arr, grayArr } = this.getImageData()
		let s_width = 1
		let s_height = 1
		let pos = 0
		for (let i = 0; i < this.img_width; i++) {
			for (let j = 0; j < this.img_height; j++) {
				pos = (j * s_height) * (this.img_width) + (i * s_width)
				let x = this.x + i * s_width
				let y = this.y + j * s_height
				let particle = {
					x: x,
					y: y,
					ox: x,
					oy: y,
					vx: 0,
					vy: 0,
					color: arr[pos].join(','),
					grayColor: grayArr[pos].join(',')
				}
				this.particles.push(particle)
			}
		}
	}
	getImageData() {
		let imageData = this.cxt.getImageData(this.x, this.y, this.img_width, this.img_height)
		let data = imageData.data
		let len = imageData.data.length
		let arr = []
		let grayArr = []
		//迷之不相等？
		if (imageData.width !== this.img_width) this.img_width = imageData.width
		if (imageData.height !== this.img_height) this.img_height = imageData.height
		for (let i = 0; i < len / 4; i++) {
			let gray = parseInt((data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3)
			arr.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]])
			grayArr.push([gray, gray, gray, 1])
		}
		return {
			arr,
			grayArr
		}
	}
	setGrayImage() {
		let imageData = this.cxt.getImageData(this.x, this.y, this.img_width, this.img_height)
		let data = imageData.data
		let len = imageData.data.length
		let arr = []
		let grayArr = []
		//迷之不相等？
		if (imageData.width !== this.img_width) this.img_width = imageData.width
		if (imageData.height !== this.img_height) this.img_height = imageData.height
		for (let i = 0; i < len / 4; i++) {
			let gray = parseInt((data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3)
			data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray
		}
		this.cxt.putImageData(imageData, 0, 0);
	}
}