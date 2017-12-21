import '../styles/index.scss'
import '../styles/factory.scss'
import Factory from './modules/Factory'

let game: Factory = new Factory(<HTMLElement> document.getElementById('app'))
console.log(game)
