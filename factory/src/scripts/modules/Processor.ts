import hljs from 'highlight.js'
import Factory from './Factory'

export type TypePort = 'entry' | 'export'
export type TypeProcess = 'leftProcessor' | 'rightProcessor' | 'topProcessor' | 'bottomProcessor'
export type TypePos = 'left' | 'right' | 'top' | 'bottom'

interface IPort {
  name?: string,
  type: TypePort
}

interface IPos {
  name?: string,
  pos: TypePos
}

/*  Factory处理器对象  */
export default class Processor {
  index: number;        // 处理器编号
  width: '30%';         // 处理器宽度
  height: '30%';        // 处理器高度
  _NEXT?: string | null = null;          // 上个过程将覆盖ACC的值
  _ACC?: string | null = null;           // 处理空间
  _COM?: string | null = null;           // 存储空间
  _context: object = {};             // 代码执行上下文
  cur_size: number = 0;          // 当前大小
  size: number;              // 限制大小
  defaultText?: string;      // 初始化时默认文本
  status: 'run' | 'idle' | 'error' | 'unavail'; // 处理器状态 ['unavail', 'idle', 'error']
  elem: HTMLElement;
  code: HTMLTextAreaElement;
  displayCode: HTMLElement;
  wrap: HTMLElement;
  ports: HTMLElement[];
  processWrap: HTMLElement;
  displayArea: HTMLElement;
  displayNEXT: HTMLElement;
  displayACC: HTMLElement;
  displayCOM: HTMLElement;
  displayStatus: HTMLElement;
  displaySize: HTMLElement;
  factory: Factory;
  leftProcessor: IPort | Processor | null;
  rightProcessor: IPort | Processor | null;
  topProcessor: IPort | Processor | null;
  bottomProcessor: IPort | Processor | null;
  constructor (options?: Object) {
    Object.assign(this, options)
    this.asyncSize = this.asyncSize.bind(this)
    this.asyncDisplayCode = this.asyncDisplayCode.bind(this)
    this.asyncScroll = this.asyncScroll.bind(this)
    this.closeError = this.closeError.bind(this)
    this.init()
  }
  /*  绑定事件  */
  bindEvent () {
    this.code.addEventListener('keyup', this.asyncSize)
    this.code.addEventListener('scroll', this.asyncScroll)
    this.elem.addEventListener('click', this.closeError)
  }
  /*  注销事件  */
  unbindEvent () {
    this.code.removeEventListener('keyup', this.asyncSize)
    this.code.removeEventListener('scroll', this.asyncScroll)
    this.elem.removeEventListener('click', this.closeError)
  }
  /*  初始化  */
  init () {
    this.ports = []
    this.createProcessor()
    this.bindEvent()
  }
  /*  销毁对象  */
  destroy () {
    this.wrap.removeChild(this.processWrap)
    this.unbindEvent()
  }
  /*  创建一个处理器  */
  createProcessor () {
    this.processWrap = document.createElement('DIV')
    this.processWrap.className = 'factory-process-wrap'
    this.processWrap.style.cssText = `
    width: ${this.width};
    height: ${this.height};
    padding: 14px;
    `

    this.elem = document.createElement('DIV')
    this.elem.className = 'factory-process'
    this.status === 'error' && this.setError()
    this.createCode()
    this.displayArea = this.createDisplayArea()
    this.processWrap.appendChild(this.elem)
    this.wrap.appendChild(this.processWrap)
  }
  /*  错误模式  */
  setError () {
    this.elem.classList.add('factory-error')
    this.elem.setAttribute('data-error', 'ERROR')
  }
  /*  代码出错  */
  setCodeError (err: string) {
    this.elem.classList.add('factory-code-error')
    this.elem.setAttribute('data-error', err)
    this.factory.pause()
  }
  /*  代码出错遮罩层关闭  */
  closeError () {
    if (this.elem.classList.contains('factory-code-error')) {
      this.elem.classList.remove('factory-code-error')
    }
  }
  /*  创建代码窗口textarea  */
  createCode () {
    let elem = document.createElement('DIV')
    elem.className = 'code-group'
    elem.innerHTML = `<div class="code-index">Processor ${this.index + 1}</div>`

    this.code = <HTMLTextAreaElement> document.createElement('TEXTAREA')
    this.displayCode = <HTMLElement> document.createElement('DIV')
    this.code.className = 'code-input'
    this.displayCode.className = 'code javascript'
    this.displayCode.setAttribute('spellcheck', 'false')
    this.code.setAttribute('spellcheck', 'false')
    if (this.defaultText) {
      this.code.value = this.defaultText || ''
      this.asyncSize(this.defaultText, this.code)
    }
    elem.appendChild(this.displayCode)
    elem.appendChild(this.code)
    this.elem.appendChild(elem)
  }
  /*  创建展示台  */
  createDisplayArea () {
    let elem = document.createElement('DIV')
    elem.className = 'display-area'
    this.displayNEXT = this.createItem('NEXT', this._NEXT, elem)
    this.displayACC = this.createItem('ACC', this._ACC, elem)
    this.displayCOM = this.createItem('COM', this._COM, elem)
    this.displayStatus = this.createItem('STATUS', this.status, elem)
    this.displaySize = this.createItem('BYTE', `${this.cur_size}/${this.size}`, elem)
    this.elem.appendChild(elem)
    return elem
  }
  /*  创建展示台的项目  */
  createItem (name: string, value?: string | null, wrap?: HTMLElement): HTMLElement {
    let elem = document.createElement('DIV')
    elem.className = 'display-item'
    elem.innerHTML = `<div class="item-title">${name}</div>`

    let value_elem = <HTMLElement> document.createElement('DIV')
    value_elem.className = 'item-value'
    value_elem.textContent = value || ''
    elem.appendChild(value_elem)
    wrap && wrap.appendChild(elem)
    return value_elem
  }
  /*  同步用户输入长度  */
  asyncSize (e: any, el?: HTMLTextAreaElement) {
    let value = typeof e === 'string' ? e : e.target.value
    let formatted_val = value.match(/\S/g)
    this.cur_size = formatted_val ? this.getByteLen(formatted_val) : 0
    if (this.cur_size > this.size) {
      this.cur_size = this.size
      let str = '', n = 0
      for (let ch of value) {
        str += ch
        if (/\S/.test(ch)) {
          n += ch.match(/[\u4E00-\u9FA5]/g) != null ? 2 : 1
        }
        if (n >= this.size)
          break
      }
      el = el || this.code
      el.value = str
    }
    if (typeof e === 'object') {
      this.displaySize.innerHTML = `${this.cur_size}/${this.size}`
    }
    this.asyncDisplayCode()
  }
  /*  同步高亮代码展示  */
  asyncDisplayCode () {
    this.displayCode.textContent = this.code.value
    this.highlightCode(this.displayCode)
  }
  /*  同步滚动  */
  asyncScroll () {
    this.displayCode.scrollTop = this.code.scrollTop 
    this.displayCode.scrollLeft = this.code.scrollLeft
  }
  /*  得到代码长度  */
  getByteLen (str: string): number {
    let len = 0
    for (let ch of str) {
      if (ch.match(/[\u4E00-\u9FA5]/g) !== null) {
        len += 2
      } else {
        len += 1
      }
    }
    return len
  }
  /*  处理器传递前判断  */
  transmitACC (val: any, portProcessor: IPort | Processor | null) {
    if (!portProcessor) {
      return false
    }
    else if (portProcessor instanceof Processor) {
      portProcessor.setNext(val)
    } else if (portProcessor.type === 'entry') {
      return false
    } else if (portProcessor.type === 'export') {
      val !== null && this.factory.detector && this.factory.detector.output(val, portProcessor.name)
    }
  }
  setCom (val: any) {
    this._COM = val
    this.displayCOM.innerHTML = this.formatVal(this._COM)
  }
  /*  设置Status  */
  setStatus (val: any) {
    this.status = val
    
    this.code.setAttribute('contenteditable', (this.status !== 'run').toString())
    this.displayStatus.innerHTML = this.status
  }
  /*  设置Next值  */
  setNext (val: any) {
    if (this.status === 'error')
      return

    this._NEXT = val
    this.displayNEXT.innerHTML = this.formatVal(this._NEXT)
  }
  /*  运行  */
  next () {
    if (this.status === 'error')
      return false

    this.isEnd()
    this._ACC !== null && this.executeCode() // 执行用户的代码
  }
  /*  将NEXT传递给ACC  */
  resetACC () {
    this._ACC = this._NEXT
    this.displayACC.textContent = this.formatVal(this._ACC)
    this.setNext(null)
  }
  /*  判断是否全部执行完毕 (全部NEXT和ACC为零)  */
  isEnd () {
    if (this._ACC === null && this._NEXT === null) {
      this.setStatus('idle')
    } else {
      this.setStatus('run')
    }
  }
  /*  执行用户的代码  */
  executeCode () {
    let code = this.code.value
    const fn = (context: Object, __ERROR__: (err: any) => any) => {
      try {
        let withCode = `
          with (this){
            return eval(arguments[0])
          }
          return code
        `
        new Function(withCode).call(Object.assign({}, this._context, context), code)
      }
      catch (err) {
        console.error(err)
        __ERROR__(err)
      }
    }

    fn({
      NEXT: this._NEXT,
      ACC: this._ACC,
      COM: this._COM,
      L: (val = this._ACC) => this.transmitACC(val, this.leftProcessor),
      R: (val = this._ACC) => this.transmitACC(val, this.rightProcessor),
      T: (val = this._ACC) => this.transmitACC(val, this.topProcessor),
      B: (val = this._ACC) => this.transmitACC(val, this.bottomProcessor),
      C: (val = null) => this.setCom(val)
    }, (err: any) => this.setCodeError(err))
  }
  /*  设置进出口  */
  setPort (obj: IPos, type: TypePort) {
    this[(<TypeProcess> `${obj.pos}Processor`)] = {
      type,
      name: obj.name
    }
    this.ports.push(this.createPortElem(obj, type))
  }
  /*  生产端口元素  */
  createPortElem (obj: IPos, type: TypePort): HTMLElement {
    let elem = document.createElement('DIV')
    elem.className = `factory-port ${type} factory-pos-${obj.pos}`
    elem.innerHTML = `${type === 'entry' ? 'IN' : 'OUT'} ${obj.name || ''} <i class="iconfont icon-${type === 'entry' ? this.reversePos(obj.pos) : obj.pos}-arrow"></i>`
    this.elem.appendChild(elem)
    return elem
  }
  /*  获得相反方向  */
  reversePos (pos: TypePos): string {
    const direction = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top'
    }
    return direction[pos]
  }
  /*  格式化输出值  */
  formatVal (val: any): string {
    if (val === null || val === void 0) {
      return ''
    } else if (typeof val === 'object') {
      return JSON.stringify(val)
    } else {
      return '' + val
    }
  }
  /*  高亮代码  */
  highlightCode (block: HTMLElement) {
    hljs.highlightBlock(block)
  }
}