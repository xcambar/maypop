"use strict";

function addAspectsToFunction (fn) {
  fn.before = function() {};
  fn.after = function() {};
  return fn;
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
