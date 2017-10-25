import Vue from 'vue'
import Vut from 'vut'
import VutDep from 'vut-dep'
import VutVue from 'vut-vue'

const vut = new Vut()

vut
  .use(VutDep)
  .use(VutVue, { Vue })

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
