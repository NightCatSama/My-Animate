import '../styles/index.scss'

import BallRunner from './modules/BallRunner'

const initGame = () => {
  let wrap = <HTMLElement> document.querySelector('.game-wrap')
  let cover = <HTMLElement> wrap.querySelector('.game-cover')

  let game = new BallRunner('ball-runner', {
    width: 'ontouchmove' in window ? document.body.offsetWidth : 600,
    height: 'ontouchmove' in window ? document.body.offsetHeight : 500,
    gameOver (point: number): void {
      cover.innerHTML = `<small>你的分数: <strong>${point}</strong></small><br /> 点击重新开始`
      cover.style.display = 'flex'
    }
  })

  wrap.onclick = () => {
    if (game.startSign) {
      cover.style.display = 'flex'
      cover.innerHTML = '点击继续'
      game.pause()
    }
    else {
      cover.style.display = 'none'
      game.start()
    }
  }
}

initGame()