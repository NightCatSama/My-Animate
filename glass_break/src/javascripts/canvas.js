export default class Canvas {
	constructor() {
    this.canvas = document.getElementById('canvas')
    this.cxt = canvas.getContext('2d')
    this.width = this.canvas.width = this.canvas.offsetWidth
    this.height = this.canvas.height = this.canvas.offsetHeight
    this.bounds = this.canvas.getBoundingClientRect()

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
    this.render({ x: mx, y: my })
  }
  render(origin_coord) {
    const start_range = [0, 100]
    const range = [100, 300]
    const count = 20
    let cur_deg = 0
    let deg_gap = 360 / count

    this.cxt.strokeStyle = `#fff`
    for(let i = 0; i < count; i++) {
      let deg_range = [cur_deg, cur_deg + deg_gap]
      cur_deg += deg_gap
      let start_coord = this.getRandomDot(range, deg_range, origin_coord)
      let end_coord = this.getRandomDot(range, deg_range, origin_coord)
      this.renderTri(origin_coord, start_coord, end_coord)
      this.renderLine(origin_coord, start_coord)
      this.renderLine(origin_coord, end_coord)
    }
  }
  //  根据范围得到一个随机数
  getRandomNumber([min, max]) {
    return ~~(Math.random() * (max - min)) + min
  }
  //  根据半径范围获得一个随机的点
  getRandomDot(range, deg_range, {x, y}) {
    const deg = Math.PI / 180 * this.getRandomNumber(deg_range)
    const d  = this.getRandomNumber(range)
    return {
      x: x + d * Math.cos(deg),
      y: y + d * Math.sin(deg),
      e_x: x + this.width * Math.cos(deg),
      e_y: y + this.width * Math.sin(deg),
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
  renderLine(start, end) {
    this.cxt.lineWidth = this.getRandomNumber([3, 10]) * 0.1

    this.cxt.beginPath()
    this.cxt.moveTo(start.x, start.y)
    this.cxt.lineTo(end.e_x, end.e_y)
    this.cxt.closePath()

    this.cxt.stroke()
  }
  //  画个三角形
  renderTri(coord1, coord2, coord3) {
    this.cxt.moveTo(coord1.x, coord1.y)
    this.cxt.lineTo(coord2.x, coord2.y)
    this.cxt.lineTo(coord3.x, coord3.y)
    this.cxt.lineTo(coord1.x, coord1.y)

    this.cxt.stroke()
  }
}