import { AuthorData } from "../utils/posts-type";

type AuthorDetailsProps = {
  author: AuthorData;
};

export const AuthorDetails: React.FC<AuthorDetailsProps> = ({ author }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={author.image}
          alt={author.name}
          className="w-16 h-16 rounded-full border-2 border-black-500 dark:border-white-300"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {author.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {author.description}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <a
          href={author.twitter}
          className="text-blue-500 hover:text-blue-400 dark:hover:text-blue-600 hover:underline"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};
