let canvas = document.getElementById('canvas')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

let DEBUG = true
let gl = getWebGLContext(canvas, DEBUG)

// 顶点着色器
let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main () {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
  }
`

// 片元着色器
let FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main () {
    gl_FragColor = v_Color;
  }
`

// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

// 得到 a_Position
let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
let a_Color = gl.getAttribLocation(gl.program, 'a_Color')

function render () {
  // 绘制背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  let vertex = new Float32Array([
    0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
    0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
    -0.5, -0.5, 30.0, 0.0, 0.0, 1.0
  ])

  let n = 3

  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW)

  let FSIZE = vertex.BYTES_PER_ELEMENT

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)

  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_PointSize)
  gl.enableVertexAttribArray(a_Color)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

render()