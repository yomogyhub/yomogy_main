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
      
      // Fetch metadata from pre-built static OGP data
      const fetchMetadata = async () => {
        try {
          // Try to load from static OGP metadata file
          const response = await fetch('/ogp-metadata.json');
          
          if (response.ok) {
            const ogpData = await response.json();
            
            if (ogpData[url]) {
              const metadata = ogpData[url];
              setCardMetadata({
                url: url,
                title: metadata.title,
                description: metadata.description || "External link",
                image: metadata.image,
              });
              return;
            }
          }
        } catch (error) {
          console.warn('Failed to load static OGP data:', error);
        }
        
        // Fallback to basic metadata if not found in static data
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
