import fs from "fs";
import path from "path";

type Post = { id: string; path: string; coverImage: string };

function main() {
  const postsPath = path.join(process.cwd(), "posts", "all-blog.json");
  const posts = Object.values(
    JSON.parse(fs.readFileSync(postsPath, "utf8"))
  ) as Post[];
  const errors: string[] = [];

  for (const post of posts) {
    const mdxPath = path.join(process.cwd(), `${post.path}.mdx`);
    const sourceImagePath = path.join(process.cwd(), "posts", post.coverImage);
    const publicImagePath = path.join(process.cwd(), "public", post.coverImage);

    if (!fs.existsSync(mdxPath)) errors.push(`${post.id}: missing MDX (${mdxPath})`);
    if (!fs.existsSync(sourceImagePath)) {
      errors.push(`${post.id}: missing cover source (${sourceImagePath})`);
    }
    if (!fs.existsSync(publicImagePath)) {
      errors.push(`${post.id}: missing public cover (${publicImagePath})`);
    }
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(`Verified generated metadata and cover images for ${posts.length} posts.`);
}

main();
