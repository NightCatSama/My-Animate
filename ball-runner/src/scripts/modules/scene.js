const _default = {
  width: 600,
  height: 500
}

import { DPR, MAX_ROAD_WIDTH, MIN_ROAT_WIDTH, MAX_LENGTH, MIN_LENGTH, GAME_WIDTH, GAME_SPEED, ROAD_COLOR, WALL_COLOR } from './configuration'

export default class Scene {
  constructor (ctx, config) {
    this.ctx = ctx
    Object.assign(this, _default, config)

    this.spacer = (this.width - GAME_WIDTH) / 2
    this.init()
  }

  init () {
    this.leftLines = this.initLeftLines()
    this.rightLines = this.initRightLines()
  }

  update () {
    this.leftLines = this.sceneRollDown(this.leftLines)
    this.rightLines = this.sceneRollDown(this.rightLines)

    if (this.leftLines[0][0].y > -this.height * 2) {
      this.leftLines.unshift(this.getLeftLine(this.leftLines[0][0], true))
      this.rightLines.unshift(this.getRightLine(this.leftLines[0], this.rightLines[0][0], true))
    }
  }

  sceneRollDown (arr) {
    return arr.filter((obj) => {
      obj[0].y += GAME_SPEED
      obj[1].y += GAME_SPEED

      return obj[0].y < this.height * 2
    })
  }

  initLeftLines () {
    let arr = [this.getLeftLine()]
    while (arr[arr.length - 1][1].y < this.height) {
      arr.push(this.getLeftLine(arr[arr.length - 1][1]))
    }
    return arr
  }

  initRightLines () {
    let arr = []
    for (let i = 0; i < this.leftLines.length; i++) {
      arr.push(this.getRightLine(this.leftLines[i], i > 0 && arr[i - 1][1]))
    }
    return arr
  }

  getLeftLine (dot, isEnd) {
    let endDot
    if (isEnd) {
      endDot = dot
      dot = this.getLeftOtherDot(endDot, isEnd)
    }
    else if (dot) {
      endDot = this.getLeftOtherDot(dot)
    }
    else {
      dot = {
        x: this.getRandom(this.spacer, this.width - MAX_ROAD_WIDTH - this.spacer),
        y: -this.height * 2
      }
      endDot = this.getLeftOtherDot(dot)
    }
    return [dot, endDot]
  }

  getRightLine (line, dot, isEnd) {
    return isEnd ? [this.getRightDot(line[0]), dot] : [dot || this.getRightDot(line[0]), this.getRightDot(line[1])]
  }

  render () {
    this.ctx.fillStyle = ROAD_COLOR
    this.renderWall()
    this.connectRoadPath()
    this.ctx.fill()
  }

  connectRoadPath () {
    this.ctx.save()
    this.ctx.translate(0, this.height / 2)
    this.ctx.scale(1, 0.5)

    this.ctx.beginPath()
    this.renderLine(this.leftLines[0][0], this.leftLines[0][1])
    Array.from(this.leftLines, (obj) => {
      this.renderLine(obj[0], obj[1])
    })
    this.renderLine(this.leftLines[this.leftLines.length - 1][1], this.rightLines[this.rightLines.length - 1][1])
    for (let i = this.rightLines.length - 1; i > 0; i--) {
      let obj = this.rightLines[i]
      this.renderLine(obj[1], obj[0])
    }
    this.renderLine(this.rightLines[0][0], this.leftLines[0][0])

    this.ctx.restore()
  }

  renderLine (dot1, dot2) {
    this.ctx.lineTo(dot1.x, dot1.y)
    this.ctx.lineTo(dot2.x, dot2.y)
  }

  renderWall () {
    this.ctx.save()
    this.ctx.translate(0, this.height / 2)
    this.ctx.scale(1, 0.5)

    Array.from(this.leftLines.concat(this.rightLines), (obj) => {
      let [dot1, dot2] = obj

      let grd = this.ctx.createLinearGradient(dot1.x, dot1.y, dot2.x + this.height, dot2.y + this.height)
      grd.addColorStop(0, WALL_COLOR)
      grd.addColorStop(1, 'transparent')

      this.ctx.fillStyle = grd
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.moveTo(dot1.x, dot1.y)
      this.ctx.lineTo(dot2.x, dot2.y)
      this.ctx.lineTo(dot2.x, dot2.y + this.height)
      this.ctx.lineTo(dot1.x, dot1.y + this.height)
      this.ctx.restore()
      this.ctx.fill()
    })

    this.ctx.restore()
  }

  getLeftOtherDot (dot, isEnd) {
    return {
      x: dot.x > this.width / 2 ? this.getRandom(this.spacer, this.width / 2) : this.getRandom(this.width / 2, this.width - MAX_ROAD_WIDTH - this.spacer),
      y: dot.y + (this.getRandom(MIN_LENGTH, MAX_LENGTH) * (isEnd ? -1 : 1))
    }
  }

  getRightDot (dot) {
    return {
      x: this.getRandom(dot.x + MIN_ROAT_WIDTH, dot.x + MAX_ROAD_WIDTH),
      y: dot.y
    }
  }

  getRandom (min, max) {
    return ~~(Math.random() * (max - min)) + min
  }
}