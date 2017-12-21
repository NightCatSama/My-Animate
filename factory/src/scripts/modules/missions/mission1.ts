let total = 0
const missionCreater = (index?: number) => {
  if (index === 0) {
    total = 0
  }
  const createMandom = () => ~~(Math.random() * 10)
  let input = createMandom()
  let output = input * 2
  total += output
  return {
    input: input,
    output: {
      A: input * 2,
      B: total
    }
  }
}

export const Mission1 = {
  missionCreater,
  intro: 'Mission 0：教程关',
  err: [],
  cols: 3,
  rows: 2,
  size: 256,
  isMultigroup: true,
  entry: {
    '0': {
      pos: 'top'
    }
  },
  export: {
    '2': {
      name: 'A',
      pos: 'top'
    },
    '5': {
      name: 'B',
      pos: 'bottom'
    }
  },
  defaultTexts: {
    '0':
`// 由 IN 传入值

// NEXT 为下一个值
NEXT

// ACC 为当前值
ACC

// 将 ACC 传给右方 Processor
R(ACC)`,
    '1':
`// NEXT 从左方 Processor 传入
// console.log(NEXT)

// 将ACC 乘以 2
ACC = ACC * 2

// 将 ACC 传给右方 Process
R(ACC)`,
    '2':
`// 将 ACC 输出(OUT A)
T(ACC)

// 将 ACC 和存储值 COM 累加
ACC = COM + ACC

// 将 ACC 储存进 COM
C(ACC)

// 将 ACC 传给下方 Process
B(ACC)
`,
    '5':
`// 将 ACC 输出(OUT B)
// 参数缺省时，传递原始ACC值
B()

// 点击 右方 NEXT 或 Auto
// 就可以顺利的运行啦
// ヽ(≧Д≦)ノ
`,
    '3':
`/* *********** 介绍 *************

* 内置变量：ACC NEXT COM

- NEXT  下一个值
- ACC   当前值
- COM   存储值

* 内置方法：T B L R C

- T B L R 四个方向的传输方法
- T [top]    向上传输值
- B [bottom] 向下传输值
- L [left]   向左传输值
- R [right]  向右传输值
- C 设置 COM 存储值

***************************** */
`,
    '4':
`/* *********** 规则 *************

* ACC 有值时 Processor 才会执行

* 每次执行 NEXT 覆盖 ACC

* COM 只能通过方法C()存储

* 所有 OUT 均等于 期望值则通关

***************************** */
`,
  }
}
