let _Vue

const install = (Vue) => {
  if (_Vue) return
  _Vue = Vue
  Object.defineProperty(_Vue.prototype, '$vut', {
    get () { return this.$root._vut }
  })
  _Vue.mixin({
    beforeCreate () {
      if (!this.$options.vut) return
      this._vut = this.$options.vut
    }
  })
}
export default function VutVue (context, options) {
  install(options.Vue)
  let $$state = []
  /* eslint-disable no-new */
  new _Vue({
    data: { $$state }
  })
  return {
    created () {
      $$state.push(this.$state)
      const index = $$state.length - 1
      Object.defineProperty(this, '$state', {
        get () {
          return $$state[index]
        },
        set (val) {
          $$state[index] = val
        }
      })
    }
  }
}
