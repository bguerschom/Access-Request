import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(isLogin ? 'Invalid credentials' : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A2647] items-center justify-center">
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-lg text-white/70">Access Request System</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0A2647]">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#0A2647] focus:outline-none transition-colors"
                placeholder="Email Address"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#0A2647] focus:outline-none transition-colors"
                placeholder="Password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#0A2647] focus:outline-none transition-colors"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#0A2647] text-white rounded-lg hover:bg-[#0A2647]/90 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-[#0A2647] font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
