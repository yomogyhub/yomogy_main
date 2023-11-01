import React from "react";

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

interface LinkCardProps {
  metadata: Metadata;
  size: "small" | "large";
}

const LinkCard: React.FC<LinkCardProps> = ({ metadata, size = "small" }) => {
  // metadataが未定義の場合、何も表示しない
  if (!metadata || !metadata.url) {
    return null;
  }

  if (size === "large") {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 mt-8 mb-8 rounded shadow-md">
        <a
          className="block"
          href={metadata.url}
          target="_blank"
          rel="noreferrer"
        >
          {metadata.image && metadata.title && (
            <img
              className="w-full rounded-t"
              src={metadata.image}
              alt={metadata.title}
            />
          )}
          <div className="p-2">
            <div className="text-gray-900 text-xl font-bold dark:text-gray-300">
              {metadata.title}
            </div>
            <p className="text-sm text-gray-600  mt-1 mb-2 dark:text-gray-400">
              {metadata.description}
            </p>
            <span>{new URL(metadata.url).hostname}</span>
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
            href={metadata.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-gray-900 text-xl font-bold dark:text-gray-300">
              {metadata.title}
            </div>
            <p className="text-sm text-gray-600 mt-1 mb-2 dark:text-gray-400 ">
              {metadata.description}
            </p>
            <span>{new URL(metadata.url).hostname}</span>
          </a>
        </div>
        {metadata.image && metadata.title && (
          <div className="max-w-1/4">
            <a href={metadata.url} target="_blank" rel="noreferrer">
              <img
                className="rounded"
                src={metadata.image}
                alt={metadata.title}
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
