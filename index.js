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

function addRunpoint(container, name) {
  var registry = [];
  container[name] = function() {
    var args = slice(arguments);
    expectLength(args);
    args.forEach(expectFunction);
    args.forEach(function (arg) {
      registry.push(arg);
    });
  };
  return registry;
}

function generateRunpointName (runpoint, fnName) {
  return runpoint + fnName.charAt(0).toUpperCase() + fnName.slice(1);
}

function addAspectsToFunction (fn) {
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

  var beforeRegistry = addRunpoint(functionWithAspects, 'before');
  var afterRegistry = addRunpoint(functionWithAspects, 'after');

  return functionWithAspects;
}

//TODO the returned function have .before and .after properties. May be cleaned up a little
function addAspectsToObject (obj) {
  Object.keys(obj).forEach(function (k) {
    if (typeof obj[k] === 'function') {
      var fn = obj[k];
      var aspectedFn = addAspectsToFunction(fn);
      var propDesc = Object.getOwnPropertyDescriptor(obj, k);
      propDesc.value = aspectedFn;
      Object.defineProperty(obj, generateRunpointName('before', k), {enumerable: true, value: aspectedFn.before});
      Object.defineProperty(obj, generateRunpointName('after', k), {enumerable: true, value: aspectedFn.after});
      Object.defineProperty(obj, k, propDesc);
    }
  });
  return obj;
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
    case 'object':
      aspected = addAspectsToObject(arg);
      break;
    default:
      throw new TypeError('Unable to add aspects to the parameter');
  }
  return aspected;
};

