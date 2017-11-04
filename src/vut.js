import util from './util'

let newId = 0

class Vut {
  constructor (options) {
    newId++
    this.modules = {}
    this.plugins = []
    util.callInstanceHook(this, 'beforeCreate')
    util.callInstanceHook(this, 'created')
  }
  addModules (path, moduleOptions) {
    if (typeof path !== 'string') {
      util.error(`${path} 'path' not is string type`)
    }
    if (!util.isObject(moduleOptions)) {
      util.error(`${path} 'options' not is object type`)
    }
    if (util.isObject(moduleOptions.modules)) {
      Object.keys(moduleOptions.modules).forEach(k => {
        this.addModules(`${path}/${k}`, moduleOptions.modules[k])
      })
    }
    if (util.has(this.modules, path)) {
      util.error(`'${path}' already is in module`)
    }
    if (typeof moduleOptions.data !== 'function') {
      util.error(`'${path}' not is function type`)
    }
    const goods = Object.create(null)
    goods.$options = moduleOptions
    goods.$context = this
    util.callModuleHook(this, goods, 'beforeCreate')

    // Bind action
    goods.$actions = {}
    Object.keys(goods.$options).forEach(fnName => {
      if (typeof goods.$options[fnName] !== 'function') return
      goods.$actions[fnName] = function action () {
        return goods.$options[fnName].apply(goods, arguments)
      }
    })

    // Bind state
    goods.$state = goods.$actions.data()
    if (!util.isObject(goods.$state)) {
      util.error(`'vut.getAction(${path}).data()' return value not is object type`)
    }

    // Path compression
    util.pathCompression(goods, goods.$actions)
    util.pathCompression(goods, goods.$state)

    this.modules[path] = goods
    util.callModuleHook(this, goods, 'created')
    return this
  }
  getModule (paths) {
    return util.getModule(this, paths, goods => goods)
  }
  getState (paths) {
    return util.getModule(this, paths, goods => goods.$state)
  }
  getActions (paths) {
    return util.getModule(this, paths, goods => goods.$actions)
  }
  destroy () {
    util.callInstanceHook(this, 'beforeDestroy')
    util.callInstanceHook(this, 'destroyed')
  }
}

Object.assign(Vut, {
  options: {
    plugins: []
  },
  use (plugin) {
    if (!util.isObject(plugin)) {
      util.error(`plugin not is object type`)
    }
    if (newId) {
      return util.error(`'Vut.use(plugin)' must in 'new Vut()' before`)
    }
    this.options.plugins.push(plugin)
    return this
  },
  util
})

export default Vut
