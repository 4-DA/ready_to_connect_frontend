"use client";

import React, { useState, useEffect } from "react";
import {
  Star as StarIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as AwardIcon,
  LocalFireDepartment as FireIcon,
  LocalHospital as MedicalIcon,
  School as EducationIcon,
  Balance as LawIcon,
  Engineering as EngineeringIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Architecture as ArchitectureIcon,
  Campaign as MarketingIcon,
  Computer as TechIcon,
  Public as GovernmentIcon,
  AttachMoney as FinanceIcon,
} from "@mui/icons-material";
import Confetti from "react-confetti";

// Interface for quiz question
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// Quiz category interface
interface QuizCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export default function DynamicQuizComponent() {
  // State variables
  const [userXP, setUserXP] = useState(750);
  const [streak, setStreak] = useState(5);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Define categories covering various educational fields
  const quizCategories: QuizCategory[] = [
    // Computer Science
    {
      id: "computer-science",
      name: "Computer Science",
      icon: <TechIcon />,
      description:
        "Software development, AI, algorithms, data structures, and more.",
      color: "bg-blue-600",
    },

    // Nursing
    {
      id: "nursing",
      name: "Nursing",
      icon: <MedicalIcon />,
      description:
        "Healthcare procedures, patient care, medical terminology, and nursing practices.",
      color: "bg-pink-600",
    },

    // Business Administration
    {
      id: "business-admin",
      name: "Business Administration",
      icon: <BusinessIcon />,
      description:
        "Management principles, organizational behavior, and business strategies.",
      color: "bg-amber-600",
    },

    // Engineering
    {
      id: "engineering",
      name: "Engineering",
      icon: <EngineeringIcon />,
      description:
        "Mechanical, electrical, civil, and other engineering disciplines.",
      color: "bg-orange-600",
    },

    // Medicine
    {
      id: "medicine",
      name: "Medicine",
      icon: <MedicalIcon />,
      description:
        "Medical diagnoses, treatments, anatomy, and healthcare knowledge.",
      color: "bg-red-600",
    },

    // Data Science
    {
      id: "data-science",
      name: "Data Science & Analytics",
      icon: <TechIcon />,
      description:
        "Statistics, machine learning, data analysis, and visualization.",
      color: "bg-indigo-600",
    },

    // Finance
    {
      id: "finance",
      name: "Finance & Accounting",
      icon: <FinanceIcon />,
      description:
        "Financial principles, accounting practices, and economic concepts.",
      color: "bg-green-600",
    },

    // Law
    {
      id: "law",
      name: "Law",
      icon: <LawIcon />,
      description: "Legal principles, case law, and judicial procedures.",
      color: "bg-purple-700",
    },

    // Psychology
    {
      id: "psychology",
      name: "Psychology",
      icon: <PsychologyIcon />,
      description:
        "Human behavior, cognitive processes, and psychological theories.",
      color: "bg-pink-500",
    },

    // Marketing
    {
      id: "marketing",
      name: "Marketing & Digital Media",
      icon: <MarketingIcon />,
      description:
        "Marketing strategies, consumer behavior, and digital advertising.",
      color: "bg-teal-600",
    },
  ];

  // Group categories by field for filtering
  const categoryFields = {
    "Health & Medicine": ["nursing", "medicine"],
    "Business & Finance": ["business-admin", "finance", "marketing"],
    Technology: ["computer-science", "data-science"],
    "Law & Social Sciences": ["law", "psychology"],
    Engineering: ["engineering"],
  };

  // Level and XP calculations
  const getXPForLevel = (level: number) => level * 100;
  const getCurrentLevel = () => {
    let level = 1;
    while (userXP >= getXPForLevel(level)) level++;
    return level - 1;
  };

