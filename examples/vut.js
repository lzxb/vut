import Vue from 'vue'
import Vut from 'vut'
import vutDep from 'vut-dep'
import vutVue from 'vut-vue'

Vue
  .use(vutVue)

Vut
  .use(vutDep)
  .use(vutVue)

const vut = new Vut()

vut.addModules('census', {
  data () {
    return {
      count: 0
    }
  },
  setCount (count) {
    this.count = count
    this.$dep.notify()
  },
  plus () {
    this.count++
    this.$dep.notify()
  },
  minus () {
    this.count--
    this.$dep.notify()
  }
})

export default vut
