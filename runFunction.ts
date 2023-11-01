import { createJsonForAuthorsAndPosts } from "./src/pages/api/get-posts-category";
import { createRssFeed } from "./src/pages/api/rss";
import { createSitemap } from "./src/pages/api/sitemap";

async function run() {
  await createJsonForAuthorsAndPosts();
  await createRssFeed();
  await createSitemap();
}

run();
