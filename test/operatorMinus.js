const assert = require("assert");

describe('Arithmetic Operators', function(){
    describe('#minus', function(){
        it('Should return 3', function(){

            var x = 10;
            var y = 7;
            var result = x - y;
            var expected = 3;

            assert.equal(result, expected);
        })
    });
});
