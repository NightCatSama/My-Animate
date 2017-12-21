let NextA = 0
let NextB = 0
const missionCreater = () => {
  const createMandom = () => ~~(Math.random() * 10)
  let input = createMandom()
  NextA += input
  NextB = Math.abs(input - NextB)
  return {
    input: input,
    output: {
      A: NextA,
      B: NextB
    }
  }
}

export default {
  missionCreater,
  intro: 'Mission 3：累加 and 差值的绝对值',
  err: [],
  size: 64,
  cols: 2,
  rows: 2,
  isMultigroup: true,
  entry: {
    '0': {
      pos: 'top'
    }
  },
  export: {
    '2': {
      name: 'A',
      pos: 'bottom'
    },
    '3': {
      name: 'B',
      pos: 'bottom'
    }
  }
}