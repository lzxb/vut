(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.vutReact = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

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







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _class2;
var _temp3;

var connect = function connect(Component, mapModules) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    inherits(Connect, _React$Component);

    function Connect() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, Connect);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Connect.__proto__ || Object.getPrototypeOf(Connect)).call.apply(_ref, [this].concat(args))), _this), _this.state = mapModules(_this.context.vut), _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(Connect, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        this.onChange = function () {
          _this2.setState(mapModules(_this2.context.vut));
        };
        this.context.vut.$dep.addSub(this.onChange);
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(Component, _extends({}, this.props, this.state));
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.vut.$dep.removeSub(this.onChange);
      }
    }]);
    return Connect;
  }(React.Component), _class.contextTypes = {
    vut: PropTypes.object.isRequired
  }, _temp2;
};

var Provider = (_temp3 = _class2 = function (_React$Component2) {
  inherits(Provider, _React$Component2);

  function Provider() {
    classCallCheck(this, Provider);
    return possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
  }

  createClass(Provider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        vut: this.props.vut
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.Children.only(this.props.children);
    }
  }]);
  return Provider;
}(React.Component), _class2.propTypes = {
  children: PropTypes.element.isRequired,
  vut: PropTypes.object.isRequired
}, _class2.childContextTypes = {
  vut: PropTypes.object.isRequired
}, _temp3);

exports.connect = connect;
exports.Provider = Provider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vut-react.js.map
