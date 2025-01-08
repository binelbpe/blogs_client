import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { useFormValidation } from "@/hooks/useFormValidation";
import { handleAPIError } from "@/utils/errorHandler";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { validateForm } = useFormValidation();

  const validationRules = {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      const response = await api.post("/auth/register", formData);
      const { data } = response.data;

      // Pass all three required arguments
      login(data.accessToken, data.refreshToken, data.user);

      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (error) {
      const apiError = handleAPIError(error);
      if (apiError.errors) {
        setErrors(apiError.errors);
      }
      toast.error(apiError.message);
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

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join our community and start sharing</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={getInputClassName("username")}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={getInputClassName("email")}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={getInputClassName("password")}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Password must contain at least 6 characters, including
                uppercase, lowercase, and numbers
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-primary text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center
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
                  Creating Account...
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
