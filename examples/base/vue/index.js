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

// import Vut from 'vut'

// const store = new Vut()

// store.addModules('user', {
//   vuts: ['user'],
//   data () {
//     return {
//       count: 0
//     }
//   },
//   plus () {
//     this.count++
//   },
//   modules: {
//     order: {
//       data () {
//         return {
//           list: []
//         }
//       },
//       load () {
//         this.list.push(++this.list.length)
//       }
//     }
//   }
// })
// console.log(store.getState({ user: 'user' }))
// console.log(store.getState('user'))
