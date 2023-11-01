import React from "react";
import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  TwitterEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";

interface SNSCardProps {
  url: string;
}

const getPlatformFromUrl = (
  url: string
):
  | "facebook"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "tiktok"
  | "twitter"
  | "youtube"
  | null => {
  const hostname = new URL(url).hostname;

  if (hostname.includes("facebook")) return "facebook";
  if (hostname.includes("instagram")) return "instagram";
  if (hostname.includes("linkedin")) return "linkedin";
  if (hostname.includes("pinterest")) return "pinterest";
  if (hostname.includes("tiktok")) return "tiktok";
  if (hostname.includes("twitter") || hostname.includes("x.com"))
    return "twitter";
  if (hostname.includes("youtube")) return "youtube";

  return null;
};

const socialEmbeds = {
  facebook: FacebookEmbed,
  instagram: InstagramEmbed,
  linkedin: LinkedInEmbed,
  pinterest: PinterestEmbed,
  tiktok: TikTokEmbed,
  twitter: TwitterEmbed,
  youtube: YouTubeEmbed,
};

const SNSCard: React.FC<SNSCardProps> = ({ url }) => {
  const platform = getPlatformFromUrl(url);

  if (!platform) {
    return <p>Unsupported platform or invalid URL.</p>;
  }
  const EmbedComponent = socialEmbeds[platform];

  if (!EmbedComponent) {
    return <p>Unsupported platform or invalid URL.</p>;
  }

  return (
    <>
      <div className="flex justify-center max-w-full">
        <EmbedComponent url={url} />
      </div>
      {/* コンポーネントにスコープされたCSS */}
      <style jsx>{`
        .youtube-iframe {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .youtube-iframe iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default SNSCard;
