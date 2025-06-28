import https from "https";
import http from "http";

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

/**
 * External URLからOGPメタデータを取得します
 */
export async function fetchPageMetadata(url: string): Promise<Metadata> {
  try {
    const html = await fetchHtml(url);
    return extractMetadata(html, url);
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error);
    return {
      url: url,
      title: new URL(url).hostname,
      description: "External link",
      image: null,
    };
  }
}

/**
 * HTMLを取得する
 */
function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YomogyBot/1.0; +https://yomogy.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * HTMLからOGPメタデータを抽出する
 */
function extractMetadata(html: string, url: string): Metadata {

  const extractMeta = (property: string, name?: string) => {
    // Try different quote patterns
    const patterns = [
      `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["'][^>]*>`,
      `<meta[^>]*property="${property}"[^>]*content="([^"]*)"[^>]*>`,
      `<meta[^>]*content="([^"]*)"[^>]*property="${property}"[^>]*>`,
      `<meta[^>]*property='${property}'[^>]*content='([^']*)'[^>]*>`,
      `<meta[^>]*content='([^']*)'[^>]*property='${property}'[^>]*>`
    ];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      const match = html.match(regex);
      if (match) return match[1];
    }

    if (name) {
      const namePatterns = [
        `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
        `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`,
        `<meta[^>]*name="${name}"[^>]*content="([^"]*)"[^>]*>`,
        `<meta[^>]*content="([^"]*)"[^>]*name="${name}"[^>]*>`
      ];

      for (const pattern of namePatterns) {
        const regex = new RegExp(pattern, 'i');
        const match = html.match(regex);
        if (match) return match[1];
      }
    }

    return null;
  };

  const ogTitle = extractMeta('og:title');
  const twitterTitle = extractMeta('twitter:title');
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const htmlTitle = titleMatch ? titleMatch[1].trim().replace(/&[^;]+;/g, '') : null;
  
  const title = ogTitle || twitterTitle || htmlTitle || new URL(url).hostname;

  const description = 
    extractMeta('og:description') ||
    extractMeta('twitter:description') ||
    extractMeta('description', 'description') ||
    extractMeta('Description', 'Description') ||
    null;

  let image = 
    extractMeta('og:image') ||
    extractMeta('twitter:image') ||
    extractMeta('twitter:image:src') ||
    null;

  if (image && !image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).href;
    } catch (error) {
      console.warn('Failed to make image URL absolute:', error);
      image = null;
    }
  }


  return {
    url: url,
    title: title,
    description: description,
    image: image,
  };
}

/**
 * MDXの内容を処理し、LinkCardにOGPメタデータを追加します
 */
export async function processMDXContent(originalContent: string): Promise<string> {
  // MDXを変更せずそのまま返す
  return originalContent;
}

/**
 * MDXからLinkCard URLsを抽出してOGPメタデータを取得
 */
/**
 * 内部リンクからメタデータを取得する
 */
async function fetchInternalMetadata(url: string): Promise<Metadata> {
  try {
    // URLからカテゴリとIDを抽出
    const urlParts = url.replace('https://yomogy.com/', '').split('/');
    const category = urlParts[0];
    const id = urlParts[1];
    
    if (!category || !id) {
      throw new Error('Invalid internal URL format');
    }

    // JSONファイルから投稿データを取得
    const fs = require('fs');
    const path = require('path');
    
    const jsonPath = path.join(process.cwd(), 'posts', 'all-blog.json');
    
    // JSON ファイルの存在確認
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found: ${jsonPath}`);
    }
    
    const postsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // 該当する投稿を検索（オブジェクト形式なのでObject.valuesで配列に変換）
    const posts = Object.values(postsData) as any[];
    const post = posts.find((p: any) => p.category === category && p.id === id);
    
    if (post) {
      return {
        url: url,
        title: post.title || new URL(url).hostname,
        description: post.description || "Internal link",
        image: post.coverImage ? `https://yomogy.com${post.coverImage}` : null,
      };
    }
    
    throw new Error(`Post not found: ${category}/${id}`);
  } catch (error) {
    console.error(`❌ Failed to fetch internal metadata for ${url}:`, error);
    return {
      url: url,
      title: "yomogy.com",
      description: "Internal link",
      image: null,
    };
  }
}

export async function extractOGPMetadata(content: string): Promise<Record<string, Metadata>> {
  const linkCardPattern = /<LinkCard\s+url="([^"]+)"[^>]*\/>/g;
  const urlsToProcess = new Set<string>();
  
  // Extract URLs from LinkCard components
  let match;
  while ((match = linkCardPattern.exec(content)) !== null) {
    urlsToProcess.add(match[1]);
  }

  const metadataMap: Record<string, Metadata> = {};
  
  for (const url of Array.from(urlsToProcess)) {
    try {
      // 内部リンクかどうかチェック
      if (url.includes('yomogy.com/synbio/') || url.includes('yomogy.com/igem/')) {
        const metadata = await fetchInternalMetadata(url);
        metadataMap[url] = metadata;
      } else {
        // 外部リンクの場合は通常のOGP取得
        const metadata = await fetchPageMetadata(url);
        metadataMap[url] = metadata;
        
        // Add delay to be respectful to servers
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`Failed to fetch metadata for ${url}:`, error);
      metadataMap[url] = {
        url: url,
        title: new URL(url).hostname,
        description: "External link",
        image: null,
      };
    }
  }

  return metadataMap;
}