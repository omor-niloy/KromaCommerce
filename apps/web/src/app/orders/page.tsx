'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, ArrowLeft, RefreshCw, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { Order } from '../../types';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth-store';

export default function OrdersPage() {
  const { user, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient.fetchOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.warn('Failed to fetch orders', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-16 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Package size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Please sign in to view your complete order history and real-time tracking updates.
        </p>
        <button
          onClick={openAuthModal}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Catalog</span>
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Your Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Account order ledger for {user.email}
          </p>
        </div>
        <div className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
          <RefreshCw size={18} className="animate-spin text-indigo-600" />
          <span>Fetching order ledger from Order microservice...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs max-w-lg mx-auto">
          <ShoppingBag size={44} className="mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No Orders Found</h3>
          <p className="text-xs text-slate-500 mb-6">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isPaid = order.status === 'PAID';
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Order ID: <span className="font-mono text-slate-800 font-bold select-all">{order.id}</span>
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Calendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      STATUS: {order.status}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping info */}
                {order.shippingAddress && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <MapPin size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5">Shipping Destination:</span>
                      <span>{order.shippingAddress}</span>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="divide-y divide-slate-100 pt-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{item.productName}</span>
                        <span className="text-slate-400 ml-2">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-800">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
