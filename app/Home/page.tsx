"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hero section animation variants
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

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
    },
    {
      name: "Mia J.",
      age: 17,
      quote:
        "The gamification made preparing for my career actually fun. I love earning badges!",
      avatar: "👩‍🎓",
    },
    {
      name: "Jamal T.",
      age: 22,
      quote:
        "My mentor from the platform has been invaluable. I feel much more confident now.",
      avatar: "👨‍💼",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white">
      {/* Subtle background noise texture */}
      <div
        className="absolute inset-0 opacity-5 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/30 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              ReadyToConnect
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Success Stories
            </Link>
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-md transition-all"
            >
              Log in
            </button>
            <button
              onClick={handleSignUp}
              className="px-4 py-2 text-sm bg-white/10 backdrop-blur-md border border-white/10 rounded-md
                      hover:bg-gradient-to-r from-blue-500 to-purple-600 hover:border-transparent transition-all"
            >
              Sign up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
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
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 space-y-6">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                Discover Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Perfect Internship
                </span>{" "}
                Journey
              </motion.h1>

              <motion.p
                className="text-lg text-gray-300 md:pr-10"
                variants={itemVariants}
              >
                AI-powered platform connecting young talent with personalized
                internships, gamified skill development, and expert mentorship.
              </motion.p>

              <motion.div
                className="pt-4 flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <button
                  onClick={handleSignUp}
                  className="px-8 py-3 font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Get Started
                </button>
                <button
                  onClick={handleDashboardDemo}
                  className="px-8 py-3 font-medium rounded-lg bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all"
                >
                  Dashboard Demo
                </button>
              </motion.div>

              <motion.div
                className="pt-6 text-sm text-gray-400"
                variants={itemVariants}
              >
                <p>Join 10,000+ students already building their future</p>
              </motion.div>
            </div>

            <motion.div className="md:w-1/2 p-4" variants={itemVariants}>
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl">
                {/* This would be a screenshot of the dashboard */}
                <div className="aspect-video w-full bg-gradient-to-tr from-gray-800 to-gray-700 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-opacity-30 flex items-center justify-center">
                    <img
                      src="/api/placeholder/600/400"
                      alt="Dashboard Preview"
                      className="rounded-xl w-full"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 rounded-xl pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background gradient blobs */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30"></div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ReadyToConnect?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform helps young people ages 15-25 find opportunities that
              match their skills and interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-white/5 backdrop-blur-sm relative"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four simple steps to launch your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-10">
                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Create your profile
                    </h3>
                    <p className="text-gray-400">
                      Tell us about your skills, interests, and career goals so
                      we can match you with the perfect opportunities.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Explore personalized matches
                    </h3>
                    <p className="text-gray-400">
                      Our AI algorithm finds internships that align with your
                      profile and career aspirations.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Build skills through challenges
                    </h3>
                    <p className="text-gray-400">
                      Complete interactive tasks and earn badges while preparing
                      for real-world job experiences.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Connect with mentors
                    </h3>
                    <p className="text-gray-400">
                      Get guidance from industry professionals who can help
                      navigate your career journey.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl">
                <img
                  src="/api/placeholder/600/450"
                  alt="Interactive Dashboard"
                  className="rounded-xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-xl pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from students who have transformed their careers with
              ReadyToConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">
                      Age {testimonial.age}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-50 pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect to Your Future?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of young people already building their career paths
              with personalized guidance and opportunities.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleSignUp}
                className="px-8 py-3 font-medium text-lg rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                ReadyToConnect
              </h3>
              <p className="text-gray-400">
                Connecting young talent with career opportunities through
                AI-powered matching and gamified learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    For Employers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ReadyToConnect. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
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
    </div>
  );
}
