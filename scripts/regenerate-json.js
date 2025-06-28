const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function createJsonForAuthorsAndPosts() {
  const postsDirectory = path.join(process.cwd(), "posts", "blog");
  const allAuthorsDir = fs.readdirSync(postsDirectory);

  let allPostsData = {};
  let allAuthors = [];
  let allCategories = {};
  let allAuthorsCount = {};
  let categoryTagCount = {};

  for (const authorDir of allAuthorsDir) {
    const categoryDirectory = path.join(postsDirectory, authorDir);
    const filenames = fs
      .readdirSync(categoryDirectory)
      .filter((filename) => filename.endsWith(".mdx"));

    for (const filename of filenames) {
      const id = filename.replace(/\.mdx$/, "");

      const fullPath = path.join(categoryDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const author = matterResult.data.author;
      const tags = matterResult.data.tag || [];

      // この記事は公開状態ではない場合スキップ
      if (matterResult.data.status !== "published") {
        continue;
      }

      allAuthors.push(author);

      allPostsData[id] = {
        id: id,
        path: `/posts/blog/${authorDir}/${id}`,
        title: matterResult.data.title,
        publishedAt: matterResult.data.publishedAt,
        updatedAt: matterResult.data.updatedAt,
        category: matterResult.data.category,
        author: author,
        description: matterResult.data.description,
        tag: tags,
        coverImage: `/blog/${authorDir}/images/${id}_cover.png`,
        rePost: matterResult.data.rePost,
        status: matterResult.data.status,
        content: matterResult.content, // Store content in JSON
      };

      if (allAuthorsCount[author]) {
        allAuthorsCount[author]++;
      } else {
        allAuthorsCount[author] = 1;
      }

      if (allCategories[matterResult.data.category]) {
        allCategories[matterResult.data.category]++;
      } else {
        allCategories[matterResult.data.category] = 1;
      }

      if (!categoryTagCount[matterResult.data.category]) {
        categoryTagCount[matterResult.data.category] = {};
      }

      for (const tag of tags) {
        if (categoryTagCount[matterResult.data.category][tag]) {
          categoryTagCount[matterResult.data.category][tag]++;
        } else {
          categoryTagCount[matterResult.data.category][tag] = 1;
        }
      }
    }
  }

  const allListCount = {
    categories: allCategories,
    authors: allAuthorsCount,
    categoryTags: categoryTagCount,
  };

  const listsJsonPath = path.join(
    process.cwd(),
    "posts",
    "all-list-count.json"
  );
  fs.writeFileSync(listsJsonPath, JSON.stringify(allListCount, null, 2));

  // Remove duplicates
  allAuthors = Array.from(new Set(allAuthors));

  // Create or update authors JSON
  const authorsJsonPath = path.join(process.cwd(), "posts", "all-author.json");
  let authorsJson;

  try {
    const jsonString = fs.readFileSync(authorsJsonPath, "utf8");
    authorsJson = JSON.parse(jsonString);
  } catch (err) {
    authorsJson = {};
  }

  for (const author of allAuthors) {
    if (!authorsJson[author]) {
      authorsJson[author] = {
        name: author,
        description: "新規ユーザーです。プロフィールを更新してください。",
        twitter: "https://x.com/y0m0gy",
        image: "/authors/y0m0gy.png",
      };
    }
  }

  fs.writeFileSync(authorsJsonPath, JSON.stringify(authorsJson, null, 2));

  // Create or update posts JSON
  const postsJsonPath = path.join(process.cwd(), "posts", "all-blog.json");
  fs.writeFileSync(postsJsonPath, JSON.stringify(allPostsData, null, 2));

  console.log("JSON files regenerated with MDX content included");
}

createJsonForAuthorsAndPosts().catch(console.error);