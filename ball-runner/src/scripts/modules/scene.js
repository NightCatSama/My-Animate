const _default = {
  width: 600,
  height: 500
}

const DPR = window.devicePixelRatio || 1
const MAX_ROAD_WIDTH = 250 * DPR  // 道路最大宽度
const MIN_ROAT_WIDTH = 100 * DPR  // 道路最小宽度
const MAX_LENGTH = 300 * DPR // 一节道路的最大长度
const MIN_LENGTH = 150 * DPR // 一节道路的最小长度
const SPACER = 50 * DPR // 左右留白

export default class Scene {
  constructor (ctx, config) {
    this.ctx = ctx
    Object.assign(this, _default, config)
    this.leftLines = this.initLeftLines()
    this.rightLines = []
  }

  initLeftLines () {
    let dot = {
      x: this.getRandom(SPACER, this.width - SPACER),
      y: 0
    }
    let endDot = this.getEndDot(dot, true)
    return {
    }
  }

  render () {
  }

  getEndDot (dot, isLeft) {
    let d = {}
    if (dot > this.width / 2) {
      d.x = this.getRandom()
    }
  }

  getRandom (min, max) {
    return ~~(Math.random() * (max - min)) + min
  }
}