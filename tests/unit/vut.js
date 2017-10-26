import ava from 'ava'
import Vut from '../../src/index'

ava('base', t => {
  const vut = new Vut()
  vut.create('census', {
    data () {
      return {
        count: 0,
        arr: []
      }
    },
    plus () {
      this.count++
    }
  })
  t.is(vut.store.census.count, 0)
  t.is(vut.store.census.$state.count, 0)
  t.deepEqual(vut.store.census.arr, [])
  t.deepEqual(vut.store.census.$state.arr, [])
  t.is(vut.store.census.arr, vut.store.census.$state.arr)
})
