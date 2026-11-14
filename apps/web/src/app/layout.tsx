import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal } from '../components/AuthModal';

export const metadata: Metadata = {
  title: 'KromaCommerce | Competitive Price Intelligence E-Commerce',
  description: 'Enterprise-grade microservices e-commerce platform with automated Playwright price intelligence engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <CartDrawer />
        <AuthModal />
        <Footer />
      </body>
    </html>
  );
}
