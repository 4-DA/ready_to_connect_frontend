"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
        credentials: "include", // Needed if using cookies
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login error response:", data);

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
        setIsLoading(false);
        return;
      }

      // ✅ Correct way: Save token in localStorage
      if (data.access) {
        localStorage.setItem("token", data.access); // Save it as 'token' because ProgressSection reads from 'token'
      } else if (data.key) {
        localStorage.setItem("token", data.key); // For dj-rest-auth sessions
      } else {
        console.error("No token received on login.");
      }

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again later.");
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
            className="w-full px-3 py-2 border rounded bg-[#2a2a35] text-white border-[#3a3a45]"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
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
