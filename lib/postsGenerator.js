'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePosts = generatePosts;

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _postGenerator = require('./postGenerator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generatePosts(opts) {
  console.info('PostsGenerator - generate');
  console.log('PostsGenerator - generate', opts);
  var postsToPublish = [];

  var postPromises = [];
  var returnedOpts = opts;
  opts.nextState.publishedPosts.forEach(function (post) {
    returnedOpts = (0, _postGenerator.generatePost)(returnedOpts, post);
  });
  return returnedOpts;
}