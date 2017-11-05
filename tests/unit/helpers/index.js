export default {
  user: {
    data () {
      return {
        name: 'lzxb'
      }
    },
    updateName (name) {
      this.name = name
      return this.name
    },
    modules: {
      order: {
        data () {
          return {
            list: []
          }
        },
        plus () {
          this.list.push(this.list.length + 1)
          return this.list
        }
      }
    }
  }
}
