const assert = require("assert");
var response = "Correct! Well done! Please GET your animated prize from /success/Node/7de52b52";

var pattern = /(prize)/;
var match = pattern.exec(response);

describe('Winner Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "prize"', function(){
            assert.equal(match[0], "prize");
        })
    });
});