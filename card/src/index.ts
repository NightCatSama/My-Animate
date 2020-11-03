import SwipeCard from './swipe-card'
import './index.scss'

const App = document.getElementById('app')

if (App) {
  const vm = new SwipeCard(App)
  vm.setCards([{
    name: '妙蛙种子',
    image: '/image/妙蛙种子.png',
    desc: '經常可見牠在太陽下睡午覺的樣子。在沐浴了充足的陽光之後，牠背上的種子就會成長茁壯。',
  }, {
    name: '小火龙',
    image: '/image/小火龙.png',
    desc: '天生喜歡熱熱的東西。據說當牠被雨淋濕的時候，尾巴的末端會冒出煙來。',
  }, {
    name: '杰尼龟',
    image: '/image/杰尼龟.png',
    desc: '甲殼的作用不僅是用來保護自己，圓潤的外形和表面的溝槽會減少水的阻力，使牠能夠快速地游泳。',
  }, {
    name: '妙蛙种子',
    image: '/image/妙蛙种子.png',
    desc: '經常可見牠在太陽下睡午覺的樣子。在沐浴了充足的陽光之後，牠背上的種子就會成長茁壯。',
  }, {
    name: '小火龙',
    image: '/image/小火龙.png',
    desc: '天生喜歡熱熱的東西。據說當牠被雨淋濕的時候，尾巴的末端會冒出煙來。',
  }, {
    name: '杰尼龟',
    image: '/image/杰尼龟.png',
    desc: '甲殼的作用不僅是用來保護自己，圓潤的外形和表面的溝槽會減少水的阻力，使牠能夠快速地游泳。',
  }, {
    name: '妙蛙种子',
    image: '/image/妙蛙种子.png',
    desc: '經常可見牠在太陽下睡午覺的樣子。在沐浴了充足的陽光之後，牠背上的種子就會成長茁壯。',
  }, {
    name: '小火龙',
    image: '/image/小火龙.png',
    desc: '天生喜歡熱熱的東西。據說當牠被雨淋濕的時候，尾巴的末端會冒出煙來。',
  }, {
    name: '杰尼龟',
    image: '/image/杰尼龟.png',
    desc: '甲殼的作用不僅是用來保護自己，圓潤的外形和表面的溝槽會減少水的阻力，使牠能夠快速地游泳。',
  }])
}
