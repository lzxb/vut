import Vut from './vut'

const util = {
  isObject (obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]'
  },
  error (msg) {
    throw new Error(`[Vut] ${msg}`)
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
      return fn(vut.modules[paths])
    } else if (util.isObject(paths)) {
      const data = {}
      Object.keys(paths).forEach(name => {
        data[name] = fn(vut.modules[paths[name]])
      })
      return data
    }
    util.error(`The parameter is illegal. Please use 'store.getModule(path: string)' or 'store.getModule({ [path: string]: string })'`)
  },
  callModuleHook (vut, goods, name) {
    const mixins = Vut
      .options
      .plugins
      .filter(plugin => {
        return util.isObject(plugin.module)
      })
      .map(plugin => plugin.module)
    mixins.forEach(mixin => {
      if (!util.has(mixin, name)) return
      mixin[name].call(goods)
    })
  },
  callInstanceHook (vut, name) {
    const mixins = Vut
      .options
      .plugins
      .filter(plugin => {
        return util.isObject(plugin.instance)
      })
      .map(plugin => plugin.instance)
    mixins.forEach(mixin => {
      if (!util.has(mixin, name)) return
      mixin[name].call(vut)
    })
  }
}

export default util
