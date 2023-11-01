import {
  getCategoriesPagePaths,
  getListData,
  getBasicContent,
} from "../../api/get-posts-category";
import { FrameTemplate } from "../../../components/frame-template";
import PageList from "../../../components/page-list";
import { PostLists, PageNationProps } from "../../../utils/posts-type";
import Pagination from "../../../components/pagination"; // 実際のパスはあなたのプロジェクト構成に基づいて調整してください
import Sidebar from "../../../components/sidebar";

// Fetch data and generate static paths with getStaticPaths
export async function getStaticPaths() {
  const paths = await getCategoriesPagePaths();

  return { paths, fallback: false };
}

// Fetch data and generate static pages with getStaticProps

export async function getStaticProps(context: {
  params: { category: string; number: string };
}) {
  const category = context.params?.category;
  const page = context.params?.number ? parseInt(context.params?.number) : null;

  if (!category || !page) return { notFound: true };

  const allPosts: PostLists = (await getListData(category)) as PostLists;
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const posts = allPosts.posts.slice(start, end);

  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: {
      posts: posts,
      title: category,
      page: page,
      totalPages: Math.ceil(allPosts.posts.length / itemsPerPage),
      newPosts,
      recommendPosts,
    },
  };
}

// Render the CategoryPage component
export default function CategoryPage({
  posts,
  title,
  page,
  totalPages,
  newPosts,
  recommendPosts,
}: PageNationProps & { newPosts: PostLists; recommendPosts: PostLists }) {
  return (
    <FrameTemplate
      leftComponent={
        <div>
          <PageList title={title} posts={posts} />
          <Pagination
            link={`${title}/page`}
            page={page}
            totalPages={totalPages}
          />
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
