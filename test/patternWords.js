const assert = require("assert");
var response = "Word question\n" +
    "\n" +
    "What are the first 2 letters of the word \"pleasant\"?\n" +
    "\n" +
    "POST to /question/3/Karim/1641ee90\n" +
    "with the POST variable `answer` set to your answer.";

var pattern = /(first|last) ([0-9]+).*?\"([a-z]+)/;
var match = pattern.exec(response);

describe('Word Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "first 2 letters of the word "pleasant"', function(){
            assert.equal(match[0], "first 2 letters of the word \"pleasant");
        })
    });

    describe('#regex First or Last', function(){
        it('Should return first', function(){
            assert.equal(match[1], 'first');
        })
    });

    describe('#regex Character count', function(){
        it('Should return 2', function(){
            assert.equal(match[2], 2);
        })
    });

    describe('#regex Selected word', function(){
        it('Should return pleasant', function(){
            assert.equal(match[3], 'pleasant');
        })
    });
});