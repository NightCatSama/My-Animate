// Rollup plugins
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import sass from 'rollup-plugin-sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import typescript from 'rollup-plugin-typescript'
import json from 'rollup-plugin-json'

import browserSync from 'browser-sync'

if (process.env.NODE_ENV === 'development') {
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
  input: 'src/scripts/main.ts',
  output: {
    file: 'build/js/main.min.js',
    sourcemap: true,
    format: 'umd'
  },
  plugins: [
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    json({
      exclude: 'node_modules/**',
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ]
};
