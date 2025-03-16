"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
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
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e13]">
      <div className="bg-[#1a1a22] p-10 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-3 mb-4 text-red-400 whitespace-pre-line">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full px-3 py-2 border rounded bg-[#2a2a35] text-white border-[#3a3a45]"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
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
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
