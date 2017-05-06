export default class Canvas {
	constructor(id) {
    this.canvas = document.getElementById(id)
    this.cxt = canvas.getContext('2d')
    this.width = this.canvas.width = this.canvas.offsetWidth
    this.height = this.canvas.height = this.canvas.offsetHeight
    this.bounds = this.canvas.getBoundingClientRect()

    this.ball_count = 30       // 总个数
    this.line_range = 200     // 连线范围
    this.r_range = [10, 20]   // 半径范围
    this.color = [[0, 64, 121], [80, 5, 121]] // 颜色[[r, g, b], ..]
    this.period = 10  // 颜色呼吸周期
    this.opacity = [0.3, 0.8]   // 透明度范围
    this.speed = [-2, 2]    // 速度范围

    this.mouse = {
      x: 0,
      y: 0,
      r: 0,
      type: -1,
      color: [255, 3, 80],
      catchBall: false,
      onLine: false
    }

    this.vballs = []
    this.balls = []

    this.clickHandle = this.clickHandle.bind(this)
    this.mouseHandle = this.mouseHandle.bind(this)
    this.bindEvent()
    this.start()
	}
  //  绑定事件
  bindEvent() {
    this.canvas.addEventListener('click', this.clickHandle, false)
    this.canvas.addEventListener('mousemove', this.mouseHandle, false)
  }
  //  移除事件
  unbindEvent() {
    this.canvas.removeEventListener('click', this.clickHandle, false)
    this.canvas.removeEventListener('mousemove', this.mouseHandle, false)
  }
  //  点击控制动画
  clickHandle(e) {
    this.toggleAnimateStatus()
  }
  //  鼠标移动事件
  mouseHandle(e) {
    let t = e.timeStamp - this.mouse.timeStamp
    this.mouse.timeStamp = e.timeStamp

    let mx = e.clientX - this.bounds.left
    let my = e.clientY - this.bounds.top

    this.mouse.x = mx
    this.mouse.y = my
  }
  //  动画开始
  start() {
    if (this.isAnimate) {
      return false
    }

    for(var i = this.vballs.length; i < this.ball_count; i++) {
      this.addBall()
    }

    this.isAnimate = true

    const step = () => {
      if (!this.isAnimate) return false
      this.render()
      this.update()
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  //  切换动画状态
  toggleAnimateStatus() {
    if (this.isAnimate) {
      return this.isAnimate = false
    }
    else {
      this.start()
    }
  }
  //  得到颜色渐变数组
  getColorList(color, freq) {
    //  颜色差值[r, g, b]
    let ColorDis = [color[1][0] - color[0][0], color[1][1] - color[0][1], color[1][2] - color[0][2]]

    //  颜色差最大的绝对值
    let ColorLength = Math.max(Math.abs(ColorDis[0]), Math.abs(ColorDis[1]), Math.abs(ColorDis[2])) * freq

    //  颜色变化系数
    let ColorChange = ColorDis.map((c) => c / ColorLength)

    let ColorList = []

    for (let i = 0; i < ColorLength; i++) {
      ColorList.push(ColorChange.map((c, index) => (color[0][index] + c * i)))
    }

    return ColorList
  }
  //  增加一个球
  addBall() {
    let ball = {
      vx: this.getRandomNumber(this.speed),  // 水平方向加速度
      vy: this.getRandomNumber(this.speed),  // 垂直方向加速度
      opacity: this.getRandomNumber(this.opacity), // 透明度
      freq: this.period,  // 颜色变化周期
      type: ~~this.getRandomNumber([0, 3]),  // 小球类型[-1:鼠标, 0:实心球, 1:圆环, 2:双环]
      cur_i: 0,  // 当前颜色step
      reverse: false, // 是否反向颜色渐变
      withMouse: 0  // 与鼠标位置的关系  [0:范围外, 1:范围内, 2:球中]
    }

    ball.r = (1 - ball.opacity) * (this.r_range[1] - this.r_range[0]) + this.r_range[0]
    ball.x = this.getRandomNumber([ball.r, this.width - ball.r])
    ball.y = this.getRandomNumber([ball.r, this.height - ball.r])
    
    if (this.isOverlap(ball)) {
      return this.addBall()
    }

    ball.color = this.color[0]
    ball.ColorList = this.getColorList(this.color, ball.freq)

    switch(ball.type) {
      case 0: break;
      case 1: 
        ball.emptyR = this.getRandomNumber([ball.r / 2, ball.r / 4 * 3])
        break;
      case 2: 
        ball.emptyR = this.getRandomNumber([ball.r / 2, ball.r / 4 * 3])
        ball.sonR = this.getRandomNumber([ball.emptyR / 2, ball.emptyR / 4 * 3])
        break;
    }

    this.vballs.push(ball)
  }
  //  判断该位置是否重叠
  isOverlap(ball) {
    return !this.vballs.every((b) => {
      let d = Math.sqrt(Math.pow(ball.x - b.x, 2) + Math.pow(ball.y - b.y, 2))
      if (d <= (ball.r + b.r)) {
        return false
      }
      return true
    })
  }
  //  根据虚拟球生成四个镜像球
  getBalls() {
    var ball = null,
        balls = []
		
    for (var i = 0, len = this.vballs.length; i < len; i++) {
      ball = this.vballs[i]
	  balls.push(ball)
	  balls = balls.concat(this.addMirrorBalls(ball))
    }

    return balls
  }
  //  判断位置生成镜像球
  addMirrorBalls(ball) {
	let range = this.r_range[1] * 4
	let balls = []
	const newPos = {}
	if (ball.x < range) {
		newPos.x = ball.x + this.width
	}
	if (ball.x > this.width - range) {
		newPos.x = ball.x - this.width
	}
	if (ball.y < range) {
		newPos.y = ball.y + this.height
	}
	if (ball.y > this.height - range) {
		newPos.y = ball.y - this.height
	}
	
	for (var i in newPos) {
		balls.push(this.addMirrorBall(ball, { [i]: newPos[i], parent: ball }))
	}
	
	if (Object.keys(newPos).length === 2) {
		balls.push(this.addMirrorBall(ball, { x: newPos.x, y: newPos.y, parent: ball }))
	}

	return balls
  }
  //  添加一个镜像Ball
  addMirrorBall(ball, obj) {
    var newBall = {}
    for (var key in ball) {
      if (obj[key] !== undefined) {
        newBall[key] = obj[key]
      }
      else {
        newBall[key] = ball[key]
      }
    }

    return newBall
  }
  //  渲染
  render(progress) {
    this.cxt.clearRect(0, 0, this.width, this.height)

    this.balls.length = 0
    
    this.balls = this.getBalls()

    this.balls.push(this.mouse)

    this.mouse.noLine = this.mouse.catchBall
    this.mouse.catchBall = false
    Array.from(this.balls, (ball, i) => {
      this.renderBall(ball, i)
    })
  }
  //  渲染单个球
  renderBall (ball, i) {
    let x = ball.x,
        y = ball.y,
        color = ball.color

    //  大球体
    this.renderArc(x, y, ball.r, this.getRGBA(color, ball.opacity))

    //  type:1|2 空心白色部分
    this.cxt.globalCompositeOperation = 'destination-out'
    ball.type > 0 && this.renderArc(x, y, ball.emptyR, '#fff')

    //  type:2 球心部分
    this.cxt.globalCompositeOperation = 'source-over'
    ball.type === 2 && this.renderArc(x, y, ball.sonR, this.getRGBA(color, ball.opacity))

    //  连线
    Array.from(this.balls, (b, index) => {
      if (index <= i) {
        return false
      }

      let d = Math.sqrt(Math.pow(x - b.x, 2) + Math.pow(y - b.y, 2))
      if (d < this.line_range && d > (ball.r + b.r)) {
        if (b.type === -1) {
          ball.withMouse = 1
          this.resetColorList(ball)
          ball.ColorList = this.getColorList([color, this.mouse.color], 1)
          
          if (this.mouse.noLine) {
            return false
          }
        }
        let g = this.cxt.createLinearGradient(x, y, b.x, b.y)
        let opacity = 1 - d / this.line_range
        let ballColor = this.getRGBA(color, opacity)
        let bColor = this.getRGBA(b.color, opacity)
        if (ball.type === 1) {
          g.addColorStop(0, ballColor)
          g.addColorStop(ball.emptyR / d, ballColor)
          g.addColorStop(ball.emptyR / d, 'transparent')
        }
        else if (ball.type === 2) {
          g.addColorStop(0, 'transparent')
          g.addColorStop(ball.sonR / d, 'transparent')
          g.addColorStop(ball.sonR / d, ballColor)
          g.addColorStop(ball.emptyR / d, ballColor)
          g.addColorStop(ball.emptyR / d, 'transparent')
        }
        else {
          g.addColorStop(0, 'transparent')
        }
        g.addColorStop(ball.r / d, 'transparent')
        g.addColorStop(ball.r / d, ballColor)
        g.addColorStop(1 - b.r / d, bColor)
        g.addColorStop(1 - b.r / d, 'transparent')
        g.addColorStop(1, 'transparent')
        this.cxt.strokeStyle = g
        this.renderLine(x, y, b.x, b.y)

        if (b.type === -1) {
          ball.withMouse = 1
          this.resetColorList(ball)
          ball.ColorList = this.getColorList([color, this.mouse.color], 1)
        }
      }
      else if (d < (ball.r + b.r) && !b.isCrash && !ball.isCrash) {
        if (b.type === -1) {
          ball.withMouse = 2
          this.mouse.catchBall = true
          this.resetColorList(ball)
          ball.ColorList = this.getColorList([color, this.mouse.color], 0.2)
        }
        else {
          ball.isCrash = true
          b.isCrash = true
          this.crashHandle(ball, b)

          if (ball.parent) {
            ball.parent.isCrash = true
          }

          if (b.parent) {
            b.parent.isCrash = true
          }
        }
      }
      else if (b.type === -1) {
        ball.withMouse = 0
        this.resetColorList(ball)
        ball.ColorList = this.getColorList(this.color, 1)
      }
    })
  }
  resetColorList(ball) {
    ball.cur_i = 0
    ball.reverse = false
  }
  //  处理两球碰撞
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
    this.vballs = this.vballs.map((ball) => {
      if (ball.x < -ball.r) {
        ball.x = ball.x + this.width
      }
      else if (ball.x > this.width + ball.r) {
        ball.x = ball.x - this.width
      }
      else if (ball.y < -ball.r) {
        ball.y = ball.y + this.height
      }
      else if (ball.y > this.height + ball.r) {
        ball.y = ball.y - this.height
      }
      this.updateColor(ball)

      if (ball.isCrash) {
        ball.isCrash = false

        ball.vx = ball.fx
        ball.vy = ball.fy
      }

      if (ball.withMouse === 1) {
        let g = Math.random() * 0.02;

        if (ball.y > this.mouse.y) {
          ball.vy = ball.vy * 0.99 + g;
        } else {
          ball.vy = ball.vy * 0.99 - g;
        }

        if (ball.x > this.mouse.x) {
          ball.vx = ball.vx * 0.99 + g;
        } else {
          ball.vx = ball.vx * 0.99 - g;
        }
      }
      if (ball.withMouse !== 2) {
        ball.x += ball.vx
        ball.y += ball.vy
      }

      return ball
    })
  }
  //  更新小球颜色
  updateColor(ball) {
    ball.color = ball.color.map((n, i) => {
      ball.cur_i++
      if (ball.cur_i === ball.ColorList.length) {
        ball.cur_i = 0
        ball.reverse = !ball.reverse
      }
      return ball.ColorList[ball.reverse ? ball.ColorList.length - ball.cur_i - 1 : ball.cur_i][i]
    })
  }
  getRGBA(color, opacity) {
    return color === 'transparent' ? color : `rgba(${~~color[0]}, ${~~color[1]}, ${~~color[2]}, ${opacity})`
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