'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generatePost = generatePost;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _hubpressCoreSlugify = require('hubpress-core-slugify');

var _hubpressCoreSlugify2 = _interopRequireDefault(_hubpressCoreSlugify);

;

function generatePost(opts, post) {
  console.info('PostGenerator - generate');
  console.log('PostGenerator - generate', opts);
  var modifiedPost = post;

  var postData = Object.assign({}, modifiedPost.original);

  postData.tags = _lodash2['default'].map(postData.tags, function (tag) {
    return {
      name: tag,
      slug: (0, _hubpressCoreSlugify2['default'])(tag)
    };
  });

  var userInfos = opts.state.authentication.credentials.userInformations;
  postData.author = {
    id: userInfos.id,
    name: userInfos.name,
    location: userInfos.location,
    website: userInfos.blog,
    image: userInfos.avatar_url
  };

  var config = opts.data.config;
  var urls = config.urls;
  var theme = {
    name: opts.data.theme.name,
    version: opts.data.theme.version,
    url: config.urls.theme
  };
  postData.urls = urls;

  var htmlContent = _builder2['default'].template('post', {
    context: 'post',
    site: config.site,
    theme: theme,
    urls: urls,
    socialnetwork: config.socialnetwork,
    relativeUrl: modifiedPost.url,
    post: postData
  });

  var postsToPublish = [];
  postsToPublish.push({
    title: modifiedPost.title,
    image: modifiedPost.image,
    name: modifiedPost.name,
    path: config.urls.getPostGhPath(modifiedPost.name),
    content: htmlContent,
    message: 'Publish ' + modifiedPost.name,
    published_at: modifiedPost.published_at
  });

  var elementsToPublish = (opts.data.elementsToPublish || []).concat(postsToPublish);
  var data = Object.assign({}, opts.data, { elementsToPublish: elementsToPublish });
  return Object.assign({}, opts, { data: data });
}