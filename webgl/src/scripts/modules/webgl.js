let canvas = document.getElementById('canvas')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

let DEBUG = true
let gl = getWebGLContext(canvas, DEBUG)

// 顶点着色器
let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_Transition;
  void main () {
    gl_Position = u_Transition * a_Position;
    gl_PointSize = 10.0;
  }
`

// 片元着色器
let FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main () {
    gl_FragColor = u_FragColor;
  }
`

// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

// 得到 a_Position
let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
let u_Transition = gl.getUniformLocation(gl.program, 'u_Transition')
let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

function render () {
  let points = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5
  ])

  let deg = 45 + 180

  deg = Math.PI / 180 * deg

  let matrix = new Float32Array([
    Math.cos(deg), Math.sin(deg), 0.0, 0.0,
    -Math.sin(deg), Math.cos(deg), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    -0.25, 0.0, 0.0, 1.0
  ])

  let n = 3

  // 创建缓存区对象
  let buffer = gl.createBuffer()

  // 绑定缓存区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // 传入缓存区数据
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  // 缓存区对象分配给 attribute 变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

  // 开启 attribute 变量
  gl.enableVertexAttribArray(a_Position)

  // 绘制背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.uniform4fv(u_FragColor, new Float32Array([0.0, 0.5, 1.0, 1.0]))
  gl.uniformMatrix4fv(u_Transition, false, matrix)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

render()

