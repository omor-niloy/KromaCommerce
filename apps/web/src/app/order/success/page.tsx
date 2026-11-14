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
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm text-center">
      {/* Status Icon */}
      {isPaid ? (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-6 text-emerald-600">
          <CheckCircle2 size={36} />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 mb-6 text-amber-600">
          <AlertCircle size={36} />
        </div>
      )}

      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
        {isPaid ? 'Payment Confirmed & Order Placed' : 'Order Recorded (Payment Pending)'}
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
        {isPaid
          ? 'Thank you for your purchase. Your payment was finalized and your order has been placed.'
          : 'Thank you for your order. Your order has been placed in PENDING status because the payment gateway is currently down. It was not paid directly.'}
      </p>

      {/* Payment Gateway Alert if not paid */}
      {!isPaid && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 mb-8 text-left text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800 mb-1.5">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>Payment Gateway Currently Down</span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            Our payment gateway is currently down for scheduled maintenance. Direct credit card settlement is temporarily paused. Your order remains securely saved as PENDING in your account history.
          </p>
        </div>
      )}

      {/* Order Details Card */}
      {orderId && (
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 text-left mb-8 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Order Reference</span>
              <span className="font-mono text-xs font-bold text-slate-900 select-all">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isPaid ? 'PAID' : 'PENDING (NOT PAID DIRECTLY)'}
              </span>
            </div>
          </div>

          {/* Shipping Address Display */}
          {order?.shippingAddress && (
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <MapPin size={14} className="text-indigo-600" />
                <span>Delivery Address</span>
              </div>
              <p className="text-xs text-slate-600 bg-white border border-slate-200/60 rounded-xl p-3 leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          )}

          {/* Items Preview */}
          {order?.items && order.items.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">Order Items:</span>
              <div className="divide-y divide-slate-100 bg-white border border-slate-200/60 rounded-xl overflow-hidden">
                {order.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{item.productName}</span>
                      <span className="text-slate-400 ml-2">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-800">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order && (
            <div className="pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
              <span className="font-semibold text-xs text-slate-600">Total Order Amount:</span>
              <span className="font-black text-xl text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Next Steps Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/orders"
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Package size={14} />
          <span>View My Orders</span>
        </Link>
        <Link
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag size={14} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center max-w-lg mx-auto my-12">
        <RefreshCw size={22} className="animate-spin text-indigo-600 mx-auto mb-2" />
        <span className="text-xs text-slate-500 font-semibold">Loading confirmation details...</span>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
