import paginationGenerator from './paginationGenerator';
import Builder from './builder';
import { generatePost } from './postGenerator';

export function generatePosts (opts) {
  console.info('PostsGenerator - generate');
  console.log('PostsGenerator - generate', opts);
  let postsToPublish = [];

  let postPromises = [];
  let returnedOpts = opts;
  opts.data.publishedPosts.forEach(post => {
    returnedOpts = generatePost(returnedOpts, post);
  })
  // TODO Test me i'm sure i'm famous
  return returnedOpts;
}
