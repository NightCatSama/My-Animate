import '../styles/index.scss'

import BallRunner from './modules/BallRunner'

let game = new BallRunner('ball-runner')

document.getElementById('ball-runner').onclick = () => game.start()
