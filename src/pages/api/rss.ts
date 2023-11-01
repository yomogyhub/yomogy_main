import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import RSS from "rss";
import { getAllPosts } from "../api/get-posts-category"; // ここで関数をインポート
import { Post } from "../../utils/posts-type";

async function generateRssFeed() {
  const feed = new RSS({
    title: "Yomogy",
    description: "Yomogy",
    feed_url: `${process.env.BASE_URL}/rss.xml`,
    site_url: `${process.env.BASE_URL}`,
    image_url: `${process.env.BASE_URL}/icon.png`,
    managingEditor: "Yomogy",
    webMaster: "Yomogy",
    copyright: "All Copyright Notice",
    language: "ja",
    pubDate: new Date().toString(),
    ttl: 60,
  });

  const posts = await getAllPosts();

  posts.forEach((post: Post) => {
    feed.item({
      title: post.title,
      description: post.title, // ここで全文としてタイトルを使用します（デモのため）
      url: `${process.env.BASE_URL}/${post.category}/${post.id}`,
      author: post.author,
      date: new Date(post.publishedAt),
    });
  });

  return feed.xml();
}

export async function createRssFeed() {
  const rssOutput = await generateRssFeed();
  const outputPath = path.join(process.cwd(), "public", "rss.xml");
  fs.writeFileSync(outputPath, rssOutput);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const rssOutput = await generateRssFeed();

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(rssOutput);
  res.end();
};

export default handler;
