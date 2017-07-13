let canvas = document.getElementById('canvas')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

let DEBUG = true
let gl = getWebGLContext(canvas, DEBUG)

// 顶点着色器
let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_vertexCrood;
  varying vec2 v_vertexCrood;
  void main () {
    gl_Position = a_Position;
    v_vertexCrood = a_vertexCrood;
  }
`

// 片元着色器
let FSHADER_SOURCE = `
  precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_vertexCrood;
  void main () {
    vec4 v_Color = texture2D(u_Sampler, v_vertexCrood);
    gl_FragColor = v_Color;
  }
`

// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
let a_vertexCrood = gl.getAttribLocation(gl.program, 'a_vertexCrood')
let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')

function render () {
  // 绘制背景色
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  let vertex = new Float32Array([
    -0.8,  0.5, 0.0, 1.0,
    -0.8, -0.5, 0.0, 0.0,
    0.8,   0.5, 1.0, 1.0,
    0.8,  -0.5, 1.0, 0.0
  ])

  let n = 4

  // 创建缓存区
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW)

  let FSIZE = vertex.BYTES_PER_ELEMENT

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.vertexAttribPointer(a_vertexCrood, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)

  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_vertexCrood)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

function handleLoadedTexture (texture) {
  // 向 target 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // y 轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  // 配置纹理图案
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image)

  // 配置纹理参数
  if (isPowerOf2(texture.image.width) && isPowerOf2(texture.image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }

  // 开启0号文理单元
  gl.activeTexture(gl.TEXTURE0)
  // 向 target 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // 将0号纹理传递给着色器
  gl.uniform1i(u_Sampler, 0)
}

function initTexture () {
  let texture = gl.createTexture()
  texture.image = new Image()
  texture.image.onload = () => {
    handleLoadedTexture(texture)
    render()
  }

  texture.image.src = './texture.jpg'
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0
}

// 初始化纹理
initTexture()
