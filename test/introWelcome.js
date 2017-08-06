var expect  = require('chai');
var request = require('request');

describe('Status and content', function() {

    describe ('Main page', function() {

        it('HTTP status', function(){
            request('http://dev-challenge.thisplace.com', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });

        it('content', function() {
            request('http://dev-challenge.thisplace.com' , function(error, response, body) {
                expect(body).to.equal('\n' +
                    'Welcome, this is the server for the This Place developer challenge.\n' +
                    'Your task is to write a program that will correctly answer a series of questions without human assistance.\n' +
                    'Each correct answer will reveal the location of the next question. There are 5 questions in total.\n' +
                    '\n' +
                    'To begin, make a POST request to /hello, use the field `name` to set your name.');
                done();
            });
        });
    });
});