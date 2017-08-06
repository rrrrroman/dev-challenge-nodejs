const assert = require("assert");
var response = "Welcome, this is the server for the This Place developer challenge.\n" +
    "Your task is to write a program that will correctly answer a series of questions without human assistance.\n" +
    "Each correct answer will reveal the location of the next question. There are 5 questions in total.\n" +
    "\n" +
    "To begin, make a POST request to /hello, use the field `name` to set your name.";

var pattern = /(GET|POST).*?(\/[^ ,]+)/;
var match = pattern.exec(response);

describe('Next step Pattern from text', function(){
    describe('#regex Full Match', function(){
        it('Should return "POST request to /hello"', function(){
            assert.equal(match[0], "POST request to /hello");
        })
    });

    describe('#regex Method', function(){
        it('Should return "POST', function(){
            assert.equal(match[1], "POST");
        })
    });

    describe('#regex Path', function(){
        it('Should return "/hello', function(){
            assert.equal(match[2], "/hello");
        })
    });
});





