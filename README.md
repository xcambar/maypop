# Maypop

__Maypop__ is a simple implementation of Apect Oriented Programming (AOP) for any ECMAScript5 engine.
Hence it works on Node.js and modern browsers.

# Aspect oriented programming

Aspect oriented programming allows developers to add behaviour (_aspects_) to functions and
objects by declaring functions that should be run _before_, _after_ and _around_ other methods.

# Example

var maypop = require('maypop');

var myFn = function (a, b) {
  return a/b;
};

# Licence

MIT


