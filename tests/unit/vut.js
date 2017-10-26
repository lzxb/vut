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
  const errors = []
  const vut = new Vut()
  try {
    vut.create()
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.create('ok', null)
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.create('ok', {})
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.create('ok', { data () {} })
  } catch (e) {
    errors.push(e.toString())
  }

  vut.create('ok', { data () { return {} } })
  t.deepEqual(vut.store.ok.$state, {})

  try {
    vut.create('ok', { data () { return {} } })
  } catch (e) {
    errors.push(e.toString())
  }

  t.deepEqual(errors, [
    'Error: [Vut] \'name\' not is string type',
    'Error: [Vut] \'options\' not is object type',
    'Error: [Vut] \'ok\' not is function type',
    'Error: [Vut] \'ok\' return value not is object type',
    'Error: [Vut] \'ok\' already is in store'
  ])
})

ava('use error', t => {
  const errors = []
  let vut = new Vut()

  try {
    vut.use({})
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.use(() => {})
  } catch (e) {
    errors.push(e.toString())
  }
  vut.create('ok', {
    data () {
      return {}
    }
  })

  try {
    vut.use()
  } catch (e) {
    errors.push(e.toString())
  }

  t.deepEqual(errors, [
    'Error: [Vut] plugin not is function type',
    'Error: [Vut] plugin return value not is object type',
    'Error: [Vut] plugin must in create store before call'
  ])
})

ava('my the plugin', t => {
  const vut = new Vut()
  const hooks = []
  vut.use(() => {
    return {
      beforeCreate () {
        hooks.push('beforeCreate-1')
      },
      created () {
        hooks.push('created-1')
      }
    }
  })

  vut.use(() => {
    return {
      beforeCreate () {
        hooks.push('beforeCreate-2')
      }
    }
  })

  vut.create('ok', {
    data () {
      return {
        count: 0
      }
    }
  })
  t.deepEqual(hooks, [
    'beforeCreate-1',
    'beforeCreate-2',
    'created-1'
  ])
})
