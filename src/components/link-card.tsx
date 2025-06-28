import React, { useState, useEffect } from "react";

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

interface LinkCardProps {
  metadata?: Metadata;
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  size?: "small" | "large";
}

const LinkCard: React.FC<LinkCardProps> = ({ 
  metadata, 
  url, 
  title, 
  description, 
  image, 
  size = "small" 
}) => {
  const [cardMetadata, setCardMetadata] = useState<Metadata | null>(metadata || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If metadata is provided, use it directly
    if (metadata) {
      setCardMetadata(metadata);
      return;
    }

    // If individual props are provided, create metadata from them
    if (url && (title !== undefined || description !== undefined || image !== undefined)) {
      setCardMetadata({
        url: url,
        title: title || null,
        description: description || null,
        image: image || null,
      });
      return;
    }

    // If URL is provided but no metadata, try to fetch it client-side
    if (url && !metadata && title === undefined && description === undefined && image === undefined) {
      setIsLoading(true);
      
      // Fetch metadata using multiple CORS proxies with fallback
      const fetchMetadata = async () => {
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
          `https://corsproxy.io/?${encodeURIComponent(url)}`,
          `https://cors-anywhere.herokuapp.com/${url}`,
        ];

        for (let i = 0; i < proxies.length; i++) {
          try {
            const proxyUrl = proxies[i];
            const response = await fetch(proxyUrl);
            
            if (response.ok) {
              let htmlContent;
              
              if (i === 0) {
                // AllOrigins format
                const data = await response.json();
                htmlContent = data.contents;
              } else {
                // Direct HTML response
                htmlContent = await response.text();
              }
              
              if (htmlContent) {
                // Parse HTML to extract OGP metadata
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                
                // Extract title
                const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
                const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
                const htmlTitle = doc.querySelector('title')?.textContent;
                const title = ogTitle || twitterTitle || htmlTitle || new URL(url).hostname;
                
                // Extract description
                const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
                const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
                const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
                const description = ogDescription || twitterDescription || metaDescription || "External link";
                
                // Extract image
                const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
                const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
                let image = ogImage || twitterImage || null;
                
                // Make image URL absolute if it's relative
                if (image && !image.startsWith('http')) {
                  try {
                    const baseUrl = new URL(url);
                    image = new URL(image, baseUrl.origin).href;
                  } catch (e) {
                    image = null;
                  }
                }
                
                console.log(`OGP extracted for ${url} via proxy ${i + 1}:`, { title, description, image });
                
                setCardMetadata({
                  url: url,
                  title: title.trim(),
                  description: description.trim(),
                  image: image,
                });
                
                return; // Success, exit the loop
              }
            }
          } catch (error) {
            console.warn(`Proxy ${i + 1} failed for ${url}:`, error);
            // Continue to next proxy
          }
        }
        
        // All proxies failed, use fallback
        console.warn(`All proxies failed for ${url}`);
        setCardMetadata({
          url: url,
          title: new URL(url).hostname,
          description: "External link",
          image: null,
        });
      };
      
      fetchMetadata();
    }
  }, [metadata, url, title, description, image]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 mt-8 mb-8 rounded shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // metadataが未定義の場合、何も表示しない
  if (!cardMetadata || !cardMetadata.url) {
    return null;
  }

  if (size === "large") {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 mt-8 mb-8 rounded shadow-md">
        <a
          className="block"
          href={cardMetadata.url}
          target="_blank"
          rel="noreferrer"
        >
          {cardMetadata.image && cardMetadata.title && (
            <img
              className="w-full rounded-t"
              src={cardMetadata.image}
              alt={cardMetadata.title}
            />
          )}
          <div className="p-2">
            <div className="text-gray-900 text-xl font-bold dark:text-gray-300">
              {cardMetadata.title}
            </div>
            <p className="text-sm text-gray-600  mt-1 mb-2 dark:text-gray-400">
              {cardMetadata.description}
            </p>
            <span>{new URL(cardMetadata.url).hostname}</span>
          </div>
        </a>
      </div>
    );
  } else if (size === "small") {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 mt-8 mb-8 rounded shadow-md flex items-center">
        <div className="flex-grow max-w-3/4">
          {" "}
          {/* max-w-xl を追加 */}
          <a
            className="block"
            href={cardMetadata.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-gray-900 text-xl font-bold dark:text-gray-300">
              {cardMetadata.title}
            </div>
            <p className="text-sm text-gray-600 mt-1 mb-2 dark:text-gray-400 ">
              {cardMetadata.description}
            </p>
            <span>{new URL(cardMetadata.url).hostname}</span>
          </a>
        </div>
        {cardMetadata.image && cardMetadata.title && (
          <div className="max-w-1/4">
            <a href={cardMetadata.url} target="_blank" rel="noreferrer">
              <img
                className="rounded"
                src={cardMetadata.image}
                alt={cardMetadata.title}
              />
            </a>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default LinkCard;
