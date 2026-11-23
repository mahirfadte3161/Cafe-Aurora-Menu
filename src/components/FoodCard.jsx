import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getItemPriceDisplay } from '../utils/formatPrice';
import { Star, ImageOff } from 'lucide-react';

// Fallback high-quality food pattern image
const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

export default function FoodCard({ item }) {
  const { getEntityName, getEntityDescription, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!item) return null;

  const isAvailable = item.Availability !== false;
  const isVeg = String(item.Food_Type).toLowerCase().includes('veg') && !String(item.Food_Type).toLowerCase().includes('non');
  const isPopular = item.Popular === true;

  const name = getEntityName(item);
  const description = getEntityDescription(item);
  const priceInfo = getItemPriceDisplay(item);

  const imageUrl = item.Image_URL && item.Image_URL.trim() ? item.Image_URL : DEFAULT_FOOD_IMAGE;

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl bg-cream-card border border-cream-300/80 shadow-soft-card overflow-hidden food-card-transition ${
        !isAvailable ? 'opacity-65 filter grayscale-[30%]' : 'hover:shadow-soft-hover hover:-translate-y-0.5'
      }`}
    >
      {/* Top: Food Image Container */}
      <div className="relative w-full aspect-[4/3] bg-cream-200 overflow-hidden">
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-cream-300/60 animate-pulse flex items-center justify-center">
            <span className="text-[10px] text-darkbrown-400 font-medium">Café Aurora</span>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-cream-200 text-darkbrown-400 p-2 text-center">
            <ImageOff className="w-6 h-6 mb-1 opacity-40" />
            <span className="text-[10px]">Photo coming soon</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Dietary Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-2 left-2 z-10">
          <div
            className={`w-4 h-4 rounded-xs border flex items-center justify-center bg-white/95 shadow-xs ${
              isVeg ? 'border-emerald-600' : 'border-red-600'
            }`}
            title={isVeg ? t('veg') : t('nonVeg')}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isVeg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>

        {/* Popular / Recommended Badge */}
        {isPopular && isAvailable && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-terracotta-700/90 text-white text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-xs">
              <Star className="w-2.5 h-2.5 fill-gold-accent text-gold-accent" />
              <span>Chef Pick</span>
            </span>
          </div>
        )}

        {/* Currently Unavailable Overlay Banner */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-darkbrown-900/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center z-20">
            <span className="px-2 py-1 rounded-md bg-white/90 text-darkbrown-900 text-[10px] font-bold tracking-tight shadow-sm">
              {t('currentlyUnavailable')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom: Details & Pricing */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          {/* Item Name */}
          <h3 className="font-serif font-bold text-sm sm:text-base text-darkbrown-900 line-clamp-2 leading-snug tracking-tight mb-1">
            {name}
          </h3>

          {/* Description (2 lines clamp on mobile) */}
          {description && (
            <p className="text-[11px] text-darkbrown-600 line-clamp-2 leading-relaxed mb-2 font-normal">
              {description}
            </p>
          )}
        </div>

        {/* Pricing Area */}
        <div className="pt-2 border-t border-cream-200/80 mt-auto">
          {priceInfo.isDual ? (
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-darkbrown-400 font-semibold">{t('half')}</span>
                <span className="font-bold text-darkbrown-900">{priceInfo.halfPrice}</span>
              </div>
              <span className="text-cream-300 font-light">|</span>
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase tracking-wider text-darkbrown-400 font-semibold">{t('full')}</span>
                <span className="font-bold text-terracotta-700">{priceInfo.fullPrice}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-wider text-darkbrown-400 font-medium">{t('portionPrice')}</span>
              <span className="font-bold text-sm sm:text-base text-terracotta-700">
                {priceInfo.singlePrice}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
