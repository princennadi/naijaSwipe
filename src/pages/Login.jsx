import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithGoogle, loginWithApple, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setBusy(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      alert(err.message || 'Google login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleApple = async () => {
    try {
      setBusy(true);
      await loginWithApple();
      navigate('/');
    } catch (err) {
      alert(err.message || 'Apple login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleEmailLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-80 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-300">Login</h2>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-md"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleApple}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-black text-white p-2 rounded-md"
          >
            <FaApple className="w-5 h-5" />
            Continue with Apple
          </button>


        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
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
            disabled={busy}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Login with Email'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md disabled:opacity-60"
        >
          Back to Browse
        </button>
      </form>
    </div>
  );
};

export default Login;
