"use strict";

var slice = (function () {
  var _s = [].slice;
  return function (o, b, e) {
    return _s.call(o, b, e);
  };
})();

function expectFunction (arg) {
  if (typeof arg !== 'function') {
    throw new TypeError('A function was expected');
  }
}

function expectLength (obj) {
  if (!obj.length) {
    throw new Error('Expected length');
  }
}

function addAspectsToFunction (fn) {
  var beforeRegistry = [];
  var afterRegistry = [];

  var functionWithAspects = function () {
    var args = arguments;
    beforeRegistry.forEach(function (fn) {
      fn.apply(undefined, args);
    });
    var ret = fn.apply(this, arguments);
    afterRegistry.forEach(function (fn) {
      fn.call(undefined, ret);
    });
    return ret;
  };
  functionWithAspects.before = function() {
    var args = slice(arguments);
    expectLength(args);
    args.forEach(expectFunction);
    args.forEach(function (arg) {
      beforeRegistry.push(arg);
    });
  };
  functionWithAspects.after = function() {
    var args = slice(arguments);
    expectLength(args);
    args.forEach(expectFunction);
    args.forEach(function (arg) {
      afterRegistry.push(arg);
    });
  };
  return functionWithAspects;
}

module.exports = function (arg) {
  var aspected;
  if (arguments.length === 0) {
    throw new Error('You must pass a parameter to maypop');
  }
  switch(typeof arg) {
    case 'function':
      aspected = addAspectsToFunction(arg);
      break;
    default:
      throw new TypeError('Unable to add aspects to the parameter');
  }
  return aspected;
};
