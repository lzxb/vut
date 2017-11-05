import ava from 'ava'
import helpers from './helpers/index'
import Vut from '../../src/index'

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
    },
    beforeAction (fnName) {
      this.$logs.push({ name: 'module.beforeAction', self: this, fnName })
    },
    actioned (fnName, res) {
      this.$logs.push({ name: 'module.actioned', self: this, fnName, res })
    }
  }
}

Vut.use(logPlugin)

ava.serial('check errors', t => {
  const vut = new Vut()
  const errors = []

  try {
    Vut.use()
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.addModules(null)
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.addModules('')
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.addModules('user', null)
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.addModules('user', {
      data: null
    })
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.addModules('user', {
      data () {}
    })
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut
      .addModules('user', {
        data () {
          return {}
        }
      })
      .addModules('user', {})
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    Vut.use({})
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.getModule()
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.getModule('xxxxxxxxxx')
  } catch (e) {
    errors.push(e.toString())
  }

  try {
    vut.getModule({ x: 'xxxxxxxxxx' })
  } catch (e) {
    errors.push(e.toString())
  }

  t.deepEqual([
    'Error: [vut] plugin not is object type',
    'Error: [vut] \'path=null\' not is string type',
    'Error: [vut] \'path\' not is null string',
    'Error: [vut] user \'options\' not is object type',
    'Error: [vut] \'user\' not is function type',
    'Error: [vut] \'vut.getAction(user).data()\' return value not is object type',
    'Error: [vut] \'user\' already is in module',
    'Error: [vut] \'Vut.use(plugin)\' must in \'new Vut()\' before',
    'Error: [vut] The parameter is illegal. Please use \'vut.getModule(path: string)\' or \'vut.getModule({ [path: string]: string })\'',
    'Error: [vut] Module \'xxxxxxxxxx\' does not exist',
    'Error: [vut] Module \'xxxxxxxxxx\' does not exist'
  ], errors)
})

ava.serial('new a instance', t => {
  t.deepEqual(Vut.options.plugins, [logPlugin])
  const vut = new Vut()
  vut.addModules('user', helpers.user)

  t.true('user' in vut.modules)
  t.true('user/order' in vut.modules)

  t.deepEqual({ name: 'lzxb' }, vut.getState('user'))
  vut.getActions('user').updateName('LZXB')
  t.deepEqual({ name: 'LZXB' }, vut.getState('user'))
  t.true('$state' in vut.getModule('user'))
  t.true('$actions' in vut.getModule('user'))

  t.deepEqual({ list: [] }, vut.getState('user/order'))
  vut.getActions('user/order').plus()
  t.deepEqual({ list: [1] }, vut.getState('user/order'))

  t.true('$state' in vut.getModule('user/order'))
  t.true('$actions' in vut.getModule('user/order'))

  vut.destroy()
  t.deepEqual([
    {
      name: 'instance.beforeCreate',
      self: vut
    },
    {
      name: 'instance.created',
      self: vut
    },
    {
      name: 'module.beforeCreate',
      self: vut.getModule('user/order')
    },
    {
      name: 'module.beforeAction',
      self: vut.getModule('user/order'),
      fnName: 'data'
    },
    {
      name: 'module.actioned',
      self: vut.getModule('user/order'),
      fnName: 'data',
      res: vut.getState('user/order')
    },
    {
      name: 'module.created',
      self: vut.getModule('user/order')
    },
    {
      name: 'module.beforeCreate',
      self: vut.getModule('user')
    },
    {
      name: 'module.beforeAction',
      self: vut.getModule('user'),
      fnName: 'data'
    },
    {
      name: 'module.actioned',
      self: vut.getModule('user'),
      fnName: 'data',
      res: vut.getState('user')
    },
    {
      name: 'module.created',
      self: vut.getModule('user')
    },
    {
      name: 'module.beforeAction',
      self: vut.getModule('user'),
      fnName: 'updateName'
    },
    {
      name: 'module.actioned',
      self: vut.getModule('user'),
      fnName: 'updateName',
      res: 'LZXB'
    },
    {
      name: 'module.beforeAction',
      self: vut.getModule('user/order'),
      fnName: 'plus'
    },
    {
      name: 'module.actioned',
      self: vut.getModule('user/order'),
      fnName: 'plus',
      res: vut.getModule('user/order').list
    },
    {
      name: 'instance.beforeDestroy',
      self: vut
    },
    {
      name: 'module.beforeDestroy',
      self: vut.getModule('user/order')
    },
    {
      name: 'module.destroyed',
      self: vut.getModule('user/order')
    },
    {
      name: 'module.beforeDestroy',
      self: vut.getModule('user')
    },
    {
      name: 'module.destroyed',
      self: vut.getModule('user')
    },
    {
      name: 'instance.destroyed',
      self: vut
    }
  ], vut.$logs)
})

ava.serial('function return value', t => {
  const vut = new Vut()
  t.is(vut, vut.addModules('user', helpers.user))

  t.is(vut.modules['user'], vut.getModule('user'))
  t.deepEqual({ user: vut.modules['user'] }, vut.getModule({ user: 'user' }))
  t.is(vut.modules['user/order'], vut.getModule('user/order'))
  t.deepEqual({ user: vut.modules['user/order'] }, vut.getModule({ user: 'user/order' }))

  t.is(vut.modules['user'].$state, vut.getState('user'))
  t.deepEqual({ user: vut.modules['user'].$state }, vut.getState({ user: 'user' }))
  t.is(vut.modules['user/order'].$state, vut.getState('user/order'))
  t.deepEqual({ user: vut.modules['user/order'].$state }, vut.getState({ user: 'user/order' }))

  t.is(vut.modules['user'].$actions, vut.getActions('user'))
  t.deepEqual({ user: vut.modules['user'].$actions }, vut.getActions({ user: 'user' }))
  t.is(vut.modules['user/order'].$actions, vut.getActions('user/order'))
  t.deepEqual({ user: vut.modules['user/order'].$actions }, vut.getActions({ user: 'user/order' }))

  t.is(vut, vut.destroy())
})
