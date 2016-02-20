'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

var _hubpressCoreSlugify = require('hubpress-core-slugify');

var _hubpressCoreSlugify2 = _interopRequireDefault(_hubpressCoreSlugify);

var PaginationGenerator = (function () {
  function PaginationGenerator() {
    _classCallCheck(this, PaginationGenerator);
  }

  _createClass(PaginationGenerator, [{
    key: 'generate',
    value: function generate(params) {
      console.info('PaginationGenerator - generate');
      console.log('PaginationGenerator - generate', params);
      var posts = params.posts;
      var config = params.opts.data.config;
      var siteConfig = config.site;
      siteConfig.url = config.urls.site;
      var pageCount = 1;
      var pagePath = (params.path || '') + 'index.html';
      var postsPageToGenerate = [];
      var postsPageToPublish = [];
      var nbPostPerPage = parseInt(siteConfig.postsPerPage || 10, 10);
      var theme = {
        name: params.opts.data.theme.name,
        version: params.opts.data.theme.version,
        url: config.urls.theme
      };
      var urls = config.urls;
      var socialnetwork = config.socialnetwork;

      var userInfos = params.opts.state.authentication.credentials.userInformations;
      var author = {
        id: userInfos.id,
        name: userInfos.name,
        location: userInfos.location,
        website: userInfos.blog,
        image: userInfos.avatar_url
      };

      if (!posts || !posts.length) {
        var htmlContent = _builder2['default'].template(params.template, {
          pagination: {
            prev: 0,
            next: 0,
            page: 0,
            pages: 0,
            total: 0,
            limit: nbPostPerPage
          },
          posts: [],
          tag: params.tag,
          site: siteConfig,
          theme: theme,
          urls: urls,
          socialnetwork: socialnetwork,
          title: siteConfig.title
        });

        postsPageToPublish.push({
          name: 'page-' + pageCount,
          path: pagePath,
          content: htmlContent,
          message: 'Publish page-' + pageCount + ' ' + params.template,
          author: author
        });

        var _elementsToPublish = (params.opts.data.elementsToPublish || []).concat(postsPageToPublish);
        var _data = Object.assign({}, params.opts.data, { elementsToPublish: _elementsToPublish });
        return Object.assign({}, params.opts, { data: _data });
      }

      var totalPage = Math.ceil(posts.length / nbPostPerPage);

      _lodash2['default'].each(posts, function (post, index) {
        var next = 0;
        var previous = 0;

        if (pageCount > 1) {
          pagePath = (params.path || '') + ('page/' + pageCount + '/index.html');
        }

        if (pageCount > 1) {
          previous = pageCount - 1;
        }
        if (pageCount < totalPage) {
          next = pageCount + 1;
        }

        var postTags = undefined;
        console.error('TESTME : Check if tag are here');
        if (post.tags) {
          //(post.attributes.map['hp-tags']) {
          postTags = _lodash2['default'].map(post.tags, function (tag) {
            return {
              name: tag,
              slug: (0, _hubpressCoreSlugify2['default'])(tag)
            };
          });
        }

        postsPageToGenerate.push({
          image: post.image,
          title: post.title,
          url: siteConfig.url + post.url,
          excerpt: post.excerpt,
          html: post.excerpt,
          tags: postTags,
          published_at: post.published_at,
          theme: theme,
          urls: urls,
          relativeUrl: ''
        });

        if (Math.floor((index + 1) / nbPostPerPage) > pageCount - 1 || index + 1 === posts.length) {
          //Generate
          //
          //
          var htmlContent = _builder2['default'].template(params.template, {
            pagination: {
              prev: previous,
              next: next,
              page: pageCount,
              pages: totalPage,
              total: posts.length,
              limit: nbPostPerPage
            },
            context: params.template,
            posts: postsPageToGenerate,
            tag: params.tag,
            title: siteConfig.title,
            description: siteConfig.description,
            site: siteConfig,
            theme: theme,
            urls: urls,
            socialnetwork: socialnetwork,
            relativeUrl: ''
          });

          postsPageToPublish.push({
            name: 'page-' + pageCount,
            path: pagePath,
            content: htmlContent,
            message: 'Publish page-' + pageCount + ' ' + params.template,
            author: author
          });

          postsPageToGenerate = [];
          pageCount++;
        }
      });

      var elementsToPublish = (params.opts.data.elementsToPublish || []).concat(postsPageToPublish);
      var data = Object.assign({}, params.opts.data, { elementsToPublish: elementsToPublish });
      return Object.assign({}, params.opts, { data: data });
    }
  }]);

  return PaginationGenerator;
})();

exports['default'] = new PaginationGenerator();
module.exports = exports['default'];