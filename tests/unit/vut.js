import ava from 'ava'
import Vut from '../../src/index'

ava('new a instance', t => {
  Vut.use({
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
  })
  const store = new Vut()
  store.addModules('user', {
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
  })

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
