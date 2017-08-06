const assert = require("assert");
var response = "Guess a number question\n" +
    "\n" +
    "I have thought of a number from 0 to 9 (including 0 and 9).\n" +
    "You win this dev challenge if you can guess my number correctly within 4 tries.\n" +
    "What is my number?\n" +
    "\n" +
    "POST to /question/5/Karim/a7641ff2\n" +
    "with the POST variable `answer` set to your answer.";

var pattern = /from ([0-9]+) to ([0-9]+)/;
var match = pattern.exec(response);

describe('Guess the number Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "from 0 to 9"', function(){
            assert.equal(match[0], "from 0 to 9");
        })
    });

    describe('#regex First Number', function(){
        it('Should return 0', function(){
            assert.equal(match[1], 0);
        })
    });

    describe('#regex Last Number', function(){
        it('Should return 9', function(){
            assert.equal(match[2], 9);
        })
    })
});

