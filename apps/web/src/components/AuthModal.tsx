'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Check, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center">
              <Lock size={15} className="text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {isLogin ? 'User Authentication' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-slate-400">Secure JWT Authentication with Cookie Rotation</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="p-6">
          {/* Quick Demo Credentials for Reviewers */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Instant Demo Fill (Portfolio Review)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 text-slate-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <Shield size={13} className="text-amber-500" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('customer')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 text-slate-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <UserIcon size={13} className="text-indigo-500" />
                <span>Customer Quick Fill</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex mb-5">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(null); setShowPassword(false); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(null); setShowPassword(false); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                  <UserIcon size={15} className="absolute right-3.5 top-3 text-slate-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
                <Mail size={15} className="absolute right-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
                {showPassword ? (
                  <button
                    type="button"
                    aria-label="Hide password"
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <EyeOff size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Show password"
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <Eye size={15} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Complete Registration'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
