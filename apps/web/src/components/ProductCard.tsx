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
    <div className="border-2 border-black bg-white flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square border-b-2 border-black bg-neutral-100 overflow-hidden group">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {hasCompetitor && isOurPriceLower && (
          <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-1 text-xs font-bold font-mono border-2 border-black flex items-center gap-1">
            <TrendingDown size={14} />
            <span>SAVE {Math.abs(competitorRecord.differencePercentage)}%</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs font-mono uppercase text-neutral-600 mb-1">
            {product.category?.name || 'Category'}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-sm line-clamp-2 hover:underline mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-black">
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <div className="text-xs font-mono text-neutral-600">Our Price</div>
              <div className="text-xl font-black font-mono">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {hasCompetitor && (
              <div className="text-right">
                <div className="text-xs font-mono text-neutral-600">
                  {competitorRecord.competitorName.substring(0, 12)}
                </div>
                <div className="text-sm line-through font-mono text-neutral-500">
                  ${competitorRecord.price.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="border-2 border-black py-2 px-3 text-xs font-bold uppercase text-center hover:bg-neutral-100 flex items-center justify-center gap-1"
            >
              <span>Details</span>
              <ArrowUpRight size={12} />
            </Link>
            <button
              onClick={() => addItem(product)}
              className="bg-black text-white border-2 border-black py-2 px-3 text-xs font-bold uppercase hover:bg-neutral-800 flex items-center justify-center gap-1.5"
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
