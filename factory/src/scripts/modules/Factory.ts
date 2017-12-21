import Detector from './Detector'
import Processor from './Processor'
import Missions, { IMission } from './Missions'

// 测试数据结构
export interface IData {
  input: any,
  output: any,
  expectant_output: any,
  result: string
}

// 游戏速度
export const GameSpeed = {
  baseSpeed: 30,
  minSpeed: 30,
  level: 10
}

/*  Factory游戏对象  */
export default class Factory {
  // 容器元素
  elem: HTMLElement;
  // 控制台元素
  console: HTMLElement;
  // 主体元素
  container: HTMLElement;
  // 控制面板元素
  panel: HTMLElement;
  // 控制台按钮面板元素
  btnGroup: HTMLElement;
  nextBtn: HTMLElement;
  autoBtn: HTMLElement;
  resetBtn: HTMLElement;
  restartBtn: HTMLElement;
  nextMissionBtn: HTMLElement | null;
  // 消息面板
  msgGroup: HTMLElement;
  // 速度面板
  speedGroup: HTMLElement;
  speedDisplay: HTMLElement;
  fastBtn: HTMLElement;
  slowBtn: HTMLElement;
  // 容器宽度
  width: number;
  // 容器高度
  height: number;
  // 是否运行中
  inService: boolean = false;
  // 关卡对象
  Missions: IMission[];
  // 当前关卡
  mission: number = 0;
  // 当前关卡对象
  curMission: IMission;
  // 测试总数
  data_count: number = 20;
  // 运行速度档次
  speed: number = 5;
  // 当前处理的处理器块
  active: number = 0;
  // 已通过测试数
  test_active: number = 0;
  // 测试总数
  test_count: number = 2;
  // 是否多组数据
  isMultigroup: boolean;
  // 检测器对象
  detector: Detector;
  // 测试数据数组
  private _data: IData[] = [];
  // 处理器对象数组
  private _processors: Processor[];
  // 事件队列
  private _events: Function[] = [];
  // 更新间隔
  private _interval: number;
  // 定时器
  timer: any;
  constructor (el: HTMLElement, options?: object) {
    Object.assign(this, options)
    this.elem = el
    if (!this.elem) {
      console.log('[Factory]: param el is the required.')
      return
    }

    this.elem.classList.add('factory')
    this.Missions = Missions
    this.init()
  }
  /*  初始化  */
  init () {
    this.initSize()
    this.getMissions()
    this.initMission()
    this.createContaner()
    this.createConsole()
    this.initProcessor()
    this.createDetector()
    this.createPanel()
  }
  /*  切换关卡  */
  refresh () {
    this.pause()
    this.msgGroup.textContent = 'Code Mode'
    this._data = []
    this.active = 0
    this.test_active = 0
    this.inService = false

    this.getMissions()
    this.initMission()
    this.initProcessor()
    this.createDetector()
  }
  /*  销毁对象  */
  destroy () {
    this.elem.innerHTML = ''
    this._data = []
    this.active = 0
    this.test_active = 0
    this.inService = false
    this.detector = null

    while (this._events.length) {
      ((<Function> this._events.shift()))()
    }
  }
  /*  初始化容器大小  */
  initSize () {
    this.width = this.elem.offsetWidth
    this.height = this.elem.offsetHeight
  }
  /*  生成检测器对象  */
  createDetector () {
    this.detector && this.detector.destroy()
    this.detector = new Detector({
      wrap: this.console,
      isMultigroup: this.isMultigroup || false,
      factory: this,
      data: this._data
    })
  }
  /*  生成游戏控制面板  */
  createPanel () {
    this.panel = document.createElement('DIV')
    this.panel.className = 'factory-panel'

    /*  控制台按钮面板  */
    this.btnGroup = document.createElement('DIV')
    this.btnGroup.className = 'factory-btn-group'
    this.nextBtn = this.createBtn('Next', this.next, this.btnGroup)
    this.autoBtn = this.createBtn('Auto', this.auto, this.btnGroup)
    this.resetBtn = this.createBtn('Reset', this.reset, this.btnGroup)
    this.restartBtn = this.createBtn('Restart', this.restart, this.btnGroup)

    /*  消息面板  */
    this.msgGroup = document.createElement('DIV')
    this.msgGroup.className = 'factory-msg-group'
    this.msgGroup.textContent = 'Code Mode'

    /*  执行速度面板  */
    this.speedGroup = document.createElement('DIV')
    this.speedGroup.className = 'factory-speed-group'
    this.slowBtn = this.createBtn('Slow', this.slow, this.speedGroup)
    this.speedDisplay = document.createElement('DIV')
    this.speedDisplay.className = 'factory-speed'
    this.setSpeed(this.speed)
    this.speedGroup.appendChild(this.speedDisplay)
    this.fastBtn = this.createBtn('Fast', this.fast, this.speedGroup)

    this.panel.appendChild(this.speedGroup)
    this.panel.appendChild(this.btnGroup)
    this.panel.appendChild(this.msgGroup)
    this.console.appendChild(this.panel)
  }
  /*  设置速度  */
  setSpeed (speed: number) {
    this.speed = speed
    this._interval = (GameSpeed.baseSpeed * GameSpeed.level + GameSpeed.minSpeed) - this.speed * GameSpeed.baseSpeed
    this.speedDisplay.textContent = `Speed: ${this.speed}`
    this.resetTimer()
  }
  /*  加快速度  */
  fast () {
    if (this.fastBtn.classList.contains('disabled'))
      return false
    this.speed === 1 && this.slowBtn.classList.remove('disabled')
    this.setSpeed(this.speed + 1)
    this.speed === 10 && this.fastBtn.classList.add('disabled')
  }
  /*  加快速度  */
  slow () {
    if (this.slowBtn.classList.contains('disabled'))
      return false
    this.speed === 10 && this.fastBtn.classList.remove('disabled')
    this.setSpeed(this.speed - 1)
    this.speed === 1 && this.slowBtn.classList.add('disabled')
  }
  /*  生成控制按钮  */
  createBtn (name: string, fn: Function, wrap: HTMLElement): HTMLElement {
    let btn = document.createElement('BUTTON')
    btn.className = 'factory-panel-btn'
    btn.textContent = name
    fn = fn.bind(this)
    btn.addEventListener('click', fn, false)
    this._events.push(() => btn.removeEventListener('click', fn, false))
    wrap.appendChild(btn)
    return btn
  }
  /*  生成游戏主体容器  */
  createContaner () {
    this.container = document.createElement('DIV')
    this.container.className = 'factory-container'
    this.elem.appendChild(this.container)
  }
  /*  生成右侧控制台  */
  createConsole () {
    this.console = document.createElement('DIV')
    this.console.className = 'factory-console'
    this.elem.appendChild(this.console)
  }
  /*  得到关卡数据  */
  getMissions () {
    let status = this.Missions.missions[this.mission]
    if (!status) {
      alert('你已全部通关（撒花 ☆:✿.٩(๑❛ᴗ❛๑)۶°*✿')
    } else {
      this.isMultigroup = false
      this.curMission = Object.assign({}, this.Missions.initialState, status)
    }
  }
  /*  设置关卡  */
  initMission () {
    this.curMission.intro && this.elem.setAttribute('data-intro', this.curMission.intro)
    this.elem.offsetWidth
    for (let i = 0; i < this.data_count; i++) {
      let d = this.curMission.missionCreater && this.curMission.missionCreater()
      this._data.push({
        input: d.input,
        output: null,
        expectant_output: d.output,
        result: 'pending'
      })
    }
  }
  /*  初始化处理器  */
  initProcessor () {
    this._processors && Array.from(this._processors, (processor) => processor.destroy())
    this._processors = []
    for (let i = 0, total_num = this.curMission.cols * this.curMission.rows; i < total_num; i++) {
      this._processors.push(new Processor({
        width: `${~~(100 / this.curMission.cols)}%`,
        height: `${~~(100 / this.curMission.rows)}%`,
        status: this.curMission.err && this.curMission.err.indexOf(i) > -1 ? 'error' : 'idle',
        size: this.curMission.size,
        wrap: this.container,
        defaultText: this.curMission.defaultTexts && this.curMission.defaultTexts[i],
        factory: this,
        index: i
      }))
    }
    Array.from(this._processors, (processor: Processor, i: number) => {
      processor.leftProcessor =  i % this.curMission.cols ? (this._processors[i - 1] || null) : null
      processor.rightProcessor = (i + 1) % this.curMission.cols ? (this._processors[i + 1] || null) : null
      processor.topProcessor = this._processors[i - this.curMission.cols] || null
      processor.bottomProcessor = this._processors[i + this.curMission.cols] || null

      if (this.curMission.entry[i]) {
        processor.setPort(this.curMission.entry[i], 'entry')
      }
      if (this.curMission.export[i]) {
        processor.setPort(this.curMission.export[i], 'export')
      }
    })
  }
  /*  运行中禁止代码输入  */
  unableCodeInput (bool?: boolean): void {
    /*  分别执行  */
    Array.from(this._processors, (processor) => {
      bool ? processor.code.setAttribute('disabled', true) : processor.code.removeAttribute('disabled')
    })
  }
  /*  游戏开始  */
  auto () {
    if (this.timer)
      return this.pause()

    this.autoBtn.textContent = 'pause'
    this.autoBtn.classList.add('active')
    this.timer = setInterval(() => {
      this.next()
    }, this._interval)
  }
  resetTimer () {
    if (!this.timer) {
      return false
    }
    this.next()
    clearInterval(this.timer)
    this.timer = null
    this.timer = setInterval(() => {
      this.next()
    }, this._interval)
  }
  /*  游戏暂停  */
  pause () {
    this.autoBtn.textContent = 'Auto'
    this.autoBtn.classList.remove('active')
    clearInterval(this.timer)
    this.timer = null
  }
  /*  关卡结束  */
  end () {
    if (this.detector.success_count === this._data.length) {
      if (this.test_active === this.test_count) {
        this.pause()
        this.msgGroup.textContent = '你通关了, 点GO进入下一关:)'
        if (!this.nextMissionBtn) {
          this.nextMissionBtn = this.createBtn('Go', this.nextMission, this.btnGroup)
        }
      } else {
        this.createDetector()
        this.test_active++
        this.active = 0
        this.detector.success_count = 0
        this.msgGroup.textContent = `Running Mode：已通过测试（${this.test_active}/${this.test_count + 1}）`
        Array.from(this._processors, (processor) => processor.setCom(null))
      }
    } else {
      this.pause()
      this.msgGroup.textContent = `出错了${this._data.length - this.detector.success_count}个, 点击Reset再改改`
    }
  }
  /*  下一关  */
  nextMission () {
    this.mission = this.mission + 1
    this.refresh()

    let unbindFn = <Function> this._events.pop()
    unbindFn.apply(this)
    this.nextMissionBtn && this.btnGroup.removeChild(this.nextMissionBtn)
    this.nextMissionBtn = null
  }
  /*  关卡重置  */
  restart () {
    return this.refresh()
  }
  /*  运行重置  */
  reset () {
    this.active = 0
    this.test_active = 0
    this.inService = false
    this.unableCodeInput(false)
    this.detector.reset()
    this.msgGroup.textContent = 'Code Mode'
    Array.from(this._processors, (processor: Processor) => {
      processor._NEXT = ''
      processor.setCom(null)
      processor.resetACC()
    })
  }
  /*  执行下一步  */
  next () {
    if (this.active < this._data.length) {
      this.detector.setInputActive(this.active)
      this.getNext()
      if (!this.inService) {
        this.inService = true
        this.msgGroup.textContent = 'Running Mode'
        this.unableCodeInput(true)
      }
      this.active++
    } else {
      this.detector.setInputActive()
    }

    /*  全部重置值  */
    Array.from(this._processors, (processor) => {
      processor.resetACC()
    })

    this.getNext()

    /*  分别执行  */
    Array.from(this._processors, (processor) => {
      processor.next()
    })

    /*  判断是否全部停滞  */
    !this._processors.some((processor) => processor.status === 'run') && this.end()
  }
  /*  入口得到Next值  */
  getNext () {
    for (let key in this.curMission.entry) {
      this._data[this.active] && this._processors[key].setNext(this._data[this.active].input)
    }
  }
}