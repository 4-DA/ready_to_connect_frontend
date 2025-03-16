"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e13]">
      <div className="bg-[#1a1a22] p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4"> 
       
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button className="w-full bg-purple-500 text-white py-2 rounded">Sign In</button>
        </form>
      </div>
    </div>
  );
}
