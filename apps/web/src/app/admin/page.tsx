'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldAlert,
  Lock,
  RefreshCw,
  Cpu,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  LogIn
} from 'lucide-react';
import { Product } from '../../types';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth-store';

/**
 * Administrative Console component with strict authentication and role-based access control (RBAC).
 */
export default function AdminPage() {
  const { user, setUser, logout, openAuthModal } = useAuthStore();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.fetchProducts({ limit: 50 });
      setProducts(res.items);
    } catch (err) {
      console.warn('Failed to load admin catalog', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && !user) {
      apiClient.fetchMe()
        .then((profile) => {
          setUser(profile, token);
          setIsVerifyingAuth(false);
        })
        .catch(() => {
          logout();
          setIsVerifyingAuth(false);
        });
    } else {
      setIsVerifyingAuth(false);
    }
  }, [user, setUser, logout]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadData();
    }
  }, [user, loadData]);

  const handleTriggerSync = async () => {
    if (!user || user.role !== 'ADMIN') {
      openAuthModal();
      return;
    }

    try {
      setSyncing(true);
      setSyncResult(null);
      const res = await apiClient.triggerPriceSync();
      setSyncResult(`Successfully crawled and updated ${res.totalSynced} competitor products via Playwright.`);
      await loadData();
    } catch (err) {
      setSyncResult(`Sync Error: ${err instanceof Error ? err.message : 'Failed to sync'}`);
    } finally {
      setSyncing(false);
    }
  };

  if (isVerifyingAuth) {
    return (
      <div className="border-2 border-black p-16 text-center bg-white font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin" />
        <span>Verifying administrator credentials...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto my-12 border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white border-2 border-black mb-6">
          <Lock size={32} />
        </div>
        <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 inline-block mb-3 uppercase tracking-wider">
          401 Unauthorized
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
          Authentication Required
        </h1>
        <p className="text-xs text-neutral-700 leading-relaxed mb-6">
          The administrative console is restricted to authenticated system administrators. Please sign in with an authorized administrator account to continue.
        </p>

        <div className="space-y-3">
          <button
            onClick={openAuthModal}
            className="w-full bg-black text-white border-2 border-black py-3 px-4 text-xs font-bold uppercase hover:bg-neutral-800 flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            <span>Sign In as Administrator</span>
          </button>
          <Link
            href="/"
            className="w-full border-2 border-black bg-white text-black py-3 px-4 text-xs font-bold uppercase hover:bg-neutral-100 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="max-w-lg mx-auto my-12 border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white border-2 border-black mb-6">
          <ShieldAlert size={32} />
        </div>
        <div className="bg-black text-white text-xs font-bold px-2.5 py-1 inline-block mb-3 uppercase tracking-wider">
          403 Forbidden
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
          Administrator Clearance Required
        </h1>
        <p className="text-xs text-neutral-700 leading-relaxed mb-2">
          Your active account <span className="font-bold underline">{user.email}</span> is authenticated with role <span className="font-bold uppercase text-red-600">[{user.role}]</span>.
        </p>
        <p className="text-xs text-neutral-500 leading-relaxed mb-6">
          This portal requires elevated [ADMIN] privileges. Standard customer accounts cannot view system telemetry, trigger scraper tasks, or access administrative inventory records.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              logout();
              openAuthModal();
            }}
            className="w-full bg-black text-white border-2 border-black py-3 px-4 text-xs font-bold uppercase hover:bg-neutral-800 flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            <span>Switch to Administrator Account</span>
          </button>
          <Link
            href="/"
            className="w-full border-2 border-black bg-white text-black py-3 px-4 text-xs font-bold uppercase hover:bg-neutral-100 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase mb-6 hover:underline"
      >
        <ArrowLeft size={14} />
        <span>Return to Storefront</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={24} />
            <h1 className="text-3xl font-black uppercase tracking-tight">Admin & Scraping Console</h1>
          </div>
          <p className="text-xs font-mono text-neutral-600 mt-1">
            Logged in as <span className="font-bold">{user.email}</span> ({user.role}) - Autonomous Crawler Diagnostics
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={syncing}
          className="border-2 border-black bg-black text-white px-5 py-2.5 font-mono text-xs font-bold uppercase hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Crawling Headless Chromium...' : 'Run Playwright Price Sync'}</span>
        </button>
      </div>

      {syncResult && (
        <div
          className={`border-2 border-black p-4 mb-8 font-mono text-xs flex items-center gap-2 ${
            syncResult.includes('Error') ? 'bg-red-200' : 'bg-green-200'
          }`}
        >
          {syncResult.includes('Error') ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{syncResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-black p-4 bg-white">
          <div className="text-xs font-mono uppercase text-neutral-600 flex items-center gap-1">
            <Cpu size={14} />
            <span>API Gateway</span>
          </div>
          <div className="text-sm font-black font-mono mt-1 text-green-700">ONLINE (Port 8000)</div>
        </div>

        <div className="border-2 border-black p-4 bg-white">
          <div className="text-xs font-mono uppercase text-neutral-600 flex items-center gap-1">
            <Shield size={14} />
            <span>Auth Service</span>
          </div>
          <div className="text-sm font-black font-mono mt-1 text-green-700">ONLINE (Port 8001)</div>
        </div>

        <div className="border-2 border-black p-4 bg-white">
          <div className="text-xs font-mono uppercase text-neutral-600 flex items-center gap-1">
            <Package size={14} />
            <span>Catalog Service</span>
          </div>
          <div className="text-sm font-black font-mono mt-1 text-green-700">ONLINE (Port 8002)</div>
        </div>

        <div className="border-2 border-black p-4 bg-white">
          <div className="text-xs font-mono uppercase text-neutral-600 flex items-center gap-1">
            <Layers size={14} />
            <span>Scraper Service</span>
          </div>
          <div className="text-sm font-black font-mono mt-1 text-green-700">ONLINE (Port 8004)</div>
        </div>
      </div>

      <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black text-white p-4 font-mono text-xs font-bold uppercase flex justify-between items-center">
          <span>Tracked Catalog Products & Competitor Target Links</span>
          <span>{products.length} Products</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin" />
            <span>Loading admin inventory ledger...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-neutral-100">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Our Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Competitor Target URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="p-3 font-bold">{p.name}</td>
                    <td className="p-3 text-neutral-600">{p.category?.name || 'Hardware'}</td>
                    <td className="p-3 font-black">${p.price.toFixed(2)}</td>
                    <td className="p-3">{p.inventoryCount} units</td>
                    <td className="p-3">
                      {p.competitorUrl ? (
                        <a
                          href={p.competitorUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 max-w-xs truncate"
                        >
                          <span className="truncate">{p.competitorUrl}</span>
                          <ExternalLink size={12} className="flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-neutral-400">None configured</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
