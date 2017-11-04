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
    throw new Error('[vut] ' + msg);
  },
  has: function has(obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr);
  },
  pathCompression: function pathCompression(obj, options) {
    Object.keys(options).forEach(function (k) {
      Object.defineProperty(obj, k, {
        get: function get() {
          return options[k];
        },
        set: function set(val) {
          options[k] = val;
        }
      });
    });
  },
  getModule: function getModule(vut, paths, fn) {
    if (typeof paths === 'string') {
      if (!util.has(vut.modules, paths)) {
        util.error('Module \'' + paths + '\' does not exist');
      }
      return fn(vut.modules[paths]);
    } else if (util.isObject(paths)) {
      var data = {};
      Object.keys(paths).forEach(function (name) {
        if (!util.has(vut.modules, name)) {
          util.error('Module \'' + paths[name] + '\' does not exist');
        }
        data[name] = fn(vut.modules[paths[name]]);
      });
      return data;
    }
    util.error('The parameter is illegal. Please use \'vut.getModule(path: string)\' or \'vut.getModule({ [path: string]: string })\'');
  },
  callModuleHook: function callModuleHook(vut, goods, name) {
    var mixins = Vut$1.options.plugins.filter(function (plugin) {
      return util.isObject(plugin.module);
    }).map(function (plugin) {
      return plugin.module;
    });
    mixins.forEach(function (mixin) {
      if (!util.has(mixin, name)) return;
      mixin[name].call(goods);
    });
  },
  callInstanceHook: function callInstanceHook(vut, name) {
    var mixins = Vut$1.options.plugins.filter(function (plugin) {
      return util.isObject(plugin.instance);
    }).map(function (plugin) {
      return plugin.instance;
    });
    mixins.forEach(function (mixin) {
      if (!util.has(mixin, name)) return;
      mixin[name].call(vut);
    });
  }
};

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

var isUse = false;

var Vut$1 = function () {
  function Vut(options) {
    classCallCheck(this, Vut);

    this.modules = {};
    this.plugins = [];
    util.callInstanceHook(this, 'beforeCreate');
    util.callInstanceHook(this, 'created');
    isUse = true;
  }

  createClass(Vut, [{
    key: 'addModules',
    value: function addModules(path, moduleOptions) {
      var _this = this;

      if (typeof path !== 'string') {
        util.error('\'path=' + path + '\' not is string type');
      }
      if (!path) {
        util.error('\'path\' not is null string');
      }
      if (!util.isObject(moduleOptions)) {
        util.error(path + ' \'options\' not is object type');
      }
      if (util.isObject(moduleOptions.modules)) {
        Object.keys(moduleOptions.modules).forEach(function (k) {
          _this.addModules(path + '/' + k, moduleOptions.modules[k]);
        });
      }
      if (util.has(this.modules, path)) {
        util.error('\'' + path + '\' already is in module');
      }
      if (typeof moduleOptions.data !== 'function') {
        util.error('\'' + path + '\' not is function type');
      }
      var goods = Object.create(null);
      goods.$options = moduleOptions;
      goods.$context = this;
      util.callModuleHook(this, goods, 'beforeCreate');

      // Bind action
      goods.$actions = {};
      Object.keys(goods.$options).forEach(function (fnName) {
        if (typeof goods.$options[fnName] !== 'function') return;
        goods.$actions[fnName] = function action() {
          return goods.$options[fnName].apply(goods, arguments);
        };
      });

      // Bind state
      goods.$state = goods.$actions.data();
      if (!util.isObject(goods.$state)) {
        util.error('\'vut.getAction(' + path + ').data()\' return value not is object type');
      }

      // Path compression
      util.pathCompression(goods, goods.$actions);
      util.pathCompression(goods, goods.$state);

      this.modules[path] = goods;
      util.callModuleHook(this, goods, 'created');
      return this;
    }
  }, {
    key: 'getModule',
    value: function getModule(paths) {
      return util.getModule(this, paths, function (goods) {
        return goods;
      });
    }
  }, {
    key: 'getState',
    value: function getState(paths) {
      return util.getModule(this, paths, function (goods) {
        return goods.$state;
      });
    }
  }, {
    key: 'getActions',
    value: function getActions(paths) {
      return util.getModule(this, paths, function (goods) {
        return goods.$actions;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      util.callInstanceHook(this, 'beforeDestroy');
      Object.keys(this.modules).forEach(function (path) {
        var goods = _this2.modules[path];
        util.callModuleHook(_this2, goods, 'beforeDestroy');
        util.callModuleHook(_this2, goods, 'destroyed');
      });
      util.callInstanceHook(this, 'destroyed');
      return this;
    }
  }]);
  return Vut;
}();

Object.assign(Vut$1, {
  options: {
    plugins: []
  },
  use: function use(plugin) {
    if (!util.isObject(plugin)) {
      util.error('plugin not is object type');
    }
    if (isUse) {
      return util.error('\'Vut.use(plugin)\' must in \'new Vut()\' before');
    }
    this.options.plugins.push(plugin);
    return this;
  }
});

return Vut$1;

})));
//# sourceMappingURL=vut.js.map
