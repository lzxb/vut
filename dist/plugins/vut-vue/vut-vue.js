(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vutVue = factory());
}(this, (function () { 'use strict';

var _Vue = void 0;

var util = {
  error: function error(msg) {
    throw new Error('[vut-vue] ' + msg);
  }
};

var install = function install(Vue) {
  _Vue = Vue;
  Object.defineProperty(_Vue.prototype, '$vut', {
    get: function get() {
      return this.$root._vut;
    }
  });
  _Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.vut) return;
      this._vut = this.$options.vut;
    }
  });
};
var vutVue = {
  install: install,
  instance: {
    beforeCreate: function beforeCreate() {
      if (!_Vue) {
        util.error('Please install \'Vue.use(vutVue)\' in Vut.use(vutVue) before');
      }
      this.$vue = new _Vue({
        data: { $$state: [] }
      });
    },
    destroyed: function destroyed() {
      this.$vue.$data.$$state = [];
      this.$vue.$destroy();
      delete this.$vue;
    }
  },
  module: {
    created: function created() {
      var data = this.$context.$vue.$data;
      data.$$state.push(this.$state);
      var index = data.$$state.length - 1;
      Object.defineProperty(this, '$state', {
        get: function get() {
          return data.$$state[index];
        },
        set: function set(val) {
          data.$$state[index] = val;
        }
      });
    }
  }
};

return vutVue;

})));
//# sourceMappingURL=vut-vue.js.map
