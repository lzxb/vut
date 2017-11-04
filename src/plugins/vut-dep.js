class Dep {
  constructor () {
    this.subs = []
  }
  addSub (fn) {
    if (typeof fn !== 'function') {
      throw new Error(`[vut-dep] addSub(fn: Function) not is function type`)
    }
    this.subs.push(fn)
  }
  removeSub (fn) {
    this.subs = this.subs.filter((item) => item !== fn)
  }
  notify () {
    this.subs.forEach(fn => fn())
  }
}

export default function vutDep (options) {
  return {
    instance: {
      beforeCreate () {
        this.$dep = new Dep()
      }
    },
    module: {
      beforeCreate () {
        this.$dep = this.$context.$dep
      }
    }
  }
}
