'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generatePosts = generatePosts;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _postGenerator = require('./postGenerator');

function generatePosts(opts) {
  console.info('PostsGenerator - generate');
  console.log('PostsGenerator - generate', opts);
  var postsToPublish = [];

  var postPromises = [];
  var returnedOpts = opts;
  opts.data.publishedPosts.forEach(function (post) {
    returnedOpts = (0, _postGenerator.generatePost)(returnedOpts, post);
  });
  // TODO Test me i'm sure i'm famous
  return returnedOpts;
}