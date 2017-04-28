export default class Canvas {
	constructor() {
    this.canvas = document.getElementById('canvas')
    this.cxt = canvas.getContext('2d')
    this.width = this.canvas.width = this.canvas.offsetWidth
    this.height = this.canvas.height = this.canvas.offsetHeight
    this.bounds = this.canvas.getBoundingClientRect()

    this.T = 10000
    this.works = []

    this.clickHandle = this.clickHandle.bind(this)
    this.bindEvent()
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
    return this.render()
    if (this.isAnimate) {
      return false
    }

    this.isAnimate = true

    let start = null
    const step = (timeStamp) => {
      if (!this.isAnimate) return false
      if (start === null) start = timeStamp

      let progress = timeStamp - start

      this.render(progress % this.T)
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  addWork(origin_coord) {
    let range = [100, 400]
    let count = 200
    this.createWork(origin_coord, range, count)

    range = [500, 1000]
    count = 100
    this.createWork(origin_coord, range, count)

    range = [1000, 3000]
    count = 50
    this.createWork(origin_coord, range, count)

    this.start()
  }
  createWork(origin_coord, range, count) {
    let cur_deg = 0
    let deg_gap = 360 / count
    let prevDot
    let firstDot
    let work = {
      origin_coord,
      dots: []
    }

    for(let i = 0; i < count; i++) {
      let deg_range = [cur_deg, cur_deg + deg_gap]
      cur_deg += deg_gap

      let coord1 = this.getRandomDot(range, deg_range, origin_coord)
      let coord2 = this.getRandomDot(range, deg_range, origin_coord)

      if (coord1.deg > coord2.deg) {
        let obj = coord1
        coord1 = coord2
        coord2 = obj
      }

      work.dots.push({
        coord1,
        coord2
      })

      if (i === 0) {
        work.firstDot = coord1
      }
    }

    this.works.push(work)
  }
  render(progress) {
    this.cxt.clearRect(0, 0, this.width, this.height)

    // this.cxt.fillStyle = '#fff'
    this.cxt.strokeStyle = `#fff`
    this.cxt.lineWidth = 0.5

    Array.from(this.works, (work) => {
      let { origin_coord, firstDot } = work
      let prevDot

      Array.from(work.dots, (obj, i) => {
        let { coord1, coord2 } = obj

        let c1 = this.getPos(coord1, progress)
        let c2 = this.getPos(coord2, progress)

        this.renderTri(origin_coord, { x: c1.x1, y: c1.y1 }, { x: c2.x1, y: c2.y1 })
        this.renderTri(origin_coord, { x: c1.x2, y: c1.y2 }, { x: c2.x2, y: c2.y2 })

        // this.renderLine(origin_coord.x, origin_coord.y, coord1.e_x, coord1.e_y)
        // this.renderLine(origin_coord.x, origin_coord.y, coord2.e_x, coord2.e_y)

        // this.renderLine(origin_coord.x, origin_coord.y, c1.x1, c1.y1)
        // this.renderLine(origin_coord.x, origin_coord.y, c2.x1, c2.y1)
        // this.renderLine(origin_coord.x, origin_coord.y, c1.x2, c1.y2)
        // this.renderLine(origin_coord.x, origin_coord.y, c2.x2, c2.y2)

        // this.renderLine(c1.x1, c1.y1, c2.x1, c2.y1)
        // if (prevDot) {
        //   this.renderLine(c1.x2, c1.y2, prevDot.x2, prevDot.y2)
        //   prevDot = null
        // }
        // if (i === work.dots.length) {
        //   this.renderLine(c2.x2, c2.y2, firstDot.x2, firstDot.y2)
        // }
        // prevDot = c2
      })
    })
  }
  getPos(coord, progress) {
    let b = progress ? (progress / this.T) : 1
    // b = b > 0.5 ? (1 - b) : b

    return {
      x1: (coord.x1 - coord.x) * b + coord.x,
      y1: (coord.y1 - coord.y) * b + coord.y,
      x2: (coord.x2 - coord.x) * b + coord.x,
      y2: (coord.y2 - coord.y) * b + coord.y
    }
  }
  //  根据范围得到一个随机数
  getRandomNumber([min, max]) {
    return ~~(Math.random() * (max - min)) + min
  }
  //  根据半径范围获得一个随机的点
  getRandomDot(range, deg_range, {x, y}) {
    const deg = this.getRandomNumber(deg_range)
    const radian = Math.PI / 180 * deg
    const d  = this.getRandomNumber(range)
    const d2  = this.getRandomNumber(range)
    return {
      deg,
      x,
      y,
      x1: x + d * Math.cos(radian),
      y1: y + d * Math.sin(radian),
      x2: x + d2 * Math.cos(radian),
      y2: y + d2 * Math.sin(radian),
      e_x: x + this.width * Math.cos(radian),
      e_y: y + this.width * Math.sin(radian),
    }
  }
  //  画一个点
  renderDot(x, y) {
    this.cxt.beginPath()
    this.cxt.arc(x, y, 1, 0, Math.PI * 2, true)
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
    // this.cxt.fill()
  }
}