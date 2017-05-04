import Cat from './cat.js'

let empty = [1, 1]

let arr = [
          ['item1', 'item2', 'item3'],
          ['item4', '.    ', 'item5'],
          ['item6', 'item7', 'item8']
          ]

let grid = document.querySelector('.grid')
let items = grid.querySelectorAll('.grid-item')

grid.addEventListener('click', (e) => {
  let item = e.target
  if (!item.classList.contains('grid-item'))
    return false

  let name = window.getComputedStyle(e.target)['grid-area'].slice(0, 5)
  console.log(this)
})

function setGrid () {
  grid.style.gridTemplateAreas = Array.from(arr, line => `"${line.join(' ')}"`).join('\n')
}

// setGrid()

