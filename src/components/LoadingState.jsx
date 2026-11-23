import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto space-y-6">
      {/* Banner Skeleton */}
      <div className="w-full h-36 rounded-2xl bg-cream-300/50 animate-pulse border border-cream-300" />

      {/* Categories Bar Skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 rounded-xl bg-cream-300/50 animate-pulse shrink-0" />
        ))}
      </div>

      <div className="text-center py-2 text-xs font-medium text-darkbrown-500 animate-pulse">
        {t('loadingMenu')}
      </div>

      {/* Two-Column Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-cream-300 p-2.5 space-y-2 animate-pulse">
            <div className="w-full aspect-[4/3] rounded-xl bg-cream-200" />
            <div className="h-4 bg-cream-200 rounded-md w-3/4" />
            <div className="h-3 bg-cream-200 rounded-md w-1/2" />
            <div className="h-4 bg-cream-200 rounded-md w-1/3 pt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
