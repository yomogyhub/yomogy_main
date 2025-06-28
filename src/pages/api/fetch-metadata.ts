import { NextApiRequest, NextApiResponse } from 'next';

interface Metadata {
  url: string;
  title: string;
  description: string | null;
  image: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Metadata | { error: string }>) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL parameter is required' });
    return;
  }

  try {
    // Validate URL
    new URL(url);
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YomogyBot/1.0; +https://yomogy.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract metadata using regex (simpler than DOM parsing)
    const extractMetaContent = (property: string, name?: string): string | null => {
      // Try property first (for og: tags)
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
    const ogTitle = extractMetaContent('og:title');
    const twitterTitle = extractMetaContent('twitter:title');
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const htmlTitle = titleMatch ? titleMatch[1].trim() : null;
    
    const title = ogTitle || twitterTitle || htmlTitle || new URL(url).hostname;

    // Extract description
    const description = 
      extractMetaContent('og:description') ||
      extractMetaContent('twitter:description') ||
      extractMetaContent('description', 'description') ||
      null;

    // Extract image
    let image = 
      extractMetaContent('og:image') ||
      extractMetaContent('twitter:image') ||
      extractMetaContent('twitter:image:src') ||
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

    const metadata: Metadata = {
      url: url,
      title: title,
      description: description,
      image: image,
    };

    res.status(200).json(metadata);

  } catch (error) {
    console.error('Error fetching metadata:', error);

    // Return fallback metadata
    const fallbackMetadata: Metadata = {
      url: url,
      title: new URL(url).hostname,
      description: 'External link',
      image: null,
    };

    res.status(200).json(fallbackMetadata);
  }
}