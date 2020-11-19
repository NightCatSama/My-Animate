import { Board } from "./board";

/** 游戏总入口 */
export default class SixWins {
  /** 容器 */
  container!: HTMLDivElement
  /** 棋盘 */
  board!: Board

  constructor(container: HTMLDivElement | string) {
    this.container =
      container instanceof HTMLDivElement
        ? container
        : typeof container === 'string'
          ? document.querySelector(container)
          : null
    if (!this.container) throw Error('容器元素不存在!')
    this.init()
    this.render()
  }

  /** 初始化游戏 */
  init() {
    this.board = new Board(this.container)
  }

  /** 渲染游戏 */
  render() {
    this.board.render()
  }
}