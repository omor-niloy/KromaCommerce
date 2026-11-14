'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Check, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { apiClient } from '../lib/api-client';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const res = await apiClient.login(email, password);
        setUser(res.user, res.accessToken);
      } else {
        const res = await apiClient.register(email, password, name);
        setUser(res.user, res.accessToken);
      }
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userType: 'admin' | 'customer') => {
    if (userType === 'admin') {
      setEmail('admin@kromacommerce.com');
      setPassword('Admin123!');
      setIsLogin(true);
    } else {
      setEmail('customer@kromacommerce.com');
      setPassword('Customer123!');
      setIsLogin(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock size={16} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              {isLogin ? 'User Authentication' : 'Create Account'}
            </span>
          </div>
          <button onClick={closeAuthModal} className="p-1 hover:bg-neutral-800">
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500 text-white p-3 text-xs font-mono border-b-2 border-black">
            {errorMsg}
          </div>
        )}

        <div className="p-6">
          <div className="flex border-2 border-black mb-6">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(null); setShowPassword(false); }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase ${
                isLogin ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(null); setShowPassword(false); }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase border-l-2 border-black ${
                !isLogin ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-mono uppercase mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full border-2 border-black p-2.5 text-xs font-mono focus:outline-none"
                  />
                  <UserIcon size={14} className="absolute right-3 top-3 text-neutral-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full border-2 border-black p-2.5 text-xs font-mono focus:outline-none"
                />
                <Mail size={14} className="absolute right-3 top-3 text-neutral-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full border-2 border-black p-2.5 pr-10 text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 p-1.5 text-black hover:text-neutral-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white border-2 border-black py-3 text-xs font-mono font-bold uppercase hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={14} />
              <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-black font-mono text-[11px]">
            <div className="text-neutral-600 uppercase font-bold mb-2">Test Seed Credentials:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickCredentials('customer')}
                className="border border-black p-1.5 text-left hover:bg-neutral-100"
              >
                <div className="font-bold">Customer</div>
                <div className="text-neutral-500">customer@...</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin')}
                className="border border-black p-1.5 text-left hover:bg-neutral-100"
              >
                <div className="font-bold">Admin</div>
                <div className="text-neutral-500">admin@...</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
