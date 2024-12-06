// src/components/auth/AuthForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, PaperclipIcon, Recycle } from 'lucide-react';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2647] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-float absolute -top-4 left-4 text-blue-100">
            <FileText size={40} />
          </div>
          <div className="animate-float-delayed absolute top-20 right-4 text-blue-100">
            <Recycle size={30} />
          </div>
          <div className="animate-float-slow absolute bottom-4 left-4 text-blue-100">
            <PaperclipIcon size={35} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#0A2647] rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Animated Text */}
            <div className="h-20 overflow-hidden">
              <div className="animate-slide-text">
                <p className="text-xl text-[#0A2647] font-medium py-4">Welcome to Paperless World</p>
                <p className="text-xl text-[#0A2647] font-medium py-4">Efficient Access Management</p>
                <p className="text-xl text-[#0A2647] font-medium py-4">Smart Document Handling</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                  placeholder="Email address"
                />
              </div>

              <div>
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
                Sign in
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
