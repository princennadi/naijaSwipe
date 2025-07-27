// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary logic: just route to home
    if (email && password) {
      navigate('/');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-80 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-300">Login</h2>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
