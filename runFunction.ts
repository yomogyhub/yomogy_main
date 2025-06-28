import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tag: string[];
  author: string;
  path: string;
  coverImage?: string;
}

interface AuthorData {
  name: string;
  bio: string;
}

interface ListCount {
  categories: Record<string, number>;
  categoryTags: Record<string, Record<string, number>>;
  authors: Record<string, number>;
}

async function generateJSONFiles() {
  const postsDirectory = path.join(process.cwd(), "posts", "blog");
  const allPosts: Record<string, Post> = {};
  const allAuthors: Record<string, AuthorData> = {};
  const listCount: ListCount = {
    categories: {},
    categoryTags: {},
    authors: {},
  };

  // Get all authors from directory structure
  function getAllAuthors(dir: string): string[] {
    const authors: string[] = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        authors.push(item);
      }
    }
    return authors;
  }

  // Process all MDX files
  function processDirectory(dir: string, category: string = "") {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        if (!category) {
          // This is a category directory
          processDirectory(itemPath, item);
        } else {
          // This is an author directory within a category
          const authorFiles = fs.readdirSync(itemPath);
          for (const file of authorFiles) {
            if (file.endsWith('.mdx')) {
              const filePath = path.join(itemPath, file);
              const fileContents = fs.readFileSync(filePath, 'utf8');
              const { data } = matter(fileContents);
              
              const id = path.basename(file, '.mdx');
              const post: Post = {
                id,
                title: data.title || '',
                description: data.description || '',
                date: data.date || '',
                category,
                tag: data.tag || [],
                author: item, // author is the directory name
                path: `/posts/blog/${category}/${item}/${id}`,
                coverImage: data.coverImage || `/blog/${item}/images/${id}_cover.png`,
              };
              
              allPosts[id] = post;
              
              // Update counts
              if (!listCount.categories[category]) {
                listCount.categories[category] = 0;
              }
              listCount.categories[category]++;
              
              if (!listCount.categoryTags[category]) {
                listCount.categoryTags[category] = {};
              }
              
              for (const tag of post.tag) {
                if (!listCount.categoryTags[category][tag]) {
                  listCount.categoryTags[category][tag] = 0;
                }
                listCount.categoryTags[category][tag]++;
              }
              
              if (!listCount.authors[item]) {
                listCount.authors[item] = 0;
              }
              listCount.authors[item]++;
              
              // Add author data if not exists
              if (!allAuthors[item]) {
                allAuthors[item] = {
                  name: item,
                  bio: `Posts by ${item}`,
                };
              }
            }
          }
        }
      }
    }
  }

  // Process all posts
  processDirectory(postsDirectory);

  // Write JSON files
  const postsOutputPath = path.join(process.cwd(), "posts", "all-blog.json");
  const authorsOutputPath = path.join(process.cwd(), "posts", "all-author.json");
  const listCountOutputPath = path.join(process.cwd(), "posts", "all-list-count.json");

  fs.writeFileSync(postsOutputPath, JSON.stringify(allPosts, null, 2));
  fs.writeFileSync(authorsOutputPath, JSON.stringify(allAuthors, null, 2));
  fs.writeFileSync(listCountOutputPath, JSON.stringify(listCount, null, 2));

  console.log(`Generated ${Object.keys(allPosts).length} posts`);
  console.log(`Generated ${Object.keys(allAuthors).length} authors`);
  console.log("JSON files generated successfully!");
}

// Run the function
generateJSONFiles().catch(console.error);