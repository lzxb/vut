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

export default util
