import Link from "next/link";
import { SidebarProps } from "../utils/posts-type";
import AdComponent from "../components/ad";

const Sidebar: React.FC<SidebarProps> = ({ title, relatedPosts }) => {
  return (
    <div>
      <div className="w-full md:w-100 p-2 md:p-4 mb-4 bg-white dark:bg-gray-900 rounded shadow-lg">
        <div className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">
          {title}
        </div>
        <ul>
          {relatedPosts.map((post) => (
            <li key={post.id} className="mb-4">
              <Link href={`/${post.category}/${post.id}`}>
                <div className="block p-4 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer shadow">
                  <div className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-300">
                    {post.title}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>{post.category}</span>
                    <span>{post.updatedAt}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="mt-8 pt-8">
        <AdComponent />
      </div> */}
    </div>
  );
};

export default Sidebar;
