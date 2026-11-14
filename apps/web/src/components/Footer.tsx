import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Database, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-black bg-white mt-16 text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-black text-xl mb-2">KROMACOMMERCE</div>
            <p className="text-xs font-mono leading-relaxed">
              High-performance microservice e-commerce platform with automated Playwright competitor price intelligence.
            </p>
          </div>

          <div>
            <div className="font-bold text-xs uppercase mb-3 font-mono">Microservices</div>
            <ul className="text-xs space-y-1 font-mono">
              <li>API Gateway (Port 8000)</li>
              <li>Auth Service (Port 8001)</li>
              <li>Catalog Service (Port 8002)</li>
              <li>Order Service (Port 8003)</li>
              <li>Scraper Service (Port 8004)</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-xs uppercase mb-3 font-mono">Free-Tier Cloud Infra</div>
            <ul className="text-xs space-y-1 font-mono">
              <li>Vercel: Next.js Frontend</li>
              <li>Neon / Supabase: PostgreSQL</li>
              <li>Render / Koyeb: Express Services</li>
              <li>Playwright: Competitor Engine</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-xs uppercase mb-3 font-mono">Engineering Standards</div>
            <ul className="text-xs space-y-1 font-mono">
              <li className="flex items-center gap-1"><Cpu size={12} /> Strict OOP Architecture</li>
              <li className="flex items-center gap-1"><Database size={12} /> Connection Pooling</li>
              <li className="flex items-center gap-1"><ShieldCheck size={12} /> Dual-Agent Unbiased QA</li>
              <li className="flex items-center gap-1"><Zap size={12} /> Zero-Commit Governance</li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-black mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono">
          <div>(C) 2026 KromaCommerce. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/" className="hover:underline">Storefront</Link>
            <Link href="/orders" className="hover:underline">Orders</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
