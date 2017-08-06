const assert = require("assert");

describe('Arithmetic Operators', function(){
    describe('#plus', function(){
        it('Should return 4', function(){

            var x = 1;
            var y = 3;
            var result = x + y;
            var expected = 4;

            assert.equal(result, expected);
        })
    });
});
