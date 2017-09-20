## [DEMO](http://nightcatsama.github.io/My-Animat/particle/)

### option
```js
{
       src: '', //图片路径
     width: document.body.offsetWidth, //canvas的宽度，默认窗口宽度
    height: document.body.offsetHeight, //canvas的高度，默认窗口高度
   imgSize: undefined, //图片的大小 [width, height]，默认原始大小
    filter: function(r, g, b, a) {  //过滤方法
	              return true
            },
         x: undefined, //图像在canvas中的x坐标，默认居中
         y: undefined, //图像在canvas中的y坐标，默认居中
         r: 0.5,  //粒子半径
      cols: 128, //图像分为几列，横坐标细度
      rows: 128, //图像分为几行，纵坐标细度
mouseRange: 60,  //影响范围
  disperse: 5, //粒子偏移范围
  recovery: 0.95  //恢复速度
}
```

### javascript
```js
    import Particle from './src/javascript/index.js'
    var demo = new Particle('canvas-id', {
      src: './demo.png'
    })
```
