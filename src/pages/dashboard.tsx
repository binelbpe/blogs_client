import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { withAuth } from "@/middleware/withAuth";
import api from "@/utils/api";
import { Blog } from "@/types";
import toast from "react-hot-toast";
import { handleAPIError, getErrorMessage } from "@/utils/errorHandler";

function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const router = useRouter();

  const fetchBlogs = async (pageNum: number) => {
    try {
      const response = await api.get(
        `/blogs/user/my-blogs?page=${pageNum}&limit=10`
      );
      const { data } = response.data;

      if (!data) {
        throw new Error("No data received from server");
      }

      const { blogs: newBlogs, hasMore: more } = data;

      setBlogs((prev) => (pageNum === 1 ? newBlogs : [...prev, ...newBlogs]));
      setHasMore(more);
      setLoading(false);
    } catch (error) {
      const apiError = handleAPIError(error);
      toast.error(apiError.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

 
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

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

  useEffect(() => {
    if (page > 1) {
      fetchBlogs(page);
    }
  }, [page]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await api.delete(`/blogs/${id}`);
        toast.success(response.data.message);
        fetchBlogs(1); 
      } catch (error) {
        const apiError = handleAPIError(error);
        toast.error(apiError.message);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">My Blogs</h1>
            <p className="text-gray-600">
              Manage your blog posts and create new content
            </p>
          </div>
          <button
            onClick={() => router.push("/blogs/new")}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 shadow-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Blog
          </button>
        </div>

        {/* Blog List */}
        <div className="grid gap-6">
          {blogs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-secondary/20">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
              <p className="text-xl text-gray-600 mb-4">
                You haven't created any blogs yet.
              </p>
              <button
                onClick={() => router.push("/blogs/new")}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Create your first blog
              </button>
            </div>
          ) : (
            blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {blog.title}
                    </h2>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => router.push(`/blogs/edit/${blog._id}`)}
                        className="inline-flex items-center px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-accent transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="inline-flex items-center px-4 py-2 bg-highlight/10 text-highlight rounded-lg hover:bg-highlight hover:text-white transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {blog.content}
                  </p>
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
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
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
                      Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}

          {/* Loading indicator */}
          <div ref={loader} className="mt-8 text-center">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            )}
            {!hasMore && blogs.length > 0 && (
              <p className="text-gray-500">No more blogs to load</p>
            )}
            {!hasMore && blogs.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center border border-secondary/20">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                    />
                  </svg>
                </div>
                <p className="text-xl text-gray-600 mb-4">
                  You haven't created any blogs yet.
                </p>
                <button
                  onClick={() => router.push("/blogs/new")}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Create your first blog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Dashboard);
