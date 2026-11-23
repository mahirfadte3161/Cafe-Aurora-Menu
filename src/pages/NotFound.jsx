import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { UtensilsCrossed, Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8EF]">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-8 rounded-2xl bg-cream-card border border-cream-300 shadow-elevated space-y-4">
          <div className="w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto shadow-inner">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-widest text-terracotta-600 font-bold">
            Page Not Found · 404
          </span>

          <h1 className="font-serif text-2xl font-bold text-darkbrown-900">
            Looks like this table is reserved!
          </h1>

          <p className="text-xs text-darkbrown-600 leading-relaxed">
            The page or category you are looking for does not exist or has been moved.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-700 text-cream-50 font-semibold text-xs hover:bg-terracotta-800 transition shadow-soft-card active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
