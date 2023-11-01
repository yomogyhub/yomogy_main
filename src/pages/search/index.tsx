import { useState, useEffect } from "react";
import Script from "next/script";
import { FrameTemplate } from "../../components/frame-template";
import Sidebar from "../../components/sidebar";
import { getBasicContent } from "../api/get-posts-category";
import { PostLists } from "../../utils/posts-type";

export async function getStaticProps() {
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: { newPosts, recommendPosts },
  };
}

export default function SearchResults({
  newPosts,
  recommendPosts,
}: {
  newPosts: PostLists;
  recommendPosts: PostLists;
}) {
  const [query, setQuery] = useState<string | null>(null);

  // クライアントサイドでURLのクエリを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setQuery(urlParams.get("q"));
  }, []);

  const title = query ? `"${query}" の検索結果` : "検索結果";

  return (
    <FrameTemplate
      leftComponent={
        <div>
          <h1 className="text-4xl mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            {title}
          </h1>
          <Script async src={process.env.SEARCH_BASE_URL}></Script>
          <div className="gcse-searchresults-only"></div>
        </div>
      }
      rightComponent={
        <>
          <Sidebar title={newPosts.title} relatedPosts={newPosts.posts} />
          <Sidebar
            title={recommendPosts.title}
            relatedPosts={recommendPosts.posts}
          />
        </>
      }
    />
  );
}
