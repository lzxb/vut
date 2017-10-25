const path = require('path')
const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')

const build = async (opts) => {
  const plugins = [
    babel({
      babelrc: false,
      presets: [
        ['es2015-rollup'],
        'stage-0'
      ],
      plugins: [
        'transform-decorators-legacy'
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    })
  ]
  if (opts.env === 'production') {
    plugins.push(uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
      }
    }, minify))
  }
  const bundle = await rollup({
    input: path.resolve(__dirname, '../src/index.js'),
    plugins
  })
  await bundle.write({
    name: 'Vut',
    format: 'umd',
    ...opts,
    file: `dist/${opts.file}`
  })
}

const list = [
  {
    env: 'production',
    file: 'vut.min.js'
  },
  {
    env: 'development',
    file: 'vut.js'
  }
]
list.forEach(opts => build(opts))
