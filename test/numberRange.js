const assert = require("assert");


/*
var a = [1,2,3]
var b = a              // As a and b both refer to the same object
a == b                 // this is true
a === b                // and this is also true

a = [1,2,3]            // here a and b have equivalent contents, but do not
b = [1,2,3]            // refer to the same Array object.
a == b                 // Thus this is false.

assert.deepEqual(a, b) // However this passes, as while a and b are not the
                       // same object, they are still arrays containing 1, 2, 3

assert.deepEqual(1, 1) // Also passes when given equal values

var X = function() {}
a = new X
b = new X
a == b                 // false, not the same object
assert.deepEqual(a, b) // pass, both are unadorned X objects
b.foo = 'bar'
assert.deepEqual(a, b) // fail!
 */
describe('Array number range', function(){
    describe('#arrayMap', function(){
        it('Should have a range from 0 to 9', function(){

            var start = 0;
            var count = 10;
            var expected = [0,1,2,3,4,5,6,7,8,9];
            var result = Array.apply(0, new Array(count)).map(function (element, index) {
                return index + start;
            });

            assert.deepEqual(result, expected);
        })
    });
});
