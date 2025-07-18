import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import {
  getPostsPaths,
  getData,
  getAdjacentPosts,
  getListData,
  getAuthorDetails,
} from "../../lib/posts";
import { Category, PostID, BlogPostProps } from "../../utils/posts-type";
import {
  processMDXContent,
  extractOGPMetadata,
} from "../../utils/mdx-link-card";
import { processMDXContentForMediaCard } from "../../utils/mdx-media-card";

import Seo from "../../components/seo";
import { FrameTemplate } from "../../components/frame-template";
import BlogPost from "../../components/blog-post";
import Sidebar from "../../components/sidebar";

import remarkPrism from "remark-prism";
import rehypePrism from "rehype-prism";
import remarkGfm from "remark-gfm";

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

  const listDataResult =
    blogPostProps.data &&
    blogPostProps.data.tag &&
    blogPostProps.data.tag.length > 0
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

  // Read MDX file directly in getStaticProps
  let mdxSource = null;
  let ogpMetadata = {};

  try {
    // Use the path from JSON instead of constructing from author
    const relativePath =
      blogPostProps.data?.path ||
      `/posts/blog/${blogPostProps.data?.author}/${params.id}`;
    const filePath = path.join(process.cwd(), `${relativePath}.mdx`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { content } = matter(fileContents);

    // Process MDX content and extract OGP metadata
    const processedContent = await processMDXContent(content);
    ogpMetadata = await extractOGPMetadata(content);

    mdxSource = processedContent
      ? await serialize(processedContent, {
          mdxOptions: {
            remarkPlugins: [remarkGfm as any, remarkPrism as any],
            rehypePlugins: [rehypePrism as any],
          },
        })
      : null;
  } catch (error) {
    console.error(`Error reading MDX file for ${params.id}:`, error);
    return { notFound: true };
  }

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
      ogpMetadata: ogpMetadata,
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
  ogpMetadata,
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
            ogpMetadata={ogpMetadata}
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
