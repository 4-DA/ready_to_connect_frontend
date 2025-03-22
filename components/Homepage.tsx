"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Optional: Auto-redirect to dashboard if already logged in
    // if (token && user) {
    //   router.push('/dashboard');
    // }
  }, [router]);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleDashboardDemo = () => {
    router.push("/dashboard");
  };

  // Feature items with icons
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Matching",
      description:
        "Find internships that perfectly align with your unique skills and interests",
    },
    {
      icon: "🎮",
      title: "Gamified Learning",
      description:
        "Level up your career journey with challenges, badges, and achievement tracking",
    },
    {
      icon: "👨‍🏫",
      title: "Mentorship Access",
      description:
        "Connect with industry professionals who guide you through your career path",
    },
    {
      icon: "📝",
      title: "Interactive Tools",
      description:
        "Build your resume, practice interviews, and develop professional skills",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Alex K.",
      age: 19,
      quote:
        "ReadyToConnect helped me land my first tech internship. The personalized matches were spot on!",
      avatar: "👨‍🎓",
      company: "TechCorp Intern",
    },
    {
      name: "Mia J.",
      age: 17,
      quote:
        "The gamification made preparing for my career actually fun. I love earning badges!",
      avatar: "👩‍🎓",
      company: "High School Senior",
    },
    {
      name: "Jamal T.",
      age: 22,
      quote:
        "My mentor from the platform has been invaluable. I feel much more confident now.",
      avatar: "👨‍💼",
      company: "University Student",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1729] text-white">
      {/* Gradient background with mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#11162d] to-[#0c1021]"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundAttachment: "fixed",
          }}
        ></div>
      </div>

      {/* Animated particles */}
      <div className="fixed inset-0 z-0">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0f1729]/80 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
              ReadyToConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm text-gray-300 hover:text-white transition-colors hover:underline decoration-indigo-500 decoration-2 underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-300 hover:text-white transition-colors hover:underline decoration-indigo-500 decoration-2 underline-offset-4"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-gray-300 hover:text-white transition-colors hover:underline decoration-indigo-500 decoration-2 underline-offset-4"
            >
              Success Stories
            </Link>
            <button
              onClick={handleLogin}
              className="px-5 py-2 text-sm bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg transition-all"
            >
              Log in
            </button>
            <button
              onClick={handleSignUp}
              className="px-5 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg border border-white/5 transition-all"
            >
              Sign up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f1729]/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="py-4 px-6 space-y-4">
              <Link
                href="#features"
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Success Stories
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleSignUp();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-all"
                >
                  Sign up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              className="md:w-1/2 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                variants={slideUp}
              >
                Discover Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                  Perfect
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
                  Internship
                </span>{" "}
                Journey
              </motion.h1>

              <motion.p
                className="text-lg text-gray-300 md:pr-10 font-light"
                variants={slideUp}
              >
                AI-powered platform connecting young talent with personalized
                internships, gamified skill development, and expert mentorship.
              </motion.p>

              <motion.div
                className="pt-4 flex flex-col sm:flex-row gap-4"
                variants={slideUp}
              >
                <button
                  onClick={handleSignUp}
                  className="px-8 py-3 font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                >
                  Get Started
                </button>
                <button
                  onClick={handleDashboardDemo}
                  className="px-8 py-3 font-medium rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
                >
                  Dashboard Demo
                </button>
              </motion.div>

              <motion.div
                className="pt-6 text-sm text-gray-400"
                variants={slideUp}
              >
                <p>Join 10,000+ students already building their future</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:w-1/2 p-4"
              variants={slideInRight}
              initial="hidden"
              animate="visible"
            >
              <div className="relative">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-50"></div>

                <div className="relative bg-[#151b30]/70 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl">
                  {/* Dashboard preview */}
                  <div className="aspect-video w-full bg-gradient-to-tr from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/api/placeholder/600/400"
                        alt="Dashboard Preview"
                        className="rounded-xl w-full"
                      />
                    </div>
                  </div>

                  {/* Glowing dots */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background gradient blobs */}
        <div className="absolute top-20 left-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ReadyToConnect?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform helps young people ages 15-25 find opportunities that
              match their skills and interests.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Card with hover effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-70 blur transition duration-300"></div>
                <div className="bg-[#151b30]/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-[#13182e]/50 backdrop-blur-sm relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four simple steps to launch your career journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-12">
                {[
                  {
                    number: 1,
                    title: "Create your profile",
                    description:
                      "Tell us about your skills, interests, and career goals so we can match you with the perfect opportunities.",
                  },
                  {
                    number: 2,
                    title: "Explore personalized matches",
                    description:
                      "Our AI algorithm finds internships that align with your profile and career aspirations.",
                  },
                  {
                    number: 3,
                    title: "Build skills through challenges",
                    description:
                      "Complete interactive tasks and earn badges while preparing for real-world job experiences.",
                  },
                  {
                    number: 4,
                    title: "Connect with mentors",
                    description:
                      "Get guidance from industry professionals who can help navigate your career journey.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative">
                      {/* Glowing number */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm opacity-70"></div>
                      <div className="relative w-12 h-12 rounded-full bg-[#1c2240] flex items-center justify-center border border-white/20 text-white font-bold text-lg">
                        {step.number}
                      </div>
                      {/* Connecting line */}
                      {index < 3 && (
                        <div className="absolute left-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-indigo-500/50 to-transparent transform -translate-x-1/2"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-50"></div>

                <div className="relative bg-[#151b30]/70 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl overflow-hidden">
                  <img
                    src="/api/placeholder/600/450"
                    alt="Interactive Dashboard"
                    className="rounded-xl w-full"
                  />

                  {/* Overlay with animated dots */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-600/10 rounded-xl pointer-events-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-white/70 rounded-full animate-ping"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from students who have transformed their careers with
              ReadyToConnect
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Glow on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-70 blur transition duration-300"></div>

                <div className="relative bg-[#151b30]/70 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 p-4 rounded-lg mb-6">
                    <p className="text-gray-300 italic">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="relative">
                      {/* Glowing avatar circle */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-sm opacity-70"></div>
                      <div className="relative w-12 h-12 rounded-full bg-[#1c2240] flex items-center justify-center border border-white/20 text-2xl">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {testimonial.company} • Age {testimonial.age}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Glowing border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-70"></div>

            {/* Content container */}
            <div className="relative bg-[#151b30]/70 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-40 h-40 bg-indigo-500/10 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: "translate(-50%, -50%)",
                      filter: "blur(40px)",
                    }}
                  ></div>
                ))}
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Connect to Your Future?
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                  Join thousands of young people already building their career
                  paths with personalized guidance and opportunities.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleSignUp}
                    className="px-8 py-3 font-medium text-lg rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={handleDashboardDemo}
                    className="px-8 py-3 font-medium text-lg rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Try Demo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                ReadyToConnect
              </h3>
              <p className="text-gray-400">
                Connecting young talent with career opportunities through
                AI-powered matching and gamified learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    For Employers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} ReadyToConnect. All rights reserved.
            </p>
            <div className="flex space-x-5">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                <span className="sr-only">Twitter</span>
                <div className="absolute -inset-2 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                <svg
                  className="h-5 w-5 relative"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                <span className="sr-only">Instagram</span>
                <div className="absolute -inset-2 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                <svg
                  className="h-5 w-5 relative"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                <span className="sr-only">LinkedIn</span>
                <div className="absolute -inset-2 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                <svg
                  className="h-5 w-5 relative"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                <span className="sr-only">GitHub</span>
                <div className="absolute -inset-2 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                <svg
                  className="h-5 w-5 relative"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom animations for the floating particles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(-20px) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(-20px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
    