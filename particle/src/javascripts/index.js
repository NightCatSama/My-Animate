'use strict';

const _default = {
	width: document.body.offsetWidth, //canvas的宽度，默认窗口宽度
	height: document.body.offsetHeight, //canvas的高度，默认窗口高度
	imgSize: undefined, //图片的大小 [width, height]，默认原始大小
	backgroundColor: '#fff',
	filter: function(r, g, b, a) {  //过滤方法
		return true
	},
	x: undefined, //图像在canvas中的x坐标，默认居中
	y: undefined, //图像在canvas中的y坐标，默认居中
	r: 0.5,  //粒子半径
	cols: 128, //图像分为几列，横坐标细度
	rows: 128, //图像分为几行，纵坐标细度
	mouseRange: 60,  //影响范围
	recovery: 0.95  //恢复速度，越小越快，1时不恢复
}

export default class Particle {
	constructor(id, option) {
		Object.assign(this, _default, option)
		this.canvas = document.getElementById(id)
		this.canvas.style.backgroundColor = this.backgroundColor
		this.cxt = this.canvas.getContext('2d')
		this.particles = []
		this.range = Math.pow(this.mouseRange, 2)
		this.isAnimate = true
		this.init()
	}
	init() {
		this.setSize()
		this.setImage(this.src)
	}
	bindEvent() {
		this.canvas.addEventListener('mousemove', this.getMousePos.bind(this))
	}
	getMousePos(e) {
	    this.mx = e.clientX - this.bounds.left;
		this.my = e.clientY - this.bounds.top;
	}
	setSize() {
		this.canvas.width = this.width
		this.canvas.height = this.height
	}
	setImage(src) {
		this.img = new Image()
		this.img.onload = () => {
			if (!this.imgSize) {
				this.img_width = this.img.width
				this.img_height = this.img.height
				this.x = this.x || ((this.width - this.img_width) / 2)
				this.y = this.y || ((this.height - this.img_height) / 2)
				this.cxt.drawImage(this.img, this.x, this.y)
			} else {
				this.img_width = this.imgSize[0]
				this.img_height = this.imgSize[1]
				this.x = this.x || ((this.width - this.img_width) / 2)
				this.y = this.y || ((this.height - this.img_height) / 2)
				this.cxt.drawImage(this.img, this.x, this.y, this.img_width, this.img_height)
			}
			this.getParticle()
			this.bounds = this.canvas.getBoundingClientRect()
			this.bindEvent()
		}
		this.img.src = src
	}
	getParticle() {
		let imageData = this.getImageData()
		let s_width = parseInt((this.img_width) / this.cols)
		let s_height = parseInt(this.img_height / this.rows)
		let pos = 0
		for (let i = 1; i <= this.cols; i++) {
			for (let j = 1; j <= this.rows; j++) {
				pos = (j * s_height) * (this.img_width) + (i * s_width)
				if (imageData[pos] && this.filter && this.filter.apply(this, imageData[pos])) {
					let x = this.x + i * s_width + (Math.random() - 0.5) * 5
					let y = this.y + j * s_height + (Math.random() - 0.5) * 5
					let particle = {
						x: x,
						y: y,
						ox: x,
						oy: y,
						vx: 0,
						vy: 0,
						color: imageData[pos].join(',')
					}
					this.particles.push(particle)
				}
			}
		}
		this.start()
	}
	getImageData() {
		let imageData = this.cxt.getImageData(this.x, this.y, this.img_width, this.img_height)
		let data = imageData.data
		let len = imageData.data.length
		let arr = []
		/*
		 * 迷之不相等？
		 */
		if (imageData.width !== this.img_width) this.img_width = imageData.width
		if (imageData.height !== this.img_height) this.img_height = imageData.height
		for (let i = 0; i < len / 4; i++) {
			arr.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]])
		}
		return arr
	}
	start() {
		this.isAnimate = true
		const step = () => {
			if (!this.isAnimate) return false
			this.render()
			this.update()
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}
	stop() {
		this.isAnimate = false
	}
	render() {
		this.cxt.clearRect(0, 0, this.width, this.height)
		Array.from(this.particles, (particle) => {
			this.cxt.fillStyle = 'rgba(' + particle.color + ')'

			this.cxt.beginPath()
			this.cxt.arc(particle.x, particle.y, this.r, 0, 2 * Math.PI, true)
			this.cxt.closePath()

			this.cxt.fill()
		})
	}
	update() {
		let p = null,
			dx, dy, d, t, f
		Array.from(this.particles, (particle) => {
			p = particle
			dx = this.mx - p.x
			dy = this.my - p.y
			d = dx * dx + dy * dy
			f = -this.range / d
			if (Math.sqrt(d) < this.range) {
				t = Math.atan2(dy, dx)
				p.vx += f * Math.cos(t)
				p.vy += f * Math.sin(t)
			}
			p.vx *= this.recovery
			p.vy *= this.recovery
			p.x += p.vx + (p.ox - p.x) * 0.25
			p.y += p.vy + (p.oy - p.y) * 0.25
		})
	}
};