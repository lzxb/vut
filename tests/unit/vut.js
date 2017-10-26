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
  vut.store.census.plus()
  t.is(vut.store.census.count, 1)
  t.is(vut.store.census.$state.count, 1)
})

ava('create params error', t => {
  const vut = new Vut()
  const errs = []
  try {
    vut.create()
  } catch (e) {
    errs.push(e.toString())
  }

  try {
    vut.create('ok', null)
  } catch (e) {
    errs.push(e.toString())
  }

  try {
    vut.create('ok', {})
  } catch (e) {
    errs.push(e.toString())
  }

  try {
    vut.create('ok', { data () {} })
  } catch (e) {
    errs.push(e.toString())
  }
  vut.create('ok', {
    data () {
      return {}
    }
  })
  try {
    vut.create('ok', {
      data () {
        return {}
      }
    })
  } catch (e) {
    errs.push(e.toString())
  }
  t.is(JSON.stringify(errs), '["TypeError: Cannot read property \'data\' of undefined","TypeError: Cannot read property \'data\' of null","TypeError: self.data is not a function","TypeError: Cannot convert undefined or null to object"]')
})
