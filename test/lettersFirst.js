const assert = require("assert");

describe('First Letters of a word', function(){
    describe('#substr', function(){
        it('should return the first 3 letters', function(){

            var word = 'karim';
            var expected = 'kar';
            assert.equal(word.substr(0, 3), expected);
        })
    });
});
