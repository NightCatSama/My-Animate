import browserSync from 'browser-sync'
import buildRollup from './rollup.config.js'

let server = browserSync.create()
let reload = browserSync.reload

server.init({
  files: './build/',
  server: {
    baseDir: './build/',
  },
  port: 12333
})

export default buildRollup