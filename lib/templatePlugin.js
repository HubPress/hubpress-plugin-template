'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.templatePlugin = templatePlugin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _indexGenerator = require('./indexGenerator');

var _postGenerator = require('./postGenerator');

var _postsGenerator = require('./postsGenerator');

var _tagsGenerator = require('./tagsGenerator');

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

function load(name, config) {

  var deferred = _q2['default'].defer();
  var promises = [];
  var meta = config.meta;
  var hubpressUrl = config.urls.hubpress;
  _superagent2['default'].get(hubpressUrl + '/themes/' + name + '/theme.json?dt=' + Date.now()).end(function (err, response) {
    if (err) {
      deferred.reject(err);
      return;
    }
    var theme = response.body;
    var version = theme.version;
    var files = _.toPairs(theme.files);

    var paginationLoaded = false;
    var navigationLoaded = false;

    files.forEach(function (file) {
      var deferredFile = _q2['default'].defer();
      promises.push(deferredFile.promise);

      paginationLoaded = paginationLoaded || file[0] === 'pagination';
      navigationLoaded = navigationLoaded || file[0] === 'nav';

      _superagent2['default'].get(hubpressUrl + '/themes/' + name + '/' + file[1] + '?v=' + version).end(function (err, response) {
        if (err) {
          deferredFile.reject(err);
          return;
        }
        deferredFile.resolve({
          name: file[0],
          path: file[1],
          content: response.text
        });
      });
    });

    if (!paginationLoaded) {
      (function () {
        var deferredPagination = _q2['default'].defer();
        promises.push(deferredPagination.promise);
        _superagent2['default'].get(hubpressUrl + '/hubpress/scripts/helpers/tpl/pagination.hbs').end(function (err, response) {
          if (err) {
            deferredPagination.reject(err);
            return;
          }

          deferredPagination.resolve({
            name: 'pagination',
            path: 'partials/pagination',
            content: response.text
          });
        });
      })();
    }

    if (!navigationLoaded) {
      (function () {
        var deferredNav = _q2['default'].defer();
        promises.push(deferredNav.promise);
        _superagent2['default'].get(hubpressUrl + '/hubpress/scripts/helpers/tpl/nav.hbs').end(function (err, response) {
          if (err) {
            deferredNav.reject(err);
            return;
          }
          deferredNav.resolve({
            name: 'nav',
            path: 'partials/nav',
            content: response.text
          });
        });
      })();
    }

    _q2['default'].all(promises).then(function (values) {
      deferred.resolve({
        version: version,
        files: values
      });
    })['catch'](function (error) {
      console.log(error);
      deferred.reject(error);
    });
  });

  return deferred.promise;
}

function templatePlugin(hubpress) {

  hubpress.on('requestTheme', function (opts) {
    console.log('Theme plugin', opts);
    var themeName = opts.data.config.theme.name;

    return load(themeName, opts.data.config).then(function (themeInfos) {
      var theme = {
        name: themeName,
        files: themeInfos.files,
        version: themeInfos.version
      };

      _builder2['default'].registerTheme(opts.data.config, theme);
      _builder2['default'].registerFiles(theme.files);

      var mergeTheme = Object.assign({}, theme);
      var data = Object.assign({}, opts.data, { theme: mergeTheme });
      return Object.assign({}, opts, { data: data });
    });
  });

  hubpress.on('requestGenerateIndex', function (opts) {
    return (0, _indexGenerator.generateIndex)(opts);
  });

  hubpress.on('requestGeneratePost', function (opts) {
    return (0, _postGenerator.generatePost)(opts, opts.data.post);
  });

  hubpress.on('requestGeneratePosts', function (opts) {
    return (0, _postsGenerator.generatePosts)(opts, opts.data.post);
  });

  hubpress.on('requestGenerateTags', function (opts) {
    return (0, _tagsGenerator.generateTags)(opts, opts.data.post);
  });
}