import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { RotateCw } from 'lucide-react';

export default function Header({ refreshing, onRefresh }) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#FBF8EF]/95 backdrop-blur-md border-b border-cream-300 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & Brand Identity */}
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Logo Mark Inspired by Menu Board */}
          <div className="w-9 h-9 rounded-lg bg-terracotta-700 text-cream-50 flex items-center justify-center shadow-soft-card border border-terracotta-800/40 transform group-hover:rotate-1 transition">
            <span className="font-serif font-bold text-lg leading-none tracking-tight">A</span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight text-darkbrown-900 tracking-wide">
              CAFÉ AURORA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-terracotta-700 font-medium -mt-0.5">
              Goa · Est. Heritage
            </span>
          </div>
        </Link>

        {/* Actions: Refresh & Language Selector */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              title={t('refreshMenu')}
              className="p-1.5 rounded-full text-darkbrown-600 hover:text-terracotta-700 hover:bg-cream-200 transition active:scale-95 disabled:opacity-50"
              aria-label={t('refreshMenu')}
            >
              <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-terracotta-600' : ''}`} />
            </button>
          )}

          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
