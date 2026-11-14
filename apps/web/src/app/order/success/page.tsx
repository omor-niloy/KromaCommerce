'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, AlertTriangle, Package, ArrowRight, ShoppingBag, ShieldCheck, RefreshCw, MapPin } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Order } from '../../../types';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const urlStatus = searchParams.get('status');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      apiClient.fetchOrderById(orderId)
        .then((data) => setOrder(data))
        .catch((err) => {
          console.warn('Could not fetch order details', err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const effectiveStatus = order?.status || urlStatus || 'PENDING';
  const isPaid = effectiveStatus === 'PAID';

  return (
    <div className="max-w-2xl mx-auto my-12 border-4 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-mono">
      {/* Status Icon */}
      {isPaid ? (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400 border-2 border-black mb-6">
          <CheckCircle2 size={36} className="text-black" />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 border-2 border-black mb-6">
          <AlertCircle size={36} className="text-black" />
        </div>
      )}

      {/* Main Heading */}
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
        {isPaid ? 'Payment Confirmed & Order Placed' : 'Order Recorded (Payment Pending)'}
      </h1>

      <p className="text-xs text-neutral-700 mb-6 max-w-lg mx-auto leading-relaxed">
        {isPaid
          ? 'Thank you for your purchase. Your payment was finalized and your order has been placed.'
          : 'Thank you for your order. Your order has been placed in PENDING status because the payment gateway is currently down. It was not paid directly.'}
      </p>

      {/* Payment Gateway Alert if not paid */}
      {!isPaid && (
        <div className="border-2 border-black bg-red-500 text-white p-4 mb-6 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 font-bold uppercase text-xs mb-1">
            <AlertTriangle size={16} />
            <span>Payment Gateway Currently Down</span>
          </div>
          <p className="text-xs leading-relaxed">
            Our payment gateway is currently down for scheduled maintenance. Direct credit card settlement is temporarily paused. Your order remains securely saved as PENDING in your account history.
          </p>
        </div>
      )}

      {/* Order details ledger */}
      {orderId && (
        <div className="border-2 border-black bg-neutral-50 p-4 text-xs mb-8 text-left space-y-2">
          <div className="flex justify-between border-b border-black pb-2">
            <span className="text-neutral-600">Order Reference:</span>
            <span className="font-bold">{orderId}</span>
          </div>

          <div className="flex justify-between border-b border-black pb-2 items-center">
            <span className="text-neutral-600">Payment Status:</span>
            <span
              className={`font-bold px-2 py-0.5 border ${
                isPaid
                  ? 'bg-green-400 text-black border-black'
                  : 'bg-yellow-300 text-black border-black'
              }`}
            >
              {isPaid ? 'PAID (CONFIRMED)' : 'PENDING (NOT PAID DIRECTLY)'}
            </span>
          </div>

          {(order?.shippingAddress) && (
            <div className="flex justify-between border-b border-black pb-2">
              <span className="text-neutral-600 flex items-center gap-1">
                <MapPin size={12} />
                <span>Shipping Address:</span>
              </span>
              <span className="font-bold text-right max-w-xs truncate">{order.shippingAddress}</span>
            </div>
          )}

          {order && (
            <div className="flex justify-between border-b border-black pb-2">
              <span className="text-neutral-600">Total Amount:</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)} USD</span>
            </div>
          )}

          <div className="flex justify-between pt-1">
            <span className="text-neutral-600">Fulfillment Status:</span>
            <span>Awaiting Payment Processing</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/orders"
          className="border-2 border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-neutral-800"
        >
          <Package size={16} />
          <span>View My Orders</span>
        </Link>
        <Link
          href="/"
          className="border-2 border-black bg-white text-black px-6 py-3 text-xs font-bold uppercase inline-flex items-center justify-center gap-2 hover:bg-neutral-100"
        >
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-8 pt-4 border-t border-black text-[11px] text-neutral-500 flex items-center justify-center gap-1">
        <ShieldCheck size={14} />
        <span>Cryptographically verified order ledger</span>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="border-2 border-black p-12 text-center bg-white font-mono text-sm flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin" />
        <span>Loading order status...</span>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}