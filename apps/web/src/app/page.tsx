'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  TrendingDown,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { apiClient } from '../lib/api-client';
import { Product, Category } from '../types';

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const initialCategory = searchParams.get('category') || undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.fetchCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.warn('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient.fetchProducts({
      search,
      categorySlug: selectedCategory,
      sortBy,
      sortOrder
    })
      .then((res) => {
        setProducts(res.items);
      })
      .catch((err) => {
        console.warn('Failed to load products', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, selectedCategory, sortBy, sortOrder]);

  return (
    <div className="space-y-10">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        {/* Decorative Background Glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 shadow-xs">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Autonomous Competitor Price Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-5">
            Zero-Margin Markup. Verified Fair Pricing.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed max-w-2xl">
            Our embedded Playwright headless crawler continuously scans market competitor catalogs.
            Whenever rivals shift prices, KromaCommerce dynamically recalibrates product listings
            to ensure you receive verified fair market pricing.
          </p>

          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-xl text-slate-200">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Real-Time Headless Browser Crawling</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-xl text-slate-200">
              <Zap size={15} className="text-amber-400" />
              <span>Microservices Monorepo Architecture</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-xl text-slate-200">
              <ShieldCheck size={15} className="text-indigo-300" />
              <span>100% Free-Tier Cloud Deployment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Sorting Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1 shrink-0">
            <Filter size={14} />
            <span>Category:</span>
          </span>
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === undefined
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ArrowUpDown size={14} />
            <span>Sort:</span>
          </span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-colors"
          >
            <option value="createdAt-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Search Query Feedback */}
      {search && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl text-xs text-indigo-900 font-medium">
          <span>Search results matching keyword: &ldquo;{search}&rdquo;</span>
          <button
            onClick={() => window.location.href = '/'}
            className="text-indigo-600 hover:text-indigo-800 font-bold underline text-xs"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-indigo-600" />
          <span className="text-sm font-semibold text-slate-600">Retrieving catalog products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
          <ShoppingBag size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No products match your criteria</h3>
          <p className="text-xs text-slate-500 mb-6">Try clearing your filters or search keywords.</p>
          <button
            onClick={() => { setSelectedCategory(undefined); }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="p-16 text-center text-sm font-semibold text-slate-500">
        Loading KromaCommerce catalog...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
