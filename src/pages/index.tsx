import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import { Blog } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { handleAPIError } from "@/utils/errorHandler";

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const fetchBlogs = async (pageNum: number) => {
    try {
      const response = await api.get(`/blogs?page=${pageNum}&limit=10`);
      const { data } = response.data;

      if (!data) {
        throw new Error("No data received from server");
      }

      const { blogs: newBlogs, hasMore: more } = data;

      setBlogs((prev) => (pageNum === 1 ? newBlogs : [...prev, ...newBlogs]));
      setHasMore(more);
    } catch (error) {
      const apiError = handleAPIError(error);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize with first page
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

  // Set up intersection observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchBlogs(page);
    }
  }, [page]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-primary rounded-3xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Our Blog Community
          </h1>
          <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
            Discover stories, ideas, and insights from our community of writers.
          </p>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-primary mb-8">Latest Stories</h2>

        {loading && page === 1 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blogs available</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Card Header with Author Info */}
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {typeof blog.author === "object"
                        ? blog.author.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        {typeof blog.author === "object"
                          ? blog.author.username
                          : "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-6">
                    {blog.content}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/blogs/${blog._id}`}
                    className="inline-flex items-center text-primary hover:text-highlight transition-colors duration-200 font-medium group-hover:translate-x-2"
                  >
                    Read more
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-background border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        <div ref={loader} className="mt-8 text-center">
          {loading && page > 1 && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          )}
          {!hasMore && blogs.length > 0 && (
            <p className="text-gray-500">No more blogs to load</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
