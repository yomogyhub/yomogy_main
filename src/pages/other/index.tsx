import Link from "next/link";
import { FrameTemplate } from "../../components/frame-template";
import Sidebar from "../../components/sidebar";
import { getBasicContent, getJsonAllList } from "../api/get-posts-category";
import { PostLists, ListCount } from "../../utils/posts-type";

export async function getStaticProps() {
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;
  const allListCount = await getJsonAllList();

  return {
    props: { newPosts, recommendPosts, allListCount },
  };
}

export default function Privacy({
  newPosts,
  recommendPosts,
  allListCount,
}: {
  newPosts: PostLists;
  recommendPosts: PostLists;
  allListCount: ListCount;
}) {
  return (
    <FrameTemplate
      leftComponent={
        <div>
          <h1 className="text-4xl mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            カテゴリー & タグ 一覧
          </h1>

          <div className="blog_main bg-white dark:bg-gray-900 p-4 lg:p-8 max-w-6xl mx-auto w-full max-w-full">
            <>
              {/* 以下の部分のみ動的に変更すると静的ページテンプレとして使用できる */}

              <div className="blog_main bg-white dark:bg-gray-900 p-4 lg:p-8 max-w-6xl mx-auto w-full">
                {Object.keys(allListCount.categories).map((category) => (
                  <div key={category} className="pb-6">
                    <div className="link_a">
                      <Link
                        href={`/${category}/page/1`}
                        className="text-xl font-bold mb-3"
                      >
                        {category.toUpperCase()}
                      </Link>
                    </div>
                    <div className="my-4">
                      {Object.keys(allListCount.categoryTags[category]).map(
                        (tag, index) => (
                          <span key={index} className="mr-2 inline-block">
                            <Link
                              href={`/${category}/tag/${tag}/1`}
                              className="border border-gray-500 hover:underline dark:border-gray-200 px-3 py-1 rounded-full"
                            >
                              # {tag}
                            </Link>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* ここまで */}
            </>
          </div>
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
