// src/app/signup/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    user_type: "student", // Default to student
    first_name: "",
    last_name: "",
    age: "",
    interests: "",
    school: "",
    phone_number: "",
    relationship: "",
    expertise: "",
    experience_years: "",
    industry: "",
    company_name: "",
    company_website: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password1: user.password,
          password2: user.password,
          user_type: user.user_type,
          // Dynamically pass extra fields
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          interests: user.interests,
          school: user.school,
          phone_number: user.phone_number,
          relationship: user.relationship,
          expertise: user.expertise,
          experience_years: user.experience_years,
          industry: user.industry,
          company_name: user.company_name,
          company_website: user.company_website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Signup error response:", data);
        if (data.non_field_errors) setError(data.non_field_errors.join(" "));
        else if (data.email) setError(data.email.join(" "));
        else setError("Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      router.push("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderExtraFields = () => {
    switch (user.user_type) {
      case "student":
        return (
          <>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Age"
              onChange={(e) => setUser({ ...user, age: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Interests"
              onChange={(e) => setUser({ ...user, interests: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="School"
              onChange={(e) => setUser({ ...user, school: e.target.value })}
              className="input"
            />
          </>
        );
      case "guardian":
        return (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Relationship to Student (Mother, Father, etc.)"
              onChange={(e) => setUser({ ...user, relationship: e.target.value })}
              className="input"
            />
          </>
        );
      case "mentor":
        return (
          <>
            <input
              type="text"
              placeholder="Expertise"
              onChange={(e) => setUser({ ...user, expertise: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Years of Experience"
              onChange={(e) => setUser({ ...user, experience_years: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Industry"
              onChange={(e) => setUser({ ...user, industry: e.target.value })}
              className="input"
            />
          </>
        );
      case "business":
        return (
          <>
            <input
              type="text"
              placeholder="Company Name"
              onChange={(e) => setUser({ ...user, company_name: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Industry"
              onChange={(e) => setUser({ ...user, industry: e.target.value })}
              className="input"
            />
            <input
              type="url"
              placeholder="Company Website (Optional)"
              onChange={(e) => setUser({ ...user, company_website: e.target.value })}
              className="input"
            />
          </>
        );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e13]">
      <div className="bg-[#1a1a22] p-10 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-3 mb-4 text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="input"
            value={user.user_type}
            onChange={(e) => setUser({ ...user, user_type: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="guardian">Guardian</option>
            <option value="mentor">Mentor</option>
            <option value="business">Business</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            required
            className="input"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="input"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          {/* Dynamically show extra fields */}
          {renderExtraFields()}

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Already have an account?{" "}
          <Link href="/signin" className="text-purple-500 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
