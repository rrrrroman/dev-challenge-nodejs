const assert = require("assert");

describe('Text Normalise', function(){
    describe('#replace break lines', function(){
        it('Should return one long string', function(){

            var text = 'I was walking in Shoreditch' +
                '\nand suddenly' +
                '\r\nI saw this big cat' +
                '\nand i thought to my self' +
                '\r\n... should i keep walking' +
                '\nor just play dead';

            var result = text.replace(/(?:\r\n|\r|\n)/g, ' ');

            var expected = 'I was walking in Shoreditch and suddenly I saw this big cat and i thought to my self ... should i keep walking or just play dead';
            assert.equal(result, expected);
        })
    });
});
