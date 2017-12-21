const missionCreater = () => {
  const createMandom = () => ~~(Math.random() * 10)
  let input = createMandom()
  return {
    input: input,
    output: input * 2
  }
}

export const Mission2 = {
  missionCreater,
  intro: 'Mission 1：简单的乘法',
  err: [3, 4],
  cols: 3,
  rows: 3,
  size: 64,
  entry: {
    '0': {
      pos: 'top'
    }
  },
  export: {
    '6': {
      pos: 'bottom'
    }
  }
}
