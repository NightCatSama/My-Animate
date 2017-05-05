export default class Canvas {
	constructor() {
    this.canvas = document.getElementById('canvas')
    this.cxt = canvas.getContext('2d')
    this.width = this.canvas.width = this.canvas.offsetWidth
    this.height = this.canvas.height = this.canvas.offsetHeight
    this.bounds = this.canvas.getBoundingClientRect()

    this.ball_count = 10       //  总个数
    this.line_range = 200     //  连线范围
    this.r_range = [20, 40]   //  半径范围
    this.color = [23, 64, 86] //  颜色[r, g, b]
    this.opacity = [0.4, 1]   //  透明度范围
    this.speed = [-5, 5]    //  速度范围
    this.balls = []

    this.clickHandle = this.clickHandle.bind(this)
    // this.bindEvent()
    this.start()
	}
  //  绑定事件
  bindEvent() {
    this.canvas.addEventListener('click', this.clickHandle, false)
  }
  //  移除事件
  unbindEvent() {
    this.canvas.removeEventListener('click', this.clickHandle, false)
  }
  //  点击获取鼠标位置
  clickHandle(e) {
    let mx = e.clientX - this.bounds.left
    let my = e.clientY - this.bounds.top
    this.addWork({ x: mx, y: my })
  }
  //  动画开始
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
  //  增加一个球
  addBall() {
    let ball = {
      x: this.getRandomNumber([0, this.width]),
      y: this.getRandomNumber([0, this.height]),
      vx: this.getRandomNumber(this.speed),
      vy: this.getRandomNumber(this.speed),
      opacity: this.getRandomNumber(this.opacity),
      type: ~~this.getRandomNumber([0, 3])
    }
    ball.r = ball.opacity * (this.r_range[1] - this.r_range[0]) + this.r_range[0]
    ball.color = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]},`

    //  随机一种模式[0:实心球, 1:圆环, 2:双环]
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
      this.renderBall(ball)

      //  左右上下镜像球
      if (ball.x < ball.r) {
        this.renderBall(ball, ball.x + this.width, ball.y)
      }
      if (ball.x > this.width - ball.r) {
        this.renderBall(ball, ball.x - this.width, ball.y)
      }
      if (ball.y < ball.r) {
        this.renderBall(ball, ball.x, ball.y + this.height)
      }
      if (ball.y > this.height - ball.r) {
        this.renderBall(ball, ball.x, ball.y - this.height)
      }
    })
  }
  //  渲染单个球
  renderBall (ball, bx, by) {
    let x = bx || ball.x,
        y = by || ball.y

    //  大球体
    this.renderArc(x, y, ball.r, ball.color + ball.opacity + ')')

    //  type:1|2 空心白色部分
    this.cxt.globalCompositeOperation = 'destination-out'
    ball.type > 0 && this.renderArc(x, y, ball.empty.r, '#fff')

    //  type:2 球心部分
    this.cxt.globalCompositeOperation = 'source-over'
    ball.type === 2 && this.renderArc(x, y, ball.son.r, ball.son.color + ball.opacity + ')')

    //  连线
    Array.from(this.balls, (b) => {
      if (ball === b) {
        return false
      }

      let d = Math.sqrt(Math.pow(x - b.x, 2) + Math.pow(y - b.y, 2))
      if (d < this.line_range && d > (ball.r + b.r)) {
        var g = this.cxt.createLinearGradient(x, y, b.x, b.y)
        if (ball.type === 1) {
          g.addColorStop(0, `${ball.color} ${1 - d / this.line_range})`)
          g.addColorStop(ball.empty.r / d, `${ball.color} ${1 - d / this.line_range})`)
          g.addColorStop(ball.empty.r / d, 'transparent')
        }
        else if (ball.type === 2) {
          g.addColorStop(0, 'transparent')
          g.addColorStop(ball.son.r / d, 'transparent')
          g.addColorStop(ball.son.r / d, `${ball.color} ${1 - d / this.line_range})`)
          g.addColorStop(ball.empty.r / d, `${ball.color} ${1 - d / this.line_range})`)
          g.addColorStop(ball.empty.r / d, 'transparent')
        }
        else {
          g.addColorStop(0, 'transparent')
        }
        g.addColorStop(ball.r / d, 'transparent')
        g.addColorStop(ball.r / d, `${ball.color} ${1 - d / this.line_range})`)
        g.addColorStop(1 - b.r / d, `${b.color} ${1 - d / this.line_range})`)
        g.addColorStop(1 - b.r / d, 'transparent')
        g.addColorStop(1, 'transparent')
        this.cxt.strokeStyle = g
        this.renderLine(x, y, b.x, b.y)

        ball.isCrash = false
      }
      else if (d < (ball.r + b.r) && !ball.isCrash) {
        ball.isCrash = true
        b.isCrash = true
        this.crashHandle(ball, b)
      }
    })
  }
  crashHandle(b1, b2) {
    let deg = Math.atan2(b2.y - b1.y, b2.x - b1.x)
    let speed1 = Math.sqrt(b1.vx * b1.vx + b1.vy * b1.vy)
    let speed2 = Math.sqrt(b2.vx * b2.vx + b2.vy * b2.vy)
    let dir1 = Math.atan2(b1.vy, b1.vx)
    let dir2 = Math.atan2(b2.vy, b2.vx)

    let vx1 = speed1 * Math.cos(dir1 - deg)
    let vy1 = speed1 * Math.sin(dir1 - deg)
    let vx2 = speed2 * Math.cos(dir2 - deg)
    let vy2 = speed2 * Math.sin(dir2 - deg)

    let fx1 = vx2
    let fy1 = vy1
    let fx2 = vx1
    let fy2 = vy2

    b1.fx = Math.cos(deg) * fx1 + Math.cos(deg + Math.PI / 2) * fy1
    b1.fy = Math.sin(deg) * fx1 + Math.sin(deg + Math.PI / 2) * fy1
    b2.fx = Math.cos(deg) * fx2 + Math.cos(deg + Math.PI / 2) * fy2
    b2.fy = Math.sin(deg) * fx2 + Math.sin(deg + Math.PI / 2) * fy2
  }
  //  更新
  update() {
    this.balls.forEach((ball) => {
      if (ball.x < -ball.r) {
        ball.x = ball.x + this.width
      }
      if (ball.x > this.width + ball.r) {
        ball.x = ball.x - this.width
      }
      if (ball.y < -ball.r) {
        ball.y = ball.y + this.height
      }
      if (ball.y > this.height + ball.r) {
        ball.y = ball.y - this.height
      }
      if (ball.isCrash) {
        ball.vx = ball.fx
        ball.vy = ball.fy
      }

      ball.x += ball.vx
      ball.y += ball.vy
    })
  }
  //  根据范围得到一个随机数[[范围], 小数位]
  getRandomNumber([min, max], decimal) {
    return (Math.random() * (max - min)) + min
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