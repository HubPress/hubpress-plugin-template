'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templatePlugin = templatePlugin;

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _indexGenerator = require('./indexGenerator');

var _postGenerator = require('./postGenerator');

var _postsGenerator = require('./postsGenerator');

var _tagsGenerator = require('./tagsGenerator');

var _authorsGenerator = require('./authorsGenerator');

var _builder = require('./builder');

var _builder2 = _interopRequireDefault(_builder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(name, config) {

  var deferred = _q2.default.defer();
  var promises = [];
  var hubpressUrl = config.urls.hubpress;
  _superagent2.default.get(hubpressUrl + '/themes/' + name + '/theme.json?dt=' + Date.now()).end(function (err, response) {
    if (err) {
      deferred.reject(err);
      return;
    }
    var theme = response.body;
    var version = theme.version;
    var files = _lodash2.default.toPairs(theme.files);

    var paginationLoaded = false;
    var navLoaded = false;
    var navigationLoaded = false;

    files.forEach(function (file) {
      var deferredFile = _q2.default.defer();
      promises.push(deferredFile.promise);

      paginationLoaded = paginationLoaded || file[0] === 'pagination';
      navLoaded = navLoaded || file[0] === 'nav';
      navigationLoaded = navigationLoaded || file[0] === 'navigation';

      _superagent2.default.get(hubpressUrl + '/themes/' + name + '/' + file[1] + '?v=' + version).end(function (err, response) {
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
      var deferredPagination = _q2.default.defer();
      promises.push(deferredPagination.promise);
      _superagent2.default.get(hubpressUrl + '/hubpress/scripts/helpers/tpl/pagination.hbs').end(function (err, response) {
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
    }

    if (!navLoaded) {
      var deferredNav = _q2.default.defer();
      promises.push(deferredNav.promise);
      _superagent2.default.get(hubpressUrl + '/hubpress/scripts/helpers/tpl/nav.hbs').end(function (err, response) {
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
    }

    if (!navigationLoaded) {
      var _deferredNav = _q2.default.defer();
      promises.push(_deferredNav.promise);
      _superagent2.default.get(hubpressUrl + '/hubpress/scripts/helpers/tpl/navigation.hbs').end(function (err, response) {
        if (err) {
          _deferredNav.reject(err);
          return;
        }
        _deferredNav.resolve({
          name: 'navigation',
          path: 'partials/navigation',
          content: response.text
        });
      });
    }

    _q2.default.all(promises).then(function (values) {
      deferred.resolve({
        version: version,
        files: values
      });
    }).catch(function (error) {
      console.log(error);
      deferred.reject(error);
    });
  });

  return deferred.promise;
}

function templatePlugin(context) {

  context.on('hubpress:request-theme', function (opts) {
    console.info('templatePlugin Plugin - hubpress:request-theme');
    console.log('hubpress:request-theme', opts);
    // lowerCase is useless after version 0.6.0
    var themeName = opts.rootState.application.config.theme.name.toLowerCase();
    var configuration = opts.rootState.application.config;

    return load(themeName, configuration).then(function (themeInfos) {
      var theme = {
        name: themeName,
        files: themeInfos.files,
        version: themeInfos.version
      };

      _builder2.default.registerTheme(configuration, theme);
      _builder2.default.registerFiles(theme.files);

      var mergeTheme = Object.assign({}, theme);
      opts.nextState = Object.assign({}, opts.nextState, { theme: mergeTheme });
      return opts;
    });
  });

  context.on('requestGenerateIndex', function (opts) {
    console.info('Template Plugin - requestGenerateIndex');
    console.log('requestGenerateIndex', opts);
    var updatedOpts = (0, _indexGenerator.generateIndex)(opts);
    console.log('requestGenerateIndex return', updatedOpts);
    return updatedOpts;
  });

  context.on('requestGeneratePost', function (opts) {
    console.info('Template Plugin - requestGeneratePost');
    console.log('requestGeneratePost', opts);
    var updatedOpts = (0, _postGenerator.generatePost)(opts, opts.nextState.post);
    console.log('requestGeneratePost return', updatedOpts);
    return updatedOpts;
  });

  context.on('requestGeneratePosts', function (opts) {
    console.info('Template Plugin - requestGeneratePosts');
    console.log('requestGeneratePosts', opts);
    var updatedOpts = (0, _postsGenerator.generatePosts)(opts);
    console.log('requestGeneratePosts return', updatedOpts);
    return updatedOpts;
  });

  context.on('requestGenerateTags', function (opts) {
    console.info('Template Plugin - requestGenerateTags');
    console.log('requestGenerateTags', opts);
    var updatedOpts = (0, _tagsGenerator.generateTags)(opts);
    console.log('requestGenerateTags return', updatedOpts);
    return updatedOpts;
  });

  context.on('requestGenerateAuthors', function (opts) {
    console.info('Template Plugin - requestGenerateAuthors');
    console.log('requestGenerateAuthors', opts);
    var updatedOpts = (0, _authorsGenerator.generateAuthors)(opts);
    console.log('requestGenerateAuthors return', updatedOpts);
    return updatedOpts;
  });
}