import paginationGenerator from './paginationGenerator';
import _ from 'lodash';
import Builder from './builder';
import slugify from 'hubpress-core-slugify';;

export function generateTags (opts) {
  console.info('TagsGenerator - generate');
  console.log('TagsGenerator - generate', opts);
  const template = 'tag';
  let posts;


  // If template Tag is not available, do not process
  if (!Builder.isTemplateAvailable(template)) {
    return opts;
  }


  if (opts.data.post && !opts.data.post.tags && !opts.data.tags ) {
    return opts;
  }

  // if (opts.data.post) {
  //   const originalTags = opts.data.post.original ? opts.data.post.original.tags : [];
  //   const postTags = _.union(opts.data.post.tags, originalTags);
  //
  //   posts = opts.data.publishedPosts.filter(post => {
  //     return _.intersection(postTags, post.tags).length;
  //   });
  // }
  if (opts.data.tags) {
    posts = opts.data.publishedPosts.filter(post => {
      return _.intersection(opts.data.tags, post.tags).length;
    });
  }
  else {
    posts = opts.data.publishedPosts;
  }

  let tags = _.reduce(posts, (memo, post) => {
    if (!post.tags) {
      return memo;
    }

    const postsTags = _.reduce(post.tags, (memo, postTag) => {
      const slugTag = slugify(postTag);
      if (!opts.data.post || !opts.data.post.tags || opts.data.post.tags.indexOf(postTag) !== -1) {
        memo.push(slugTag);
      }

      return memo;
    }, []);

    _.uniq(postsTags).forEach(postTag => {
      memo[postTag] = memo[postTag] || [];
      memo[postTag].push(post);
    });

    return memo;

  }, {});

  let returnedOpts = opts;
  _.each(tags, (tag, key) => {

    let tagObject = {
      name: key,
      slug: slugify(key),
      description: null
    }
    returnedOpts = paginationGenerator.generate({opts: returnedOpts, posts: tag, tag: tagObject, template, path: `tag/${key}/`});

  });

  return returnedOpts;
}
