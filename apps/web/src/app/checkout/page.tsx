'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ShieldCheck
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
      <div className="max-w-lg mx-auto my-12 border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white border-2 border-black mb-6">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
          Authentication Required
        </h1>
        <p className="text-xs text-neutral-700 leading-relaxed mb-6">
          Please sign in to your account before proceeding to order checkout and delivery configuration.
        </p>
        <button
          onClick={openAuthModal}
          className="w-full bg-black text-white border-2 border-black py-3 px-4 text-xs font-bold uppercase hover:bg-neutral-800"
        >
          Sign In to Checkout
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-12 border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
        <ShoppingBag size={48} className="mx-auto mb-3 text-neutral-400" />
        <h1 className="text-xl font-bold uppercase mb-2">Your Cart is Empty</h1>
        <p className="text-xs text-neutral-600 mb-6">
          Add products from our catalog to proceed with shipping and checkout.
        </p>
        <Link
          href="/"
          className="border-2 border-black bg-black text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-neutral-800 inline-block"
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
      setErrorMsg('Complete city, state, and postal code are required.');
      return;
    }

    try {
      setCheckingOut(true);
      setErrorMsg(null);

      const orderItems = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity
      }));

      const formattedAddress = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      // Create order with shipping address in PENDING status (not paid directly)
      const order = await apiClient.createOrder(orderItems, formattedAddress);

      clearCart();
      router.push(`/order/success?order_id=${order.id}&status=PENDING`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Order submission failed');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 font-mono">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase mb-6 hover:underline"
      >
        <ArrowLeft size={14} />
        <span>Return to Storefront</span>
      </Link>

      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">Checkout & Shipping</h1>
        <p className="text-xs text-neutral-600 mt-1">
          Complete your delivery details. Payment processing is currently offline.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-500 text-white p-3 text-xs mb-6 border-2 border-black">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <form onSubmit={handlePlacePendingOrder} className="md:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4 font-bold uppercase text-sm">
              <MapPin size={18} />
              <span>1. Shipping Address</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Recipient Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                  />
                  <UserIcon size={14} className="absolute right-3 top-3 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  placeholder="e.g. 100 Main Street, Suite 400"
                  className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="e.g. Seattle"
                    className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="e.g. WA"
                    className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase mb-1">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="e.g. 98101"
                    className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full border-2 border-black p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Option (Gateway Down) */}
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4 font-bold uppercase text-sm">
              <CreditCard size={18} />
              <span>2. Payment Option</span>
            </div>

            <div className="border-2 border-black p-4 mb-4 bg-neutral-50 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold uppercase">Credit / Debit Card Online Payment</div>
                <div className="text-neutral-600 text-[11px] mt-0.5">Automated clearing via payment gateway</div>
              </div>
              <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 border border-black uppercase">
                Gateway Offline
              </span>
            </div>

            {/* PAYMENT GATEWAY CURRENTLY DOWN ALERT */}
            <div className="border-2 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center gap-2 font-black uppercase text-xs">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <span>Payment Gateway Currently Down</span>
              </div>
              <p className="text-xs leading-relaxed">
                Notice: Our payment gateway is currently down for maintenance. Direct online card clearance cannot be processed directly at this time.
              </p>
              <div className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase inline-block border border-white/20">
                Not Paid Directly
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled
                className="w-full bg-neutral-300 text-neutral-600 border-2 border-black py-3 px-4 font-bold text-xs uppercase cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>Payment Gateway Currently Down</span>
              </button>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full bg-black text-white border-2 border-black py-3.5 px-4 font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
              >
                <Package size={16} />
                <span>{checkingOut ? 'Recording Order...' : 'Place Order (Payment Pending)'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Order Summary */}
        <div className="space-y-4">
          <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-bold uppercase text-xs border-b-2 border-black pb-2 mb-3">
              Order Summary ({items.length} items)
            </h3>

            <div className="divide-y divide-black/20 text-xs mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex justify-between">
                  <div className="pr-2">
                    <div className="font-bold line-clamp-1">{item.product.name}</div>
                    <div className="text-neutral-500 text-[11px]">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-black flex-shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="border-t border-black pt-2 flex justify-between font-black text-sm">
                <span>Total Due</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          <div className="border border-black p-3 bg-neutral-100 text-[11px] text-neutral-600 flex items-center gap-2">
            <ShieldCheck size={16} className="flex-shrink-0 text-black" />
            <span>Orders placed during gateway downtime are reserved in PENDING status.</span>
          </div>
        </div>
      </div>
    </div>
  );
}