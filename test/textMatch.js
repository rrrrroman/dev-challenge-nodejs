const assert = require("assert");

describe('Text Match', function(){
    describe('#indexOf', function(){
        it('Should return true', function(){

            var string = 'I was walking in Shoreditch';
            var substring = 'walking';
            var expected = true;
            var result = string.indexOf(substring) > -1;

            assert.equal(result, expected);
        })
    });
});
