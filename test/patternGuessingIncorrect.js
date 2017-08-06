const assert = require("assert");
var response = "That answer was incorrect.\n" +
    "My number is less than your guess.\n" +
    "You have 2 guess(es) remaining.";

var pattern = /(less|greater)/;
var match = pattern.exec(response);

describe('Guess the number is Incorrect Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "less"', function(){
            assert.equal(match[0], "less");
        })
    });
});