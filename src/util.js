import Vut from './vut'

const util = {
  isObject (obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]'
  },
  error (msg) {
    throw new Error(`[vut] ${msg}`)
  },
  has (obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr)
  },
  pathCompression (obj, options) {
    Object.keys(options).forEach(k => {
      Object.defineProperty(obj, k, {
        get () {
          return options[k]
        },
        set (val) {
          options[k] = val
        }
      })
    })
  },
  getModule (vut, paths, fn) {
    if (typeof paths === 'string') {
      if (!util.has(vut.modules, paths)) {
        util.error(`Module '${paths}' does not exist`)
      }
      return fn(vut.modules[paths])
    } else if (util.isObject(paths)) {
      const data = {}
      Object.keys(paths).forEach(name => {
        if (!util.has(vut.modules, name)) {
          util.error(`Module '${paths[name]}' does not exist`)
        }
        data[name] = fn(vut.modules[paths[name]])
      })
      return data
    }
    util.error(`The parameter is illegal. Please use 'vut.getModule(path: string)' or 'vut.getModule({ [path: string]: string })'`)
  },
  callModuleHook (vut, goods, name, ...arg) {
    const mixins = Vut
      .options
      .plugins
      .filter(plugin => {
        return util.isObject(plugin.module)
      })
      .map(plugin => plugin.module)
    mixins.forEach(mixin => {
      if (!util.has(mixin, name)) return
      mixin[name].apply(goods, arg)
    })
  },
  callInstanceHook (vut, name, ...arg) {
    const mixins = Vut
      .options
      .plugins
      .filter(plugin => {
        return util.isObject(plugin.instance)
      })
      .map(plugin => plugin.instance)
    mixins.forEach(mixin => {
      if (!util.has(mixin, name)) return
      mixin[name].apply(vut, arg)
    })
  }
}

export default util
