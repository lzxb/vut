import Vue from 'vue'
import Vut from 'vut'
import vutDep from 'vut-dep'
import vutVue from 'vut-vue'

const vut = new Vut()

vut
  .use(vutDep)
  .use(vutVue, { Vue })

vut.create('census', {
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
