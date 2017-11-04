import ava from 'ava'
import Vue from 'vue'
import Vut from '../../../src/index'
import vutVue from '../../../src/plugins/vut-vue'

Vue.use(vutVue)
Vut.use(vutVue())

ava('base', t => {
  const vut = new Vut()
  vut.addModules('census', {
    data () {
      return {
        count: 0,
        arr: []
      }
    },
    plus () {
      this.count++
    }
  })
  t.is(vut.$vue.$data.$$state[0], vut.getState('census'))
})
