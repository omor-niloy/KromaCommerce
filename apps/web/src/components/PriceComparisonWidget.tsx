'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { PriceComparisonSummary } from '../types';
import { apiClient } from '../lib/api-client';

interface PriceComparisonWidgetProps {
  productId: string;
  ourPrice: number;
}

export const PriceComparisonWidget: React.FC<PriceComparisonWidgetProps> = ({
  productId,
  ourPrice,
}) => {
  const [comparison, setComparison] = useState<PriceComparisonSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.fetchComparison(productId);
      setComparison(data);
    } catch {
      // Comparison data might not be ready yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await apiClient.triggerPriceSync();
      await loadData();
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 my-6 shadow-xs">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <RefreshCw size={16} className="animate-spin text-indigo-600" />
          <span>Polling Playwright Price Intelligence Feed...</span>
        </div>
      </div>
    );
  }

  if (!comparison || comparison.records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 my-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Competitor Price Intelligence</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">No active competitor snapshots recorded yet for this item.</p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Crawling Competitors...' : 'Trigger Playwright Sync'}</span>
        </button>
      </div>
    );
  }

  const lowest = comparison.lowestCompetitorPrice || ourPrice;
  const priceDifference = Math.round((lowest - ourPrice) * 100) / 100;
  const isCheaper = priceDifference > 0;
  const savingsPct = Math.round((Math.abs(priceDifference) / lowest) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 my-8 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">
              Competitor Price Intelligence
            </span>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              PLAYWRIGHT AUTOMATED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time headless DOM extraction tracking market competitor variances
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
          <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
        </button>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Our Store Price
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight mt-1 block">
            ${ourPrice.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Fair price guaranteed
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Lowest Competitor
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight mt-1 block">
            ${lowest.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across tracked stores
          </span>
        </div>

        <div className={`rounded-xl p-4 border ${
          isCheaper ? 'bg-emerald-50/70 border-emerald-200/60' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Price Advantage
          </span>
          <div className="flex items-center gap-2 mt-1">
            {isCheaper ? (
              <TrendingDown size={22} className="text-emerald-600" />
            ) : (
              <TrendingUp size={22} className="text-amber-600" />
            )}
            <span className={`text-2xl font-black tracking-tight ${
              isCheaper ? 'text-emerald-700' : 'text-slate-900'
            }`}>
              {isCheaper ? `-${savingsPct}%` : 'Fair'}
            </span>
          </div>
          <span className={`text-[11px] font-medium mt-0.5 block ${
            isCheaper ? 'text-emerald-700' : 'text-slate-500'
          }`}>
            {isCheaper ? `You save $${priceDifference.toFixed(2)} with Kroma` : 'Competitively matched'}
          </span>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/80 flex justify-between items-center text-xs font-semibold text-slate-600">
          <span>Tracked Competitor Snapshots</span>
          <span>{comparison.records.length} records active</span>
        </div>
        <div className="divide-y divide-slate-100">
          {comparison.records.map((rec) => {
            const diff = ourPrice - rec.price;
            const diffPct = Math.round((Math.abs(diff) / rec.price) * 100);
            return (
              <div
                key={rec.id}
                className="px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {rec.competitorName}
                    </span>
                    <a
                      href={rec.competitorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Inspect Competitor Target"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={11} />
                    Scraped {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700">
                    ${rec.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      rec.price > ourPrice
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rec.price > ourPrice
                      ? `Our store is ${diffPct}% cheaper`
                      : `Matched / Competitive`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
