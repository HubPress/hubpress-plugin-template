"use strict";var handlebars=require("handlebars"),hbs={handlebars:handlebars},encode;encode=function(e,n){var r=e||n;return new hbs.handlebars.SafeString(encodeURIComponent(r))},module.exports=encode;