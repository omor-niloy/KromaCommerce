'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  CreditCard,
  AlertTriangle,
  Lock,
  Package,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '../../store/cart-store';
import { useAuthStore } from '../../store/auth-store';
import { apiClient } from '../../lib/api-client';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalAmount } = useCartStore();
  const { user, openAuthModal } = useAuthStore();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user && !shippingAddress.fullName) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || ''
      }));
    }
  }, [user, shippingAddress.fullName]);

  const total = getTotalAmount();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5 text-indigo-600">
          <Lock size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Authentication Required
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Please sign in to configure delivery options and review your order details.
        </p>
        <button
          onClick={openAuthModal}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
        <p className="text-xs text-slate-500 mb-6">
          Add items from our catalog to proceed with order delivery and checkout.
        </p>
        <Link
          href="/"
          className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handlePlacePendingOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName.trim()) {
      setErrorMsg('Recipient full name is required.');
      return;
    }
    if (!shippingAddress.streetAddress.trim()) {
      setErrorMsg('Street address is required.');
      return;
    }
    if (!shippingAddress.city.trim() || !shippingAddress.state.trim() || !shippingAddress.postalCode.trim()) {
      setErrorMsg('Please complete all city, state, and postal code fields.');
      return;
    }

    setCheckingOut(true);
    setErrorMsg(null);

    try {
      const fullAddressString = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      const res = await apiClient.createOrder(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        fullAddressString
      );

      clearCart();
      router.push(`/order/success?order_id=${res.id}&status=${res.status}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to record order. Please try again.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Catalog</span>
      </Link>

      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your delivery details and order specifications
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2-Column Responsive Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Delivery & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form id="checkout-form" onSubmit={handlePlacePendingOrder} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                <MapPin size={18} className="text-indigo-600" />
                <span>1. Shipping Information</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Terrace, Suite 100"
                    value={shippingAddress.streetAddress}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Springfield"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">State / Province</label>
                    <input
                      type="text"
                      required
                      placeholder="OR"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal / ZIP Code</label>
                    <input
                      type="text"
                      required
                      placeholder="97477"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                <CreditCard size={18} className="text-indigo-600" />
                <span>2. Payment Status & Options</span>
              </div>

              {/* Prominent Payment Offline Warning Box */}
              <div className="p-5 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 mb-4">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                  <span>Payment Gateway Temporarily Offline</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Our credit card processing provider is undergoing scheduled system upgrades.
                  You will <span className="font-bold text-amber-900">not be charged directly</span>.
                  Your order will be preserved and registered with <span className="font-bold text-amber-900">PENDING (Payment Required)</span> status.
                </p>
              </div>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {checkingOut ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Recording Order in Pending State...</span>
                  </>
                ) : (
                  <>
                    <Package size={16} />
                    <span>Place Order (Payment Pending) • ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm sticky top-24 space-y-6">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Summary ({items.length} items)
            </h3>

            {/* Item list */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-xs text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Delivery</span>
                <span className="font-semibold text-emerald-600 uppercase">Free</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Due</span>
                <span className="font-black text-2xl text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Encrypted Checkout & Competitor Fair Price Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
