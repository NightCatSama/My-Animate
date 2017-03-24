'use strict';

const _default = {
	src: '', //图片路径
	width: document.body.offsetWidth, //canvas的宽度，默认窗口宽度
	height: document.body.offsetHeight, //canvas的高度，默认窗口高度
	imgSize: undefined, //图片的大小 [width, height]，默认原始大小
	filter: function(r, g, b, a) {  //过滤方法
		return true
	},
	x: undefined, //图像在canvas中的x坐标，默认居中
	y: undefined, //图像在canvas中的y坐标，默认居中
	r: 0.5,  //粒子半径
	cols: 150, //图像分为几列，横坐标细度
	rows: 150, //图像分为几行，纵坐标细度
	mouseRange: 60,  //影响范围
	disperse: 5, //粒子偏移范围
	recovery: 0.95  //恢复速度，越小越快，1时不恢复
}

export default class Particle {
	constructor(id, option) {
		Object.assign(this, _default, option)
		this.canvas = document.getElementById(id)
		this.cxt = this.canvas.getContext('2d')
		this.particles = []
		this.isAnimate = true
		this.init()
	}
	init() {
		this.setSize()
		this.setImage(this.src)
	}
	destory() {
		this.cxt.clearRect(0, 0, this.width, this.height)
		this.particles.length = 0
		this.stop()
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
					let x = this.x + i * s_width + (Math.random() - 0.5) * this.disperse
					let y = this.y + j * s_height + (Math.random() - 0.5) * this.disperse
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
		//迷之不相等？
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

		// 离屏渲染
		// let canvasOffscreen = document.createElement('canvas');
		// canvasOffscreen.width = this.width
		// canvasOffscreen.height = this.height
		// let cxt = canvasOffscreen.getContext('2d')

		// Array.from(this.particles, (particle) => {
		// 	cxt.fillStyle = 'rgba(' + particle.color + ')'

		// 	cxt.beginPath()
		// 	cxt.arc(particle.x, particle.y, this.r, 0, 2 * Math.PI, true)
		// 	cxt.closePath()

		// 	cxt.fill()
		// })

		// this.cxt.drawImage(canvasOffscreen, 0, 0);

		// 普通渲染
		Array.from(this.particles, (particle) => {
			this.cxt.fillStyle = 'rgba(' + particle.color + ')'

			this.cxt.beginPath()
			this.cxt.arc(particle.x, particle.y, this.r, 0, 2 * Math.PI, true)
			this.cxt.closePath()

			this.cxt.fill()
		})
	}
	update() {
		let range = Math.pow(this.mouseRange, 2)  //  作用范围的平方
		let p = null,
			dx, dy, d, t, f, distance
		Array.from(this.particles, (particle) => {
			p = particle
			dx = this.mx - p.x
			dy = this.my - p.y
			d = dx * dx + dy * dy
			distance = Math.sqrt(d) //  鼠标到粒子的距离
			f = -range / d // 作用范围与距离比
			if (distance < range) {
				t = Math.atan2(dy, dx)  //  获得角度
				p.vx += f * Math.cos(t) // 根据水平加速度
				p.vy += f * Math.sin(t) // 根据垂直加速度
			}
			//  加速度衰减
			p.vx *= this.recovery
			p.vy *= this.recovery

			//  恢复至原始位置
			p.x += p.vx + (p.ox - p.x) * 0.25
			p.y += p.vy + (p.oy - p.y) * 0.25
		})
	}
};