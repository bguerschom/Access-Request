// src/components/auth/AuthForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Send } from 'lucide-react';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';



const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const { user, error: loginError } = await authService.login(email, password);
    
    if (loginError) {
      setError(loginError);
      return;
    }

    navigate('/');
  };

  

  return (
    <div className="min-h-screen bg-[#0A2647] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Flow */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <path
            className="animate-flow"
            d="M0,200 C150,200 250,100 500,100 C750,100 850,200 1000,200"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            className="animate-flow-delayed"
            d="M0,250 C150,250 250,150 500,150 C750,150 850,250 1000,250"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            className="animate-flow-slow"
            d="M0,300 C150,300 250,200 500,200 C750,200 850,300 1000,300"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative transform transition-all hover:scale-[1.01]">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#0A2647] rounded-full flex items-center justify-center animate-bounce-slow">
                <Send className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0A2647] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 animate-fade-in">
              Your digital transformation journey continues here
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                  placeholder="Email address"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                  placeholder="Password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-[#0A2647] text-white rounded-lg hover:bg-[#0A2647]/90 transition-all transform hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center">
                Sign in to continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
