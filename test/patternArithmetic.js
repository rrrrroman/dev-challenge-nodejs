const assert = require("assert");
var response = "Arithmetic question\n" +
    "\n" +
    "What is 9 minus 4?\n" +
    "\n" +
    "POST to /question/1/Karim/129856c5\n" +
    "with the POST variable `answer` set to your answer.";

var pattern = /is ([0-9]+) ([a-z]+) ([0-9]+)/;
var match = pattern.exec(response);

describe('Arithmetic Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "is 9 minus 4"', function(){
            assert.equal(match[0], "is 9 minus 4");
        })
    });

    describe('#regex First Number', function(){
        it('Should return 9', function(){
            assert.equal(match[1], 9);
        })
    });

    describe('#regex Operator', function(){
        it('Should return minus', function(){
            assert.equal(match[2], "minus");
        })
    });

    describe('#regex Last Number', function(){
        it('Should return 4', function(){
            assert.equal(match[3], 4);
        })
    });
});

