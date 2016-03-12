"use strict";function isBrowse(r,e){var s=!0;return(e.id||e.slug)&&(s=!1),s}function resolvePaths(r,e){var s=/\{\{(.*?)\}\}/g;return e=e.replace(s,function(e,s){var t;return s=pathAliases[s]?pathAliases[s]:s,s=s.replace(/\.\[/g,"["),t=jsonpath.query(r,s).join(",")})}function parseOptions(r,e){return _.isString(e.filter)&&(e.filter=resolvePaths(r,e.filter)),e}var _=require("lodash"),hbs=require("express-hbs"),Promise=require("bluebird"),errors=require("../errors"),api=require("../api"),jsonpath=require("jsonpath"),labs=require("../utils/labs"),i18n=require("../i18n"),resources,pathAliases,get;resources=["posts","tags","users"],pathAliases={"post.tags":"post.tags[*].slug","post.author":"post.author.slug"},get=function(r,e){e=e||{},e.hash=e.hash||{},e.data=e.data||{};var s,t=this,a=hbs.handlebars.createFrame(e.data),i=_.omit(e.hash,"context");return e.fn?_.contains(resources,r)?(s=isBrowse(r,i)?api[r].browse:api[r].read,i=parseOptions(this,i),s(i).then(function(s){var i;return _.isEmpty(s[r])?e.inverse(t,{data:a}):(i=[s[r]],s.meta&&s.meta.pagination&&(s.pagination=s.meta.pagination,i.push(s.meta.pagination)),e.fn(s,{data:a,blockParams:i}))})["catch"](function(r){return a.error=r.message,e.inverse(t,{data:a})})):(a.error=i18n.t("warnings.helpers.get.invalidResource"),errors.logWarn(a.error),Promise.resolve(e.inverse(t,{data:a}))):(a.error=i18n.t("warnings.helpers.get.mustBeCalledAsBlock"),errors.logWarn(a.error),Promise.resolve())},module.exports=function(r,e){var s=this,t=[i18n.t("warnings.helpers.get.helperNotAvailable"),i18n.t("warnings.helpers.get.apiMustBeEnabled"),i18n.t("warnings.helpers.get.seeLink",{url:"http://support.ghost.org/public-api-beta"})];return labs.isSet("publicAPI")===!0?get.call(s,r,e):(errors.logError.apply(this,t),Promise.resolve(function(){return'<script>console.error("'+t.join(" ")+'");</script>'}))};