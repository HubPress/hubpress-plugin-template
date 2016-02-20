import _ from 'lodash';
import Builder from './builder';
import slugify from 'hubpress-core-slugify';

class PaginationGenerator {

  generate(params) {
    console.info('PaginationGenerator - generate');
    console.log('PaginationGenerator - generate', params);
    const posts = params.posts;
    const config = params.opts.data.config;
    const siteConfig = config.site;
    siteConfig.url = config.urls.site;
    let pageCount = 1;
    let pagePath = (params.path || '') + 'index.html';
    let postsPageToGenerate = [];
    let postsPageToPublish = [];
    let nbPostPerPage = parseInt(siteConfig.postsPerPage || 10, 10);
    const theme = {
      name: params.opts.data.theme.name,
      version: params.opts.data.theme.version,
      url: config.urls.theme
    };
    let urls = config.urls;
    let socialnetwork = config.socialnetwork;


    const userInfos = params.opts.state.authentication.credentials.userInformations;
    const author = {
      id: userInfos.id,
      name: userInfos.name,
      location:userInfos.location,
      website:userInfos.blog,
      image:userInfos.avatar_url
    };


    if (!posts || !posts.length) {
      let htmlContent = Builder.template(params.template ,{
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
        title: siteConfig.title,
      });

      postsPageToPublish.push( {
        name:`page-${pageCount}`,
        path: pagePath,
        content: htmlContent,
        message: `Publish page-${pageCount} ${params.template}`,
        author: author
      })

      const elementsToPublish = (params.opts.data.elementsToPublish || []).concat(postsPageToPublish);
      const data = Object.assign({}, params.opts.data, {elementsToPublish});
      return Object.assign({}, params.opts, {data});
    }

    let totalPage = Math.ceil((posts.length) / nbPostPerPage);

    _.each(posts, (post, index) => {
      let next = 0;
      let previous = 0;

      if (pageCount > 1) {
        pagePath =  (params.path || '') + `page/${pageCount}/index.html`;
      }

      if (pageCount > 1) {
        previous = pageCount-1;
      }
      if (pageCount < totalPage) {
        next = pageCount+1;
      }

      let postTags;
      console.error('TESTME : Check if tag are here')
      if (post.tags){ //(post.attributes.map['hp-tags']) {
        postTags = _.map(post.tags, (tag) => {
          return  {
            name: tag,
            slug: slugify(tag)
          };
        });
      }


      postsPageToGenerate.push({
        image: post.image,
        title: post.title,
        url: siteConfig.url+post.url,
        excerpt: post.excerpt,
        html: post.excerpt,
        tags: postTags,
        published_at: post.published_at,
        theme: theme,
        urls: urls,
        relativeUrl: ''
      });

      if (Math.floor((index + 1) / nbPostPerPage) > pageCount-1 || (index + 1)===posts.length) {
        //Generate
        //
        //
        let htmlContent = Builder.template(params.template,{
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

        postsPageToPublish.push( {
          name:`page-${pageCount}`,
          path: pagePath,
          content: htmlContent,
          message: `Publish page-${pageCount} ${params.template}`,
          author: author
        });

        postsPageToGenerate = [];
        pageCount++;
      }

    });

    const elementsToPublish = (params.opts.data.elementsToPublish || []).concat(postsPageToPublish);
    const data = Object.assign({}, params.opts.data, {elementsToPublish});
    return Object.assign({}, params.opts, {data});
  }
}

export default new PaginationGenerator();