  // Function to generate questions using GPT API
  const generateQuiz = async (categoryId: string) => {
    setIsLoading(true);
    setError(null);

    const category = quizCategories.find((c) => c.id === categoryId);
    if (!category) {
      setError("Category not found");
      setIsLoading(false);
      return;
    }

    try {
      // Create a specific prompt for the selected category
      const prompt = `Generate 5 multiple-choice quiz questions about ${category.name}. 
      
      For each question:
      1. Make sure there is one clearly correct answer
      2. Include 2-3 plausible but incorrect options that someone without expertise might choose
      3. Provide a brief explanation for why the correct answer is right
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswerIndex": 0, // Index of correct answer (0-based)
          "explanation": "Explanation of why the correct answer is right"
        },
        // More questions...
      ]
      
      Make the questions educational and engaging, covering key concepts in ${category.name}.`;

      // API call to GPT
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          category: category.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Parse the response to get questions
      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error("No valid questions returned from the API");
      }

      setQuestions(data.questions);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError(
        `Failed to generate quiz: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setIsLoading(false);
    }
  };

  // Start a new quiz
  const startQuiz = (categoryId: string) => {
    const category = quizCategories.find((c) => c.id === categoryId);
    if (!category) return;

    setCurrentCategoryId(categoryId);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setLives(3);
    generateQuiz(categoryId);
  };

  // Handle answer selection
  const handleAnswer = (selectedIndex: number) => {
    if (questions.length === 0 || showFeedback) return;

    const isAnswerCorrect =
      selectedIndex === questions[currentQuestion].correctAnswerIndex;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (!isAnswerCorrect) setLives(lives - 1);

    setTimeout(() => {
      setShowFeedback(false);
      if (lives > 0 && currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate XP based on performance
        const xpGain = isAnswerCorrect ? 15 : 5;
        setUserXP((prevXP) => prevXP + xpGain);

        if (lives === 3) {
          // Perfect score
          setUserXP((prevXP) => prevXP + 50);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }

        setCurrentCategoryId(null);
      }
    }, 2000);
  };

  // Filter categories based on search or field selection
  const filteredCategories = quizCategories.filter((category) => {
    const matchesSearch =
      searchTerm === "" ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField =
      selectedField === null ||
      Object.entries(categoryFields).find(
        ([field, ids]) => field === selectedField && ids.includes(category.id)
      ) !== undefined;

    return matchesSearch && matchesField;
  });

  return (
    <div className="p-6">
      {currentCategoryId === null ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Your Quiz Topic</h2>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for a topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedField(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedField === null ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                All
              </button>
              {Object.keys(categoryFields).map((field) => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedField === field ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 cursor-pointer h-full ${category.color}`}
                onClick={() => startQuiz(category.id)}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-100 mb-4 flex-grow">
                  {category.description}
                </p>
                <button className="w-full mt-auto py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md font-medium transition-all duration-200">
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-lg">Generating your quiz questions...</p>
          <p className="text-sm text-gray-400 mt-2">
            We're creating unique questions about{" "}
            {quizCategories.find((c) => c.id === currentCategoryId)?.name}...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-6 text-center">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => setCurrentCategoryId(null)}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-all duration-200"
          >
            Back to Topics
          </button>
        </div>
      ) : questions.length > 0 ? (
        <div>
          {showConfetti && <Confetti />}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {quizCategories.find((c) => c.id === currentCategoryId)?.name}{" "}
                Quiz
              </h2>
              <p className="text-sm text-gray-400">
                Test your knowledge of key concepts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Lives: </span>
              {Array(lives)
                .fill(0)
                .map((_, i) => (
                  <FireIcon key={i} className="text-red-400" />
                ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
            <div className="mb-1 flex justify-between">
              <span className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-blue-400">
                +15 XP for correct answers
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(currentQuestion / questions.length) * 100}%`,
                }}
              ></div>
            </div>

            <h3 className="text-xl font-medium mb-6">
              {questions[currentQuestion].question}
            </h3>

            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 border-2 text-left rounded-md text-md transition-all duration-200 ${
                    showFeedback &&
                    index === questions[currentQuestion].correctAnswerIndex
                      ? "border-green-500 bg-green-900 bg-opacity-20"
                      : showFeedback && isCorrect === false
                      ? "border-gray-600 opacity-60"
                      : "border-gray-700 hover:border-blue-500 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {showFeedback &&
                      index ===
                        questions[currentQuestion].correctAnswerIndex && (
                        <CheckIcon className="ml-auto text-green-500" />
                      )}
                  </div>
                </button>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 p-4 rounded-md ${
                  isCorrect
                    ? "bg-green-900 bg-opacity-20 border border-green-800"
                    : "bg-red-900 bg-opacity-20 border border-red-800"
                }`}
              >
                <div className="flex items-center mb-2">
                  {isCorrect ? (
                    <>
                      <CheckIcon className="mr-2 text-green-500" />
                      <span className="font-medium text-green-400">
                        Correct!
                      </span>
                    </>
                  ) : (
                    <>
                      <FireIcon className="mr-2 text-red-500" />
                      <span className="font-medium text-red-400">
                        Not quite right
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentCategoryId(null)}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-200"
            >
              Quit Quiz
            </button>
            {showFeedback && (
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setShowFeedback(false);
                  } else {
                    setCurrentCategoryId(null);
                  }
                }}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-all duration-200"
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg mb-4">
            No questions available. Please try another topic.
          </p>
          <button
            onClick={() => setCurrentCategoryId(null)}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-all duration-200"
          >
            Back to Topics
          </button>
        </div>
      )}
    </div>
  );
}
