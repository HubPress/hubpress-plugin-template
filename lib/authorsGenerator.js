'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateAuthors = generateAuthors;

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _hubpressCoreSlugify = require('hubpress-core-slugify');

var _hubpressCoreSlugify2 = _interopRequireDefault(_hubpressCoreSlugify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

function generateAuthors(opts) {
  console.info('AuthorGenerator - generate');
  console.log('AuthorGenerator - generate', opts);
  var template = 'author';
  var posts = void 0;

  if (!_builder2.default.isTemplateAvailable(template)) {
    return opts;
  }

  if (opts.nextState.author) {
    posts = opts.nextState.publishedPosts.filter(function (post) {
      return post.author.login === opts.nextState.author.login;
    });
  } else {
    posts = opts.nextState.publishedPosts;
  }

  var authors = _lodash2.default.reduce(posts, function (memo, post) {
    memo[post.author.login] = memo[post.author.login] || [];
    memo[post.author.login].push(post);
    return memo;
  }, {});

  var returnedOpts = opts;
  _lodash2.default.each(authors, function (authorPosts, key) {

    var authorObject = authorPosts[0].author;
    authorObject.name = authorObject.name || authorObject.login;
    authorObject.slug = key;
    // --- Required for template
    authorObject.website = authorObject.blog;
    authorObject.status = '';
    // ---
    returnedOpts = _paginationGenerator2.default.generate({ opts: returnedOpts, posts: authorPosts, author: authorObject, template: template, path: 'author/' + key + '/' });
  });

  return returnedOpts;
}