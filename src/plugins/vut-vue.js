let _Vue

const util = {
  error (msg) {
    throw new Error(`[vut-vue] ${msg}`)
  }
}

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
      this.$vue.destroy()
    }
  },
  module: {
    created () {
      const state = this.$context.$vue.$data.$$state
      state.push(this.$state)
      const index = state.length - 1
      Object.defineProperty(this, '$state', {
        get () {
          return state[index]
        },
        set (val) {
          state[index] = val
        }
      })
    }
  }
}
