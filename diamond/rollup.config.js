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

export default {
  entry: 'src/scripts/main.js',
  dest: 'build/js/main.min.js',
  format: 'umd',
  sourceMap: 'inline',
  plugins: [
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
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
