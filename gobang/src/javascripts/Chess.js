const _default = {
	size: 600,                          // 棋盘大小
	shrink: 5,                         //  棋子大小 = 一格大小 - shrink
	color: ['#000', '#FFF'],            // 玩家1 玩家2 颜色
	cb: null,                           // 游戏结束回调方法
	bg_texture: 'dist/images/wood.png'  //  背景纹理
}

export default class Chess {
	constructor(el, options){
		Object.assign(this, _default, options)
		this.checkerboard = el
		this.cxt = this.checkerboard.getContext('2d')
		this.gap = this.size / 15

		this.ignores = []

		this.getMousePos = this.getMousePos.bind(this)
		this.bindEvent()
		this.init()
	}
	/*  绑定事件  */
	bindEvent() {
		this.checkerboard.addEventListener('click', this.getMousePos)
	}
	/*  解除绑定  */
	unbindEvent() {
		this.checkerboard.removeEventListener('click', this.getMousePos)
	}
	/*  初始化  */
	init() {
		this.cxt.clearRect(0, 0, this.size, this.size)
		this.initSize()
		this.player = 0
		this.piece_count = 0
		this.over = false
		this.pieces = []
		this.pieces0 = []
		this.pieces1 = []
		this.setBg()
	}
	/*  初始化大小  */
	initSize() {
		this.checkerboard.width = this.size
		this.checkerboard.height = this.size
		this.bounds = this.checkerboard.getBoundingClientRect()
	}
	/*  设置背景图  */
	setBg() {
		this.cxt.clearRect(0, 0, this.size, this.size)

		this.image = new Image()
		this.image.onload = () => {
			this.cxt.fillStyle = this.cxt.createPattern(this.image, 'repeat')
        	this.cxt.fillRect(0, 0, this.size, this.size)
			this.createGridding()
		}

		this.image.src = this.bg_texture
	}
	/*  生成网格  */
	createGridding() {
		this.cxt.strokeStyle = '#000'
		this.cxt.lineWidth = 1
		for (let x = 0; x < 15; x++) {
			this.cxt.moveTo(x * this.gap + this.gap / 2, this.gap / 2)
			this.cxt.lineTo(x * this.gap + this.gap / 2, this.size - this.gap / 2)
			this.cxt.moveTo(this.gap / 2, x * this.gap + this.gap / 2)
			this.cxt.lineTo(this.size - this.gap / 2, x * this.gap + this.gap / 2)
			this.cxt.stroke()
		}
	}
	/*  点击事件  */
	getMousePos(e) {
		if (this.over)
			return this.init()
	  let mx = e.clientX - this.bounds.left
		let my = e.clientY - this.bounds.top
		this.checked(~~(mx / this.gap), ~~(my / this.gap))
	}
	/*  callback  */
	callback(word) {
		alert(word)
		this.cb && this.cb(word)
	}
	/*  下了个棋子  */
	checked(x, y) {
		let index = this.getIndex(x, y)
		if (this.pieces.indexOf(index) > -1)
			return false
		this.pieces.push(index)
		this[`pieces${this.player}`].push(index)
		this.createPiece(x, y, index)
		this.isWin(index)
		if (!this.over) {
			this.player = +!this.player
		}
		else {
			return setTimeout(() => this.callback(`${this.player ? '白' : '黑'}棋获得了胜利!`))
		}
		this.piece_count++
		if (this.piece_count === 225) {
			return setTimeout(() => this.callback(`和棋!`))
		}
	}
	/*  生成个棋子  */
	createPiece(x, y, index) {
		this.cxt.fillStyle = this.color[this.player]
		this.cxt.shadowColor = '#000'
		this.cxt.shadowBlur = 5

		this.cxt.beginPath()
		this.cxt.arc(x * this.gap + this.gap / 2, y * this.gap + this.gap / 2, (this.gap - this.shrink) / 2, 0, 2 * Math.PI, true)
		this.cxt.closePath()

		this.cxt.fill()
	}
	/*  是否赢了  */
	isWin(index) {
		let lines = {
			's': [index],
			'h': [index],
			't': [index],
			'd': [index]
		}
		this.typeLine = this.createTypeLine(index)
		this.setLines(index, lines)
		for (let type in lines) {
			/*  其中一条线大于等于5个就赢了  */
			if (lines[type].length >= 5) {
				this.over = true
			}
		}
		this.ignores = []
	}
	/*  得到该点四条线上的连点数  */
	setLines(index, lines, haveType) {
		let indexs = this.getIndexs(index, haveType)
		Array.from(indexs, p => {
			let type = this.getType(index, p)
			lines[type].push(p)
			this.setLines(p, lines, type)
		})
	}
	/*  type = undefined 得到8个方向上的我方棋子坐标, type = 线 得到该线两个方向上的我方棋子  */
	getIndexs(index, type) {
		this.ignores.push(index)
		let x = index % 15
		let y = ~~(index / 15)
		const xs = [x-1, x, x+1]
		const ys = [y-1, y, y+1]

		let n = []
		Array.from(xs, (i) => {
			Array.from(ys, (j) => {
				if (i < 0 || j < 0)
					return
				let p = j * 15 + i
				if (this.isEnable(p, type)) {
					n.push(p)
				}
			})
		})
		return n
	}
	/*  这个点是否可用(排除用过的, 不在方向上的, 不是自己的颜色的棋子)  */
	isEnable(index, type) {
		if (this.ignores.indexOf(index) > -1)
			return false

		if (type && this.typeLine[type].indexOf(index) === -1)
			return false

		this.ignores.push(index)
		if (this[`pieces${this.player}`].indexOf(index) > -1)
			return true

		return false
	}
	/*  根据一个点得到四条线的点(竖, 横, 上升, 下降)  */
	createTypeLine(index) {
		const maps = {
			s: 15,
			h: 1,
			d: 16,
			t: 14
		}
		let obj = {
			's': [index],
			'h': [index],
			't': [index],
			'd': [index]
		}
		let pos = this.getXY(index)
		let x = pos.x
		let y = pos.y
		for (let type in maps) {
			obj[type] = this.getOneTypeLine(type, x, y)
		}
		return obj
	}
	/*  得到单独一条线的点  */
	getOneTypeLine(type, x, y) {
		let arr = []
		let bx = x
		let by = y
		while(x >= 0 && y >= 0 && x <= 14 &&  y <= 14) {
			arr.push(this.getIndex(x, y))
			switch(type) {
				case 's': y += 1; break;
				case 'h': x += 1; break;
				case 'd': x += 1; y += 1; break;
				case 't': x += 1; y -= 1; break;
			}
		}
		x = bx
		y = by
		while(x >= 0 && y >= 0 && x <= 14 && y <= 14) {
			arr.push(this.getIndex(x, y))
			switch(type) {
				case 's': y -= 1; break;
				case 'h': x -= 1; break;
				case 'd': x -= 1; y -= 1; break;
				case 't': x -= 1; y += 1; break;
			}
		}
		return arr.slice(1)
	}
	/*  两点确定线的方向  */
	getType(index, p) {
		const maps = {
			15: 's',
			1: 'h',
			16: 'd',
			14: 't'
		}
		return maps[Math.abs(index - p)]  //  's'竖, 'h'横, 't'上升线, 'd'下降线
	}
	/*  根据索引获取坐标  */
	getXY(index) {
		return {
			x: index % 15,
			y: ~~(index / 15)
		}
	}
	/*  根据坐标获得索引  */
	getIndex(x, y) {
		return y * 15 + x
	}
};