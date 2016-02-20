'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var helpers = require('./helpers');

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.name = null;
    this.version = null;
    this.templateCache = new Map();
    this.templateOptions = { data: {} };
    helpers.loadCoreHelpers();
  }

  _createClass(Builder, [{
    key: 'registerTheme',
    value: function registerTheme(config, theme) {
      this.setThemeName(theme.name);
      this.setThemeVersion(theme.version);
      this.registerFiles(theme.files);

      var blog = config.site || {};
      blog.url = config.urls.site;

      this.templateOptions = {
        data: {
          blog: blog
        }
      };
    }
  }, {
    key: 'registerFiles',
    value: function registerFiles(themeFiles) {
      var _this = this;

      console.info('Builder - registerFiles');
      console.log('Builder - registerFiles', themeFiles);
      var LAYOUT_PATTERN = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;
      themeFiles.forEach(function (file) {
        if (file.path.indexOf('partials/') === 0) {
          _handlebars2['default'].registerPartial(file.name, file.content);
        } else {
          var data = {
            name: file.name,
            template: _handlebars2['default'].compile(file.content)
          };

          var matches = file.content.match(LAYOUT_PATTERN);
          if (matches) {
            data.layout = matches[1];
          }

          _this.templateCache.set(file.name, data);
        }
      });
    }
  }, {
    key: 'template',
    value: function template(templateName, data) {
      console.info('Builder - template');
      console.log('Builder - template', templateName, data);
      var templateCache = this.templateCache.get(templateName);
      var htmlContent = templateCache.template(data, this.templateOptions);

      if (templateCache.layout) {
        data.body = htmlContent;
        templateCache = this.templateCache.get(templateCache.layout);
        htmlContent = templateCache.template(data, this.templateOptions);
      }

      return htmlContent;
    }
  }, {
    key: 'setThemeName',
    value: function setThemeName(name) {
      this.name = name;
    }
  }, {
    key: 'getThemeName',
    value: function getThemeName() {
      return this.name;
    }
  }, {
    key: 'getThemeVersion',
    value: function getThemeVersion() {
      return this.version;
    }
  }, {
    key: 'setThemeVersion',
    value: function setThemeVersion(version) {
      this.version = version;
    }
  }]);

  return Builder;
})();

exports['default'] = new Builder();
module.exports = exports['default'];