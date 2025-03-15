
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', formData);
    // Add your login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-dark-light rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">READY TO CONNECT</h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 text-primary focus:ring-primary-light"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary-light hover:text-primary">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-light hover:text-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
