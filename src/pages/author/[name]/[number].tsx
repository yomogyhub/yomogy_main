import Link from "next/link";
import {
  getAllAuthorPath,
  getPostsByAuthor,
  getBasicContent,
} from "../../api/get-posts-category";
import PageList from "../../../components/page-list";
import { PageNationProps, PostLists } from "../../../utils/posts-type";
import Sidebar from "../../../components/sidebar";
import { FrameTemplate } from "../../../components/frame-template";
import Pagination from "../../../components/pagination"; // 実際のパスはあなたのプロジェクト構成に基づいて調整してください

// Fetch data and generate static paths with getStaticPaths
export async function getStaticPaths() {
  const paths = await getAllAuthorPath();
  return { paths: paths, fallback: false };
}

// Fetch data and generate static pages with getStaticProps
export async function getStaticProps(context: {
  params: { name: string; number: string };
}) {
  const name = context.params?.name;
  const page = context.params?.number ? parseInt(context.params?.number) : null;

  if (!name || !page) return { notFound: true };

  const allPosts: PostLists = (await getPostsByAuthor(name)) as PostLists;
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const posts = allPosts.posts.slice(start, end);

  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: {
      title: name,
      posts: posts,
      page: page,
      totalPages: Math.ceil(posts.length / itemsPerPage),
      newPosts,
      recommendPosts,
    },
  };
}

// Render the AuthorPage component
export default function AuthorPage({
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
            link={`author/${title}`}
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
