/**
 * BallRunner.js
 * 一个小球滚动的 Canvas 游戏
 */

import Ball from './ball'
import Scene from './scene'
import { DPR, MAX_BALL_PER_DISTANCE, BG_COLOR, BALL_RADIUS } from './configuration'

const _default = {
  width: 600,
  height: 500,
  gameOver: null
}

export default class BallRunner {
  config: {
    width: number,
    height: number,
    gameOver?: Function | null
  };
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  bounds: {
    left: number,
    top: number
  };
  startSign: Boolean;
  point: number = 0;
  private _mx: number = 0;
  ball: Ball;
  scene: Scene;

  constructor (id: string, config?: object) {
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
  init (id: string): void {
    if (!id) {
      return console.error('[BallRunner.js] param id is the required.')
    }

    this.canvas = <HTMLCanvasElement> document.getElementById(id)

    if (!this.canvas) {
      return console.error('[BallRunner.js] Could not find the canvas element.')
    }

    this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d')

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
    if (!this.ctx) {
      return console.error('[BallRunner.js] Could not find the canvas element.')
    }

    this.startSign = false
    this._mx = 0
    this.point = 0

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

    // 开始渲染
    this.render()
  }

  /**
   * 绑定事件
   */
  bindEvent () {
    if (!this.canvas) {
      return console.error('[BallRunner.js] Could not find the canvas element.')
    }
    this.canvas.addEventListener('mousemove', this.moveBall)
    this.canvas.addEventListener('touchmove', this.moveBall)
  }

  /**
   * 解除绑定事件
   */
  unbindEvent () {
    if (!this.canvas) {
      return console.error('[BallRunner.js] Could not find the canvas element.')
    }
    this.canvas.removeEventListener('mousemove', this.moveBall)
    this.canvas.removeEventListener('touchmove', this.moveBall)
  }

  /**
   * 控制小球左右移动
   */
  moveBall (e: any) {
    if (!this.startSign) {
      return
    }

    e.preventDefault()
    if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
    this._mx = (e.clientX - this.bounds.left) * DPR
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
      this.point++
      this.update()
      this.render()
      if (!this.inRoad()) {
        this.config.gameOver && this.config.gameOver(this.point)
        this.initGame()
      }
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  /**
   * 游戏暂停
   */
  pause () {
    this.startSign = false
  }

  /**
   * 更新游戏
   */
  update () {
    this.updateScene()
    this.updateBall()
  }

  /**
   * 判断小球是否在路径中
   */
  inRoad (): Boolean {
    this.scene.connectRoadPath()
    return this.ctx.isPointInPath(this.ball.x, this.ball.y + BALL_RADIUS)
  }

  /**
   * 更新个球
   */
  updateBall () {
    if (!this._mx) {
      return false
    }

    let diff = this._mx - this.ball.x
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
    this.renderPoint()
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

  /**
   * 画个分数
   */
  renderPoint () {
    this.ctx.save()

    this.ctx.font = 'normal 50px DINAlternate-Bold'
    this.ctx.textAlign = 'right'
    this.ctx.fillStyle = '#fff'
    this.ctx.fillText(`${this.point}`, this.width - 10, 50)

    this.ctx.restore()
  }
}
