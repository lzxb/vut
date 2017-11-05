import Vue from 'vue'
import App from './App'
import vut from '../../vut'

export default new Vue({
  vut,
  el: '#app-vue',
  render (h) {
    return h(App)
  }
})
