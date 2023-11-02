import Link from "next/link";
import { AuthorData } from "../utils/posts-type";

type AuthorDetailsProps = {
  author: AuthorData;
};

export const AuthorDetails: React.FC<AuthorDetailsProps> = ({ author }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-6">
        <img
          src={author.image}
          alt={author.name}
          className="w-20 h-20 rounded-full border-2 border-black-500 dark:border-white-300 hover:border-blue-500 transition-all duration-300"
        />
        <div className="space-y-4">
          <div>
            <div>
              <span className="p-0 text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-all duration-300">
                {author.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                {author.description}
              </span>
            </div>
          </div>
          <div className="flex space-x-4">
            <span className="link_a hover:underline transition-all duration-300">
              <a href={author.twitter}>X (Twitter)</a>
            </span>
            <span className="link_a hover:underline transition-all duration-300">
              <Link href={`/author/${author.name}/1`}>記事一覧</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
