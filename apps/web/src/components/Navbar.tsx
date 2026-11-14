'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  User as UserIcon,
  LogOut,
  Shield,
  Package,
  Zap,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { useAuthStore } from '../store/auth-store';
import { apiClient } from '../lib/api-client';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const totalCartCount = useCartStore((state) => state.getTotalCount());
  const toggleCart = useCartStore((state) => state.toggleCart);

  const { user, setUser, logout, openAuthModal } = useAuthStore();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && !user) {
      apiClient.fetchMe()
        .then((profile) => setUser(profile, token))
        .catch(() => logout());
    }
  }, [user, setUser, logout]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">KROMACOMMERCE PRICE INTELLIGENCE ENGINE</span>
          <span className="text-slate-500 hidden sm:inline">• Playwright Headless Crawling</span>
        </div>
        <div className="flex gap-4 items-center text-xs">
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="hover:text-amber-300 flex items-center gap-1 text-amber-400 font-semibold transition-colors"
            >
              <Shield size={13} />
              <span>Admin Console</span>
            </Link>
          )}
          <span className="text-slate-400 font-normal hidden md:inline">100% Free-Tier Cloud Architecture</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-lg tracking-tight shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            KC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                KromaCommerce
              </span>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold px-1.5 py-0.5 rounded-md hidden sm:inline">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide block leading-none">
              Fair Pricing Engine
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
          </div>
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Shield size={14} className="text-amber-600" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/orders"
                className="hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Package size={14} className="text-slate-500" />
                <span>Orders</span>
              </Link>
              <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{user.name.split(' ')[0]}</span>
                <span className="font-semibold text-slate-500">({user.role})</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserIcon size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow"
          >
            <ShoppingCart size={15} />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-0.5">
                {totalCartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
