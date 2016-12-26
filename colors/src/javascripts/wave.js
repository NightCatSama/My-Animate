'use strict'

const _default = {
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
	x: 0,
	y: 0,
	r: 1
}

export default class Wave {
	constructor(option) {
		Object.assign(this, _default, option)
		this.isAnimate = false
		this.wave = []
		this.fn = null
		this.cb = null
		this.init()
	}
	init() {
		this.createCanvas()
		this.setSize()
		this.bindEvent()
	}
	createCanvas() {
		this.canvas = document.createElement('canvas')
		this.canvas.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 2;'
		this.bounds = this.canvas.getBoundingClientRect()
		this.cxt = this.canvas.getContext('2d')
	}
	setSize() {
		this.canvas.width = this.width
		this.canvas.height = this.height
	}
	destory() {
		this.cxt.clearRect(0, 0, this.width, this.height)
		this.stop()
	}
	bindEvent() {
		this.canvas.addEventListener('click', this.getMousePos.bind(this))
	}
	getMousePos(e) {
		e.stopPropagation()
	    let mx = e.clientX - this.bounds.left
		let my = e.clientY - this.bounds.top
		this.addWave(mx, my)
	}
	addWave(x, y) {
		var canvasOffscreen = document.createElement('canvas')
		canvasOffscreen.width = this.width
		canvasOffscreen.height = this.height
		// let val = Math.max(this.width, this.height)

		let wave = {
			x: x,
			y: y,
			initialTr: 0.6,
			main: x < this.width / 2,
			lastTr: 0,
			timeStamp: Date.now(),
			live: 2000,
			// live: val / 180 * 1000,
			canvas: canvasOffscreen,
			cxt: canvasOffscreen.getContext('2d'),
			arc: [{
				r: 0,
				vr: 5,
				width: 0.5,
				transprent: 0.36,
				color: 'rgba(255, 255, 255,'
			}, {
				r: -20,
				vr: 5,
				width: 3,
				transprent: 0.2,
				color: 'rgba(211, 211, 211,'
			}, {
				r: -50,
				vr: 3,
				width: 1,
				transprent: 0.2,
				color: 'rgba(255, 255, 255,'
			}, {
				r: -50,
				vr: 2.8,
				width: 0.8,
				transprent: 0.1,
				color: 'rgba(156, 156, 156,'
			}, {
				r: -50,
				vr: 3,
				width: 0.8,
				transprent: 0.2,
				color: 'rgba(156, 156, 156,'
			}]
		}
		this.wave.push(wave)
		this.start()
	}
	start() {
		if (this.isAnimate) return false

		this.isAnimate = true
		const step = () => {
			if (!this.isAnimate) return false
			this.fn && this.fn()
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
		this.cxt.shadowColor = 'rgba(0, 0, 0, 0.46)'
		this.cxt.shadowOffsetX = -5
		this.cxt.shadowOffsetX = -5
		this.cxt.shadowBlur = 10

		Array.from(this.wave, obj => {
			Array.from(obj.arc, v => {
				if (v.r < 0) return false

				let arr = [{ x: obj.x, y: obj.y, isReflect: false }, { x: -obj.x, y: obj.y, isReflect: true }, { x: obj.x, y: -obj.y, isReflect: true }, { x: this.width * 2 - obj.x, y: obj.y, isReflect: true }, { x: obj.x, y: this.height * 2 - obj.y, isReflect: true }]
				arr.map(({ x, y, isReflect }) => {
					this.cxt.strokeStyle = v.color + (v.opacity * (isReflect ? 0.8 : 1)) + ')'
					this.cxt.lineWidth = v.width * (isReflect ? 0.8 : 1)
					this.cxt.beginPath()
					this.cxt.arc(x, y, v.r, 0, 2 * Math.PI, true)
					this.cxt.closePath()

					this.cxt.stroke()
				})
			})
		})
	}
	update() {
		let now = Date.now()
		this.wave = this.wave.filter(obj => {
			obj.arc = obj.arc.filter(v => {
				if (now - obj.timeStamp > obj.live) {
					return false
				}
				else {
					v.opacity = (1 - (now - obj.timeStamp) / obj.live) * v.transprent
				}

				v.r += v.vr

				return true
			})
			if (obj.arc.length === 0) {
				// this.cb && this.cb(obj.canvas)
				return false
			}
			return true
		})
		if (this.wave.length === 0) {
			this.stop()
		}
	}
}