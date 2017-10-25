(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vut = factory());
}(this, (function () { 'use strict';

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

var util = {
  isObject: function isObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
  },
  error: function error(msg) {
    console.error('[Vut] ' + msg);
  },
  has: function has(obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr);
  },
  callHook: function callHook(goods, name) {
    goods.$plugins.forEach(function (plugin) {
      if (!util.has(plugin, name)) return;
      plugin[name].call(goods);
    });
  }
};

var Vut = function () {
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
      var item = plugin(this, options);
      if (!util.isObject(item)) {
        util.error('\'' + name + '\' not is object type');
      }
      this.plugins.push(item);
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
      var self = Object.create(null);
      self.$options = options;
      var plugins = self.$options.plugins;

      if (Array.isArray(plugins)) {
        self.$plugins = self.$options.plugins.concat(this.plugins);
      } else {
        self.$plugins = [].concat(this.plugins);
      }
      util.callHook(self, 'beforeCreate');
      // Bind methods
      Object.keys(self.$options).forEach(function (fnName) {
        self[fnName] = function action() {
          var res = self.$options[fnName].apply(self, arguments);
          return res;
        };
      });
      // Compression path
      self.$state = self.data();
      if (!util.isObject(self.$state)) {
        util.error('\'' + name + '\' not is object type');
      }
      Object.keys(self.$state).forEach(function (attrName) {
        Object.defineProperty(self, attrName, {
          get: function get$$1() {
            return self.$state[attrName];
          },
          set: function set$$1(val) {
            self.$state[attrName] = val;
          }
        });
      });
      this.store[name] = self;
      util.callHook(self, 'created');
      return this;
    }
  }]);
  return Vut;
}();

return Vut;

})));
