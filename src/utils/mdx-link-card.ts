import { JSDOM, VirtualConsole } from "jsdom";
import fs from "fs";
import path from "path";

async function fetchInternalMetadata(url: string): Promise<Metadata> {
  // Parse the URL to extract category and id
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length >= 2) {
    const category = pathSegments[0];
    const id = pathSegments[1];
    
    try {
      // Read from the generated JSON files
      let jsonPath: string;
      let blogData: any;
      
      if (typeof window === 'undefined') {
        // Server-side: read from file system
        jsonPath = path.join(process.cwd(), 'posts', 'all-blog.json');
        blogData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } else {
        // Client-side: this won't work, return fallback
        return {
          url: url,
          title: extractTitleFromUrl(url),
          description: "Read more on Yomogy",
          image: null,
        };
      }
      
      if (blogData[id]) {
        const post = blogData[id];
        return {
          url: url,
          title: post.title,
          description: post.description ? post.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : null,
          image: post.coverImage ? (post.coverImage.startsWith('http') ? post.coverImage : `https://yomogy.com${post.coverImage}`) : null,
        };
      }
    } catch (error) {
      console.warn(`Failed to read internal blog data:`, error);
    }
  }
  
  // Fallback
  return {
    url: url,
    title: extractTitleFromUrl(url),
    description: "Read more on Yomogy",
    image: null,
  };
}

function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    // Convert kebab-case to title case
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return url;
  }
}

export interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

export async function fetchPageMetadata(url: string): Promise<Metadata> {
  // For internal yomogy.com URLs, extract metadata from JSON files
  if (url.startsWith('https://yomogy.com/')) {
    try {
      return await fetchInternalMetadata(url);
    } catch (error) {
      console.warn(`Failed to fetch internal metadata for ${url}:`, error);
      return {
        url: url,
        title: extractTitleFromUrl(url),
        description: "Read more on Yomogy",
        image: null,
      };
    }
  }

  // Skip external fetching during build to avoid network issues
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return {
      url: url,
      title: extractTitleFromUrl(url),
      description: "External link",
      image: null,
    };
  }

  try {
    const response = await fetch(url);

    // HTTPステータスコードが200以外の場合はエラーとして扱う
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
    }

    const html = await response.text();
    
    // Create virtual console to suppress CSS parsing errors
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {
      // Suppress CSS parsing errors silently
    });
    
    const dom = new JSDOM(html, {
      virtualConsole,
      resources: "usable",
      runScripts: "outside-only"
    });
    const document = dom.window.document;

    const getTitle = () => {
      const title = document.querySelector("title");
      return title ? title.textContent : null;
    };

    const maxChars = 150; // 例として150文字とします。必要に応じて変更してください。

    const truncateIfLong = (str: string | null): string | null => {
      if (!str) return null;
      if (str.length <= maxChars) return str;
      return str.substring(0, maxChars) + "...";
    };

    const getMetaContent = (name: string) => {
      const meta = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      const content = meta ? meta.getAttribute("content") : null;
      return name === "og:description" ? truncateIfLong(content) : content;
    };

    return {
      url: url,
      title: getTitle(),
      description: getMetaContent("og:description"),
      image: getMetaContent("og:image"),
    };
  } catch (error) {
    return {
      url: url,
      title: `Not found : ${url}`,
      description: null,
      image: null,
    };
  }
}

/**
 * MDXの内容を処理し、LinkCardにOGPメタデータを追加します。
 * @param originalContent 元のMDXの内容
 * @return 変更されたMDXの内容
 */
export async function processMDXContent(
  originalContent: string
): Promise<string> {
  let processedContent = originalContent;

  // LinkCard url="..." の正規表現パターン
  const linkCardPattern = /<LinkCard\s+url="([^"]+)"([^>]*?)\/?>|<LinkCard\s+url="([^"]+)"([^>]*?)>.*?<\/LinkCard>/g;

  let match;
  while ((match = linkCardPattern.exec(originalContent)) !== null) {
    const url = match[1] || match[3];
    const existingProps = match[2] || match[4] || '';
    
    try {
      const metadata = await fetchPageMetadata(url);
      
      // Replace the original <LinkCard> tag with metadata
      const replacement = `<LinkCard url="${url}" title="${metadata.title || ''}" description="${metadata.description || ''}" image="${metadata.image || ''}"${existingProps} />`;
      
      processedContent = processedContent.replace(match[0], replacement);
    } catch (error) {
      console.warn(`Failed to fetch metadata for ${url}:`, error);
      // Keep original if metadata fetching fails
    }
  }

  return processedContent;
}
