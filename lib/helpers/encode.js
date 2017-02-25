'use strict';

// # Encode Helper
//
// Usage:  `{{encode uri}}`
//
// Returns URI encoded string

var handlebars = require('handlebars'),
    hbs = {
    handlebars: handlebars
},
    encode;

encode = function encode(context, str) {
    var uri = context || str;
    return new hbs.handlebars.SafeString(encodeURIComponent(uri));
};

module.exports = encode;