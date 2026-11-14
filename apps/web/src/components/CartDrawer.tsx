'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MapPin,
  AlertTriangle,
  Lock,
  Package,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { useAuthStore } from '../store/auth-store';
import { apiClient } from '../lib/api-client';

type CheckoutStep = 'cart' | 'shipping' | 'payment';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { items, isOpen, setOpen, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore();
  const { user, openAuthModal } = useAuthStore();
  
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  useEffect(() => {
    if (user && !shippingAddress.fullName) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || ''
      }));
    }
  }, [user, shippingAddress.fullName]);

  // Reset to cart step whenever drawer closes
  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = getTotalAmount();

  const handleStartCheckout = () => {
    if (!user) {
      setOpen(false);
      openAuthModal();
      return;
    }
    if (items.length === 0) return;
    setErrorMsg(null);
    setStep('shipping');
  };

  const handleValidateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName.trim()) {
      setErrorMsg('Full name is required for shipping.');
      return;
    }
    if (!shippingAddress.streetAddress.trim()) {
      setErrorMsg('Street address is required.');
      return;
    }
    if (!shippingAddress.city.trim()) {
      setErrorMsg('City is required.');
      return;
    }
    if (!shippingAddress.state.trim()) {
      setErrorMsg('State / Province is required.');
      return;
    }
    if (!shippingAddress.postalCode.trim()) {
      setErrorMsg('Postal / ZIP code is required.');
      return;
    }

    setErrorMsg(null);
    setStep('payment');
  };

  const handlePlacePendingOrder = async () => {
    setCheckingOut(true);
    setErrorMsg(null);

    try {
      const fullAddressString = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      const res = await apiClient.createOrder(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        fullAddressString
      );

      clearCart();
      setOpen(false);
      router.push(`/order/success?order_id=${res.id}&status=${res.status}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to record order. Please try again.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Your Cart ({items.length})</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-semibold ${
            step === 'cart' ? 'text-indigo-600' : 'text-slate-700'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'cart' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>1</span>
            <span>Items</span>
          </div>
          <span className="text-slate-300">›</span>
          <div className={`flex items-center gap-1.5 font-semibold ${
            step === 'shipping' ? 'text-indigo-600' : step === 'payment' ? 'text-slate-700' : 'text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'shipping' ? 'bg-indigo-600 text-white' : step === 'payment' ? 'bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-400'
            }`}>2</span>
            <span>Shipping</span>
          </div>
          <span className="text-slate-300">›</span>
          <div className={`flex items-center gap-1.5 font-semibold ${
            step === 'payment' ? 'text-indigo-600' : 'text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
            }`}>3</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mb-6">Explore our catalog to find verified fair prices.</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 bg-slate-50/70 border border-slate-100 rounded-xl"
                    >
                      <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-slate-900 text-xs line-clamp-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-sm text-slate-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold px-2 text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {step === 'shipping' && (
            <form id="shipping-form" onSubmit={handleValidateShipping} className="space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <MapPin size={15} className="text-indigo-600" />
                <span>Shipping Address</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Springfield"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="OR"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Postal / ZIP</label>
                  <input
                    type="text"
                    required
                    placeholder="97477"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT REVIEW (OFFLINE BANNER) */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <CreditCard size={15} className="text-indigo-600" />
                <span>Payment Options</span>
              </div>

              {/* Prominent Payment Gateway Notice Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-xs uppercase tracking-wider text-amber-800">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                  <span>Payment Gateway Currently Down</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed mb-3">
                  Our credit card processing provider is currently in scheduled maintenance. You will
                  <span className="font-bold text-amber-900"> Not Paid Directly</span>. Your order will be securely recorded in 
                  <span className="font-bold text-amber-900"> PENDING</span> status.
                </p>

                <button
                  type="button"
                  disabled
                  className="w-full bg-amber-200/50 text-amber-900 border border-amber-300 py-2 px-3 rounded-xl text-xs font-bold uppercase cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Lock size={12} />
                  <span>Payment Gateway Currently Down</span>
                </button>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Ship To:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                    {shippingAddress.fullName}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Address:</span>
                  <span className="font-medium text-slate-700 text-right truncate max-w-[200px]">
                    {shippingAddress.streetAddress}, {shippingAddress.city}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-semibold text-slate-700 text-xs">Total Amount:</span>
                  <span className="font-black text-xl text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer / Action Buttons */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
            {step === 'cart' && (
              <>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-slate-500">Order Subtotal:</span>
                  <span className="text-xl font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleStartCheckout}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Proceed to Shipping Address</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}

            {step === 'shipping' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  form="shipping-form"
                  className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlacePendingOrder}
                  disabled={checkingOut}
                  className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {checkingOut ? (
                    <>
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                      <span>Recording Order...</span>
                    </>
                  ) : (
                    <>
                      <Package size={14} />
                      <span>Place Order (Payment Pending)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
