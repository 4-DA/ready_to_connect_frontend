"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api"; // ✅ Centralized Axios instance
import {
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Briefcase,
  Book,
  Heart,
  School,
  Phone,
  Users,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "bg-gray-300",
  });

  const router = useRouter();

  // Check password strength whenever password changes
  useEffect(() => {
    if (!user.password) {
      setPasswordStrength({
        score: 0,
        message: "",
        color: "bg-gray-300",
      });
      return;
    }

    // Basic password strength check
    let score = 0;

    if (user.password.length >= 8) score++;
    if (/[A-Z]/.test(user.password)) score++;
    if (/[a-z]/.test(user.password)) score++;
    if (/\d/.test(user.password)) score++;
    if (/[^A-Za-z0-9]/.test(user.password)) score++;

    let message = "";
    let color = "";

    if (score < 2) {
      message = "Weak";
      color = "bg-red-500";
    } else if (score < 4) {
      message = "Medium";
      color = "bg-yellow-500";
    } else {
      message = "Strong";
      color = "bg-green-500";
    }

    setPasswordStrength({ score, message, color });
  }, [user.password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First Register the User
      const registerResponse = await api.post("/accounts/auth/register/", {
        email: user.email,
        password1: user.password,
        password2: user.password,
        user_type: user.user_type,
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
      });

      if (registerResponse.status !== 201 && registerResponse.status !== 200) {
        throw new Error("Registration failed");
      }

      // ✅ Automatically Log the User In
      const loginResponse = await api.post("/accounts/auth/login/", {
        email: user.email,
        password: user.password,
      });

      const loginData = loginResponse.data;

      if (loginData.access) {
        localStorage.setItem("access_token", loginData.access);
      }
      if (loginData.refresh) {
        localStorage.setItem("refresh_token", loginData.refresh);
      }
      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      // ✅ Redirect to Home Page
      router.push("/");
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.non_field_errors) setError(data.non_field_errors.join(" "));
        else if (data.email) setError(data.email.join(" "));
        else if (data.password1) setError(data.password1.join(" "));
        else setError("Registration failed. Please try again.");
      } else {
        setError("Connection error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderExtraFields = () => {
    switch (user.user_type) {
      case "student":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <School className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="School"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) => setUser({ ...user, school: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="Age"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                />
              </div>
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Interests"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) =>
                    setUser({ ...user, interests: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        );
      case "guardian":
        return (
          <>
            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) =>
                  setUser({ ...user, phone_number: e.target.value })
                }
              />
            </div>

            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Relationship to Student"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) =>
                  setUser({ ...user, relationship: e.target.value })
                }
              />
            </div>
          </>
        );
      case "mentor":
        return (
          <>
            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Book className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Expertise"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) =>
                  setUser({ ...user, expertise: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="Years of Experience"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) =>
                    setUser({ ...user, experience_years: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
                <div className="pl-3 py-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Industry"
                  className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                  onChange={(e) =>
                    setUser({ ...user, industry: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        );
      case "business":
        return (
          <>
            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Company Name"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) =>
                  setUser({ ...user, company_name: e.target.value })
                }
              />
            </div>

            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Industry"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) => setUser({ ...user, industry: e.target.value })}
              />
            </div>

            <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden">
              <div className="pl-3 py-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                placeholder="Company Website (Optional)"
                className="bg-transparent border-0 focus:ring-0 flex-grow pl-3 py-3 text-white"
                onChange={(e) =>
                  setUser({ ...user, company_website: e.target.value })
                }
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0e0e13] to-[#1a1a2a] p-4">
      <div className="bg-[#1a1a22] p-8 rounded-xl shadow-2xl w-full max-w-md border border-[#2a2a35] relative overflow-hidden">
        {/* Add subtle gradient highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-50"></div>

        {/* Logo */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-xl bg-purple-500 opacity-40 animate-pulse"></div>
            <span className="text-3xl font-bold text-white">R</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-white text-center relative z-10">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 mb-6 text-red-400 flex items-start relative z-10">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="bg-[#252532] p-3 rounded-lg shadow-inner">
            <div className="flex items-center justify-between">
              {[
                { value: "student", label: "Student" },
                { value: "guardian", label: "Guardian" },
                { value: "mentor", label: "Mentor" },
                { value: "business", label: "Business" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    user.user_type === option.value
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md"
                      : "bg-[#1e1e2a] text-gray-300 hover:bg-[#2a2a38]"
                  }`}
                  onClick={() => setUser({ ...user, user_type: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email field with fixed icon */}
          <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden shadow-inner">
            <div className="pl-3 py-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              className="bg-transparent border-0 focus:ring-0 focus:outline-none flex-grow pl-3 py-3 text-white"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          {/* Password field with fixed icon */}
          <div className="flex items-center bg-[#25252f] rounded-lg border border-[#3a3a4a] overflow-hidden shadow-inner">
            <div className="pl-3 py-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="bg-transparent border-0 focus:ring-0 focus:outline-none flex-grow pl-3 py-3 text-white"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button type="button" className="pr-3" onClick={toggleShowPassword}>
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>

          {user.password && (
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              {passwordStrength.message && (
                <p
                  className={`text-xs ${
                    passwordStrength.message === "Weak"
                      ? "text-red-400"
                      : passwordStrength.message === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  Password strength: {passwordStrength.message}
                </p>
              )}
            </div>
          )}

          {/* Dynamic fields based on user type */}
          {renderExtraFields()}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/20 font-medium flex items-center justify-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 relative z-10">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-purple-500 hover:text-purple-400 transition-colors font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
