import Q from 'q';
import request from 'superagent';
import { generateIndex } from './indexGenerator';
import { generatePost } from './postGenerator';
import { generatePosts } from './postsGenerator';
import { generateTags } from './tagsGenerator';
import Builder from './builder';

function load(name, config) {

  let deferred = Q.defer();
  let promises = [];
  let meta = config.meta;
  let hubpressUrl = config.urls.hubpress;
  request.get(`${hubpressUrl}/themes/${name}/theme.json?dt=${Date.now()}`)
    .end((err, response) => {
      if (err) {
        deferred.reject(err);
        return;
      }
      let theme = response.body;
      let version = theme.version;
      let files = _.toPairs(theme.files);

      let paginationLoaded = false;
      let navigationLoaded = false;

      files.forEach((file) => {
        let deferredFile = Q.defer();
        promises.push(deferredFile.promise);

        paginationLoaded = paginationLoaded || file[0] === 'pagination';
        navigationLoaded = navigationLoaded || file[0] === 'nav';

        request.get(`${hubpressUrl}/themes/${name}/${file[1]}?v=${version}`)
          .end((err, response) => {
            if (err) {
              deferredFile.reject(err)
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
        let deferredPagination = Q.defer();
        promises.push(deferredPagination.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/pagination.hbs`)
          .end((err, response) => {
            if (err) {
              deferredPagination.reject(err)
              return;
            }

            deferredPagination.resolve({
              name: 'pagination',
              path: 'partials/pagination',
              content: response.text
            });
          });
      }

      if (!navigationLoaded) {
        let deferredNav = Q.defer();
        promises.push(deferredNav.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/nav.hbs`)
          .end((err, response) => {
            if (err) {
              deferredNav.reject(err)
              return;
            }
            deferredNav.resolve({
              name: 'nav',
              path: 'partials/nav',
              content: response.text
            });
          });
      }

      Q.all(promises)
        .then((values)=>{
          deferred.resolve({
            version: version,
            files: values
          });
        })
        .catch((error) => {
          console.log(error);
          deferred.reject(error);
        });
    });

  return deferred.promise;
}

export function templatePlugin (hubpress) {

  hubpress.on('requestTheme', function (opts) {
    console.log('Theme plugin', opts);
    const themeName = opts.data.config.theme.name;

    return load(themeName, opts.data.config)
      .then((themeInfos) => {
        const theme = {
          name: themeName,
          files: themeInfos.files,
          version: themeInfos.version
        };

        Builder.registerTheme(opts.data.config, theme);
        Builder.registerFiles(theme.files);

        const mergeTheme = Object.assign({}, theme);
        const data = Object.assign({}, opts.data, {theme: mergeTheme});
        return Object.assign({}, opts, {data});
      });
  })

    hubpress.on('requestGenerateIndex', opts => {
      return generateIndex(opts);
    });

    hubpress.on('requestGeneratePost', opts => {
      return generatePost(opts, opts.data.post);
    });

    hubpress.on('requestGeneratePosts', opts => {
      return generatePosts(opts, opts.data.post);
    });

    hubpress.on('requestGenerateTags', opts => {
      return generateTags(opts, opts.data.post);
    });

}
