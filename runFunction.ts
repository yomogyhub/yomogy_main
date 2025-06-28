import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Post {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tag: string[];
  author: string;
  path: string;
  coverImage?: string;
  rePost?: boolean;
  status?: string;
}

interface AuthorData {
  name: string;
  bio: string;
  image?: string;
  description?: string;
  twitter?: string;
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

  // Get all author directories
  const authorDirs = fs.readdirSync(postsDirectory).filter(item => {
    const itemPath = path.join(postsDirectory, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log(`Found ${authorDirs.length} author directories:`, authorDirs);

  // Process each author directory
  for (const author of authorDirs) {
    const authorPath = path.join(postsDirectory, author);
    
    // Skip if this is an images directory
    if (author === 'images') continue;
    
    // Get all MDX files in this author directory
    const files = fs.readdirSync(authorPath).filter(file => file.endsWith('.mdx'));
    
    console.log(`Processing ${files.length} MDX files for author: ${author}`);
    
    for (const file of files) {
      const filePath = path.join(authorPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      const id = path.basename(file, '.mdx');
      const post: Post = {
        id,
        title: data.title || '',
        description: data.description || '',
        publishedAt: data.publishedAt || '',
        updatedAt: data.updatedAt || data.publishedAt || '',
        category: data.category || 'igem',
        tag: Array.isArray(data.tag) ? data.tag : (data.tag ? [data.tag] : []),
        author,
        path: `/posts/blog/${author}/${id}`,
        coverImage: data.coverImage || `/blog/${author}/images/${id}_cover.png`,
        rePost: data.rePost || false,
        status: data.status || 'published',
      };
      
      allPosts[id] = post;
      
      // Update counts
      const category = post.category;
      if (!listCount.categories[category]) {
        listCount.categories[category] = 0;
      }
      listCount.categories[category]++;
      
      if (!listCount.categoryTags[category]) {
        listCount.categoryTags[category] = {};
      }
      
      if (Array.isArray(post.tag)) {
        for (const tag of post.tag) {
          if (!listCount.categoryTags[category][tag]) {
            listCount.categoryTags[category][tag] = 0;
          }
          listCount.categoryTags[category][tag]++;
        }
      }
      
      if (!listCount.authors[author]) {
        listCount.authors[author] = 0;
      }
      listCount.authors[author]++;
      
      // Add author data if not exists
      if (!allAuthors[author]) {
        // Handle special case for Yomogy -> y0m0gy
        const imageFilename = author === 'yomogy' ? 'y0m0gy' : author.toLowerCase();
        
        allAuthors[author] = {
          name: author,
          bio: `Posts by ${author}`,
          description: `Posts by ${author}`,
          image: `/authors/${imageFilename}.png`,
          twitter: '',
        };
      }
    }
  }

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