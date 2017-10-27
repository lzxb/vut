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

export default function vutDep (context, options) {
  context.$dep = new Dep()
  return {
    beforeCreate () {
      this.$dep = context.$dep
    }
  }
}
