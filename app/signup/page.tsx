"use client";
import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

type UserType = "Student" | "Mentor" | "Business" | "Guardian";

interface UserData {
  full_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  user_type: UserType | "";
  location: string;
  profile_picture: File | null;
}

export default function Signup() {
  const [user, setUser] = useState<UserData>({
    full_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    user_type: "",
    location: "",
    profile_picture: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Form validation
    if (
      !user.full_name ||
      !user.email ||
      !user.password ||
      !user.date_of_birth ||
      !user.user_type ||
      !user.location
    ) {
      setError("All fields are required except profile picture");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("full_name", user.full_name);
      formData.append("email", user.email);
      formData.append("password1", user.password);
      formData.append("password2", user.password);
      formData.append("date_of_birth", user.date_of_birth);
      formData.append("user_type", user.user_type);
      formData.append("location", user.location);

      if (user.profile_picture) {
        formData.append("profile_picture", user.profile_picture);
      }

      const response = await axios.post(
        "https://readytoconnect.panemtech.com/api/accounts/registration/",
        formData,
        {
          withCredentials: true,
          // Don't set Content-Type header when using FormData
        }
      );

      // Successful registration - redirect to signin
      setTimeout(() => {
        router.push("/signin");
      }, 100);
    } catch (error) {
      // Type guard for AxiosError
      const err = error as AxiosError<any>;

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (typeof err.response.data === "object") {
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("\n");
          setError(errorMessages);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Connection error. Please try again later.");
      }
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for text/select inputs
  const handleInputChange =
    (field: keyof Omit<UserData, "profile_picture">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUser((prevUser) => ({
        ...prevUser,
        [field]: e.target.value,
      }));
    };

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Update state with the selected file
      setUser((prevUser) => ({
        ...prevUser,
        profile_picture: file,
      }));

      // Create preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        profile_picture: null,
      }));
      setPreviewUrl(null);
    }
  };

  const handleProfilePictureClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
          <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
          <p className="text-gray-400 mt-2">Sign up for ReadyToConnect</p>
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
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Your full name"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={user.full_name}
                onChange={handleInputChange("full_name")}
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
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Email */}
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
                value={user.email}
                onChange={handleInputChange("email")}
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

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Create a password"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={user.password}
                onChange={handleInputChange("password")}
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

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={user.date_of_birth}
                onChange={handleInputChange("date_of_birth")}
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
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* User Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              User Type
            </label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none"
                value={user.user_type}
                onChange={handleInputChange("user_type")}
              >
                <option value="">Select your role</option>
                <option value="Student">Student</option>
                <option value="Mentor">Mentor</option>
                <option value="Business">Business</option>
                <option value="Guardian">Guardian</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Your location"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={user.location}
                onChange={handleInputChange("location")}
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
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Profile Picture
            </label>
            <div
              className="w-full border border-[#3a3a45] rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-[#2a2a35]"
              onClick={handleProfilePictureClick}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mb-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-400">
                  {user.profile_picture
                    ? user.profile_picture.name
                    : "Click to upload profile picture"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG or GIF (max. 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Profile Preview */}
          {previewUrl && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-purple-500"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  onClick={() => {
                    setUser((prev) => ({ ...prev, profile_picture: null }));
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
