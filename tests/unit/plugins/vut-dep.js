import ava from 'ava'
import Vut from '../../../src/index'
import vutDep from '../../../src/plugins/vut-dep'

Vut.use(vutDep())
ava('base', t => {
  const vut = new Vut()
  vut.addModules('ok', {
    data () {
      return {}
    }
  })
  t.is(vut.$dep, vut.getModule('ok').$dep)
  let count = 0
  const sub = () => {
    count++
  }
  vut.$dep.addSub(sub)
  t.deepEqual(vut.$dep.subs, [ sub ])
  vut.$dep.notify()
  t.is(count, 1)
  vut.$dep.removeSub(sub)
  t.deepEqual(vut.$dep.subs, [])
})

ava('error', t => {
  const errors = []
  const vut = new Vut()
  try {
    vut.$dep.addSub(null)
  } catch (e) {
    errors.push(e.toString())
  }
  t.deepEqual(errors, [
    'Error: [vut-dep] addSub(fn: Function) not is function type'
  ])
})
