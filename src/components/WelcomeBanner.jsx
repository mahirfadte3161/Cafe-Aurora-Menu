import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, UtensilsCrossed, Clock, MapPin } from 'lucide-react';

export default function WelcomeBanner() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 my-4 bg-gradient-to-br from-terracotta-800 via-terracotta-700 to-terracotta-900 text-cream-50 shadow-soft-hover border border-terracotta-900/40">
      {/* Decorative Portuguese Azulejo Accent Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="relative p-5 sm:p-6 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-50/15 backdrop-blur-sm border border-cream-100/20 text-[11px] font-medium tracking-wide">
            <Sparkles className="w-3 h-3 text-gold-accent" />
            <span>Traditional Goan Cuisine</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] text-cream-200">
            <MapPin className="w-3 h-3" />
            <span>Fontainhas, Goa</span>
          </div>
        </div>

        {/* Welcome Headline & Tagline */}
        <div className="space-y-1.5 mb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cream-50 leading-tight">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-cream-100/90 leading-relaxed max-w-lg">
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* Dine-In QR Menu Notice Banner */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-darkbrown-900/40 border border-cream-100/15 backdrop-blur-xs text-[11px] text-cream-100">
          <UtensilsCrossed className="w-4 h-4 text-gold-accent shrink-0" />
          <span className="leading-snug">{t('tableDineInNote')}</span>
        </div>
      </div>
    </div>
  );
}
