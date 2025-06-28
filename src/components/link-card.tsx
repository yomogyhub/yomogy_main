import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useOGP } from "../contexts/OGPContext";

// Simple markdown link parser
const parseMarkdownLinks = (text: string) => {
  if (!text) return text;
  
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};

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
  const { metadata: ogpMetadata } = useOGP();
  const [cardMetadata, setCardMetadata] = useState<Metadata | null>(metadata || null);
  const [isLoading] = useState(false);

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

    // If URL is provided but no metadata, check OGP context first
    if (url && !metadata && title === undefined && description === undefined && image === undefined) {
      const ogpData = ogpMetadata[url];
      if (ogpData) {
        setCardMetadata(ogpData);
      } else {
        // Fallback to basic metadata
        setCardMetadata({
          url: url,
          title: new URL(url).hostname,
          description: "External link",
          image: null,
        });
      }
    }
  }, [metadata, url, title, description, image, ogpMetadata]);

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
            <Image
              className="w-full rounded-t"
              src={cardMetadata.image}
              alt={cardMetadata.title}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              unoptimized
            />
          )}
          <div className="p-2">
            <div className="text-gray-900 text-xl font-bold dark:text-gray-300">
              {cardMetadata.title}
            </div>
            <p 
              className="text-sm text-gray-600  mt-1 mb-2 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(cardMetadata.description || '') }}
            ></p>
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
            <p 
              className="text-sm text-gray-600 mt-1 mb-2 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(cardMetadata.description || '') }}
            ></p>
            <span>{new URL(cardMetadata.url).hostname}</span>
          </a>
        </div>
        {cardMetadata.image && cardMetadata.title && (
          <div className="max-w-1/4">
            <a href={cardMetadata.url} target="_blank" rel="noreferrer">
              <Image
                className="rounded"
                src={cardMetadata.image}
                alt={cardMetadata.title}
                width={0}
                height={0}
                sizes="25vw"
                style={{ width: "100%", height: "auto" }}
                unoptimized
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
