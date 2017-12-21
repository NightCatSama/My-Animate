import missions from './missions/index'

type TypePos = 'left' | 'right' | 'top' | 'bottom'

interface IGate {
  [index: string]: {
    name?: string,  // 当多个输出口事，则必须
    pos: TypePos
  }
}

export interface IMission {
  intro: string,          // 关卡描述
  err: number[],          // 不可用的Processor
  cols: number,           // 列数
  rows: number,           // 行数
  size: number,           // 字节限制
  isMultigroup?: boolean,  // 是否多个输出口
  entry: IGate,           // 入口信息
  export: IGate,          // 出口信息
  defaultTexts?: any,       // 默认 Processor value
  missionCreater: ((index?: number) => { input: any, output: any }) | null    // 生成关卡方法
}

const initialState = {
  intro: '',
  err: [],
  cols: 3,
  rows: 3,
  size: 64,
  isMultigroup: false,
  entry: {},
  export: {},// 出口信息
  defaultTexts: null,
  missionCreater: null
}

/*  关卡生成器  */
export default {
  initialState: <IMission> initialState,
  missions: <IMission[]> missions
}
