'use strict';

import Rhythm from './rhythm'

const _default = {
	text: 'NightCat',
	musics: [{
		name: 'Maroon 5 - Sugar',
		src: './src/music/Maroon 5 - Sugar.mp3'
	}, {
		name: 'TheFatRat - Jackpot',
		src: './src/music/TheFatRat - Jackpot.mp3'
	}, {
		name: 'Axol x Alex Skrindo - You',
		src: './src/music/Axol x Alex Skrindo - You.mp3'
	}, {
		name: 'IMLAY MYLK - Flower Flower',
		src: './src/music/IMLAY MYLK - Flower Flower.mp3'
	}],
	size: 30,
	color: '#fff',
	offset: 1,
	gridX: 1, //文字间隔X
	gridY: 1, //文字间隔Y
	r: 1 //粒子半径
}

class Particle {
	constructor(x, y, r, color, offset) {
		x = x + Math.random() * offset - offset * 0.5
		y = y + Math.random() * offset - offset * 0.5
		this.x = this.cx = x
		this.y = this.cy = y
		this.r = r
		this.rhythm = null;
		this.color = color
		this.size = 200
	}
}

class Character {
	constructor(character) {
		this.character = character
		this.width = 0
		this.size = 200
		this.offset = 10
		this.particles = []
	}
}

