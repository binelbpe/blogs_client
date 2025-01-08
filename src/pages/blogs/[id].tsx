import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import { Blog } from "@/types";
import toast from "react-hot-toast";

const BlogView: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (error: any) {
      toast.error("Failed to fetch blog");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!blog) return null;

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Author Info */}
        <div className="flex items-center mb-8">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {typeof blog.author === "object"
              ? blog.author.username.charAt(0).toUpperCase()
              : "U"}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-gray-900">
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-blue-500"
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
                className="w-4 h-4 mr-1 text-blue-500"
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
    </Layout>
  );
};

export default BlogView;
