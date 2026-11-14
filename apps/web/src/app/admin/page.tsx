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
  LogIn,
  Activity,
  TrendingDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Product } from '../../types';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth-store';

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
      <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-xs flex items-center justify-center gap-3 text-slate-600 text-xs font-semibold">
        <RefreshCw size={20} className="animate-spin text-indigo-600" />
        <span>Verifying administrator credentials...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-600">
          <Lock size={28} />
        </div>
        <div className="text-xs font-semibold text-amber-600 uppercase mb-2">401 Unauthorized</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Authentication Required
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          You must authenticate with an account holding the <span className="font-bold text-slate-800">ADMIN</span> role to access catalog controls and Playwright scraping triggers.
        </p>
        <div className="space-y-3">
          <button
            onClick={openAuthModal}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={15} />
            <span>Sign In as Administrator</span>
          </button>
          <Link
            href="/"
            className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-rose-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5 text-rose-600">
          <ShieldAlert size={28} />
        </div>
        <div className="text-xs font-semibold text-rose-600 uppercase mb-2">403 Forbidden</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Administrator Clearance Required
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-2">
          Authenticated as <span className="font-semibold text-slate-800">{user.email}</span> with role <span className="font-bold text-rose-600">[CUSTOMER]</span>.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          This portal requires elevated [ADMIN] privileges to access.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => { logout(); openAuthModal(); }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Switch to Administrator Account
          </button>
          <Link
            href="/"
            className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Calculate high-level stats
  const totalSnapshots = products.reduce((acc, p) => acc + (p.competitorPriceRecords?.length || 0), 0);
  const cheaperCount = products.filter((p) => {
    const rec = p.competitorPriceRecords?.[0];
    return rec && rec.price > p.price;
  }).length;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Storefront</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Shield size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admin & Scraping Console
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            RBAC Clearance: {user.email} (Role: <span className="font-bold text-slate-800">ADMIN</span>)
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={syncing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Crawling Targets via Playwright...' : 'Run Playwright Price Sync'}</span>
        </button>
      </div>

      {/* Microservice Topology Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">Services:</span>
        <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold shadow-2xs">API Gateway</span>
        <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold shadow-2xs">Auth Service</span>
        <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold shadow-2xs">Catalog Service</span>
        <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold shadow-2xs">Scraper Service</span>
      </div>

      {/* Sync Status Banner */}
      {syncResult && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          syncResult.startsWith('Sync Error')
            ? 'bg-rose-50 border border-rose-200 text-rose-800'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {syncResult.startsWith('Sync Error') ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{syncResult}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Catalog Coverage
          </span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            {products.length} Products
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Active items managed in PostgreSQL
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Competitor Intelligence
          </span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            {totalSnapshots} Snapshots
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
            <CheckCircle2 size={13} />
            {cheaperCount} items cheaper than competitors
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Playwright Engine
          </span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Scraper Microservice on Port 8004
          </span>
        </div>
      </div>

      {/* Product Catalog & Price Intelligence Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Tracked Catalog Products & Competitor Target Links</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live comparisons against scraped competitor stores</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Page 1 of 1</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-indigo-600" />
            <span>Loading admin matrix...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Our Price</th>
                  <th className="py-3 px-4">Competitor Target URL</th>
                  <th className="py-3 px-4">Competitor Price</th>
                  <th className="py-3 px-4">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const rec = product.competitorPriceRecords?.[0];
                  const hasRec = rec !== undefined;
                  const isCheaper = hasRec && rec.price > product.price;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[220px] truncate">
                        <Link href={`/products/${product.slug}`} className="hover:text-indigo-600 transition-colors">
                          {product.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                          {product.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {hasRec ? (
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[130px]">{rec.competitorName}</span>
                            <a
                              href={rec.competitorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None tracked</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {hasRec ? `$${rec.price.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {hasRec ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isCheaper ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isCheaper ? `-${Math.abs(rec.differencePercentage)}%` : `+${rec.differencePercentage}%`}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
