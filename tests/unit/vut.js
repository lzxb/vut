import ava from 'ava'
import Vut from '../../src/index'

const USER = {
  data () {
    return {
      name: 'lzxb'
    }
  },
  updateName (name) {
    this.name = name
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
      }
    }
  }
}

const logPlugin = {
  instance: {
    beforeCreate () {
      this.$logs = [{ name: 'instance.beforeCreate', self: this }]
    },
    created () {
      this.$logs.push({ name: 'instance.created', self: this })
    },
    beforeDestroy () {
      this.$logs.push({ name: 'instance.beforeDestroy', self: this })
    },
    destroyed () {
      this.$logs.push({ name: 'instance.destroyed', self: this })
    }
  },
  module: {
    beforeCreate () {
      this.$logs = this.$context.$logs
      this.$logs.push({ name: 'module.beforeCreate', self: this })
    },
    created () {
      this.$logs.push({ name: 'module.created', self: this })
    },
    beforeDestroy () {
      this.$logs.push({ name: 'module.beforeDestroy', self: this })
    },
    destroyed () {
      this.$logs.push({ name: 'module.destroyed', self: this })
    }
  }
}

Vut.use(logPlugin)

ava.serial('check errors', t => {
  const store = new Vut()
  const logs = []

  try {
    Vut.use()
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.addModules(null)
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.addModules('')
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.addModules('user', null)
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.addModules('user', {
      data: null
    })
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.addModules('user', {
      data () {}
    })
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store
      .addModules('user', {
        data () {
          return {}
        }
      })
      .addModules('user', {})
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    Vut.use({})
  } catch (e) {
    logs.push(e.toString())
  }

  try {
    store.getModule()
  } catch (e) {
    logs.push(e.toString())
  }

  t.deepEqual([
    'Error: [Vut] plugin not is object type',
    'Error: [Vut] \'path=null\' not is string type',
    'Error: [Vut] \'path\' not is null string',
    'Error: [Vut] user \'options\' not is object type',
    'Error: [Vut] \'user\' not is function type',
    'Error: [Vut] \'store.getAction(user).data()\' return value not is object type',
    'Error: [Vut] \'user\' already is in module',
    'Error: [Vut] \'Vut.use(plugin)\' must in \'new Vut()\' before',
    'Error: [Vut] The parameter is illegal. Please use \'store.getModule(path: string)\' or \'store.getModule({ [path: string]: string })\''
  ], logs)
})

ava.serial('new a instance', t => {
  t.deepEqual(Vut.options.plugins, [logPlugin])
  const store = new Vut()
  store.addModules('user', USER)

  t.true('user' in store.modules)
  t.true('user/order' in store.modules)

  t.deepEqual({ name: 'lzxb' }, store.getState('user'))
  store.getActions('user').updateName('LZXB')
  t.deepEqual({ name: 'LZXB' }, store.getState('user'))
  t.true('$state' in store.getModule('user'))
  t.true('$actions' in store.getModule('user'))

  t.deepEqual({ list: [] }, store.getState('user/order'))
  store.getActions('user/order').plus()
  t.deepEqual({ list: [1] }, store.getState('user/order'))

  t.true('$state' in store.getModule('user/order'))
  t.true('$actions' in store.getModule('user/order'))

  store.destroy()
  t.deepEqual([
    {
      name: 'instance.beforeCreate',
      self: store
    },
    {
      name: 'instance.created',
      self: store
    },
    {
      name: 'module.beforeCreate',
      self: store.getModule('user/order')
    },
    {
      name: 'module.created',
      self: store.getModule('user/order')
    },
    {
      name: 'module.beforeCreate',
      self: store.getModule('user')
    },
    {
      name: 'module.created',
      self: store.getModule('user')
    },
    {
      name: 'instance.beforeDestroy',
      self: store
    },
    {
      name: 'module.beforeDestroy',
      self: store.getModule('user/order')
    },
    {
      name: 'module.destroyed',
      self: store.getModule('user/order')
    },
    {
      name: 'module.beforeDestroy',
      self: store.getModule('user')
    },
    {
      name: 'module.destroyed',
      self: store.getModule('user')
    },
    {
      name: 'instance.destroyed',
      self: store
    }
  ], store.$logs)
})

ava.serial('function return value', t => {
  const store = new Vut()
  t.is(store, store.addModules('user', USER))

  t.is(store.modules['user'], store.getModule('user'))
  t.deepEqual({ user: store.modules['user'] }, store.getModule({ user: 'user' }))
  t.is(store.modules['user/order'], store.getModule('user/order'))
  t.deepEqual({ user: store.modules['user/order'] }, store.getModule({ user: 'user/order' }))

  t.is(store.modules['user'].$state, store.getState('user'))
  t.deepEqual({ user: store.modules['user'].$state }, store.getState({ user: 'user' }))
  t.is(store.modules['user/order'].$state, store.getState('user/order'))
  t.deepEqual({ user: store.modules['user/order'].$state }, store.getState({ user: 'user/order' }))

  t.is(store.modules['user'].$actions, store.getActions('user'))
  t.deepEqual({ user: store.modules['user'].$actions }, store.getActions({ user: 'user' }))
  t.is(store.modules['user/order'].$actions, store.getActions('user/order'))
  t.deepEqual({ user: store.modules['user/order'].$actions }, store.getActions({ user: 'user/order' }))

  t.is(store, store.destroy())
})