export default class MyCanvas {
	constructor(id, option) {
		Object.assign(this, _default, option)

		this.canvas = document.getElementById(id)
		this.cxt = this.canvas.getContext('2d')
		this.placement = [] //  文本数组
		this.array = [] //  频谱数组
		this.length = 0 //  文本长度
		this.index = 0
		this.isAnimate = false //  动画开始标志
		this.init()
	}
	changeSong(index) {
		this.index = typeof index === 'number' ? index : (this.index + 1)
		if (this.index > this.musics.length - 1)
			this.index = 0

		this.rhythm && this.rhythm.pause()
		this.rhythm = null
		this.rhythm = new Rhythm(this.musics[this.index].src)
		this.text = this.musics[this.index].name
		this.setText()
		this.rhythm.play()
	}
	init() {
		this.getSize()
		this.changeSong(0)
		this.setText()
		this.start()
	}
	getSize() {
		this.width = this.canvas.width = this.canvas.offsetWidth
		this.height = this.canvas.height = this.canvas.offsetHeight
	}
	destory() {
		this.cxt.clearRect(0, 0, this.width, this.height)
		this.placement.length = 0
		this.stop()
	}
	setText() {
		this.placement.length = 0
		Array.from(this.text, (character) => {
			let obj = new Character(character)
			let data = this.getPartical(character)
			obj.particles = data.particles
			obj.width = data.width
			this.placement.push(obj)
		})

		this.length = 0
		Array.from(this.placement, (character) => {
			this.length += ~~(character.width)
		})
	}
	getPartical(Character) {
		this.cxt.textAlign = 'center'
		this.cxt.font = `normal ${this.size}px arial`
		this.cxt.fillStyle = this.color
		this.cxt.fillText(Character, this.x || this.width / 2, this.y || this.height / 2 + 50)
		let width = this.cxt.measureText(Character).width

		var idata = this.cxt.getImageData(0, 0, this.width, this.height)
		var buffer32 = new Uint32Array(idata.data.buffer)

		var particles = []

		for (var j = 0; j < this.height; j += this.gridY) {
			for (var i = 0; i < this.width; i += this.gridX) {
				if (buffer32[j * this.width + i]) {
					var particle = new Particle(i, j, this.r, this.color, this.offset)
					particles.push(particle)
				}
			}
		}

		this.cxt.clearRect(0, 0, this.width, this.height)
		return {
			width,
			particles
		}
	}
	start() {
		this.isAnimate = true
		this.rhythm.play()

		this.cxt.shadowColor = '#fff'
		this.cxt.shadowBlur = 3

		const step = () => {
			if (!this.isAnimate) return false
			if (this.rhythm.audio.ended) this.changeSong()

			this.render()
			this.renderFrequency()
			this.update()
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}
	toggle() {
		this.isAnimate ? this.stop() : this.start()
	}
	stop() {
		this.isAnimate = false
		this.cxt.clearRect(0, 0, this.width, this.height)
		this.rhythm.pause()
	}
	render() {
		this.cxt.clearRect(0, 0, this.width, this.height)

		let offset = this.length * -0.5
		Array.from(this.placement, (character) => {
			let width = ~~(character.width)
			let len = character.particles.length
			let oldX, oldY

			this.cxt.strokeStyle = this.color
			this.cxt.lineWidth = 0.5
			Array.from(character.particles, (particle, index) => {
				let x = particle.x + offset + 0.5 * width
				let y = particle.y

				this.cxt.fillStyle = this.color
				this.cxt.beginPath()
				this.cxt.arc(particle.x + offset + 0.5 * width, particle.y, particle.r, 0, 2 * Math.PI, true)
				this.cxt.closePath()
				this.cxt.fill()

				oldX = x
				oldY = y
			})
			offset += width
		})
	}
	renderFrequency() {
		this.array = this.rhythm.getArr()
		this.array = this.array.slice(0, Math.round(2 / 3 * this.array.length))
		let fre_width = 450 // 频谱的宽度
		let x = this.width / 2 - fre_width / 2 // 位置坐标x
		let y = this.height / 2 - this.size / 2 // 位置坐标y
		let gap = 2 // 间隔
		let meterNum = this.array.length // 条数
		let width = fre_width / meterNum - gap // 条宽度
		let step = Math.round(this.array.length / meterNum) // 采样步长

		let radius = 50
		let r_x = x - 120
		let r_x2 = x + fre_width + 120
		let r_y = this.height - y - 30

		for (var i = 0; i < meterNum; i++) {
			var value = (this.array[i * step] / 255) * this.array[i * step] * Math.sin(Math.PI / 90 * (90 / meterNum * i)) / 4 + 2

			this.cxt.fillRect(
				i * (gap + width) + x,
				this.height - value - y,
				width,
				value
			)
			value = -value
			this.cxt.fillRect(
				i * (gap + width) + x,
				this.height - value - y + this.size * 1.5,
				width,
				value
			)

			//  环形
			if (i % 2) {
				this.cxt.save()
				this.cxt.translate(r_x, (r_y) + radius)
				this.cxt.rotate(Math.PI / 180 * (180 / meterNum * i - 180))
				this.cxt.translate(-r_x, -(r_y) + radius)
				this.cxt.fillRect(
					r_x,
					r_y - value,
					width,
					value
				)
				this.cxt.restore()
			}
			else {
				this.cxt.save()
				this.cxt.translate(r_x, (r_y) + radius)
				this.cxt.rotate(Math.PI / 180 * (180 / meterNum * i))
				this.cxt.translate(-r_x, -(r_y) + radius)
				this.cxt.fillRect(
					r_x,
					r_y - value,
					width,
					value
				)
				this.cxt.restore()
			}

			if (i % 2) {
				this.cxt.save()
				this.cxt.translate(r_x2, (r_y) + radius)
				this.cxt.rotate(Math.PI / 180 * (180 / meterNum * i - 180))
				this.cxt.translate(-r_x2, -(r_y) + radius)
				this.cxt.fillRect(
					r_x2,
					r_y - value,
					width,
					value
				)
				this.cxt.restore()
			}
			else {
				this.cxt.save()
				this.cxt.translate(r_x2, (r_y) + radius)
				this.cxt.rotate(Math.PI / 180 * (180 / meterNum * i))
				this.cxt.translate(-r_x2, -(r_y) + radius)
				this.cxt.fillRect(
					r_x2,
					r_y - value,
					width,
					value
				)
				this.cxt.restore()
			}
		}
	}
	update() {
		let meterNum = this.array.length
		let step = Math.round(this.array.length / meterNum) // 200取样
		let value = 0
		for (var i = 0; i < meterNum; i++) {
			value += this.array[i * step]
		}
		let average = value / meterNum

		Array.from(this.placement, (character) => {
			Array.from(character.particles, (particle) => {
				particle.x = average / 100 * 2 - 2 + particle.cx
				particle.y = average / 100 * 2 - 2 + particle.cy
				particle.r = average / 100 * 0.5
			})
		})
	}
}