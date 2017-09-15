const _default = {
  width: 600,
  height: 500
}

import { MAX_ROAD_WIDTH, MIN_ROAT_WIDTH, MAX_LENGTH, MIN_LENGTH, GAME_WIDTH, GAME_SPEED, ROAD_COLOR, WALL_COLOR } from './configuration'

export default class Scene {
  constructor (ctx, config) {
    this.ctx = ctx
    Object.assign(this, _default, config)

    // 根据画布宽度和实际游戏宽度，计算左右留空区域
    this.spacer = (this.width - GAME_WIDTH) / 2

    // 初始化
    this.init()
  }

  /**
   * 初始化场景
   */
  init () {
    this.leftLines = this.initLeftLines()
    this.rightLines = this.initRightLines()
  }

  /**
   * 更新场景
   */
  update () {
    this.leftLines = this.sceneRollDown(this.leftLines)
    this.rightLines = this.sceneRollDown(this.rightLines)

    // 添加新的路
    if (this.leftLines[0][0].y > -this.height * 2) {
      this.leftLines.unshift(this.getLeftLine(this.leftLines[0][0], true))
      this.rightLines.unshift(this.getRightLine(this.leftLines[0], this.rightLines[0][0], true))
    }
  }

  /**
   * 场景下滚，数组的 y 增加，并把超出画布下边界的线清除掉
   * @param  {Array} arr 线数组
   * @return {Array}     线数组
   */
  sceneRollDown (arr) {
    return arr.filter((obj) => {
      obj[0].y += GAME_SPEED
      obj[1].y += GAME_SPEED

      return obj[0].y < this.height * 2
    })
  }

  /**
   * 初始化道路左侧的线
   * @return {Array} 线数组
   */
  initLeftLines () {
    let arr = [this.getLeftLine()]
    while (arr[arr.length - 1][1].y < this.height) {
      arr.push(this.getLeftLine(arr[arr.length - 1][1]))
    }
    return arr
  }


  /**
   * 初始化道路右侧的线
   * @return {Array} 线数组
   */
  initRightLines () {
    let arr = []
    for (let i = 0; i < this.leftLines.length; i++) {
      arr.push(this.getRightLine(this.leftLines[i], i > 0 && arr[i - 1][1]))
    }
    return arr
  }

  /**
   * 得到一条左边的线
   * @param  {Object}  dot        一个点坐标对象，为空时则根据范围随机一个点
   * @param  {Boolean} isReverse 是否为反方向获得线
   * @return {Array}             一个包含起点坐标和结束坐标的线数组 eg: [startDot, endDot]
   */
  getLeftLine (dot, isReverse) {
    let endDot
    if (isReverse) {
      endDot = dot
      dot = this.getLeftOtherDot(endDot, isReverse)
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

  /**
   * 得到一条右侧的线，根据左侧的线获得
   * @param  {Array}  line      左侧的线
   * @param  {Object}  dot       一个点坐标对象
   * @param  {Boolean} isReverse 是否为反方向获得线
   * @return {Array}            一个包含起点坐标和结束坐标的线数组 eg: [startDot, endDot]
   */
  getRightLine (line, dot, isReverse) {
    return isReverse ? [this.getRightDot(line[0]), dot] : [dot || this.getRightDot(line[0]), this.getRightDot(line[1])]
  }

  /**
   * 渲染场景
   */
  render () {
    this.renderWall()
    this.renderRoad()
  }

  /**
   * 渲染道路
   */
  renderRoad () {
    this.ctx.fillStyle = ROAD_COLOR
    this.connectRoadPath()
    this.ctx.fill()
  }

  /**
   * 连接道路的路径，将左侧和右侧线数组连接成一起
   * @return {[type]} [description]
   */
  connectRoadPath () {
    this.ctx.save()

    this.ctx.beginPath()
    this.connectLine(this.leftLines[0][0], this.leftLines[0][1])
    Array.from(this.leftLines, (obj) => {
      this.connectLine(obj[0], obj[1])
    })
    this.connectLine(this.leftLines[this.leftLines.length - 1][1], this.rightLines[this.rightLines.length - 1][1])
    for (let i = this.rightLines.length - 1; i > 0; i--) {
      let obj = this.rightLines[i]
      this.connectLine(obj[1], obj[0])
    }
    this.connectLine(this.rightLines[0][0], this.leftLines[0][0])

    this.ctx.restore()
  }

  /**
   * 根据两个点连成一条线
   * @param  {Object} dot1  起始点
   * @param  {Object} dot2  终止点
   */
  connectLine (dot1, dot2) {
    this.ctx.lineTo(dot1.x, dot1.y)
    this.ctx.lineTo(dot2.x, dot2.y)
  }

  /**
   * 画墙
   */
  renderWall () {
    this.ctx.save()
    Array.from(this.leftLines.concat(this.rightLines), (obj) => {
      let [dot1, dot2] = obj
      let WALL_HEIGHT = this.height / 2

      let grd = this.ctx.createLinearGradient(dot1.x, dot1.y, dot2.x + WALL_HEIGHT, dot2.y + WALL_HEIGHT)
      grd.addColorStop(0, WALL_COLOR)
      grd.addColorStop(1, 'transparent')

      this.ctx.fillStyle = grd
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.moveTo(dot1.x, dot1.y)
      this.ctx.lineTo(dot2.x, dot2.y)
      this.ctx.lineTo(dot2.x, dot2.y + WALL_HEIGHT)
      this.ctx.lineTo(dot1.x, dot1.y + WALL_HEIGHT)
      this.ctx.restore()
      this.ctx.fill()
    })
    this.ctx.restore()
  }

  /**
   * 根据一个点，获取另外一个点
   * @param  {Object}  dot       点坐标对象
   * @param  {Boolean} isReverse 是否反方向获取线
   * @return {[type]}            [description]
   */
  getLeftOtherDot (dot, isReverse) {
    return {
      x: dot.x > this.width / 2 ? this.getRandom(this.spacer, this.width / 2) : this.getRandom(this.width / 2, this.width - MAX_ROAD_WIDTH - this.spacer),
      y: dot.y + (this.getRandom(MIN_LENGTH, MAX_LENGTH) * (isReverse ? -1 : 1))
    }
  }

  /**
   * 得到右侧的点
   * @param  {Object} dot 一个左侧的坐标点
   * @return {Object}     一个右侧的坐标点
   */
  getRightDot (dot) {
    return {
      x: this.getRandom(dot.x + MIN_ROAT_WIDTH, dot.x + MAX_ROAD_WIDTH),
      y: dot.y
    }
  }

  /**
   * 根据范围，获得一个随机数
   * @param  {Number} min 范围最小值
   * @param  {Number} max 范围最大值
   * @return {Number}     随机数
   */
  getRandom (min, max) {
    return ~~(Math.random() * (max - min)) + min
  }
}