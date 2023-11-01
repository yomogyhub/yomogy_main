export interface MediaMetadata {
  mediaType: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
}

export async function fetchMediaMetadata(url: string): Promise<MediaMetadata> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    const isVideo = contentType.startsWith("video/");
    const isImage = contentType.startsWith("image/");

    if (isImage) {
      return {
        mediaType: "image",
        src: url,
        alt: "", // Placeholder alt. This can be improved.
        caption: "", // Placeholder caption. This can be improved.
      };
    } else if (isVideo) {
      return {
        mediaType: "video",
        src: url,
        alt: `お使いのブラウザは動画をサポートしていません。元動画 : ${url}`,
        caption: "", // Placeholder caption. This can be improved.
      };
    } else {
      throw new Error(`Unsupported media type: ${contentType}`);
    }
  } catch (error) {
    throw new Error(`Failed to fetch media metadata for ${url}`);
  }
}

export async function processMDXContentForMediaCard(
  originalContent: string
): Promise<string> {
  let processedContent = originalContent;

  const mediaCardPattern = /<MediaCard src="([^"]+)"/g;

  let match;
  while ((match = mediaCardPattern.exec(originalContent)) !== null) {
    const url = match[1];
    const metadata = await fetchMediaMetadata(url);

    // Replace the original <MediaCard> tag with the new tag with metadata.
    const replacement = `<MediaCard mediaType="${metadata.mediaType}" src="${metadata.src}" alt="${metadata.alt}" caption="${metadata.caption}"`;
    processedContent = processedContent.replace(match[0], replacement);
  }

  return processedContent;
}
