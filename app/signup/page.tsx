"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // From your Django URLconf, the registration endpoint is /api/accounts/registration/
      const res = await fetch(
        "http://159.89.44.197:8000/api/accounts/registration/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Adjust field names to match Django's expected format
            // Django typically uses 'username' instead of 'name'
            username: user.name,
            email: user.email,
            password1: user.password, // Django-allauth typically uses password1/password2
            password2: user.password, // For confirmation
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        // Handle different error formats
        if (errorData && typeof errorData === "object") {
          // Format error messages from different fields
          const errorMessages = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("\n");
          setError(errorMessages);
        } else {
          setError("Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success - redirect to signin page
      router.push("/signin");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Connection error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 flex justify-center items-center p-4">
      {/* Subtle background noise texture */}
      <div
        className="absolute inset-0 opacity-5 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Background gradient blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-0 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 mb-6">
              Join ReadyToConnect and discover your perfect internship
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 whitespace-pre-line"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
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
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-xs">
          By signing up, you agree to our{" "}
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
