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
  Package
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
    <header className="border-b-2 border-black bg-white sticky top-0 z-40">
      <div className="bg-black text-white px-4 py-1 text-xs font-mono flex justify-between items-center">
        <span>KROMACOMMERCE PRICE INTELLIGENCE ENGINE</span>
        <div className="flex gap-4 items-center">
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="hover:underline flex items-center gap-1 text-yellow-300 font-bold"
            >
              <Shield size={12} />
              <span>Admin Console</span>
            </Link>
          )}
          <span className="text-neutral-400 font-normal hidden sm:inline">100% Free Tier Cloud Architecture</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-2 font-black text-xl tracking-tighter">
            KC
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight text-black block leading-none">
              KROMA
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-black">
              COMMERCE
            </span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full flex">
            <input
              type="text"
              placeholder="Search products by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 flex items-center justify-center hover:bg-neutral-800"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="border-2 border-black bg-yellow-400 px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-yellow-300 transition-colors"
                >
                  <Shield size={14} />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/orders"
                className="border-2 border-black px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-black hover:text-white transition-colors"
              >
                <Package size={14} />
                <span>Orders</span>
              </Link>
              <div className="border-2 border-black px-3 py-1.5 text-xs font-mono">
                {user.name.split(' ')[0]} ({user.role})
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="border-2 border-black p-1.5 hover:bg-black hover:text-white"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="border-2 border-black px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 bg-black text-white hover:bg-neutral-800"
            >
              <UserIcon size={14} />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={toggleCart}
            className="border-2 border-black px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 relative"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-black text-white text-xs px-1.5 py-0.5 font-mono ml-1">
                {totalCartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
