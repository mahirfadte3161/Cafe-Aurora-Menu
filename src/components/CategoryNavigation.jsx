import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Utensils } from 'lucide-react';

export default function CategoryNavigation({ categories, activeCategoryId }) {
  const { getEntityName, t } = useLanguage();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-serif font-bold text-base sm:text-lg text-darkbrown-900 tracking-tight flex items-center gap-1.5">
          <Utensils className="w-4 h-4 text-terracotta-600" />
          <span>{t('exploreCategoriesTitle')}</span>
        </h2>
      </div>

      {/* Horizontally scrollable category buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.Category_ID;
          const name = getEntityName(cat);

          return (
            <Link
              key={cat.Category_ID}
              to={`/category/${cat.Category_ID}`}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                isActive
                  ? 'bg-terracotta-700 text-white border-terracotta-700 shadow-soft-card'
                  : 'bg-cream-card text-darkbrown-800 border-cream-300 hover:border-terracotta-400 hover:bg-cream-200'
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
