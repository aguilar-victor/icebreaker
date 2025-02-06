import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1600&q=80')] mix-blend-overlay opacity-10 bg-cover bg-center fixed"></div>
      <nav className="relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-2 group-hover:scale-105 transition-transform">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <Sparkles className="h-4 w-4 text-pink-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                    Sync&Chat
                  </span>
                  <p className="text-xs text-white/60">Connect ─ Converse</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};