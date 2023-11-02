import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { format } from "date-fns";
import { BlogPostOnlyProps } from "../utils/posts-type";
import { AuthorDetails } from "./author";
import ShareButtons from "../components/share-buttons";
import LinkCard from "../components/link-card";
import SNSCard from "../components/sns-card";
import MediaCard from "../components/media-card";
import AdComponent from "../components/ad";
import tocbot from "tocbot";
import React, { useEffect } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const BlogPost: React.FC<BlogPostOnlyProps> = ({
  content,
  data,
  author,
  id,
  adjacentPosts,
  path,
}) => {
  useEffect(() => {
    const initTocbot = () => {
      tocbot.init({
        tocSelector: ".toc",
        contentSelector: ".mdx-content",
        headingSelector: "h2, h3",
      });
    };

    initTocbot();

    const handleCustomEvent = () => {
      tocbot.destroy();
      initTocbot();
    };

    window.addEventListener("customNavigationEvent", handleCustomEvent);

    const handleRouteChange = () => {
      const event = new Event("customNavigationEvent");
      window.dispatchEvent(event);
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      tocbot.destroy();
      window.removeEventListener("customNavigationEvent", handleCustomEvent);
      Router.events.off("routeChangeComplete", handleRouteChange); // イベントリスナーの解除
    };
  }, []);

  return (
    <div className="blog_main bg-white dark:bg-gray-900 p-4 lg:p-8 max-w-6xl mx-auto w-full max-w-full">
      <div className="flex items-center space-x-2">
        <span className="text-gray-800 dark:text-gray-200 p-0">
          {"Home > "}
        </span>
        <Link href={`/${data.category}/page/1`} className="hover:underline">
          {data.category}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {data.title}
      </h1>
      <div className="flex items-center mb-4 space-x-4">
        <span className="link_a hover:underline ">
          <Link href={`/author/${data.author}/1`}>{data.author}</Link>
        </span>
        <time
          dateTime={format(new Date(data.updatedAt), "yyyy-MM-dd")}
          itemProp="dateModified"
          className="text-gray-600 dark:text-gray-400"
        >
          {format(new Date(data.updatedAt), "yyyy年MM月dd日")}
        </time>
        <time
          dateTime={format(new Date(data.publishedAt), "yyyy-MM-dd")}
          itemProp="datePublished"
          className="block text-gray-600 mb-4"
        ></time>
      </div>

      <div className="my-4">
        {data.tag.map((name, index) => (
          <span key={index} className="mr-2 inline-block">
            <Link
              href={`/${data.category}/tag/${name}/1`}
              className="border border-gray-500 hover:underline dark:border-gray-200  px-3 py-1 rounded-full"
            >
              # {name}
            </Link>
          </span>
        ))}
      </div>

      {/* repost の表示 */}
      {data.rePost && data.rePost.slice(0, 5) === "https" && (
        <div className="link_a repost-section bg-gray-100 dark:bg-gray-800 p-2 mb-4 rounded-md shadow">
          Repost (Approved) :{" "}
          <a
            href={data.rePost}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Original Post
          </a>
        </div>
      )}
      <div className="link_a text-gray-800 dark:text-gray-300 pt-2 mb-4">
        <p>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {data.description}
          </ReactMarkdown>
        </p>
      </div>

      <div className="link_a bg-white dark:bg-gray-700 p-4 rounded shadow-md mb-4 divide-y divide-gray-300 dark:divide-gray-600">
        <p className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200">
          目次
        </p>
        <div className="toc pl-4"></div>
      </div>

      <div className="mdx-content link_a pb-20">
        <MDXRemote {...content} components={{ LinkCard, SNSCard, MediaCard }} />
      </div>

      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="align-items">
          <ShareButtons
            url={`${process.env.BASE_URL}/${data.category}/${id}`}
            title={data.title}
            summary="@Yomogy"
          />
        </div>
        <a
          className="flex items-center px-4 py-2 bg-transparent border border-gray-300 shadow-md rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          rel="noopener noreferrer"
          target="_blank"
          href={`${process.env.GITHUB_POST_BASE_URL}/${path}.mdx`}
        >
          <span className="mr-2">
            <svg
              x="0px"
              y="0px"
              viewBox="0 0 27 27"
              xmlSpace="preserve"
              height="20"
              width="20"
            >
              <path
                fill="currentColor"
                d="M13.4,1.2C7,1,1.8,6,1.7,12.4c0,0.1,0,0.4,0,0.5c0,5.1,3.2,9.8,8.2,11.5c0.6,0.1,0.7-0.2,0.7-0.6s0-1.8,0-2.9 c0,0-3.3,0.6-4-1.5c0,0-0.6-1.3-1.3-1.8c0,0-1.1-0.7,0.1-0.7c0.7,0.1,1.5,0.6,1.8,1.2c0.6,1.2,2.2,1.7,3.4,1h0.1 c0.1-0.6,0.4-1.2,0.7-1.6C8.7,17.1,6,16.9,6,12.3c0-1.1,0.5-2.1,1.2-2.8c0-1.1,0-2.2,0.3-3.2c1-0.4,3.3,1.3,3.3,1.3c2-0.6,4-0.6,6,0 c0,0,2.2-1.6,3.2-1.2c0.5,1,0.5,2.2,0.1,3.2c0.7,0.7,1.2,1.8,1.2,2.8c0,4.5-2.8,5-5.5,5.2c0.6,0.6,0.9,1.3,0.7,2.2c0,1.7,0,3.5,0,4 s0.2,0.6,0.7,0.6c4.9-1.7,8.2-6.2,8-11.5c0.1-6.4-5.1-11.6-11.6-11.6C13.5,1.2,13.4,1.2,13.4,1.2z"
              ></path>
            </svg>
          </span>
          GitHubで編集を提案
        </a>
      </div>

      {/* 前後の記事 */}
      <div className="w-full flex justify-between mt-8 mb-8 my-4 p-4 border-t border-b border-gray-400 dark:border-gray-200">
        <div className="w-full flex flex-col items-start pr-4">
          {adjacentPosts.afterAdjacentPost ? (
            <>
              <Link
                className="w-full flex"
                href={`/${adjacentPosts.afterAdjacentPost.category}/${adjacentPosts.afterAdjacentPost.id}`}
              >
                <div className="w-full flex items-center justify-start">
                  <div>
                    <svg
                      width="24"
                      height="24"
                      className="text-gray-400 dark:text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>

                  <div>
                    <p className="font-medium text-sm text-gray-400 dark:text-gray-300">
                      次の記事
                    </p>
                    <p className="dark:text-gray-300 text-right">
                      {adjacentPosts.afterAdjacentPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="w-2% border-r"></div>

        <div className="w-full flex flex-col items-end pl-4">
          {adjacentPosts.beforeAdjacentPost ? (
            <>
              <Link
                className="w-full flex"
                href={`/${adjacentPosts.beforeAdjacentPost.category}/${adjacentPosts.beforeAdjacentPost.id}`}
              >
                <div className="w-full flex items-center justify-end">
                  <div>
                    <p className="font-medium text-sm text-gray-400 dark:text-gray-300">
                      前の記事
                    </p>
                    <p className="dark:text-gray-300 text-right">
                      {adjacentPosts.beforeAdjacentPost.title}
                    </p>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      className="text-gray-400 dark:text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <AuthorDetails author={author} />
    </div>
  );
};

export default BlogPost;
