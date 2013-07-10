# Maypop

> Work in Progress: Features are added on a daily basis.

__Maypop__ is a simple implementation of Apect Oriented Programming (AOP) for any ECMAScript5 engine.
Hence it works on Node.js and modern browsers.

# Status

[ ![Codeship Status for xcambar/maypop](https://www.codeship.io/projects/e9fb6f50-ca97-0130-5ff8-0ac4a233f6f3/status?branch=master) ](https://www.codeship.io/projects/4840)

# Aspect oriented programming

Aspect oriented programming allows developers to add behaviour (_aspects_) to functions and
objects by declaring functions that should be run _before_, _after_ and _around_ other methods.

# Example

    var maypop = require('maypop');

    var noAspects = function () {

    };
    var withAspects = maypop(noAspects);

    withAspects.before(function () {/*   */);
    withAspects.before(function () {/*   */);
    withAspects.before(function () {/*   */);

    withAspects.after(function () {/*   */);
    withAspects.after(function () {/*   */);

    //Execute
    withAspects();

    //Need to find better than "just an example"
    //meanwhile, you should read the tests to have a clear view of what's possible

# Features

## Add run points to

* functions

## Runpoints available

* __before__: `before` runpoints are executed on their own context, and take the same parameters as the initial function.
* __after__: `after` runpoints are executed on their own context, and take the return value of the initial function as unique parameter

# Licence

MIT


