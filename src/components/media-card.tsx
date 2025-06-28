import Image from "next/image";

interface MediaCardProps {
  mediaType?: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  mediaType,
  src,
  alt,
  caption,
}) => {
  // For static export, use relative paths
  const fixSrc = src.startsWith("https://yomogy.com/")
    ? src.replace("https://yomogy.com/", "/")
    : src;

  // Auto-detect media type if not provided
  const detectedMediaType = mediaType || (
    src.toLowerCase().includes('.mp4') || 
    src.toLowerCase().includes('.webm') || 
    src.toLowerCase().includes('.ogg')
      ? "video" 
      : "image"
  );

  return (
    <div style={{ width: "100%", height: "auto", margin: "3em 0" }}>
      {detectedMediaType === "image" ? (
        <Image 
          src={fixSrc} 
          alt={alt}
          width={800}
          height={600}
          style={{ width: "100%", height: "auto" }}
          unoptimized
        />
      ) : (
        <video controls>
          <source src={fixSrc} type="video/mp4" />
          {alt}
        </video>
      )}
      <figcaption
        style={{
          display: "flex",
          justifyContent: "center",
          fontStyle: "italic",
        }}
      >
        {caption}
      </figcaption>
    </div>
  );
};

export default MediaCard;
