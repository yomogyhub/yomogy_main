const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const url = event.queryStringParameters?.url;
  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  try {
    // Validate URL
    new URL(url);
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid URL' }),
    };
  }

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YomogyBot/1.0; +https://yomogy.com)',
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract metadata
    const getMetaContent = (property, name) => {
      // Try property first (for og: tags)
      let element = document.querySelector(`meta[property="${property}"]`);
      if (element) return element.getAttribute('content');
      
      // Try name attribute
      element = document.querySelector(`meta[name="${name || property}"]`);
      if (element) return element.getAttribute('content');
      
      return null;
    };

    const title = 
      getMetaContent('og:title') ||
      getMetaContent('twitter:title') ||
      document.querySelector('title')?.textContent?.trim() ||
      new URL(url).hostname;

    const description = 
      getMetaContent('og:description') ||
      getMetaContent('twitter:description') ||
      getMetaContent('description') ||
      null;

    const image = 
      getMetaContent('og:image') ||
      getMetaContent('twitter:image') ||
      getMetaContent('twitter:image:src') ||
      null;

    // Make image URL absolute if it's relative
    let absoluteImage = image;
    if (image && !image.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        absoluteImage = new URL(image, baseUrl.origin).href;
      } catch (error) {
        console.warn('Failed to make image URL absolute:', error);
      }
    }

    const metadata = {
      url: url,
      title: title,
      description: description,
      image: absoluteImage,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(metadata),
    };

  } catch (error) {
    console.error('Error fetching metadata:', error);

    // Return fallback metadata
    const fallbackMetadata = {
      url: url,
      title: new URL(url).hostname,
      description: 'External link',
      image: null,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(fallbackMetadata),
    };
  }
};