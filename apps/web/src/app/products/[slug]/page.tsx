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
  Minus
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
      <div className="border-2 border-black p-16 text-center font-mono text-sm flex items-center justify-center gap-2">
        <RefreshCw size={20} className="animate-spin" />
        <span>Loading product specifications...</span>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="border-2 border-black p-12 text-center bg-white font-mono">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-sm text-neutral-600 mb-6">{errorMsg || 'The requested product could not be located.'}</p>
        <Link
          href="/"
          className="border-2 border-black bg-black text-white px-4 py-2 text-xs uppercase font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Return to Catalog</span>
        </Link>
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
        <span>Back to All Products</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="border-4 border-black bg-neutral-100 relative aspect-square shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <div className="text-xs font-mono uppercase bg-black text-white px-2 py-0.5 inline-block mb-3">
            {product.category?.name || 'Hardware'}
          </div>

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
            {product.name}
          </h1>

          <div className="border-y-2 border-black py-4 my-4 flex items-baseline justify-between">
            <div>
              <div className="text-xs font-mono text-neutral-600">Our Verified Fair Price</div>
              <div className="text-3xl font-black font-mono mt-0.5">
                ${product.price.toFixed(2)} USD
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2 py-1 bg-green-200 border border-black inline-flex items-center gap-1">
                <Check size={12} />
                <span>{product.inventoryCount > 0 ? `${product.inventoryCount} In Stock` : 'Out of Stock'}</span>
              </span>
            </div>
          </div>

          <p className="text-sm font-mono leading-relaxed text-neutral-800 mb-6">
            {product.description}
          </p>

          <div className="border-2 border-black p-4 bg-neutral-50 mb-6">
            <div className="text-xs font-mono uppercase font-bold mb-3">Select Quantity:</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-black bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-neutral-200"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-mono font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.inventoryCount, q + 1))}
                  className="px-3 py-2 hover:bg-neutral-200"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.inventoryCount === 0}
                className="flex-1 bg-black text-white border-2 border-black py-3 px-6 text-xs font-mono font-bold uppercase hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono border-2 border-black p-3 bg-white">
            <div className="flex items-center gap-1.5">
              <Truck size={16} />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw size={16} />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={16} />
              <span>2-Yr Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <PriceComparisonWidget
          productId={product.id}
          ourPrice={product.price}
        />
      </div>
    </div>
  );
}
