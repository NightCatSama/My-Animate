import { DPR, BOARD_BORDER_COLOR } from "./config";

/** 游戏棋盘 */
export class Board {
  elem!: HTMLCanvasElement
  ctx!: CanvasRenderingContext2D
  width!: number
  height!: number

  constructor(wrap: HTMLDivElement) {
    const width = wrap.offsetWidth
    const height = wrap.offsetHeight

    this.elem = document.createElement('canvas')
    this.ctx = this.elem.getContext('2d')

    this.elem.style.width = `${width}px`
    this.elem.style.height = `${height}px`
    this.elem.width = this.width = width * DPR
    this.elem.height = this.height = height * DPR

    wrap.appendChild(this.elem)
  }

  /** 渲染棋盘 */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        this.renderHexagon({
          x: 60 * i + (j % 2 ? 30 : 0),
          y: 60 * j,
        })
      }
    }
  }

  /** 渲染单个六边形 */
  renderHexagon({ x, y }) {
    this.ctx.strokeStyle = BOARD_BORDER_COLOR
    this.ctx.lineWidth = 2

    this.ctx.beginPath()
    const angle = 60

    /** 圆心 */
    let dx = x
    let dy = y
    /** 半径 */
    let r = 30
    /** 首个点偏移 */
    let offset = 90
    for (var i = 0; i < 6; i++) {
      this.ctx.lineTo(
        dx + r * Math.cos((offset + angle * i * Math.PI) / 180),
        dy + r * Math.sin((offset + angle * i * Math.PI) / 180)
      )
    }

    this.ctx.closePath()
    this.ctx.stroke()
  }
}