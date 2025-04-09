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
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e13]">
      <div className="bg-[#1a1a22] p-10 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>

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
            className="w-full px-3 py-2 border rounded bg-[#2a2a35] text-white border-[#3a3a45]"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={user.password}
            className="w-full px-3 py-2 border rounded bg-[#2a2a35] text-white border-[#3a3a45]"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Do not have an account?{" "}
          <Link href="/signup" className="text-purple-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
