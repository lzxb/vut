const path = require('path')
const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const babelHelpers = require('babel-helpers')

const build = async (opts) => {
  const plugins = [
    babel({
      babelrc: false,
      presets: [
        ['es2015-rollup'],
        'stage-0',
        'react'
      ],
      plugins: [
        'transform-decorators-legacy',
        'external-helpers'
      ],
      externalHelpersWhitelist: babelHelpers.list.filter(helperName => helperName !== 'asyncGenerator')
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
    input: path.resolve(__dirname, opts.input),
    plugins,
    external: ['react', 'prop-types']
  })
  await bundle.write({
    name: opts.name,
    format: 'umd',
    ...opts,
    file: `dist/${opts.file}`,
    sourcemap: true,
    globals: {
      'react': 'React',
      'prop-types': 'PropTypes'
    }
  })
}

const list = [
  {
    name: 'Vut',
    input: '../src/index.js',
    env: 'production',
    file: 'vut.min.js'
  },
  {
    name: 'Vut',
    input: '../src/index.js',
    env: 'development',
    file: 'vut.js'
  },
  {
    name: 'vutDep',
    input: '../src/plugins/vut-dep.js',
    env: 'production',
    file: 'plugins/vut-dep/vut-dep.min.js'
  },
  {
    name: 'vutDep',
    input: '../src/plugins/vut-dep.js',
    env: 'development',
    file: 'plugins/vut-dep/vut-dep.js'
  },
  {
    name: 'vutReact',
    input: '../src/plugins/vut-react.jsx',
    env: 'production',
    file: 'plugins/vut-react/vut-react.min.js'
  },
  {
    name: 'vutReact',
    input: '../src/plugins/vut-react.jsx',
    env: 'development',
    file: 'plugins/vut-react/vut-react.js'
  },
  {
    name: 'vutVue',
    input: '../src/plugins/vut-vue.js',
    env: 'production',
    file: 'plugins/vut-vue/vut-vue.min.js'
  },
  {
    name: 'vutVue',
    input: '../src/plugins/vut-vue.js',
    env: 'development',
    file: 'plugins/vut-vue/vut-vue.js'
  }
]
list.forEach(opts => build(opts))
