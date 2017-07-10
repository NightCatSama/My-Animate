let canvas = document.getElementById('canvas')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

let DEBUG = true
let gl = getWebGLContext(canvas, DEBUG)

// 顶点着色器
let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main () {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`

// 片元着色器
let FSHADER_SOURCE = `
  void main () {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

// 得到 a_Position
let a_Position = gl.getAttribLocation(gl.program, 'a_Position')

let points = []
canvas.onclick = (e) => {
  let bounds = canvas.getBoundingClientRect()
  let mx = (e.clientX - bounds.left - canvas.width / 2) / (canvas.width / 2)
  let my = (canvas.height / 2 - (e.clientY - bounds.top)) / (canvas.height / 2)
  points.push({
    x: mx,
    y: my,
    vx: 0.01,
    vy: 0.01
  })
}

function render () {
  // 绘制背景色
  gl.clearColor(0.5, 0.5, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 绘制点
  Array.from(points, (point) => {
    point.x += point.vx
    point.y += point.vy

    if (point.x > 1.0 || point.x < -1.0) {
      point.vx = -point.vx
    }
    if (point.y > 1.0 || point.y < -1.0) {
      point.vy = -point.vy
    }

    gl.vertexAttrib2f(a_Position, point.x, point.y)
    gl.drawArrays(gl.POINTS, 0, 1)
  })
  requestAnimFrame(render)
}

requestAnimFrame(render)
