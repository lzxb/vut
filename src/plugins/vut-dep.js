class Dep {
  constructor () {
    this.subs = []
  }
  addSub (fn) {
    this.subs.push(fn)
  }
  removeSub (fn) {
    this.subs = this.subs.filter((item) => item !== fn)
  }
  notify () {
    this.subs.forEach(fn => fn())
  }
}

export default function VutDep (context, options) {
  context.$dep = new Dep()
  return {
    beforeCreate () {
      this.$dep = context.$dep
    }
  }
}
