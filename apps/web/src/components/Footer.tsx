import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Database, Zap, ExternalLink, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                KC
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">KromaCommerce</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enterprise-grade distributed e-commerce monorepo featuring autonomous Playwright competitor price intelligence and strict OOP design patterns.
            </p>
            <a
              href="https://github.com/omor-niloy/KromaCommerce"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <Github size={14} />
              <span>Inspect Source on GitHub</span>
            </a>
          </div>

          {/* Microservices */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Microservices Architecture
            </h4>
            <ul className="text-xs space-y-2">
              <li className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>API Gateway (Port 8000)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Auth & Identity Service (Port 8001)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Catalog & Search Service (Port 8002)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Order & Checkout Service (Port 8003)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Playwright Scraper Service (Port 8004)</span>
              </li>
            </ul>
          </div>

          {/* Free-Tier Cloud Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Production Cloud Topology
            </h4>
            <ul className="text-xs space-y-2">
              <li className="hover:text-slate-200 transition-colors">
                <span className="text-slate-200 font-semibold">Vercel:</span> Edge Storefront (Next.js 14)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                <span className="text-slate-200 font-semibold">Render:</span> Node.js API Web Service
              </li>
              <li className="hover:text-slate-200 transition-colors">
                <span className="text-slate-200 font-semibold">Neon:</span> Serverless PostgreSQL
              </li>
              <li className="hover:text-slate-200 transition-colors">
                <span className="text-slate-200 font-semibold">Playwright:</span> Headless Browser Worker
              </li>
            </ul>
          </div>

          {/* Engineering Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Software Engineering
            </h4>
            <ul className="text-xs space-y-2.5">
              <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                <Cpu size={14} className="text-indigo-400" />
                <span>OOP Strategy & Repository Patterns</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                <Database size={14} className="text-emerald-400" />
                <span>PgBouncer Connection Pooling</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>Dual-Agent Zero-Bias QA (104+ Tests)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                <Zap size={14} className="text-cyan-400" />
                <span>Fast Refresh & Signal Dev Runner</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>© 2026 KromaCommerce. Enterprise-grade open source e-commerce architecture.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Storefront</Link>
            <Link href="/orders" className="hover:text-slate-300 transition-colors">Order History</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
