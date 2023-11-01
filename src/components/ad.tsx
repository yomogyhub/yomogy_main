import React, { useEffect } from "react";

const AdComponent: React.FC = () => {
  useEffect(() => {
    if (!(window as any).adsbygoogle.loaded) {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.GA_ADSENSE_ID} // この部分を適切なdata-ad-client値に置き換えてください
      data-ad-slot="6636616767" // この部分を適切なdata-ad-slot値に置き換えてください
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdComponent;
