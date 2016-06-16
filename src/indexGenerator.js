import paginationGenerator from './paginationGenerator';

export function generateIndex (opts) {
  return paginationGenerator.generate({opts, posts: opts.data.publishedPosts, template: 'index', path: ''});
}
