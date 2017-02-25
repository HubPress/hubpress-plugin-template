'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateIndex = generateIndex;

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateIndex(opts) {
  return _paginationGenerator2.default.generate({ opts: opts, posts: opts.nextState.publishedPosts, template: 'index', path: '' });
}