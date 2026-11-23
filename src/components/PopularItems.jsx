import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import FoodCard from './FoodCard';
import { Sparkles } from 'lucide-react';

export default function PopularItems({ items }) {
  const { t } = useLanguage();

  if (!items || items.length === 0) return null;

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-terracotta-100 text-terracotta-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-darkbrown-900 leading-tight">
              {t('popularSectionTitle')}
            </h2>
            <p className="text-[11px] text-darkbrown-500">
              {t('popularSectionSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column mobile grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {items.map((item) => (
          <FoodCard key={item.Item_ID} item={item} />
        ))}
      </div>
    </section>
  );
}
