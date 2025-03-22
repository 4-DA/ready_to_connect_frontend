"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

// Define a User interface to match the expected data structure
interface User {
  pk: number;
  email: string;
  full_name: string;
  streak: number;
  xp: number;
  level: number;
  badge?: number;
  profile_picture?: string;
  user_type: string;
  [key: string]: any; // Allow for additional properties
}

export default function Signin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Updated API endpoint (without trailing slash to ensure consistency)
      const response = await axios.post(
        "https://readytoconnect.panemtech.com/api/accounts/login/",
        credentials,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Access the data directly from response.data
      const data = response.data;

      // Store tokens
      if (data.access) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
      }

      // Store full user data
      if (data.user) {
        // Ensure all important fields are preserved
        const userToStore: User = {
          pk: data.user.pk,
          email: data.user.email,
          full_name: data.user.full_name,
          streak: data.user.streak,
          xp: data.user.xp,
          level: data.user.level,
          badge: data.user.badge,
          profile_picture: data.user.profile_picture,
          user_type: data.user.user_type,
        };

        localStorage.setItem("user", JSON.stringify(userToStore));

        // Log for debugging
        console.log("Stored user data:", userToStore);
      }

      // Add a small delay before navigation to ensure data is stored
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error) {
      // Type guard for AxiosError
      const err = error as AxiosError<{ detail?: string }>;

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(
          err.response.data?.detail ||
            "Login failed. Please check your credentials."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Connection error. Please try again later.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Demo login function to fill in credentials with demo account
  const handleDemoLogin = () => {
    setCredentials({
      email: "demo@readytoconnect.com",
      password: "demopassword123",
    });
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
          {/* Logo and Header */}
          <div className="text-center pt-8 px-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold">R</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2 mb-6">
              Sign in to your ReadyToConnect account
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm"
              >
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>{error}</div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-white/5 border-white/10 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-400"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white/5 text-sm text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 focus:outline-none transition-all flex items-center justify-center"
              >
                Demo Account
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
