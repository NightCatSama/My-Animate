import '../styles/index.scss'

import debug from 'debug'
const log = debug('app:log')

// The logger should only be enabled if we’re not in production.
if (ENV !== 'production') {
  // Enable the logger.
  debug.enable('*')
  log('Logging is enabled!')

  // Enable LiveReload
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  )
} else {
  debug.disable()
}

// 画点点
import './modules/points.js'

// 画图形 （矩阵）
// import './modules/webgl.js'

// 动画
// import './modules/anim.js'