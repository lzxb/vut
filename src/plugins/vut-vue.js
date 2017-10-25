export default function VutVue (context, options) {
  let $$state = []
  /* eslint-disable no-new */
  new options.Vue({
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
