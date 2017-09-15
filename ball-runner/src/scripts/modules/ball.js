const _default = {
  x: 0,
  y: 0
}

import { BALL_RADIUS, TAIL_LENGTH, TAIL_DIST, DPR, TAIL_WIDTH } from './configuration'

export default class Ball {
  constructor (ctx, config) {
    this.ctx = ctx
    Object.assign(this, _default, config)
    this.tails = this.initTail()
    this.f = 1
  }
  /**
   * 初始化尾巴数组
   * @return {Array} 尾巴数组
   */
  initTail () {
    let { x, y } = this
    let tails = []
    let startPos = [x, y + BALL_RADIUS + TAIL_DIST]

    for (let i = 0; i < TAIL_LENGTH / DPR; i++) {
      tails.push({
        x: startPos[0],
        y: startPos[1] + i * DPR
      })
    }

    return tails
  }

  /**
   * 更新球的位置，并且修改尾巴坐标数组
   */
  updateBallPos (pos) {
    let a = this.tails[0].x
    for (let i = 1; i < this.tails.length; i++) {
      let b = this.tails[i].x
      this.tails[i].x = a
      a = b
    }

    this.x = pos
    this.tails[0] = {
      x: pos,
      y: this.tails[0].y
    }
  }

  /**
   * 渲染
   */
  render () {
    this.renderShadow()
    this.renderBall()
    this.renderTail()
  }

  /**
   * 画个球
   */
  renderBall () {
    let { x, y } = this
    let grd = this.ctx.createLinearGradient(x, y - BALL_RADIUS, x, y + BALL_RADIUS)
    grd.addColorStop(0, '#fff')
    grd.addColorStop(0.5, '#fff')
    grd.addColorStop(0.5, '#c7baac')
    grd.addColorStop(1, '#c7baac')
    this.ctx.fillStyle = grd
    this.ctx.beginPath()
    this.ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2, true)
    this.ctx.fill()
  }
  /**
   * 画球的阴影
   */
  renderShadow () {
    let { x, y } = this

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.save()
    this.ctx.scale(1, 0.5)
    this.ctx.beginPath()
    this.ctx.arc(x, y * 2 + BALL_RADIUS * 2, BALL_RADIUS, 0, 2 * Math.PI, false)
    this.ctx.closePath()
    this.ctx.restore()
    this.ctx.fill()
  }
  /**
   * 画球的小尾巴
   */
  renderTail () {
    let { x, y } = this

    let startPos = [x, y + BALL_RADIUS + TAIL_DIST]
    let endPos = [x, y + BALL_RADIUS + TAIL_DIST + TAIL_LENGTH]
    let grd = this.ctx.createLinearGradient(startPos[0], startPos[1], endPos[0], endPos[1])
    grd.addColorStop(0, 'rgba(255, 255, 255, .8)')
    grd.addColorStop(0.5, 'rgba(255, 255, 255, .5)')
    grd.addColorStop(1, 'transparent')

    /* 轨迹尾巴 */
    this.ctx.strokeStyle = grd
    this.ctx.lineWidth = TAIL_WIDTH
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    for (let i = 1; i < this.tails.length; i++) {
      this.ctx.moveTo(this.tails[i].x, this.tails[i].y)
      this.ctx.lineTo(this.tails[i - 1].x, this.tails[i - 1].y)
    }
    this.ctx.stroke()
  }
}