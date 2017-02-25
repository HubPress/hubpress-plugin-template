'use strict';

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getActiveThemePaths(activeTheme) {
    return _config2.default.activeTheme.url;
}

function getSingleTemplateHierarchy(single) {
    var templateList = ['post'],
        type = 'post';

    if (single.page) {
        templateList.unshift('page');
        type = 'page';
    }

    templateList.unshift(type + '-' + single.slug);

    return templateList;
}

function pickTemplate(themePaths, templateList) {
    var template = _.find(templateList, function (template) {
        return themePaths.hasOwnProperty(template + '.hbs');
    });

    if (!template) {
        template = templateList[templateList.length - 1];
    }

    return template;
}

function getTemplateForSingle(activeTheme, single) {
    return pickTemplate(getActiveThemePaths(activeTheme), getSingleTemplateHierarchy(single));
}

module.exports = {
    single: getTemplateForSingle
};