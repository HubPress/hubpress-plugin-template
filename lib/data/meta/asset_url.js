"use strict";function getAssetUrl(c,e,t){var a="";return a+=c.match(/^favicon\.ico$/)?config.url+"/":config.activeTheme.url+"/",c.match(/^favicon\.ico$/)||c.match(/^shared/)||c.match(/^asset/)||(a+=e?"ghost/":"assets/"),c=c.replace(/^\//,""),t&&(c=c.replace(/\.([^\.]*)$/,".min.$1")),a+=c,c.match(/^favicon\.ico$/)||(a=a+"?v="+config.assetHash),a}var config=require("../../config");module.exports=getAssetUrl;