let _Vue

const util = {
  error (msg) {
    throw new Error(`[vut-vue] ${msg}`)
  }
}

const install = (Vue) => {
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
export default {
  install,
  instance: {
    beforeCreate () {
      if (!_Vue) {
        util.error(`Please install 'Vue.use(vutVue)' in Vut.use(vutVue) before`)
      }
      this.$vue = new _Vue({
        data: { $$state: [] }
      })
    },
    destroyed () {
      this.$vue.$data.$$state = []
      this.$vue.$destroy()
      delete this.$vue
    }
  },
  module: {
    created () {
      const data = this.$context.$vue.$data
      data.$$state.push(this.$state)
      const index = data.$$state.length - 1
      Object.defineProperty(this, '$state', {
        get () {
          return data.$$state[index]
        },
        set (val) {
          data.$$state[index] = val
        }
      })
    }
  }
}
