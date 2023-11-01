import Link from "next/link";
import {
  getAllCategoryTagsPath,
  getListData,
  getBasicContent,
} from "../../../api/get-posts-category";
import PageList from "../../../../components/page-list";
import {
  PostLists,
  Category,
  Tag,
  PageNationProps,
} from "../../../../utils/posts-type";

import { FrameTemplate } from "../../../../components/frame-template";
import Pagination from "../../../../components/pagination"; // 実際のパスはあなたのプロジェクト構成に基づいて調整してください
import Sidebar from "../../../../components/sidebar";

export async function getStaticPaths() {
  const paths = await getAllCategoryTagsPath();
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: Category & Tag & { number: string };
}) {
  if (!params.category || !params.tag) return { notFound: true };
  const allPosts: PostLists = (await getListData(
    params.category,
    params.tag
  )) as PostLists;

  const page = params.number ? parseInt(params.number) : 1;
  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const posts = allPosts.posts.slice(start, end);
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: {
      title: params.tag,
      posts: posts,
      page: page,
      totalPages: Math.ceil(allPosts.posts.length / itemsPerPage),
      newPosts,
      recommendPosts,
    },
  };
}

export default function TagPage({
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
          <PageList title={`#${title}`} posts={posts} />
          <Pagination
            link={`${posts[0].category}/tag/${title}`}
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
