# Only What Matters - Simple Level Logger

This module/script enables the user to set his own output level for the console.
It works for node and for browsers (>IE11) and it manages console.(debug|error|info|log|trace|warn) methods only.

## How to use
`npm install -save owm`
Or in browser
```html
<script src="path/of/owm/index.js"></script>
<script>
var logger = new OWM('l');
logger.log('It works!');
logger.info('This is hidden');
</script>
```

### The input parameter(s)

Each parameter could be provided in exclusion (or inclusion) mode by prepending (or not) a "-" dash before the letter corresponding the desired level.

#### Accepted values (as single concatenated string, as multiple strings or as array of strings)
* "d": enabled `debug` method
* "-d": disable `debug` method
* "e": enabled `error` method
* "-e": disable `error` method
* "i": enabled `info` method
* "-i": disable `info` method
* "l": enabled `log` method
* "-l": disable `log` method
* "t": enabled `trace` method
* "-t": disable `trace` method
* "w": enabled `warn` method
* "-w": disable `warn` method
* "a": shortcut for "deiltw". This enables all the methods above (d, e, i, l, t, w). IMPORTANT: This is the default value.
* "-a": shortcut for "-d-e-i-l-t-w". This disables all the methods above (d, e, i, l, t, w)

If "a" is present but not "-a", all methods are enabled.
If "-a" is present, all methods are disabeld.
In all the other cases, order matters: latest wins.

Extended "human readable" values are also accepted:
* (-)all
* (-)log / (-)logs
* (-)err / (-)error / (-)errors
* (-)warn / (-)warning / (-)warnings
They all will be converted in (-)(a|l|e|w).

#### Special methods: `options`, `reset`, `__noSuchMethod__`
```js
var logger = new OWM(); // enables all ('a' is the default value)
logger.options('l'); // enable log method only
logger.reset(); // shortcut for logger.options() with no parameters: re-enable all primitive methods
/* Customizable behavior for unexistent methods (as prototype or not) */
logger.options('le'); // enables log and error methods only;
OWM.prototype.__noSuchMethod__ = function(name, args){
    this.error(`This method doesn't exists: ${name}.`); 
};
logger.newMethod('Test me'); // output: "This method doesn't exists: newMethod."
logger.__noSuchMethod__ = function(name, args){
    this.log('Try another method, please.');
};
logger.newMethod('Test me again'); // output: "Try another method, please."
```

#### Special property: `once`
If needed, primitive console methods could be called using logger.once object. See below for the example:
```js
var logger = new OWM('l'); // Enabled log method only
logger.log(1); // output: 1
logger.warn(2); // no output
logger.once.warn(3); // output: 3
logger.warn(4); // no output
```

## Examples
```js
var levels = [ 'l', 'w', 'e', '-w', '-i-d-t' ];
var logger = new OWM(levels);
logger.log(1); // output: 1
logger.warn(2); // no output
logger.error(3); // output: 3
logger.info('No output'); // no output
logger.debug('No output'); // no output
logger.trace('No output'); // no output

levels = '-la'; // -l: disables log method, a: enables all (-l is ignored)
logger.options(levels);
logger.log(4); // output: 4
logger.warn(5); // output: 5
logger.error(6); // output: 6

logger.options('-a'); // disables all
logger.log(7); // no output
logger.warn(8); // no output
logger.error(9); // no output

logger.reset(); // alias for logger.option() with no parameter: all primitive console functionalities are recovered
logger.log(10); // output: 10
logger.warn(11); // output: 11
logger.error(12); // output: 12

var logger = new OWM('w,e'); // warn and error outputs only are enabled
logger.warn('This is a warning!');
logger.log('This log is ignored!'); // this outputs nothing
logger.error('This is an error!');

logger.reset(); // re-enable all the console functionalities
logger.options('a'); // alternative for logger.reset();
logger.options('l,e'); // enable output for console.log and console.error only

logger.warn('This warn is not shown.');
logger.options('w').warn('This new warn is shown');
logger.log('This log is not shown.');
logger.error('This error is not shown.');
logger.options('e').error('This error is visible.');
```
