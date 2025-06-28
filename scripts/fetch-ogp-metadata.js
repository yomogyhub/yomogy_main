const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Extract URLs from MDX files
function extractUrlsFromMdx(content) {
  const linkCardPattern = /<LinkCard\s+url="([^"]+)"/g;
  const urls = [];
  let match;
  
  while ((match = linkCardPattern.exec(content)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Fetch HTML content
function fetchHtml(url) {
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

// Extract OGP metadata from HTML
function extractMetadata(html, url) {
  // Simple regex-based extraction (works better than DOM parsing in Node.js)
  const extractMeta = (property, name) => {
    // Try property first (og: tags)
    let regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
    let match = html.match(regex);
    if (match) return match[1];

    // Try content first then property (alternative order)
    regex = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["'][^>]*>`, 'i');
    match = html.match(regex);
    if (match) return match[1];

    // Try name attribute if provided
    if (name) {
      regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
      match = html.match(regex);
      if (match) return match[1];

      regex = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i');
      match = html.match(regex);
      if (match) return match[1];
    }

    return null;
  };

  // Extract title
  const ogTitle = extractMeta('og:title');
  const twitterTitle = extractMeta('twitter:title');
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const htmlTitle = titleMatch ? titleMatch[1].trim() : null;
  
  const title = ogTitle || twitterTitle || htmlTitle || new URL(url).hostname;
  
  // Debug specific problematic URLs
  if (url.includes('identity_academy')) {
    console.log('Debug identity_academy:');
    console.log('ogTitle:', ogTitle);
    console.log('twitterTitle:', twitterTitle);
    console.log('htmlTitle:', htmlTitle);
    console.log('HTML sample:', html.substring(0, 1000));
  }

  // Extract description
  const description = 
    extractMeta('og:description') ||
    extractMeta('twitter:description') ||
    extractMeta('description', 'description') ||
    null;

  // Extract image
  let image = 
    extractMeta('og:image') ||
    extractMeta('twitter:image') ||
    extractMeta('twitter:image:src') ||
    null;

  // Make image URL absolute if it's relative
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

// Process all MDX files and extract OGP metadata
async function processOgpMetadata() {
  console.log('Starting OGP metadata extraction...');
  
  const postsDir = path.join(process.cwd(), 'posts', 'blog');
  const ogpData = {};
  const allUrls = new Set();

  // Find all MDX files and extract URLs
  function findMdxFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findMdxFiles(filePath);
      } else if (file.endsWith('.mdx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const urls = extractUrlsFromMdx(content);
        urls.forEach(url => allUrls.add(url));
      }
    }
  }

  findMdxFiles(postsDir);
  
  console.log(`Found ${allUrls.size} unique URLs to process`);

  // Fetch metadata for each URL
  let processed = 0;
  for (const url of allUrls) {
    try {
      console.log(`Processing ${++processed}/${allUrls.size}: ${url}`);
      
      const html = await fetchHtml(url);
      const metadata = extractMetadata(html, url);
      ogpData[url] = metadata;
      
      console.log(`✓ Success: ${metadata.title}`);
      
      // Add delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.warn(`✗ Failed to fetch ${url}:`, error.message);
      
      // Add fallback data
      ogpData[url] = {
        url: url,
        title: new URL(url).hostname,
        description: "External link",
        image: null,
      };
    }
  }

  // Save to JSON file
  const outputPath = path.join(process.cwd(), 'public', 'ogp-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(ogpData, null, 2));
  
  console.log(`OGP metadata saved to ${outputPath}`);
  console.log(`Total URLs processed: ${Object.keys(ogpData).length}`);
}

// Run the script
if (require.main === module) {
  processOgpMetadata().catch(console.error);
}

module.exports = { processOgpMetadata };