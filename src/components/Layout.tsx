import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-accent transition-colors"
            >
              Blog Management
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-white">Welcome, {user?.username}!</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg bg-secondary text-primary hover:bg-accent transition-all duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-highlight text-white hover:bg-opacity-90 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg bg-secondary text-primary hover:bg-accent transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-highlight text-white hover:bg-opacity-90 transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-primary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white">
              © {new Date().getFullYear()} Blog Management. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/about"
                className="text-white hover:text-accent transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-white hover:text-accent transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-white hover:text-accent transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
