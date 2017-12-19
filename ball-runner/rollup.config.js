// Rollup plugins
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import sass from 'rollup-plugin-sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

import browserSync from 'browser-sync'
import minimist from 'minimist'

let isBuild = minimist(process.argv.slice(2)).build

if (!isBuild) {
  let server = browserSync.create()

  server.init({
    files: './build/',
    server: {
      baseDir: './build/',
    },
    port: 12333
  })
}

export default {
  entry: 'src/scripts/main.ts',
  dest: 'build/js/main.min.js',
  format: 'umd',
  sourceMap: 'inline',
  plugins: [
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    typescript({
      typescript: require('typescript')
    }),
    sass({
      processor: css => postcss([ autoprefixer({ browsers: [] }) ])
        .process(css)
        .then(result => result.css),
      insert: true
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ]
};
