'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck
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
      <div className="border-2 border-black p-4 bg-neutral-50 font-mono text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className="animate-spin" />
          <span>Polling Playwright Price Intelligence Feed...</span>
        </div>
      </div>
    );
  }

  if (!comparison || comparison.records.length === 0) {
    return (
      <div className="border-2 border-black p-4 bg-neutral-50 font-mono text-xs">
        <div className="font-bold mb-1">COMPETITOR PRICE INTELLIGENCE</div>
        <p className="text-neutral-600 mb-3">No active competitor snapshots tracked yet.</p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="border-2 border-black px-3 py-1 bg-black text-white hover:bg-neutral-800 flex items-center gap-1.5"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Scraping Live...' : 'Trigger Playwright Sync'}</span>
        </button>
      </div>
    );
  }

  const lowest = comparison.lowestCompetitorPrice || ourPrice;
  const priceDifference = Math.round((lowest - ourPrice) * 100) / 100;
  const isCheaper = priceDifference > 0;
  const savingsPct = Math.round((Math.abs(priceDifference) / lowest) * 100);

  return (
    <div className="border-2 border-black bg-white p-5 my-6">
      <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase tracking-wider font-mono">
              Competitor Price Intelligence
            </span>
            <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-mono">
              PLAYWRIGHT AUTOMATED
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-mono mt-0.5">
            Real-time market audit comparing verified retailer prices.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          title="Refresh Playwright price scan"
          className="border-2 border-black px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1 hover:bg-black hover:text-white transition-colors"
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Scanning...' : 'Sync'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="border-2 border-black p-3 bg-neutral-50">
          <div className="text-xs font-mono uppercase text-neutral-600">Our Price</div>
          <div className="text-2xl font-black font-mono mt-1">${ourPrice.toFixed(2)}</div>
        </div>

        <div className="border-2 border-black p-3 bg-neutral-50">
          <div className="text-xs font-mono uppercase text-neutral-600">Lowest Competitor</div>
          <div className="text-2xl font-black font-mono mt-1 text-neutral-700">
            ${lowest.toFixed(2)}
          </div>
        </div>

        <div className={`border-2 border-black p-3 ${isCheaper ? 'bg-green-400' : 'bg-yellow-300'}`}>
          <div className="text-xs font-mono uppercase text-black font-bold">
            {isCheaper ? 'Customer Advantage' : 'Market Variance'}
          </div>
          <div className="text-2xl font-black font-mono mt-1 flex items-center gap-1 text-black">
            {isCheaper ? <TrendingDown size={22} /> : <TrendingUp size={22} />}
            <span>{isCheaper ? `Save ${savingsPct}%` : `+${savingsPct}%`}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold font-mono uppercase mb-2 flex items-center gap-1">
          <Clock size={12} />
          <span>Historical Competitor Snapshots</span>
        </div>
        <div className="border-2 border-black divide-y-2 divide-black">
          {comparison.records.slice(0, 4).map((record) => (
            <div
              key={record.id}
              className="p-3 flex justify-between items-center text-xs font-mono bg-white hover:bg-neutral-50"
            >
              <div>
                <div className="font-bold flex items-center gap-1">
                  <span>{record.competitorName}</span>
                  <a
                    href={record.competitorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-blue-600"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="text-[11px] text-neutral-500">
                  {new Date(record.createdAt).toLocaleDateString()} at{' '}
                  {new Date(record.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-sm">${record.price.toFixed(2)}</div>
                <div
                  className={`text-[11px] font-bold ${
                    record.price > ourPrice ? 'text-green-700' : 'text-neutral-600'
                  }`}
                >
                  {record.price > ourPrice
                    ? `+$${(record.price - ourPrice).toFixed(2)} higher`
                    : `-$${(ourPrice - record.price).toFixed(2)} lower`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
        <ShieldCheck size={14} />
        <span>Verified by autonomous Playwright headless browser crawler</span>
      </div>
    </div>
  );
};
