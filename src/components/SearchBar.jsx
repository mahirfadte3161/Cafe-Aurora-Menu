import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, Leaf, Drumstick } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  dietaryFilter,
  setDietaryFilter
}) {
  const { t } = useLanguage();

  return (
    <div className="px-4 mb-4 space-y-2.5">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-darkbrown-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-cream-300 text-darkbrown-900 placeholder:text-darkbrown-400 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-600 transition shadow-soft-card"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 rounded-full text-darkbrown-400 hover:text-darkbrown-800 hover:bg-cream-100 transition"
            aria-label={t('clearSearch')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dietary Quick Filters (All, Veg, Non-Veg) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setDietaryFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
            dietaryFilter === 'ALL'
              ? 'bg-terracotta-700 text-white border-terracotta-700 shadow-xs'
              : 'bg-white text-darkbrown-700 border-cream-300 hover:bg-cream-100'
          }`}
        >
          {t('filterAll')}
        </button>

        <button
          type="button"
          onClick={() => setDietaryFilter('VEG')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
            dietaryFilter === 'VEG'
              ? 'bg-mutedgreen-600 text-white border-mutedgreen-600 shadow-xs'
              : 'bg-white text-darkbrown-700 border-cream-300 hover:bg-cream-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>{t('filterVeg')}</span>
        </button>

        <button
          type="button"
          onClick={() => setDietaryFilter('NON_VEG')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
            dietaryFilter === 'NON_VEG'
              ? 'bg-terracotta-700 text-white border-terracotta-700 shadow-xs'
              : 'bg-white text-darkbrown-700 border-cream-300 hover:bg-cream-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          <span>{t('filterNonVeg')}</span>
        </button>
      </div>
    </div>
  );
}
