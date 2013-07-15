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

//Object.getProotypeOf throws a TypeError if the param is not an object
//We want to be more flexible
function getPrototypeOf (obj) {
  try {
    return Object.getPrototypeOf(obj);
  } catch (e) {
    return undefined;
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
    var scope = this;
    var args = slice(arguments);
    beforeRegistry.forEach(function (fn) {
      fn.apply(undefined, args);
    });
    var boundAroundFns = [];
    [fn].concat(aroundRegistry).forEach(function (aroundFn, i) {
      var fnScope = boundAroundFns.length ? undefined : scope;
      if (aroundFn !== fn) {
        var next = boundAroundFns[i - 1];
        args = [next].concat(args);
      }
      args.forEach(function (arg) {
        aroundFn = aroundFn.bind(fnScope, arg);
      });
      boundAroundFns.push(aroundFn);
    });
    var ret = boundAroundFns[boundAroundFns.length - 1]();
    afterRegistry.forEach(function (fn) {
      fn.call(undefined, ret);
    });
    return ret;
  };

  var beforeRegistry = addRunpoint(functionWithAspects, 'before');
  var aroundRegistry = addRunpoint(functionWithAspects, 'around');
  var afterRegistry = addRunpoint(functionWithAspects, 'after');

  return functionWithAspects;
}

//TODO the returned function have .before and .after properties. May be cleaned up a little
function addAspectsToObject (obj) {
  Object.keys(obj).forEach(function (k) {
    if (getPrototypeOf(obj[k]) === Function.prototype) {
      var aspectedFn = addAspectsToFunction(obj[k]);
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
  switch(getPrototypeOf(arg)) {
    case Function.prototype:
      aspected = addAspectsToFunction(arg);
      break;
    case Object.prototype:
      aspected = addAspectsToObject(arg);
      break;
    default:
      throw new TypeError('Unable to add aspects to the parameter');
  }
  return aspected;
};

