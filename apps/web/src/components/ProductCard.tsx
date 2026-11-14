'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cart-store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const competitorRecord = product.competitorPriceRecords?.[0];
  const hasCompetitor = competitorRecord !== undefined;
  const isOurPriceLower = hasCompetitor && competitorRecord.price > product.price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square bg-slate-100 overflow-hidden"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Savings Badge */}
        {hasCompetitor && isOurPriceLower && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <TrendingDown size={13} />
            <span>SAVE {Math.abs(competitorRecord.differencePercentage)}%</span>
          </div>
        )}

        {/* Stock Status Pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200/50 shadow-xs">
          {product.inventoryCount} in stock
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
            {product.category?.name || 'Category'}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-slate-900 text-base line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Our Verified Price</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {hasCompetitor && (
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-400 block truncate max-w-[120px]">
                  {competitorRecord.competitorName}
                </span>
                <span className="text-sm line-through text-slate-400 font-semibold">
                  ${competitorRecord.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={`/products/${product.slug}`}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight size={13} />
            </Link>
            <button
              onClick={() => addItem(product)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow"
            >
              <ShoppingCart size={13} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
