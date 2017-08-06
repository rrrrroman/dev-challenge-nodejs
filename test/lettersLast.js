const assert = require("assert");

describe('Last Letters of a word', function(){
    describe('#substr', function(){
        it('should return the last 3 letters', function(){

            var word = 'karim';
            var expected = 'rim';
            assert.equal(word.substr(word.length-3), expected);
        })
    });
});
