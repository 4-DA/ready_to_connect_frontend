"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api"; // ✅ centralized axios instance

export default function Signin() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post("/accounts/auth/login/", {
        email: user.email,
        password: user.password,
      });
      const data = response.data;
      // ✅ Save both access_token and refresh_token correctly
      if (data.access && data.refresh) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
      } else {
        console.error("No tokens received during login.");
        throw new Error("Invalid login response from server.");
      }
      // ✅ OPTIONAL: Save user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // ✅ Redirect to dashboard or home
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(" "));
        } else if (data.email) {
          setError(data.email.join(" "));
        } else if (data.password) {
          setError(data.password.join(" "));
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        setError("Connection error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0e0e13] to-[#1a1a2a]">
      <div className="bg-[#1a1a22] p-10 rounded-xl shadow-xl w-96 border border-[#2a2a35] relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center relative">
            <div className="absolute w-20 h-20 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <span className="text-3xl font-bold text-white relative z-10">
              R
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-3 mb-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={user.email}
            className="w-full px-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={user.password}
            className="w-full px-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Do not have an account?{" "}
          <Link href="/signup" className="text-purple-500 bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
