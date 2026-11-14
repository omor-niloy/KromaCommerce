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
  User as UserIcon
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

  const handleCreatePendingOrder = async () => {
    if (!user) {
      setOpen(false);
      openAuthModal();
      return;
    }

    if (items.length === 0) return;

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
      setOpen(false);
      setStep('cart');

      // Navigate to order confirmation showing PENDING status and gateway down notice
      router.push(`/order/success?order_id=${order.id}&status=PENDING`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Order creation failed');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end">
      <div className="w-full max-w-md bg-white border-l-2 border-black flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
          <div className="flex items-center gap-2">
            {step === 'cart' && <ShoppingBag size={18} />}
            {step === 'shipping' && <MapPin size={18} />}
            {step === 'payment' && <CreditCard size={18} />}
            <span className="font-black tracking-wider uppercase text-sm font-mono">
              {step === 'cart' && `Your Cart (${items.length})`}
              {step === 'shipping' && 'Shipping Address'}
              {step === 'payment' && 'Payment Options'}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-neutral-800"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="grid grid-cols-3 border-b-2 border-black font-mono text-[10px] font-bold uppercase text-center bg-neutral-100">
          <button
            type="button"
            onClick={() => setStep('cart')}
            className={`py-2 border-r border-black ${
              step === 'cart' ? 'bg-black text-white' : 'hover:bg-neutral-200'
            }`}
          >
            1. Cart
          </button>
          <button
            type="button"
            onClick={() => {
              if (user && items.length > 0) setStep('shipping');
            }}
            className={`py-2 border-r border-black ${
              step === 'shipping' ? 'bg-black text-white' : 'hover:bg-neutral-200'
            }`}
          >
            2. Shipping
          </button>
          <button
            type="button"
            disabled={!shippingAddress.streetAddress}
            onClick={() => {
              if (shippingAddress.streetAddress) setStep('payment');
            }}
            className={`py-2 ${
              step === 'payment' ? 'bg-black text-white' : 'hover:bg-neutral-200 disabled:opacity-40'
            }`}
          >
            3. Payment
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500 text-white p-3 text-xs font-mono border-b-2 border-black">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: CART ITEMS */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-sm">
                  <ShoppingBag size={48} className="mx-auto mb-3 text-neutral-400" />
                  <p>Your shopping cart is currently empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="border-2 border-black p-3 flex gap-3 bg-white"
                  >
                    <div className="relative w-20 h-20 border border-black bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs line-clamp-1">{item.product.name}</h4>
                        <div className="text-sm font-black font-mono mt-1">
                          ${item.product.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-black">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-neutral-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-neutral-200"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-neutral-500 hover:text-black p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t-2 border-black p-4 bg-neutral-50 font-mono">
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span className="font-bold">FREE</span>
                  </div>
                  <div className="border-t border-black pt-2 flex justify-between text-base font-black">
                    <span>Total</span>
                    <span>${total.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={handleStartCheckout}
                  disabled={checkingOut}
                  className="w-full bg-black text-white border-2 border-black py-3 px-4 font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
                >
                  <MapPin size={16} />
                  <span>
                    {user ? 'Proceed to Shipping Address' : 'Sign In to Checkout'}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: SHIPPING ADDRESS FORM */}
        {step === 'shipping' && (
          <form onSubmit={handleValidateShipping} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              <div className="bg-neutral-100 p-2.5 border border-black text-[11px] flex items-center gap-1.5">
                <MapPin size={14} className="flex-shrink-0" />
                <span>Enter your delivery address to proceed with order fulfillment.</span>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1 text-[11px]">Recipient Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                  />
                  <UserIcon size={14} className="absolute right-3 top-2.5 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1 text-[11px]">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase mb-1 text-[11px]">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="e.g. Springfield"
                    className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1 text-[11px]">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="e.g. OR"
                    className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase mb-1 text-[11px]">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="e.g. 97477"
                    className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1 text-[11px]">Country *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full border-2 border-black p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-500">
                Order Total: <span className="font-bold text-black">${total.toFixed(2)} USD</span> (Free shipping)
              </div>
            </div>

            <div className="border-t-2 border-black p-4 bg-neutral-50 space-y-2 font-mono">
              <button
                type="submit"
                className="w-full bg-black text-white border-2 border-black py-3 px-4 font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-neutral-800"
              >
                <CreditCard size={16} />
                <span>Proceed to Payment</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full bg-white text-black border-2 border-black py-2.5 px-4 font-bold text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-100"
              >
                <ArrowLeft size={14} />
                <span>Back to Cart</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT METHOD (GATEWAY DOWN NOTICE) */}
        {step === 'payment' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {/* Shipping Destination summary */}
              <div className="border-2 border-black p-3 bg-neutral-50">
                <div className="flex justify-between items-center mb-1.5 border-b border-black pb-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
                    <MapPin size={12} />
                    <span>Shipping Destination</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-black underline font-bold text-[10px] uppercase"
                  >
                    Edit
                  </button>
                </div>
                <div className="font-bold text-xs">{shippingAddress.fullName}</div>
                <div className="text-neutral-700">{shippingAddress.streetAddress}</div>
                <div className="text-neutral-700">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </div>
                <div className="text-neutral-700">{shippingAddress.country}</div>
              </div>

              {/* Payment Option */}
              <div className="border-2 border-black p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 font-bold uppercase text-xs">
                    <CreditCard size={16} />
                    <span>Credit / Debit Card</span>
                  </div>
                  <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 border border-black uppercase">
                    Unavailable
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Automated online card clearance via payment gateway.
                </p>
              </div>

              {/* PAYMENT GATEWAY CURRENTLY DOWN ALERT BANNER */}
              <div className="border-2 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center gap-2 font-black uppercase text-xs">
                  <AlertTriangle size={18} className="flex-shrink-0" />
                  <span>Payment Gateway Currently Down</span>
                </div>
                <p className="text-xs leading-relaxed text-white">
                  Notice: Our online payment gateway is currently down for maintenance. We cannot process direct card payments at this time.
                </p>
                <div className="bg-black text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider inline-block border border-white/20">
                  Not Paid Directly
                </div>
              </div>

              {/* Order total ledger */}
              <div className="border-2 border-black p-3 bg-neutral-100 space-y-1">
                <div className="flex justify-between">
                  <span>Order Items ({items.length}):</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping:</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="border-t border-black pt-1 flex justify-between font-black text-sm">
                  <span>Total Amount Due:</span>
                  <span>${total.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t-2 border-black p-4 bg-neutral-50 space-y-2 font-mono">
              {/* Disabled direct payment button */}
              <button
                type="button"
                disabled
                className="w-full bg-neutral-300 text-neutral-600 border-2 border-black py-3 px-4 font-bold text-xs uppercase cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>Payment Gateway Currently Down</span>
              </button>

              {/* Place Order as Pending (Not Paid Directly) */}
              <button
                type="button"
                onClick={handleCreatePendingOrder}
                disabled={checkingOut}
                className="w-full bg-black text-white border-2 border-black py-3 px-4 font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
              >
                <Package size={16} />
                <span>{checkingOut ? 'Submitting Order...' : 'Place Order (Payment Pending)'}</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="w-full bg-white text-black border-2 border-black py-2.5 px-4 font-bold text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-100"
              >
                <ArrowLeft size={14} />
                <span>Back to Shipping Address</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};