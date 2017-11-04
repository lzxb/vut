import ava from 'ava'
import helpers from '../helpers/index'
import Vue from 'vue'
import Vut from '../../../src/index'
import vutVue from '../../../src/plugins/vut-vue'

ava.serial('check errors', t => {
  const errors = []

  try {
    Vut.use(vutVue)
    /* eslint-disable no-new  */
    new Vut()
  } catch (e) {
    errors.push(e.toString())
  }

  t.deepEqual([
    'Error: [vut-vue] Please install \'Vue.use(vutVue)\' in Vut.use(vutVue) before'
  ], errors)
  Vut.options.plugins = []
})

ava.serial('base', t => {
  Vut.options.plugins = []
  Vue.use(vutVue)
  Vut.use(vutVue)

  const vut = new Vut()
  vut.addModules('user', helpers.user)

  t.deepEqual([
    vut.getState('user/order'),
    vut.getState('user')
  ], vut.$vue.$data.$$state)

  t.deepEqual({ name: 'lzxb' }, vut.getState('user'))
  t.deepEqual({ list: [] }, vut.getState('user/order'))

  vut.getActions('user').updateName('LZXB')
  vut.getActions('user/order').plus()
  t.deepEqual({ name: 'LZXB' }, vut.getState('user'))
  t.deepEqual({ list: [1] }, vut.getState('user/order'))

  const vm = new Vue({
    vut
  })
  t.is(vm._vut, vm.$vut)
  t.is(vm.$vut, vut)
})
