import _ from 'lodash';
import Builder from './builder';
import slugify from 'hubpress-core-slugify';;

export function generatePost (opts, post) {
  console.info('PostGenerator - generate');
  console.log('PostGenerator - generate', opts);
  const modifiedPost = post;

  const postData = Object.assign({}, modifiedPost.original);

  postData.tags = _.map(postData.tags, (tag) => {
    return {
      name: tag,
      slug: slugify(tag)
    };
  });

  const userInfos = opts.state.authentication.credentials.userInformations;
  postData.author = {
    id: userInfos.id,
    name: userInfos.name,
    location:userInfos.location,
    website:userInfos.blog,
    image:userInfos.avatar_url
  };

  const config = opts.data.config;
  const urls = config.urls;
  const theme = {
    name: opts.data.theme.name,
    version: opts.data.theme.version,
    url: config.urls.theme
  };
  postData.urls = urls;

  const htmlContent = Builder.template('post',{
      context: 'post',
      site: config.site,
      theme: theme,
      urls: urls,
      socialnetwork: config.socialnetwork,
      relativeUrl: modifiedPost.url,
      post: postData
    });

  const postsToPublish = []
  postsToPublish.push({
    title: modifiedPost.title,
    image: modifiedPost.image,
    name:modifiedPost.name,
    path:config.urls.getPostGhPath(modifiedPost.name),
    content:htmlContent,
    message: `Publish ${modifiedPost.name}`,
    published_at: modifiedPost.published_at
  });

  const elementsToPublish = (opts.data.elementsToPublish || []).concat(postsToPublish);
  const data = Object.assign({}, opts.data, {elementsToPublish});
  return Object.assign({}, opts, {data});

}
