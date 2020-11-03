import './styles.scss'

export interface ICard {
  name: string
  image: string
  desc: string
}

export default class SwipeCard {
  wrapElem!: Element
  list: ICard[] = []

  constructor(elem: Element, options?: {
  }) {
    if (!elem || typeof elem !== 'object') {
      throw Error('首个 参数必须传入元素')
    }
    this.initWrapElem(elem)
  }

  /** 初始化容器元素 */
  initWrapElem(elem: Element) {
    this.wrapElem = elem
    this.wrapElem.classList.add('swipe-card')
  }

  /** 设置卡片数据 */
  setCards(list: ICard[]) {
    this.list = list
    this.render()
  }

  /** 开始渲染 */
  render() {
    this.wrapElem.innerHTML = ''
    const list = this.createCardList()
    this.wrapElem.appendChild(list)
  }

  /** 渲染卡片列表 */
  createCardList() {
    const frame = document.createDocumentFragment()
    this.list.forEach((card, index) => {
      const cardElem = this.createCardElem(card)
      frame.appendChild(cardElem)
    })
    return frame
  }

  /** 创建卡片元素 */
  createCardElem(card: ICard): HTMLDivElement {
    const elem = document.createElement('div')
    elem.classList.add('swipe-card-item')

    // 图片
    const imgElem = document.createElement('div')
    imgElem.classList.add('swipe-card-image')
    imgElem.style.backgroundImage = `url("${card.image}")`
    elem.appendChild(imgElem)

    // 名称
    const nameElem = document.createElement('div')
    nameElem.classList.add('swipe-card-name')
    nameElem.textContent = card.name
    elem.appendChild(nameElem)

    // 描述
    const descElem = document.createElement('div')
    descElem.classList.add('swipe-card-desc')
    descElem.textContent = card.desc
    elem.appendChild(descElem)

    return elem
  }
}