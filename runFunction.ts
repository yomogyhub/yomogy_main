import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createImage } from "./src/utils/make-fig";
import { copyImagesToPublic } from "./src/utils/copy-image-to-public";

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

  // Generate missing cover images in posts directory
  for (const [id, post] of Object.entries(allPosts)) {
    const sourceImagePath = path.join(process.cwd(), "posts", post.coverImage!);
    
    if (!fs.existsSync(sourceImagePath)) {
      console.log(`Creating missing cover image for: ${id}`);
      try {
        // Ensure directory exists
        const imageDir = path.dirname(sourceImagePath);
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        
        await createImage(
          sourceImagePath,
          post.title,
          post.author,
          allAuthors[post.author].image!
        );
        console.log(`✅ Created cover image: ${sourceImagePath}`);
      } catch (error) {
        console.error(`❌ Failed to create image for ${id}:`, error);
      }
    }
  }

  // Sync images to public directory (removes old files and copies new ones)
  const blogDirectory = path.join(process.cwd(), "posts", "blog");
  const authorDirsForSync = fs.readdirSync(blogDirectory).filter(item => {
    const itemPath = path.join(blogDirectory, item);
    return fs.statSync(itemPath).isDirectory() && item !== 'images';
  });

  for (const author of authorDirsForSync) {
    const sourcePath = path.join(blogDirectory, author);
    const destinationPath = path.join(process.cwd(), "public", "blog", author);
    
    try {
      // Simple sync: remove existing directory and copy fresh
      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
        console.log(`Removed existing directory: ${destinationPath}`);
      }
      
      copyImagesToPublic(sourcePath, destinationPath);
      console.log(`Synced images for author: ${author}`);
    } catch (error) {
      console.error(`Failed to sync images for ${author}:`, error);
    }
  }

  console.log(`Generated ${Object.keys(allPosts).length} posts`);
  console.log(`Generated ${Object.keys(allAuthors).length} authors`);
  console.log("JSON files generated successfully!");
}

// Run the function
generateJSONFiles().catch(console.error);