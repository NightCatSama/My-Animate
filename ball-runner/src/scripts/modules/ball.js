const _default = {
  r: 30,
  x: 0,
  y: 0
}

export default class Ball {
  constructor (ctx, config) {
    this.ctx = ctx
    Object.assign(this, _default, config)
  }
  render () {
    this.renderShadow()
    this.renderBall()
    this.renderTail()
  }
  /**
   * 画球主体
   */
  renderBall () {
    let { x, y, r } = this

    let grd = this.ctx.createLinearGradient(x, y - r, x, y + r)
    grd.addColorStop(0, '#fff')
    grd.addColorStop(0.5, '#fff')
    grd.addColorStop(0.5, '#c7baac')
    grd.addColorStop(1, '#c7baac')

    this.ctx.fillStyle = grd

    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2, true)
    this.ctx.fill()
  }
  /**
   * 画球的阴影
   */
  renderShadow () {
    let { x, y, r } = this

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.save()
    this.ctx.scale(1, 0.5)
    this.ctx.beginPath()
    this.ctx.arc(x, y * 2 + r * 2, r, 0, 2 * Math.PI, false)
    this.ctx.closePath()
    this.ctx.restore()
    this.ctx.fill()
  }
  /**
   * 画球的小尾巴
   */
  renderTail () {
  }
}