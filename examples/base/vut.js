import Vue from 'vue'
import Vut from 'vut'
import VutDep from 'vut-dep'
import VutVue from 'vut-vue'

const vut = new Vut()

vut
  .use(VutDep)
  .use(VutVue, { Vue })

vut.create('user', {
  data () {
    return {
      loading: false,
      detail: {
        name: null,
        age: null
      }
    }
  },
  load () {
    this.loading = true
    this.$dep.notify()
    setTimeout(() => {
      this.detail = {
        name: 'Vut',
        age: 24
      }
      this.loading = false
      this.$dep.notify()
    }, 3000)
  }
})

export default vut
