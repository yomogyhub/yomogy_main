import Link from "next/link";

interface PaginationProps {
  link: string;
  page: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ link, page, totalPages }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {/* Previous Button */}
      {page > 1 && (
        <Link href={`/${link}/${page - 1}`}>
          <span className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 cursor-pointer">
            Previous
          </span>
        </Link>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Link href={`/${link}/${pageNumber}`} key={pageNumber}>
          <span
            className={`px-2 py-1 border rounded-md ${
              page === pageNumber
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            }`}
          >
            {pageNumber}
          </span>
        </Link>
      ))}

      {/* Next Button */}
      {page < totalPages && (
        <Link href={`/${link}/${page + 1}`}>
          <span className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 cursor-pointer">
            Next
          </span>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
