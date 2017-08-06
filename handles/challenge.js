const request = require('request');
const opn = require('opn');

module.exports = {


    /**
     * Initialise base variables
     *
     * @param base
     * @param path
     * @param method
     * @returns {exports}
     */
    init: function (base, path, method) {
        this.base = base;
        this.path = path;
        this.method = method;
        this.fullUrl = base + path;
        this.answer = 0;
        this.guess_number = 0;
        return this;
    },

    /**
     * Initial start function
     * Will retrieve data from init()
     */
    start: function () {
        // We need to init a local variable in order to pass it to the request.get method
        var full_url = this.fullUrl;

        request.get(
            full_url,
            function (error, response, body) {
                if (error && response.statusCode !== 200) {
                    console.warn('Nothing has been found on this response body: ' + body);
                    return false;
                }

                console.log('Start at: ', full_url);
                module.exports.nextStep(body, true);
            }
        );
    },

    /**
     * Start HTTP request based on GET|POST method
     * if HTTP code != 200, execution will halt
     * if other method than GET|POST then execution will halt
     * @param url
     * @param method
     * @param fields
     * @returns {boolean}
     */
    doRequest: function (url, method, fields) {
        console.log(method+' - Step: '+ url);
        if (method === 'GET') {

            request.get(
                {url: url}, function (error, response, body) {
                    if (error && response.statusCode !== 200) {
                        console.warn('Something went wrong: Method:' + method + ', Error:' + error);
                        return false;
                    }
                    console.log('Body: '+ body);
                    module.exports.nextStep(body, false);
                    console.log('=====================');
                }
            );
        } else if (method === 'POST') {

            request.post(
                {url: url, form: fields}, function (error, response, body) {
                    if (error && response.statusCode !== 200) {
                        console.warn('Something went wrong: Method:' + method + ', Error:' + error);
                        return false;
                    }
                    console.log('Body: '+ body);
                    module.exports.nextStep(body, false);
                    console.log('=====================');
                }
            );
        } else {
            console.warn(method + ' method is not allowed');

            return false;
        }

    },

    /**
     * Checks for patterns within the body and based on the index of the pattern
     * it will execute different sections and submit the answer to the given URL
     *
     * @param response
     * @param isStart
     */
    nextStep: function (response, isStart) {
        var fields = null , answer = null;
        // First we normalise the text, removing breaking lines in to spaces
        response = module.exports.NormaliseText(response);
        // We check against a pre-determined pattern list which action to execute
        var match = module.exports.checkPattern(response);
        // We retrieve the data which includes the GET|POST and URL to submit against on the next step
        var next = module.exports.patternNext(response);

        if (typeof match !== "undefined" && match !== null) {
            // We check first if the 'index' property exists
            if (match.hasOwnProperty('index')) {

                // First match
                if (match['index'] === 0) {
                    // Arithmetic
                    answer = module.exports.operator(match['pattern'][2] ,match['pattern'][1], match['pattern'][3]);
                }

                // Second Match
                if (match['index'] === 1) {
                    // First or Last x letters of a word
                    if (match['pattern'][1] === 'first') {
                        answer = module.exports.getFirstLetters(match['pattern'][3], match['pattern'][2]);
                    }else{
                        answer = module.exports.getLastLetters(match['pattern'][3], match['pattern'][2]);
                    }
                }
                // Third Match
                if (match['index'] === 2) {
                    // Guessing the number
                    // We retrieve the lowest and highest number
                    // This will generate [0,1,2,3,4,5,6,7,8,9]
                    module.exports.numberGuess(match['pattern'][1],match['pattern'][2]);

                    // Based on the lowest and highest number, we guess a number which is always divided by 2
                    // The starting number will be 5
                    answer = module.exports.numberGuessStart();

                    // We set this in a global variable for match index 3
                    this.guess_number = answer;
                    // We set the method in a global variable for match index 3
                    this.method = next[1];
                    // We set the url in a global variable for match index 3
                    this.fullUrl = this.base + next[2];
                }

                if (match['index'] === 3) {

                    // Based on the text match we retrieve and display a warning if the guess was incorrect
                    if (module.exports.isTextMatching(response,'That answer was incorrect.')) {
                        console.warn(response);
                    }

                    // We check again against the patterns, whether the guess was correct/incorrect
                    match = module.exports.checkPattern(response);

                    if (match.hasOwnProperty('pattern')) {

                        // if the pattern result is less|greater
                        if (match['pattern'][0] === 'greater') {
                            // There are 2 arrays
                            // Left Array : [0,1,2,3,4]
                            // Right Array: [5,6,7,8,9]
                            // if the number is higher, we add an additional index value to the right array
                            // because the starting number is 5
                            // e.g. [5,6,7,8,9] becomes [6,7,8,9]
                            this.guess_number = module.exports.numberGuessHigher();
                        }  else {
                            // if the number is lower, the starting element is 0 and divided by 2
                            // Now we have 2 arrays consisting of [6,7] and [8,9]
                            // After x tries the array will consist of each 1 digit:
                            // Either 6 or 9
                            // Based on what is given e.g. (less than 7), the answer will be 6
                            this.guess_number = module.exports.numberGuessLower();
                        }
                        // We pass on the answer to the field
                        fields = {'answer': this.guess_number};
                        console.log('Value Submitted:', fields);
                        // We execute the request against the last known URL in match index 2
                        module.exports.doRequest(this.fullUrl, this.method, fields);
                    }

                }

                if (match['index'] === 4) {
                    // We have actually won.
                    // Let's retrieve the URL and show our prize
                    match = module.exports.patternNext(response);

                    // Using OPN to open a browser tab
                    opn('https://www.youtube.com/watch?v=fXW02XmBGQw', {app :'chrome'});
                    // global context of this.base does not work in a timeout
                    // We set it to a local variable and pass it on to the timeout
                    var base_url = this.base;
                    // After 3000 ms we open the actual result page
                    setTimeout(function(){
                        opn(base_url + match[2], {app :'chrome'});
                    },3000, base_url);
                }

            }

            if(answer !== null) {
                fields = {'answer': answer};
            }
        }

        // If it's the starting section, we specify the key and value
        if(isStart) {
            fields = {'name': 'Node'};
        }
        // Only if there is a pattern available in 'next' we will execute the next step
        if (next !== null) {
            if(fields !== null) {
                console.log('Value Submitted:', fields);
            }
            module.exports.doRequest(this.base + next[2], next[1], fields);
        }

    },
    /**
     * Arithmetic operators based on type will return the result
     * For consistency, x and y are casted to integers to avoid float results
     *
     * @param type
     * @param x
     * @param y
     * @returns {number}
     */
    operator: function (type,x, y) {
        var result = 0;
        x = parseInt(x);
        y = parseInt(y);

        if (type === 'plus') {
            result = x + y;
        } else if (type === 'minus') {
            result = x - y;
        } else if (type === 'times') {
            result = x * y;
        }
       return result;
    },

    /**
     * Retrieving the first letters
     * substr: start,length
     * @param word
     * @param characters
     * @returns {string}
     */
    getFirstLetters: function (word, characters) {
        return word.substr(0, characters)
    },

    /**
     * Retrieving the last letters
     * Total length - amount of characters
     * E.g. popular, 3
     * Results in: lar
     * @param word
     * @param characters
     * @returns {string}
     */
    getLastLetters: function (word, characters) {
        return word.substr(word.length - characters);
    },

    /**
     * Check if string is matching against substring
     *
     * @param string
     * @param substring
     * @returns {boolean}
     */
    isTextMatching: function (string, substring) {
        return string.indexOf(substring) > -1;
    },

    /**
     * Normalise the text by removing breaking lines in to a long string
     *
     * @param response
     * @returns {string}
     * @constructor
     */
    NormaliseText: function (response) {
        return response.replace(/(?:\r\n|\r|\n)/g, ' ');
    },



    /**
     * Load in all the patterns in an array
     * Iterate through the array and check which patterns contain a result
     * Each pattern is unique based on Regex
     * @param response
     * @returns {{index: number, pattern: *}}
     */
    checkPattern: function (response) {

        var patterns = [
            module.exports.patternArithmetic(response),
            module.exports.patternWords(response),
            module.exports.patternGuessing(response),
            module.exports.patternIncorrectGuessing(response),
            module.exports.patternPrize(response)
        ];

        for (var i = 0; i < patterns.length; i++) {
            if (patterns[i] !== null) {
                return {'index': i, 'pattern': patterns[i]};
            }

        }

    },

    /**
     * Pattern to recognise if there is a next step available
     * On the last step (question 5, guessing numbers) there is no
     * step to continue and thus result will be null
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternNext: function (response) {


        /*
        Welcome, this is the server for the This Place developer challenge.
        Your task is to write a program that will correctly answer a series of questions without human assistance.
        Each correct answer will reveal the location of the next question. There are 5 questions in total.

        To begin, make a POST request to /hello, use the field `name` to set your name.
         */
        /*
       /(GET|POST).*?(\/[^ ,]+) /
        1st Capturing Group (GET|POST)
            1st Alternative GET
                GET matches the characters GET literally (case sensitive)
        2nd Alternative POST
            POST matches the characters POST literally (case sensitive)

        .*? matches any character (except for line terminators)
        *? Quantifier — Matches between zero and unlimited times, as few times as possible, expanding as needed (lazy)

        2nd Capturing Group (\/[^ ,]+)
            \/ matches the character / literally (case sensitive)
                Match a single character not present in the list below [^ ,]+
                    + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
                    , matches a single character in the list  , (case sensitive)
        Result:
        Full match      `POST request to /hello`
        Group`method`   `POST`
        Group`url`	    `/hello`
         */
        var pattern = /(GET|POST).*?(\/[^ ,]+)/;
        return pattern.exec(response);
    },

    /**
     * Regex pattern against a integer + operator + integer
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternArithmetic: function (response) {

        /*
        Arithmetic question

        What is 9 minus 4?

        POST to /question/1/Karim/129856c5
        with the POST variable `answer` set to your answer.
         */
        /*
       /is ([0-9]+) ([a-z]+) ([0-9]+)/
        is  matches the characters is  literally (case sensitive)
        1st Capturing Group ([0-9]+)
            Match a single character present in the list below [0-9]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            0-9 a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)
          matches the character   literally (case sensitive)
        2nd Capturing Group ([a-z]+)
        Match a single character present in the list below [a-z]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            a-z a single character in the range between a (index 97) and z (index 122) (case sensitive)
              matches the character   literally (case sensitive)
        3rd Capturing Group ([0-9]+)
            Match a single character present in the list below [0-9]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            0-9 a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)

        Result:
        Full match	`9 minus 4`
        Group 1.    `9`
        Group 2.	`minus`
        Group 3. 	`4`
         */
        var pattern = /is ([0-9]+) ([a-z]+) ([0-9]+)/;
        return pattern.exec(response);
    },

    /**
     * Regex pattern looking for first|last integer ... "word" (between double quotes)
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternWords: function (response) {

        /*
        Word question

        What are the first 2 letters of the word "pleasant"?

        POST to /question/3/Karim/1641ee90
        with the POST variable `answer` set to your answer.
         */
        /*
       /(first|last) ([0-9]+).*?\"([a-z]+)/
        1st Capturing Group (first|last)
            1st Alternative first
            first matches the characters first literally (case sensitive)

            2nd Alternative last
            last matches the characters last literally (case sensitive)
            matches the character   literally (case sensitive)

        2nd Capturing Group ([0-9]+)
            Match a single character present in the list below [0-9]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            0-9 a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)

        .*? matches any character (except for line terminators)
        *? Quantifier — Matches between zero and unlimited times, as few times as possible, expanding as needed (lazy)

        \" matches the character " literally (case sensitive)
            3rd Capturing Group ([a-z]+)
            Match a single character present in the list below [a-z]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            a-z a single character in the range between a (index 97) and z (index 122) (case sensitive)

        Result:
        Full match      `first 2 letters of the word "pleasant`
        Group 1.        `first`
        Group 2.        `2`
        Group 3.        `pleasant`
         */
        var pattern = /(first|last) ([0-9]+).*?\"([a-z]+)/;
        return pattern.exec(response);
    },

    /**
     * Regex pattern to check for:
     * from integer to integer
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternGuessing: function (response) {
        /*
        Guess a number question

        I have thought of a number from 0 to 9 (including 0 and 9).
        You win this dev challenge if you can guess my number correctly within 4 tries.
        What is my number?

        POST to /question/5/Karim/a7641ff2
        with the POST variable `answer` set to your answer.
         */
        /*
       /from ([0-9]+) to ([0-9]+)/
        from  matches the characters from  literally (case sensitive)

        1st Capturing Group ([0-9]+)
            Match a single character present in the list below [0-9]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            0-9 a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)

        to  matches the characters  to  literally (case sensitive)

        2nd Capturing Group ([0-9]+)
            Match a single character present in the list below [0-9]+
            + Quantifier — Matches between one and unlimited times, as many times as possible, giving back as needed (greedy)
            0-9 a single character in the range between 0 (index 48) and 9 (index 57) (case sensitive)


        Result:
        Full match      `from 0 to 9`
        Group 1.        `0`
        Group 2.        `9`
         */
        var pattern = /from ([0-9]+) to ([0-9]+)/;
        return pattern.exec(response);
    },


    /**
     * Regex pattern to check whether the answer is less or greater than given previously
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternIncorrectGuessing: function (response) {
        /*
        That answer was incorrect.
        My number is less|greater than your guess.
        You have 2 guess(es) remaining.
         */
        /*
       /(less|greater)/ g
        1st Capturing Group (less|greater)
            1st Alternative less
            less matches the characters less literally (case sensitive)

            2nd Alternative greater
            greater matches the characters greater literally (case sensitive)

        Global pattern flags
        g modifier: global. All matches (don't return after first match)

        Result:
        Full match      less
         */
        var pattern = /(less|greater)/;
        return pattern.exec(response);
    },


    /**
     * Regex pattern to locate the word 'prize'
     *
     * @param response
     * @returns {Array|{index: number, input: string}}
     */
    patternPrize: function (response) {
        /*
          Correct! Well done! Please GET your animated prize from /success/Node/7de52b52
         */
        /*
       /(prize)/ g
        1st Capturing Group (prize)
        prize matches the characters prize literally (case sensitive)

        Global pattern flags
        g modifier: global. All matches (don't return after first match)

        Result:
        Full match      prize
         */
        var pattern = /(prize)/;
        return pattern.exec(response);
    },


    /**
     * Initialise the number guessing with the low and high numbers
     * And create a range from low to high
     * e.g. low: 0, high: 9
     * Result of range: [0,1,2,3,4,5,6,7,8,9]
     * @param low
     * @param high
     * @returns {exports}
     */
    numberGuess: function (low, high) {

        this.low = parseInt(low);
        this.high = parseInt(high);
        this.maxRange = module.exports.range(this.low, this.high + 1);
        return this;
    },

    /**
     * Starting number would be length divided by 2
     * e.g. [0,1,2,3,4,5,6,7,8,9]
     * length = 10 = (10 / 2)
     * result = 5
     * @returns {*}
     */
    numberGuessStart: function(){
        return this.maxRange[Math.floor(this.maxRange.length / 2)];
    },

    /**
     * if the number is lower, the starting element is 0 and divided by 2
     * Now we have 2 arrays consisting of [6,7] and [8,9]
     * We initialise the number guessing again to get 1 result
     * @returns {*}
     */
    numberGuessLower: function(){
        this.maxRange = this.maxRange.splice(0, Math.floor(this.maxRange.length / 2));
        return module.exports.numberGuessStart();
    },

    /**
     * if the number is higher, we add an additional index value to the right array
     * because the starting number is 5
     * e.g. [5,6,7,8,9] becomes [6,7,8,9]
     * We initialise the number guessing again to get 1 result
     * @returns {*}
     */
    numberGuessHigher: function(){
        this.maxRange = this.maxRange.splice( 1 + Math.floor(this.maxRange.length / 2));
        return module.exports.numberGuessStart();
    },

    /**
     * Create a new array from starting point and count
     * e.g. 0,9
     * result: [0,1,2,3,4,5,6,7,8,9]
     * @param start
     * @param count
     */
    range: function (start, count) {
        return Array.apply(0, new Array(count)).map(function (element, index) {
           return index + start;
        });
    }

};