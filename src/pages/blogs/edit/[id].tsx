import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { withAuth } from "@/middleware/withAuth";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { Blog } from "@/types";
import { useFormValidation } from "@/hooks/useFormValidation";

function EditBlog() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const { validateForm } = useFormValidation();

  const validationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    content: {
      required: true,
      minLength: 50,
      maxLength: 5000,
    },
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      const blog: Blog = response.data;
      setFormData({
        title: blog.title,
        content: blog.content,
      });
      setIsLoading(false);
    } catch (error: any) {
      toast.error("Failed to fetch blog");
      router.push("/dashboard");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/blogs/${id}`, formData);
      toast.success("Blog updated successfully");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update blog");
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string) => `
    w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
    ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-primary focus:ring-primary/20"
    }
  `;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Edit Blog</h1>
          <p className="text-gray-600">Update your blog post content</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-xl p-6 shadow-sm"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={getInputClassName("title")}
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Title should be between 3 and 100 characters
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`${getInputClassName("content")} resize-none h-64`}
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
            <div className="mt-1 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Minimum 50 characters required
              </p>
              <p className="text-sm text-gray-500">
                {formData.content.length}/5000 characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-primary text-white rounded-lg transition-all duration-200 flex items-center
                ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-primary/90"
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default withAuth(EditBlog);
