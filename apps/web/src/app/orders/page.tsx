'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
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
      <div className="border-4 border-black bg-white p-12 text-center max-w-xl mx-auto my-8 font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <Package size={40} className="mx-auto mb-3" />
        <h2 className="text-xl font-bold uppercase mb-2">Authentication Required</h2>
        <p className="text-xs text-neutral-600 mb-6">
          Please sign in to view your complete order history and tracking information.
        </p>
        <button
          onClick={openAuthModal}
          className="border-2 border-black bg-black text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-neutral-800"
        >
          Sign In Now
        </button>
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
        <span>Return to Catalog</span>
      </Link>

      <div className="flex justify-between items-baseline border-b-4 border-black pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Your Order History</h1>
          <p className="text-xs font-mono text-neutral-600 mt-1">
            Tracking customer records for {user.email}
          </p>
        </div>
        <div className="font-mono text-xs font-bold bg-black text-white px-3 py-1">
          {orders.length} TOTAL ORDERS
        </div>
      </div>

      {loading ? (
        <div className="border-2 border-black p-12 text-center font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw size={16} className="animate-spin" />
          <span>Fetching order ledger from Order microservice...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="border-2 border-black p-12 text-center bg-white font-mono">
          <ShoppingBag size={40} className="mx-auto mb-3 text-neutral-400" />
          <p className="font-bold text-sm mb-1">No Orders Found</p>
          <p className="text-xs text-neutral-600 mb-6">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/"
            className="border-2 border-black bg-black text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-neutral-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="bg-black text-white p-4 flex flex-wrap justify-between items-center text-xs font-mono gap-2">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-neutral-400">ORDER ID: </span>
                    <span className="font-bold">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-bold uppercase border ${
                      order.status === 'PAID'
                        ? 'bg-green-400 text-black border-black'
                        : 'bg-yellow-300 text-black border-black'
                    }`}
                  >
                    STATUS: {order.status}
                  </span>
                  <span className="text-base font-black font-mono">
                    ${order.totalAmount.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="p-4 divide-y divide-black/20">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex justify-between items-center text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-sm">{item.productName}</div>
                      <div className="text-neutral-600">
                        Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-bold text-sm">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
