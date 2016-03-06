import paginationGenerator from './paginationGenerator';
import _ from 'lodash';
import Builder from './builder';
import slugify from 'hubpress-core-slugify';;

export function generateAuthors (opts) {
  console.info('AuthorGenerator - generate');
  console.log('AuthorGenerator - generate', opts);
  const template = 'author';
  let posts;

  if (!Builder.isTemplateAvailable(template)) {
    return opts;
  }

  if (opts.data.author) {
    posts = opts.data.publishedPosts.filter(post => {
      return post.author.login === opts.data.author.login;
    });
  }
  else {
    posts = opts.data.publishedPosts;
  }

  let authors = _.reduce(posts, (memo, post) => {
    memo[post.author.login] = memo[post.author.login] || [];
    memo[post.author.login].push(post)
    return memo;
  }, {});


  let returnedOpts = opts;
  _.each(authors, (authorPosts, key) => {

    let authorObject = authorPosts[0].author;
    authorObject.name = authorObject.name || authorObject.login;
    authorObject.slug = key;
    returnedOpts = paginationGenerator.generate({opts: returnedOpts, posts: authorPosts, author: authorObject, template, path: `author/${key}/`});

  });

  return returnedOpts;
}
