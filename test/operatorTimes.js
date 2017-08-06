const assert = require("assert");

describe('Arithmetic Operators', function(){
    describe('#times', function(){
        it('Should return 20', function(){

            var x = 5;
            var y = 4;
            var result = x * y;
            var expected = 20;

            assert.equal(result, expected);
        })
    });
});
