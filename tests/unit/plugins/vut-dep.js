import ava from 'ava'
import Vut from '../../../src/index'
import vutDep from '../../../src/plugins/vut-dep'

ava('test', t => {
  const vut = new Vut()
  vut.use(vutDep)
  vut.create('ok', {
    data () {
      return {}
    }
  })
  t.is(vut.$dep, vut.store.ok.$dep)
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
