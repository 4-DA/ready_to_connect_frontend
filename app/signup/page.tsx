"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    router.push("/signin");
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e13]">
      <div className="bg-[#1a1a22] p-10 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 "> 

        <input
            type="text"
            placeholder="Name"
            required
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          /> 

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button className="w-full bg-purple-500 text-white py-2 rounded">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
