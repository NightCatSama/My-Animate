export default class Canvas {
	constructor() {
    this.canvas = document.getElementById('canvas')
    this.cxt = canvas.getContext('2d')
    this.width = this.canvas.width = this.canvas.offsetWidth
    this.height = this.canvas.height = this.canvas.offsetHeight
    this.bounds = this.canvas.getBoundingClientRect()

    this.ball_count = 50
    this.line_range = 200
    this.balls = []

    this.clickHandle = this.clickHandle.bind(this)
    // this.bindEvent()
    this.start()
	}
  bindEvent() {
    this.canvas.addEventListener('click', this.clickHandle, false)
  }
  unbindEvent() {
    this.canvas.removeEventListener('click', this.clickHandle, false)
  }
  clickHandle(e) {
    let mx = e.clientX - this.bounds.left
    let my = e.clientY - this.bounds.top
    this.addWork({ x: mx, y: my })
  }
  start() {
    if (this.isAnimate) {
      return false
    }

    this.isAnimate = true

    const step = () => {
      if (!this.isAnimate) return false

      if (this.balls.length < this.ball_count) {
        for(var i = 0; i < this.ball_count - this.balls.length; i++) {
          this.addBall()
        }
      }
      this.render()
      this.update()
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  addBall() {
    let ball = {
      x: this.getRandomNumber([0, this.width]),
      y: this.getRandomNumber([0, this.height]) * -1,
      g: this.getRandomNumber([2, 15]) * 0.1,
      gray: this.getRandomNumber([4, 10]) * 0.1,
      type: ~~this.getRandomNumber([0, 3])
    }
    ball.r = ball.gray * 20 + 20
    let color = ~~(188 * ball.gray)
    ball.color = `rgba(${color}, ${color}, ${color}, 1)`

    switch(ball.type) {
      case 0: break;
      case 1: ball.empty = {
          r: this.getRandomNumber([10, ball.r - 10])
        }
        break;
      case 2: ball.empty = {
          r: this.getRandomNumber([ball.r / 2 - 3, ball.r / 2 + 3])
        }
        ball.son = {
          r: this.getRandomNumber([7, ball.empty.r - 3]),
          color: ball.color
        }
        break;
    }

    this.balls.push(ball)
  }
  //  渲染
  render(progress) {
    this.cxt.clearRect(0, 0, this.width, this.height)

    Array.from(this.balls, (ball) => {
      Array.from(this.balls, (b) => {
        let d = Math.sqrt(Math.pow(ball.x - b.x, 2) + Math.pow(ball.y - b.y, 2))
        if (d < this.line_range) {
          this.cxt.strokeStyle = `rgba(188, 188, 188, ${1 - d / this.line_range})`
          this.renderLine(ball.x, ball.y, b.x, b.y)
        }
      })
    })

    Array.from(this.balls, (ball) => {
      this.cxt.globalCompositeOperation = 'destination-over'
      ball.type > 0 && this.renderArc(ball.x, ball.y, ball.empty.r, '#fff')
      this.cxt.globalCompositeOperation = 'source-over'
      ball.type === 2 && this.renderArc(ball.x, ball.y, ball.son.r, ball.son.color)
      this.cxt.globalCompositeOperation = 'destination-over'
      this.renderArc(ball.x, ball.y, ball.r, ball.color)
    })
  }
  //  更新
  update() {
    Array.from(this.balls, (ball) => {
      ball.y += ball.g
    })
  }
  //  根据范围得到一个随机数
  getRandomNumber([min, max]) {
    return ~~(Math.random() * (max - min)) + min
  }
  //  画一个圆
  renderArc(x, y, r, color) {
    this.cxt.fillStyle = color

    this.cxt.beginPath()
    this.cxt.arc(x, y, r, 0, Math.PI * 2, true)
    this.cxt.closePath()

    this.cxt.fill()
  }
  //  画一条线
  renderLine(x1, y1, x2, y2) {
    this.cxt.beginPath()
    this.cxt.moveTo(x1, y1)
    this.cxt.lineTo(x2, y2)
    this.cxt.closePath()

    this.cxt.stroke()
  }
  //  画个三角形
  renderTri(coord1, coord2, coord3) {
    this.cxt.beginPath()
    this.cxt.moveTo(coord1.x, coord1.y)
    this.cxt.lineTo(coord2.x, coord2.y)
    this.cxt.lineTo(coord3.x, coord3.y)
    this.cxt.lineTo(coord1.x, coord1.y)
    this.cxt.closePath()

    this.cxt.stroke()
  }
}