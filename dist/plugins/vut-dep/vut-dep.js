(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vutDep = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Dep = function () {
  function Dep() {
    classCallCheck(this, Dep);

    this.subs = [];
  }

  createClass(Dep, [{
    key: 'addSub',
    value: function addSub(fn) {
      if (typeof fn !== 'function') {
        throw new Error('[vut-dep] addSub(fn: Function) not is function type');
      }
      this.subs.push(fn);
    }
  }, {
    key: 'removeSub',
    value: function removeSub(fn) {
      this.subs = this.subs.filter(function (item) {
        return item !== fn;
      });
    }
  }, {
    key: 'notify',
    value: function notify() {
      this.subs.forEach(function (fn) {
        return fn();
      });
    }
  }]);
  return Dep;
}();

var vutDep = {
  instance: {
    beforeCreate: function beforeCreate() {
      this.$dep = new Dep();
    }
  },
  module: {
    beforeCreate: function beforeCreate() {
      this.$dep = this.$context.$dep;
    }
  }
};

return vutDep;

})));
//# sourceMappingURL=vut-dep.js.map
