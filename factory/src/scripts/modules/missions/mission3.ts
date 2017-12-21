const missionCreater = () => {
  const createMandom = () => ~~(Math.random() * 3) - 1
  let input = createMandom()
  let output = input > 0 ? { 'A': 1, 'B': 0, 'C': 0 } : input === 0 ? { 'A': 0, 'B': 1, 'C': 0 } : { 'A': 0, 'B': 0, 'C': 1 }
  return {
    input: input,
    output: output
  }
}

export default {
  missionCreater,
  intro: 'Mission 2：分类',
  err: [],
  size: 32,
  cols: 3,
  rows: 3,
  isMultigroup: true,
  entry: {
    '1': {
      pos: 'top'
    }
  },
  export: {
    '6': {
      name: 'A',
      pos: 'bottom'
    },
    '7': {
      name: 'B',
      pos: 'bottom'
    },
    '8': {
      name: 'C',
      pos: 'bottom'
    }
  }
}
