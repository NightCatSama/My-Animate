/**
 * BallRunner.js
 * 一个小球滚动的 Canvas 游戏
 *
 * author: NightCat
 * create_at: 2017/09/12
 */

import Ball from './ball'

const _default = {
  width: 600,
  height: 500,
  bgColor: '#31102e',
  roadColor: '#ff186b'
}

const DPR = window.devicePixelRatio || 1
const MAX_BALL_PER_DISTANCE = 10

export default class BallRunner {
  constructor (id, config) {
    this.config = Object.assign({}, _default, config)

    // 初始化
    this.init(id)
    this.startSign = false

    // 生成球
    this.ball = new Ball(this.ctx, {
      x: this.width / 2,
      y: this.height / 2,
      r: 10 * DPR
    })

    // 绑定事件
    this.moveBall = this.moveBall.bind(this)
    this.bindEvent()

    // 开始渲染
    this.render()
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
    this.mx = e.clientX - this.bounds.left
  }

  /**
   * 游戏开始
   */
  start () {
    this.startSign = true

    const step = () => {
      if (!this.startSign) {
        return false
      }

      this.update()
      this.render()
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  /**
   * 更新游戏
   */
  update () {
    this.updateBall()
  }

  /**
   * 更新个球
   */
  updateBall () {
    if (!this.mx) {
      return false
    }
    // 【未完成】
    this.ball.x += (Math.abs(this.mx - this.ball.x) < 3 ? 0 : this.mx > this.ball.x ? 1 : -1) * MAX_BALL_PER_DISTANCE * DPR
    this.ballMoveFlag = 0
  }

  /**
   * 渲染画布
   */
  render () {
    this.renderBackground()
    this.renderBall()
  }

  /**
   * 画个背景
   */
  renderBackground () {
    this.ctx.fillStyle = this.config.bgColor
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  /**
   * 画个球
   */
  renderBall () {
    this.ball.render()
  }
}