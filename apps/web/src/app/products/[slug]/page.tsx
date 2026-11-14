'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Shield,
  Truck,
  RotateCcw,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { Product } from '../../../types';
import { apiClient } from '../../../lib/api-client';
import { useCartStore } from '../../../store/cart-store';
import { PriceComparisonWidget } from '../../../components/PriceComparisonWidget';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params['slug'] as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.fetchProduct(slug)
      .then((data) => setProduct(data))
      .catch((err) => setErrorMsg(err instanceof Error ? err.message : 'Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-xs flex items-center justify-center gap-3">
        <RefreshCw size={22} className="animate-spin text-indigo-600" />
        <span className="text-sm font-semibold text-slate-600">Retrieving product specifications...</span>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center max-w-lg mx-auto my-12 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{errorMsg || 'The requested product could not be located.'}</p>
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const competitorRecord = product.competitorPriceRecords?.[0];
  const hasCompetitor = competitorRecord !== undefined;
  const isOurPriceLower = hasCompetitor && competitorRecord.price > product.price;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to All Products</span>
      </Link>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        {/* Product Image Showcase */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          {hasCompetitor && isOurPriceLower && (
            <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
              <TrendingDown size={14} />
              <span>SAVE {Math.abs(competitorRecord.differencePercentage)}% VS COMPETITORS</span>
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category & Stock Indicators */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category?.name || 'Hardware'}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{product.inventoryCount} Available in Stock</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Pricing Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 mb-6">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">Verified Fair Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      ${product.price.toFixed(2)}
                    </span>
                    {hasCompetitor && (
                      <span className="text-sm line-through text-slate-400 font-semibold">
                        ${competitorRecord.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {hasCompetitor && isOurPriceLower && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full block">
                      ${(competitorRecord.price - product.price).toFixed(2)} cheaper than market
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1 w-full sm:w-auto justify-between">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <Minus size={15} />
                </button>
                <span className="px-5 font-bold text-sm text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.inventoryCount, quantity + 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Truck size={18} className="text-indigo-600 shrink-0" />
              <span>Fast Tracked Dispatch</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Shield size={18} className="text-emerald-600 shrink-0" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <RotateCcw size={18} className="text-amber-600 shrink-0" />
              <span>Verified Fair Price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Live Price Intelligence */}
      <PriceComparisonWidget productId={product.id} ourPrice={product.price} />
    </div>
  );
}
