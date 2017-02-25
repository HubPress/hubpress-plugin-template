'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePost = generatePost;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _hubpressCoreSlugify = require('hubpress-core-slugify');

var _hubpressCoreSlugify2 = _interopRequireDefault(_hubpressCoreSlugify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

function generatePost(opts, post) {
  console.info('PostGenerator - generate');
  console.log('PostGenerator - generate', opts);
  var modifiedPost = post;

  var postData = Object.assign({}, modifiedPost.original);

  postData.tags = _lodash2.default.map(postData.tags, function (tag) {
    return {
      name: tag,
      slug: (0, _hubpressCoreSlugify2.default)(tag)
    };
  });

  var userInfos = postData.author;
  postData.author = {
    id: userInfos.id,
    name: userInfos.name || userInfos.login,
    location: userInfos.location,
    website: userInfos.blog,
    image: userInfos.avatar_url,
    bio: userInfos.bio,
    status: '',
    slug: userInfos.login
  };

  var config = opts.rootState.application.config;
  var urls = config.urls;
  var theme = {
    name: opts.nextState.theme.name,
    version: opts.nextState.theme.version,
    url: config.urls.theme
  };
  postData.urls = urls;
  postData.status = 'published';

  var htmlContent = _builder2.default.template('post', {
    context: 'post',
    // site: config.site,
    // theme: theme,
    // urls: urls,
    socialnetwork: config.socialnetwork,
    relativeUrl: modifiedPost.url,
    post: postData,
    author: postData.author
  }, {
    config: config,
    theme: opts.nextState.theme
  });

  var postsToPublish = [];
  postsToPublish.push({
    title: modifiedPost.title,
    image: modifiedPost.image,
    name: modifiedPost.name,
    path: config.urls.getPostGhPath(modifiedPost.name),
    url: config.urls.getPostGhPath(modifiedPost.name),
    content: htmlContent,
    message: 'Publish ' + modifiedPost.name,
    published_at: modifiedPost.published_at
  });

  opts.nextState.elementsToPublish = (opts.nextState.elementsToPublish || []).concat(postsToPublish);
  return opts;
}