import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, MapPin, Wifi, QrCode } from 'lucide-react';

export default function Footer({ lastUpdated, dataSource, onRefresh }) {
  const { t } = useLanguage();

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <footer className="mt-12 border-t border-cream-300 bg-cream-100/70 text-darkbrown-800 pt-8 pb-14 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Brand & Tagline */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-terracotta-700 text-cream-50 font-serif font-bold text-base shadow-xs mb-1">
            A
          </div>
          <h3 className="font-serif font-bold text-lg text-darkbrown-900 tracking-wider">
            CAFÉ AURORA
          </h3>
          <p className="text-xs text-darkbrown-600 max-w-sm mx-auto">
            {t('tagline')}
          </p>
        </div>

        {/* Café Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Hours */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-cream-300/80 shadow-soft-card">
            <div className="p-1.5 rounded-lg bg-terracotta-50 text-terracotta-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-darkbrown-900">{t('footerHoursTitle')}</div>
              <div className="text-darkbrown-600 text-[11px]">{t('footerHoursText')}</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-cream-300/80 shadow-soft-card">
            <div className="p-1.5 rounded-lg bg-mutedgreen-50 text-mutedgreen-700 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-darkbrown-900">{t('footerLocationTitle')}</div>
              <div className="text-darkbrown-600 text-[11px]">{t('footerLocationText')}</div>
            </div>
          </div>

          {/* Guest Wi-Fi */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-cream-300/80 shadow-soft-card">
            <div className="p-1.5 rounded-lg bg-terracotta-50 text-terracotta-700 shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-darkbrown-900">{t('footerWifiTitle')}</div>
              <div className="text-darkbrown-600 text-[11px]">{t('footerWifiText')}</div>
            </div>
          </div>
        </div>

        {/* Sync & Refresh Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-darkbrown-500 border-t border-cream-200">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>
              {formattedTime ? `${t('lastUpdated')}: ${formattedTime}` : t('available')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-darkbrown-400">
              <QrCode className="w-3 h-3" />
              <span>Tabletop QR Menu</span>
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center text-darkbrown-400 leading-normal max-w-md mx-auto">
          {t('footerDisclaimer')}
        </p>
      </div>
    </footer>
  );
}
