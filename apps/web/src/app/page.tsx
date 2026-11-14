'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  TrendingDown,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  RefreshCw
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
    <div>
      <section className="border-4 border-black bg-yellow-400 p-8 md:p-12 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-mono text-xs uppercase font-bold mb-4">
            <TrendingDown size={14} />
            <span>Autonomous Playwright Price Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black uppercase leading-none mb-4">
            Zero-Margin Markup. Verified Fair Pricing.
          </h1>

          <p className="font-mono text-sm md:text-base text-black mb-6 leading-relaxed">
            Our headless Playwright scraper crawls leading competitor storefronts every hour.
            Whenever a competitor adjusts their price, our catalog automatically re-calibrates
            to ensure you never overpay.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5">
              <CheckCircle2 size={16} />
              <span>Real-Time Market Crawl</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5">
              <CheckCircle2 size={16} />
              <span>Stripe & Mock Checkout Modes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5">
              <CheckCircle2 size={16} />
              <span>Zero Free-Tier Cloud Cost</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-2 border-black bg-white p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-xs font-mono font-bold uppercase flex items-center gap-1 mr-2">
            <Filter size={14} />
            <span>Categories:</span>
          </span>
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border border-black ${
              selectedCategory === undefined
                ? 'bg-black text-white'
                : 'bg-white hover:bg-neutral-100'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border border-black whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown size={14} />
          <span className="text-xs font-mono font-bold uppercase">Sort:</span>
          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split(':');
              if (sb && so) {
                setSortBy(sb);
                setSortOrder(so);
              }
            }}
            className="border-2 border-black px-2 py-1 text-xs font-mono bg-white focus:outline-none"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="name:asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {search && (
        <div className="mb-6 font-mono text-xs flex items-center gap-2">
          <span>Search results for:</span>
          <span className="bg-black text-white px-2 py-0.5 font-bold">{search}</span>
        </div>
      )}

      {loading ? (
        <div className="border-2 border-black p-12 text-center bg-white font-mono text-sm flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          <span>Loading catalog inventory...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="border-2 border-black p-12 text-center bg-white font-mono text-sm">
          <Layers size={40} className="mx-auto mb-3 text-neutral-400" />
          <p className="font-bold">No products match your current filters.</p>
          <button
            onClick={() => { setSelectedCategory(undefined); }}
            className="mt-4 border-2 border-black px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="border-2 border-black p-12 text-center bg-white font-mono text-sm flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin" />
        <span>Loading storefront...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
