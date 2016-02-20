'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateIndex = generateIndex;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

function generateIndex(opts) {

  return _paginationGenerator2['default'].generate({ opts: opts, posts: opts.data.publishedPosts, template: 'index', path: '' });
}