'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateTags = generateTags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _paginationGenerator = require('./paginationGenerator');

var _paginationGenerator2 = _interopRequireDefault(_paginationGenerator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _hubpressCoreSlugify = require('hubpress-core-slugify');

var _hubpressCoreSlugify2 = _interopRequireDefault(_hubpressCoreSlugify);

;

function generateTags(opts) {
  console.info('TagsGenerator - generate');
  console.log('TagsGenerator - generate', opts);
  var posts = undefined;

  if (opts.data.post && !opts.data.post.tags && !opts.data.tags) {
    return opts;
  }

  // if (opts.data.post) {
  //   const originalTags = opts.data.post.original ? opts.data.post.original.tags : [];
  //   const postTags = _.union(opts.data.post.tags, originalTags);
  //
  //   posts = opts.data.publishedPosts.filter(post => {
  //     return _.intersection(postTags, post.tags).length;
  //   });
  // }
  if (opts.data.tags) {
    posts = opts.data.publishedPosts.filter(function (post) {
      return _lodash2['default'].intersection(opts.data.tags, post.tags).length;
    });
  } else {
    posts = opts.data.publishedPosts;
  }

  var tags = _lodash2['default'].reduce(posts, function (memo, post) {
    if (!post.tags) {
      return memo;
    }

    var postsTags = _lodash2['default'].reduce(post.tags, function (memo, postTag) {
      var slugTag = (0, _hubpressCoreSlugify2['default'])(postTag);
      if (!opts.data.post || !opts.data.post.tags || opts.data.post.tags.indexOf(postTag) !== -1) {
        memo.push(slugTag);
      }

      return memo;
    }, []);

    _lodash2['default'].uniq(postsTags).forEach(function (postTag) {
      memo[postTag] = memo[postTag] || [];
      memo[postTag].push(post);
    });

    return memo;
  }, {});

  console.log('TAAAG TAGS', tags);

  var returnedOpts = opts;
  _lodash2['default'].each(tags, function (tag, key) {

    var tagObject = {
      name: key,
      slug: (0, _hubpressCoreSlugify2['default'])(key)
    };
    console.log('TAGGGG', key, tag);
    returnedOpts = _paginationGenerator2['default'].generate({ opts: returnedOpts, posts: tag, tag: tagObject, template: 'tag', path: 'tag/' + key + '/' });
  });

  return returnedOpts;
}