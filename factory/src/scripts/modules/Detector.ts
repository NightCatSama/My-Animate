import { IData } from './Factory'

interface IDetectorData extends IData {
  output_el?: any;
  index: number;
}

/*  Factory检测器对象  */
export default class Detector {
  // 测试数据数组
  data: IData[];
  // 检测器测试数据数组
  items: IDetectorData[] = [];
  last_output: any;
  success_count: number;
  isMultigroup: boolean;
  wrap: HTMLElement;
  elem: HTMLElement;
  input_group: HTMLElement;
  output_group: any;
  expect_group: HTMLElement;
  constructor (options?: object) {
    Object.assign(this, options)
    this.init()
  }
  /*  初始化  */
  init () {
    this.last_output = 0
    this.success_count = 0
    this.createDetector()
    this.initIems()
    this.render()
  }
  /*  销毁  */
  destroy () {
    this.wrap.removeChild(this.elem)
  }
  /*  重置  */
  reset () {
    this.success_count = 0
    this.setActive(null, this.input_group)
    if (this.isMultigroup) {
      this.last_output = {}
      for (let key in this.output_group) {
        this.last_output[key] = 0
        this.setActive(null, this.output_group[key].output_cgroup)
      }
      Array.from(this.items, (obj) => {
        obj.output = {}
        for (let i in obj.output_el) {
          obj.output_el[i].textContent = ''
          obj.output_el[i].className = 'factory-item'
        }
      })
    } else {
      this.last_output = 0
      this.setActive(null, this.output_group)
      Array.from(this.items, (obj) => {
        obj.output_el.textContent = ''
        obj.output_el.className = 'factory-item'
      })
    }
  }
  /*  创建右侧检测器  */
  createDetector () {
    this.elem = document.createElement('DIV')
    this.elem.className = 'factory-detector'
    if (this.isMultigroup) {
      this.output_group = {}
      this.last_output = {}
      this.input_group = this.createGroup('IN')
      for (let key in this.data[0].expectant_output) {
        this.output_group[key] = {}
        this.last_output[key] = 0
        this.output_group[key].el = this.createGroup(`OUT.${key}`)
        let el = document.createElement('DIV')
        el.className = 'factory-group-child-wrap'
        this.output_group[key].expect_cgroup = this.createChildGroup(el, 'factory-expect-group-wrap')
        this.output_group[key].output_cgroup = this.createChildGroup(el, 'factory-output-group-wrap')
        this.output_group[key].exports = []
        this.output_group[key].output = []
        this.output_group[key].el.appendChild(el)
      }
    } else {
      this.input_group = this.createGroup('IN')
      this.output_group = this.createGroup('OUT')
      this.expect_group = this.createGroup('EXP')
    }
    this.wrap.firstChild ? this.wrap.insertBefore(this.elem, this.wrap.firstChild) : this.wrap.appendChild(this.elem)
  }
  /*  生成各组  */
  createGroup (name: string): HTMLElement {
    let elem = document.createElement('DIV')
    elem.className = 'factory-group'
    elem.innerHTML = `<div class="group-title">${name}</div>`
    this.elem.appendChild(elem)
    return elem
  }
  /*  生成子组  */
  createChildGroup (wrap: HTMLElement, className: string): HTMLElement {
    let elem = document.createElement('DIV')
    elem.className = `factory-group-child ${className}`
    wrap.appendChild(elem)
    return elem
  }
  /*  生成各项  */
  createItem (value: string | null, index: any, wrap: HTMLElement): HTMLElement {
    let elem = document.createElement('DIV')
    elem.className = 'factory-item'
    elem.innerHTML = value !== null ? JSON.stringify(value) : ''
    elem.setAttribute('data-index', index)
    wrap.appendChild(elem)
    return elem
  }
  /*  初始化各项  */
  initIems () {
    this.items = Array.from(this.data, (obj, index) => Object.assign({ index }, obj))
  }
  /*  绘制  */
  render () {
    Array.from(this.items, (obj, i) => {
      if (this.isMultigroup) {
        this.createItem(obj.input, i, this.input_group)
        obj.output_el = {}
        obj.output = {}
        for (let key in obj.expectant_output) {
          let val = obj.expectant_output[key]
          obj.output_el[key] = this.createItem(null, i, this.output_group[key].output_cgroup)
          this.createItem(val, i, this.output_group[key].expect_cgroup)
          this.output_group[key].exports.push(val)
        }
      } else {
        this.createItem(obj.input, i, this.input_group)
        obj.output_el = this.createItem(obj.output, i, this.output_group)
        this.createItem(obj.expectant_output, i, this.expect_group)
      }
    })
  }
  /*  设置input的位置  */
  setInputActive (index?: number) {
    this.setActive(index, this.input_group)
  }
  /*  设置当前位置  */
  setActive (index?: number | null, wrap: HTMLElement) {
    let active = wrap.querySelector('.active')
    active && active.classList.remove('active')
    if (typeof index === 'number') {
      let elem = wrap.querySelector(`[data-index="${index}"]`)
      elem && elem.classList.add('active')
    }
  }
  /*  输出值  */
  output (val: string, key: string) {
    let index = this.isMultigroup ? this.last_output[key] : this.last_output
    if (this.isMultigroup) {
      let obj = this.output_group[key]
      if (index < this.data.length) {
        let exp = obj.exports[index]
        let output_el = this.items[index].output_el[key]
        let mObj = {
          output: val,
          expectant_output: exp,
          output_el: output_el
        }
        this.items[index].output[key] = obj.output[index] = val
        output_el.textContent = val !== null ? JSON.stringify(val) : ''
        this.examine(index, mObj)
        this.setActive(index++, obj.output_cgroup)
        this.last_output[key] = index
        if (index === this.data.length) {
          this.setActive(null, obj.output_cgroup)
        }
      }
    } else {
      if (index < this.data.length) {
        this.items[index].output = val
        this.items[index].output_el.textContent = val !== null ? JSON.stringify(val) : ''
        this.examine(index)
        this.setActive(index++, this.output_group)
        this.last_output = index
        if (index === this.data.length) {
          this.setActive(null, this.output_group)
        }
      }
    }
  }
  /*  检查是否正确  */
  examine (index: number, mObj?: any) {
    let obj = mObj || this.items[index]
    if (this.isDiff(obj.output, obj.expectant_output)) {
      obj.output_el.classList.add('error')
    } else {
      if (this.isMultigroup) {
        if (!this.isDiff(this.items[index].output, this.items[index].expectant_output)) {
          this.success_count++
        }
      } else {
        this.success_count++
      }
      obj.output_el.classList.add('success')
    }
  }
  /*  两个值是否不相等  */
  isDiff (a: any, b: any): boolean {
    if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
      return true
    } else if (Array.isArray(a)) {
      return a.length !== b.length || a.some((v, i) => v !== b[i])
    } else if (typeof a === 'object') {
      if (Object.keys(a).length !== Object.keys(b).length)
        return true
      for (let i in a) {
        if (a[i] !== b[i])
          return true
      }
      return false
    }
    return a !== b
  }
}