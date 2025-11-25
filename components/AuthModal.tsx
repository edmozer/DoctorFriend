import React, { useState } from 'react';
import { Button } from './Button';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn, signUp } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        onSuccess();
        onClose();
      } else {
        const data = await signUp(email, password, fullName);
        
        // Check if session was created immediately (Email verification disabled in Supabase)
        if (data.session) {
          onSuccess();
          onClose();
        } else if (data.user) {
          // User created but no session => Email verification is ENABLED in Supabase
          setIsLoading(false);
          setInfoMessage('Conta criada! Verifique seu email para confirmar o cadastro, ou desative a opção "Confirm Email" no painel do Supabase para login imediato.');
          return; // Do not close modal
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      // Only stop loading if we didn't return early for the info message
      if (isLogin) setIsLoading(false);
    }
  };

  const handleClose = () => {
      setError('');
      setInfoMessage('');
      setEmail('');
      setPassword('');
      setFullName('');
      setIsLogin(true);
      onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in" onClick={handleClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full animate-scale-in">
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <button onClick={handleClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600"/></button>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {infoMessage && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm flex items-start border border-green-100">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-bold mb-1">Quase lá!</p>
                        <p>{infoMessage}</p>
                        <button 
                            onClick={() => { setInfoMessage(''); setIsLogin(true); }}
                            className="mt-3 text-green-800 font-bold underline"
                        >
                            Ir para Login
                        </button>
                    </div>
                </div>
            )}

            {!infoMessage && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" required 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                        </div>
                    </div>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                        type="email" required 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                        type="password" required minLength={6}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full py-3">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>

                    <div className="text-center mt-4">
                    <button 
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                    </div>
                </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};