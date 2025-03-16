"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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

// API URL constant to ensure consistency
const API_BASE_URL = "https://readytoconnect.panemtech.com/api";

export default function Signin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token validity before auto-login
      verifyToken(token);
    }
  }, []);

  // Function to verify token validity
  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/accounts/verify-token/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Token is valid, redirect to home
        router.push("/");
      } else {
        // If verification endpoint doesn't exist or returns non-200
        // Clear potentially invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      // Token verification failed, clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      console.log("Token verification failed, removed old tokens");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First ensure there are no lingering previous auth data
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      // Make login request with retry logic
      const response = await loginWithRetry(credentials, 2);

      // Process successful login
      const data = response.data;

      // Store tokens
      if (data.access) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Store token creation time for potential expiry handling
        localStorage.setItem("token_created_at", Date.now().toString());
      } else {
        throw new Error("No access token received");
      }

      // Store full user data
      if (data.user) {
        // Ensure all important fields are preserved
        const userToStore: User = {
          pk: data.user.pk,
          email: data.user.email,
          full_name: data.user.full_name || "",
          streak: data.user.streak || 0,
          xp: data.user.xp || 0,
          level: data.user.level || 0,
          badge: data.user.badge,
          profile_picture: data.user.profile_picture,
          user_type: data.user.user_type || "user",
        };

        localStorage.setItem("user", JSON.stringify(userToStore));
        console.log("Login successful, stored user data");
      } else {
        throw new Error("No user data received");
      }

      // Ensure localStorage operations are complete before navigation
      await ensureLocalStorageUpdated("token", data.access);

      // Navigate to home page
      router.push("/");
    } catch (error) {
      // Enhanced error handling with more specific messages
      const err = error as AxiosError<{
        detail?: string;
        non_field_errors?: string[];
      }>;

      if (err.response) {
        // Handle specific API error responses
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (err.response.data?.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data?.non_field_errors?.length) {
          setError(err.response.data.non_field_errors[0]);
        } else {
          setError(`Login failed (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // Network or CORS issues
        setError("Network error. Please check your connection and try again.");
      } else if (err.message) {
        // Other errors with messages
        setError(`Error: ${err.message}`);
      } else {
        // Fallback error
        setError("Unknown error occurred. Please try again.");
      }

      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with retry functionality
  const loginWithRetry = async (
    credentials: { email: string; password: string },
    maxRetries: number
  ) => {
    let retries = 0;
    let lastError;

    while (retries <= maxRetries) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/accounts/login/`,
          credentials,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            timeout: 10000, // 10 second timeout
          }
        );
        return response;
      } catch (error) {
        lastError = error;
        const err = error as AxiosError;

        // Only retry on network errors or 5xx server errors
        if (!err.response || (err.response && err.response.status >= 500)) {
          retries++;
          // Wait before retry (exponential backoff)
          if (retries <= maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
            continue;
          }
        }
        // Don't retry for client errors (4xx)
        throw error;
      }
    }
    throw lastError;
  };

  // Ensure localStorage is updated
  const ensureLocalStorageUpdated = async (
    key: string,
    expectedValue: string
  ): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 5;
    const checkInterval = 20; // ms

    return new Promise((resolve, reject) => {
      const checkStorage = () => {
        const storedValue = localStorage.getItem(key);
        if (storedValue === expectedValue) {
          resolve();
        } else if (attempts >= maxAttempts) {
          // After max attempts, proceed anyway but log the issue
          console.warn(`LocalStorage update for ${key} could not be verified`);
          resolve();
        } else {
          attempts++;
          setTimeout(checkStorage, checkInterval);
        }
      };

      checkStorage();
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0e0e13] to-[#1a1a24]">
      <div className="w-full max-w-md px-8 py-10 mx-2 backdrop-blur-sm bg-[#1a1a22]/80 rounded-2xl shadow-xl border border-[#ffffff0f]">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">
            Sign in to your ReadyToConnect account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 whitespace-pre-line text-sm">
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
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    email: e.target.value.trim(),
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
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
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
                className="h-4 w-4 bg-[#2a2a35] border-[#3a3a45] rounded text-purple-500 focus:ring-purple-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-400"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1a22] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center"
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
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
