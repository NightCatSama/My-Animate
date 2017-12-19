import '../styles/index.scss'

import BallRunner from './modules/BallRunner'

const initGame = () => {
  let wrap = <HTMLElement> document.querySelector('.game-wrap')
  let cover = <HTMLElement> wrap.querySelector('.game-cover')

  let game = new BallRunner('ball-runner', {
    width: 'ontouchmove' in window ? document.body.offsetWidth : 600,
    height: 'ontouchmove' in window ? document.body.offsetHeight : 500,
    gameOver (point: number): void {
      cover.innerHTML = `<small>Your Point: ${point}</small><br /> Click to restart`
      cover.style.display = 'flex'
    }
  })

  wrap.onclick = () => {
    if (game.startSign) {
      cover.style.display = 'flex'
      cover.innerHTML = 'Click to continue'
      game.pause()
    }
    else {
      cover.style.display = 'none'
      game.start()
    }
  }
}

initGame()