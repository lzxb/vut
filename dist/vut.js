(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vut = factory());
}(this, (function () { 'use strict';

var util = {
  isObject: function isObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
  },
  error: function error(msg) {
    throw new Error('[Vut] ' + msg);
  },
  has: function has(obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr);
  },
  callHook: function callHook(vut, goods, name) {
    vut.plugins.forEach(function (plugin) {
      if (!util.has(plugin, name)) return;
      plugin[name].call(goods);
    });
  }
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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

var Vut$1 = function () {
  function Vut() {
    classCallCheck(this, Vut);

    this.store = {};
    this.plugins = [];
  }

  createClass(Vut, [{
    key: 'use',
    value: function use(plugin, options) {
      if (Object.keys(this.store).length) {
        util.error('plugin must in create store before call');
      }
      if (typeof plugin !== 'function') {
        util.error('plugin not is function type');
      }
      var mixin = plugin(this, options);
      if (!util.isObject(mixin)) {
        util.error('plugin return value not is object type');
      }
      this.plugins.push(mixin);
      return this;
    }
  }, {
    key: 'create',
    value: function create(name, options) {
      if (typeof name !== 'string') {
        util.error('\'name\' not is string type');
      }
      if (!util.isObject(options)) {
        util.error('\'options\' not is object type');
      }
      if (util.has(this.store, name)) {
        util.error('\'' + name + '\' already is in store');
      }
      if (typeof options.data !== 'function') {
        util.error('\'' + name + '\' not is function type');
      }
      var goods = Object.create(null);
      goods.$options = options;
      util.callHook(this, goods, 'beforeCreate');
      // Bind methods
      Object.keys(goods.$options).forEach(function (fnName) {
        goods[fnName] = function action() {
          var res = goods.$options[fnName].apply(goods, arguments);
          return res;
        };
      });
      // Compression path
      goods.$state = goods.data();
      if (!util.isObject(goods.$state)) {
        util.error('\'' + name + '\' return value not is object type');
      }
      Object.keys(goods.$state).forEach(function (attrName) {
        Object.defineProperty(goods, attrName, {
          get: function get$$1() {
            return goods.$state[attrName];
          },
          set: function set$$1(val) {
            goods.$state[attrName] = val;
          }
        });
      });
      this.store[name] = goods;
      util.callHook(this, goods, 'created');
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      Object.keys(this.store).forEach(function (goods) {
        util.callHook(_this, _this.store[goods], 'beforeDestroy');
        util.callHook(_this, _this.store[goods], 'destroyed');
      });
      return this;
    }
  }]);
  return Vut;
}();

Object.assign(Vut$1, {
  util: util
});

return Vut$1;

})));
//# sourceMappingURL=vut.js.map
