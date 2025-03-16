"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define broader field options and skill levels
type FieldOfInterest =
  | "Medicine"
  | "Engineering"
  | "Business & Finance"
  | "Marketing & Communications"
  | "Education & Teaching"
  | "Arts & Design"
  | "Law & Legal"
  | "Science & Research"
  | "Information Technology"
  | "Healthcare"
  | "Social Services"
  | "Hospitality & Tourism"
  | "Agriculture"
  | "Construction & Architecture"
  | "Manufacturing"
  | "Retail";

type SkillLevel =
  | "Novice"
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

interface SkillAssessmentSetup {
  field: FieldOfInterest | "";
  level: SkillLevel | "";
  specificInterest: string;
  priorExperience: string;
  goalForLearning: string;
  questionCount: number;
}

export default function SkillsAssessment() {
  const [setup, setSetup] = useState<SkillAssessmentSetup>({
    field: "",
    level: "",
    specificInterest: "",
    priorExperience: "",
    goalForLearning: "",
    questionCount: 4,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fields: FieldOfInterest[] = [
    "Medicine",
    "Engineering",
    "Business & Finance",
    "Marketing & Communications",
    "Education & Teaching",
    "Arts & Design",
    "Law & Legal",
    "Science & Research",
    "Information Technology",
    "Healthcare",
    "Social Services",
    "Hospitality & Tourism",
    "Agriculture",
    "Construction & Architecture",
    "Manufacturing",
    "Retail",
  ];

  const levels: SkillLevel[] = [
    "Novice",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  const handleChange = (field: keyof SkillAssessmentSetup, value: any) => {
    setSetup((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !setup.field ||
      !setup.level ||
      !setup.specificInterest ||
      !setup.priorExperience ||
      !setup.goalForLearning
    ) {
      setError("Please complete all fields");
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would call your API to generate questions
      // with GPT using the selected options
      await axios.post("/api/generate-assessment", setup);

      // Store the setup in localStorage or state management for the assessment page
      localStorage.setItem("assessmentSetup", JSON.stringify(setup));

      // Navigate to the dashboard
      router.push("/");
    } catch (error) {
      console.error("Error generating assessment:", error);
      setError("Failed to generate your skills assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Just navigate to dashboard if user skips assessment
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md px-8 py-10 mx-2 backdrop-blur-sm bg-[#1a1a22]/80 rounded-2xl shadow-xl border border-[#ffffff0f]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Welcome to ReadyToConnect!
          </h2>
          <p className="text-gray-400 mt-2">
            Let's personalize your learning journey
          </p>
        </div>

        <div className="mb-6 bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-4 text-indigo-200 text-sm">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium mb-1">Complete your profile setup</p>
              <p>
                Tell us about your interests so we can customize your learning
                experience. This will only take a minute!
              </p>
            </div>
          </div>
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
          {/* Field of Interest */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Field of Interest
            </label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none"
                value={setup.field}
                onChange={(e) => handleChange("field", e.target.value)}
              >
                <option value="">Select your field</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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

          {/* Specific Interest */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              What specific area are you most interested in?
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Pediatrics, Structural Engineering, Digital Marketing..."
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                value={setup.specificInterest}
                onChange={(e) =>
                  handleChange("specificInterest", e.target.value)
                }
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Your Current Skill Level
            </label>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`py-2 sm:py-3 px-1 sm:px-4 rounded-lg border text-center transition-all text-xs sm:text-sm ${
                    setup.level === level
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-[#2a2a35] border-[#3a3a45] text-gray-300 hover:border-purple-500"
                  }`}
                  onClick={() => handleChange("level", level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Prior Experience */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              What prior experience do you have in this field?
            </label>
            <div className="relative">
              <textarea
                placeholder="Briefly describe your background in this area..."
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all min-h-[80px]"
                value={setup.priorExperience}
                onChange={(e) =>
                  handleChange("priorExperience", e.target.value)
                }
              />
              <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              What's your primary goal for learning in this field?
            </label>
            <div className="relative">
              <select
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none"
                value={setup.goalForLearning}
                onChange={(e) =>
                  handleChange("goalForLearning", e.target.value)
                }
              >
                <option value="">Select your primary goal</option>
                <option value="Career advancement">Career advancement</option>
                <option value="Career change">Career change</option>
                <option value="Skill development">Skill development</option>
                <option value="Academic requirement">
                  Academic requirement
                </option>
                <option value="Personal interest">Personal interest</option>
                <option value="Starting a business">Starting a business</option>
                <option value="Certification">
                  Professional certification
                </option>
                <option value="Problem solving">
                  Solving a specific problem
                </option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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

          {/* Question Count */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Number of Questions
            </label>
            <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-[#2a2a35] text-white border-[#3a3a45]">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 hover:bg-purple-500 transition-colors"
                onClick={() =>
                  setup.questionCount > 3 &&
                  handleChange("questionCount", setup.questionCount - 1)
                }
                disabled={setup.questionCount <= 3}
              >
                -
              </button>
              <span className="text-xl font-medium">{setup.questionCount}</span>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 hover:bg-purple-500 transition-colors"
                onClick={() =>
                  setup.questionCount < 10 &&
                  handleChange("questionCount", setup.questionCount + 1)
                }
                disabled={setup.questionCount >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleSkip}
              className="w-1/3 py-3 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1a1a22] transition-all"
            >
              Skip
            </button>

            <button
              type="submit"
              className="w-2/3 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1a22] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center"
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
                  Generating...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            We'll use AI to create a personalized skills assessment based on
            your selections. This will help us tailor your learning experience
            to match your goals and expertise level.
          </p>
        </form>
      </div>
    </div>
  );
}
