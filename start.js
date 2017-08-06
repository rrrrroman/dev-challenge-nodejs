var challenge = require('./handles/challenge');

var base = 'http://dev-challenge.thisplace.com';
var path = '/';

challenge.init(base,path,'GET');

challenge.start();
