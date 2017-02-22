import Chess from './Chess.js';

let c = new Chess(document.getElementById('checkerboard'), {
	cb: gameover
})

let bValue = c.player
Object.defineProperty(c, 'player', {
	get: function() {
		return bValue
	},
	set: function(newValue) {
		changePlayer(newValue)
		bValue = newValue
	},
	enumerable: true,
	configurable: true
})

function changePlayer(player) {
	document.getElementById('control').textContent = `当前玩家：${player ? '白棋' : '黑旗'}`
}

function gameover(result) {
	document.getElementById('control').textContent = result
} 

changePlayer(bValue)