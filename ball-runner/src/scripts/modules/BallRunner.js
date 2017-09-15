/**
 * BallRunner.js
 * 一个小球滚动的 Canvas 游戏
 *
 * author: NightCat
 * create_at: 2017/09/12
 */

import Ball from './ball'
import Scene from './scene'

const _default = {
  width: 600,
  height: 500
}

import { DPR, MAX_BALL_PER_DISTANCE, BG_COLOR, BALL_RADIUS } from './configuration'

export default class BallRunner {
  constructor (id, config) {
    this.config = Object.assign({}, _default, config)

    // 初始化
    this.init(id)
    this.initGame()

    // 绑定事件
    this.moveBall = this.moveBall.bind(this)
    this.bindEvent()
  }

  /**
   * 初始化 Canvas
   */
  init (id) {
    if (!id) {
      console.error('[BallRunner.js] param id is the required.')
      return false
    }

    this.canvas = document.getElementById(id)
    this.ctx = this.canvas.getContext('2d')

    // 乘以DPR是为了在高倍分辨率下保持高清
    this.canvas.width = this.width = (this.config.width || this.canvas.offsetWidth) * DPR
    this.canvas.height = this.height = (this.config.height || this.canvas.offsetHeight) * DPR
    this.canvas.style.width = `${this.width / DPR}px`
    this.canvas.style.height = `${this.height / DPR}px`
    this.bounds = this.canvas.getBoundingClientRect()
  }

  /**
   * 初始化游戏
   */
  initGame () {
    this.startSign = false
    this.mx = 0

    // 生成球
    this.ball = new Ball(this.ctx, {
      x: this.width / 2,
      y: this.height / 2
    })

    // 生成场景
    this.scene = new Scene(this.ctx, {
      width: this.width,
      height: this.height
    })

    while (!this.inRoad()) {
      this.scene.init()
    }

    // 开始渲染
    this.render()
  }

  /**
   * 绑定事件
   */
  bindEvent () {
    this.canvas.addEventListener('mousemove', this.moveBall)
  }

  /**
   * 解除绑定事件
   */
  unbindEvent () {
    this.canvas.removeEventListener('mousemove', this.moveBall)
  }

  /**
   * 控制小球左右移动
   * @return {[type]} [description]
   */
  moveBall (e) {
    if (!this.startSign) {
      return false
    }

    e.preventDefault()
    this.mx = (e.clientX - this.bounds.left) * DPR
  }

  /**
   * 游戏开始
   */
  start () {
    if (this.startSign) {
      return false
    }

    this.startSign = true
    const step = () => {
      if (!this.startSign) {
        return false
      }
      this.update()
      this.render()
      if (!this.inRoad()) {
        console.log('You Lose!')
        this.startSign = false
      }
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  /**
   * 更新游戏
   */
  update () {
    this.updateScene()
    this.updateBall()
  }

  inRoad () {
    this.scene.connectRoadPath()
    return this.ctx.isPointInPath(this.ball.x, this.ball.y + BALL_RADIUS)
  }

  /**
   * 更新个球
   */
  updateBall () {
    if (!this.mx) {
      return false
    }

    let diff = this.mx - this.ball.x
    let direction = diff < 0 ? -1 : 1
    this.ball.updateBallPos(this.ball.x + direction * ((Math.abs(diff) / this.width) * MAX_BALL_PER_DISTANCE))
  }

  /**
   * 更新场景
   */
  updateScene () {
    this.scene.update()
  }

  /**
   * 渲染画布
   */
  render () {
    this.renderBackground()
    this.renderScene()
    this.renderBall()
  }

  /**
   * 画个背景
   */
  renderBackground () {
    this.ctx.fillStyle = BG_COLOR
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  /**
   * 画个场景
   */
  renderScene () {
    this.scene.render()
  }

  /**
   * 画个球
   */
  renderBall () {
    this.ball.render()
  }
}