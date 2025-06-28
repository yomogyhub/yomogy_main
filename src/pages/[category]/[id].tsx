import { serialize } from "next-mdx-remote/serialize";
import {
  getPostsPaths,
  getData,
  getAdjacentPosts,
  getListData,
  getAuthorDetails,
} from "../api/get-posts-category";
import { Category, PostID, BlogPostProps } from "../../utils/posts-type";
import { processMDXContent } from "../../utils/mdx-link-card";
import { processMDXContentForMediaCard } from "../../utils/mdx-media-card";

import Seo from "../../components/seo";
import { FrameTemplate } from "../../components/frame-template";
import BlogPost from "../../components/blog-post";
import Sidebar from "../../components/sidebar";

import remarkPrism from "remark-prism";
import rehypePrism from "rehype-prism";

export async function getStaticPaths() {
  const paths = await getPostsPaths();
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: Category & PostID;
}) {
  const blogPostProps = await getData(params);
  if ("notFound" in blogPostProps && blogPostProps.notFound) {
    return { notFound: true };
  }

  // Check if blogPostProps.data exists before referencing it
  const authorDetails = blogPostProps.data
    ? getAuthorDetails(blogPostProps.data.author)
    : null;

  const listDataResult = blogPostProps.data
    ? await getListData(params.category, blogPostProps.data.tag[0])
    : await getListData(params.category);

  const relatedPosts = "posts" in listDataResult ? listDataResult.posts : [];

  // Check if data.id is undefined, and if so, replace it with empty string
  if (blogPostProps.data && blogPostProps.data.id === undefined) {
    (blogPostProps.data as any).id = params.id;
    blogPostProps.data.coverImage = blogPostProps.coverImage ?? null;
  }

  // 前後の記事を取得
  const adjacentPosts = await getAdjacentPosts(params.id);

  // mdx
  const processedContent1 = await processMDXContent(
    blogPostProps.content ?? ""
  ); // for link card. コードブロックの中も除外できないので注意
  const processedContent = await processMDXContentForMediaCard(
    processedContent1
  ); // for media card.

  const mdxSource = processedContent
    ? await serialize(processedContent, {
        mdxOptions: {
          remarkPlugins: [remarkPrism as any],
          rehypePlugins: [rehypePrism as any],
        },
      })
    : null;
  return {
    props: {
      ...blogPostProps,
      content: mdxSource,
      relatedPosts,
      author: authorDetails,
      id: params.id,
      adjacentPosts: adjacentPosts,
      coverImage: blogPostProps.coverImage,
      path: blogPostProps.path,
    },
  };
}

const BlogPostPage: React.FC<BlogPostProps> = ({
  data,
  content,
  relatedPosts,
  author,
  id,
  adjacentPosts,
  path,
}) => {
  return (
    <>
      <Seo
        pageTitle={data.title}
        pageDescription={data.description}
        pagePath={`${process.env.BASE_URL}/${data.category}/${id}`}
        pageImg={`${process.env.BASE_URL}${data.coverImage}`}
      />
      <FrameTemplate
        leftComponent={
          <BlogPost
            content={content}
            data={data}
            author={author}
            id={id}
            adjacentPosts={adjacentPosts}
            path={path}
          />
        }
        rightComponent={
          <Sidebar title={"Related Posts"} relatedPosts={relatedPosts} />
        }
      />
    </>
  );
};

export default BlogPostPage;
