interface MediaCardProps {
  mediaType: "image" | "video";
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

  return (
    <div style={{ width: "100%", height: "auto", margin: "3em 0" }}>
      {mediaType === "image" ? (
        <img src={fixSrc} alt={alt} />
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
