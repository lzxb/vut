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
  callHook (vut, goods, name) {
    vut.plugins.forEach(plugin => {
      if (!util.has(plugin, name)) return
      plugin[name].call(goods)
    })
  }
}

class Vut {
  constructor () {
    this.store = {}
    this.plugins = []
  }
  use (plugin, options) {
    if (Object.keys(this.store).length) {
      util.error(`plugin must in create store before call`)
    }
    if (typeof plugin !== 'function') {
      util.error(`plugin not is function type`)
    }
    const mixin = plugin(this, options)
    if (!util.isObject(mixin)) {
      util.error(`plugin return value not is object type`)
    }
    this.plugins.push(mixin)
    return this
  }
  create (name, options) {
    if (typeof name !== 'string') {
      util.error(`'name' not is string type`)
    }
    if (!util.isObject(options)) {
      util.error(`'options' not is object type`)
    }
    if (util.has(this.store, name)) {
      util.error(`'${name}' already is in store`)
    }
    if (typeof options.data !== 'function') {
      util.error(`'${name}' not is function type`)
    }
    const goods = Object.create(null)
    goods.$options = options
    util.callHook(this, goods, 'beforeCreate')
    // Bind methods
    Object.keys(goods.$options).forEach(fnName => {
      goods[fnName] = function action () {
        const res = goods.$options[fnName].apply(goods, arguments)
        return res
      }
    })
    // Compression path
    goods.$state = goods.data()
    if (!util.isObject(goods.$state)) {
      util.error(`'${name}' return value not is object type`)
    }
    Object.keys(goods.$state).forEach(attrName => {
      Object.defineProperty(goods, attrName, {
        get () {
          return goods.$state[attrName]
        },
        set (val) {
          goods.$state[attrName] = val
        }
      })
    })
    this.store[name] = goods
    util.callHook(this, goods, 'created')
    return this
  }
}

export default Vut
