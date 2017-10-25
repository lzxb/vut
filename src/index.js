const util = {
  isObject (obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]'
  },
  error (msg) {
    console.error(`[Vut] ${msg}`)
  },
  has (obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr)
  },
  callHook (goods, name) {
    goods.$plugins.forEach(plugin => {
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
    const item = plugin(this, options)
    if (!util.isObject(item)) {
      util.error(`'${name}' not is object type`)
    }
    this.plugins.push(item)
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
    const self = Object.create(null)
    self.$options = options
    const { plugins } = self.$options
    if (Array.isArray(plugins)) {
      self.$plugins = self.$options.plugins.concat(this.plugins)
    } else {
      self.$plugins = [].concat(this.plugins)
    }
    util.callHook(self, 'beforeCreate')
    // Bind methods
    Object.keys(self.$options).forEach(fnName => {
      self[fnName] = function action () {
        const res = self.$options[fnName].apply(self, arguments)
        return res
      }
    })
    // Compression path
    self.$state = self.data()
    if (!util.isObject(self.$state)) {
      util.error(`'${name}' not is object type`)
    }
    Object.keys(self.$state).forEach(attrName => {
      Object.defineProperty(self, attrName, {
        get () {
          return self.$state[attrName]
        },
        set (val) {
          self.$state[attrName] = val
        }
      })
    })
    this.store[name] = self
    util.callHook(self, 'created')
    return this
  }
}

export default Vut
