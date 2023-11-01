import fs from "fs";
import path from "path";
import { getAllPosts } from "../api/get-posts-category";
import { Post } from "../../utils/posts-type";

async function generateSitemap() {
  const baseUrl = `${process.env.BASE_URL}`;

  // 投稿データを取得
  const posts = await getAllPosts();

  // サイトマップの開始部分を設定
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
          <loc>${baseUrl}</loc>
      </url>`;

  // 各投稿のURLをサイトマップに追加
  posts.forEach((post: Post) => {
    sitemap += `
        <url>
            <loc>${baseUrl}/${post.category}/${post.id}</loc>
            <lastmod>${post.updatedAt}</lastmod>
        </url>`;
  });

  // サイトマップの終了部分を設定
  sitemap += `</urlset>`;

  return sitemap;
}

export async function createSitemap() {
  const sitemapOutput = await generateSitemap();
  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, sitemapOutput);
}

createSitemap();
