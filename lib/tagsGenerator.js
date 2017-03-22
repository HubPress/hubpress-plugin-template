'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTags = generateTags;

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

function generateTags(opts) {
  console.info('TagsGenerator - generate');
  console.log('TagsGenerator - generate', opts);
  var template = 'tag';
  var posts = void 0;

  // If template Tag is not available, do not process
  if (!_builder2.default.isTemplateAvailable(template)) {
    return opts;
  }

  if (opts.nextState.post && !opts.nextState.post.tags && !opts.nextState.tags) {
    return opts;
  }

  // if (opts.nextState.post) {
  //   const originalTags = opts.nextState.post.original ? opts.nextState.post.original.tags : [];
  //   const postTags = _.union(opts.nextState.post.tags, originalTags);
  //
  //   posts = opts.nextState.publishedPosts.filter(post => {
  //     return _.intersection(postTags, post.tags).length;
  //   });
  // }
  if (opts.nextState.tags) {
    posts = opts.nextState.publishedPosts.filter(function (post) {
      var trimmedStateTags = opts.nextState.tags.map(function (v) {
        return v.trim();
      });
      var trimmedPostTags = (post.tags || []).map(function (v) {
        return v.trim();
      });
      return _lodash2.default.intersection(trimmedStateTags, trimmedPostTags).length;
    });
  } else {
    posts = opts.nextState.publishedPosts;
  }

  var tags = _lodash2.default.reduce(posts, function (memo, post) {
    if (!post.tags) {
      return memo;
    }

    var postsTags = _lodash2.default.reduce(post.tags, function (memo, postTag) {
      var slugTag = (0, _hubpressCoreSlugify2.default)(postTag);
      if (!opts.nextState.post || !opts.nextState.post.tags || opts.nextState.post.tags.indexOf(postTag) !== -1) {
        memo.push(slugTag);
      }

      return memo;
    }, []);

    _lodash2.default.uniq(postsTags).forEach(function (postTag) {
      memo[postTag] = memo[postTag] || [];
      memo[postTag].push(post);
    });

    return memo;
  }, {});

  var returnedOpts = opts;
  _lodash2.default.each(tags, function (tag, key) {

    var tagObject = {
      name: key,
      slug: (0, _hubpressCoreSlugify2.default)(key),
      description: null
    };
    returnedOpts = _paginationGenerator2.default.generate({ opts: returnedOpts, posts: tag, tag: tagObject, template: template, path: 'tag/' + key + '/' });
  });

  return returnedOpts;
}