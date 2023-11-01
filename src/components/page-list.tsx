// src/app/[category]/pagelink.tsx
import Link from "next/link";
import { PostLists } from "../utils/posts-type";
import Image from "next/image";

const PageList: React.FC<PostLists> = ({ title, posts }) => (
  <div>
    <h1 className="text-4xl mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
      {title.toUpperCase()}
    </h1>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="bg-white dark:bg-gray-900 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out lg:w-[90%] w-full mx-auto"
        >
          <Link href={`/${post.category}/${post.id}`} className="block h-full">
            <div className="relative w-full">
              <Image
                src={`${post.coverImage}`}
                alt={post.title}
                className="rounded-md object-cover h-full w-full"
                width={600}
                height={315}
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                {post.title}
              </h2>
              <ul className="flex flex-wrap mb-2">
                {post.tag.map((tag, index) => (
                  <li
                    key={index}
                    className="mr-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {post.updatedAt}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default PageList;
