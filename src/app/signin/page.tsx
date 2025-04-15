"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api"; // ✅ centralized axios instance

export default function Signin() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", user.email);

      // Remember the email for debugging purposes
      localStorage.setItem("last_login_email", user.email);

      const response = await api.post("/accounts/auth/login/", {
        email: user.email,
        password: user.password,
      });

      // Handle successful login
      const data = response.data;
      console.log("Login response:", data);

      // Store the access token
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      } else if (data.access) {
        localStorage.setItem("access_token", data.access);
      }

      // After successful login, simply redirect to dashboard
      // The dashboard component will handle showing the correct dashboard type
      console.log("Login successful, redirecting to dashboard");
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-purple-600/15 blur-3xl"></div>
      </div>

      <div className="m-auto max-w-md w-full p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Sign In
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={user.email}
              onChange={handleChange}
              className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              name="password"
              type="password"
              required
              value={user.password}
              onChange={handleChange}
              className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
