import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import FoodCard from '../components/FoodCard';
import BackToTop from '../components/BackToTop';
import LoadingState from '../components/LoadingState';
import Footer from '../components/Footer';
import { useMenu } from '../hooks/useMenu';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Search, X, SearchX, Utensils } from 'lucide-react';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { categories, getItemsByCategory, loading, refreshing, lastUpdated, dataSource, refreshMenu } = useMenu();
  const { t, getEntityName, getEntityDescription } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // ALL, VEG, NON_VEG

  // Identify current category entity
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.Category_ID === categoryId) || null;
  }, [categories, categoryId]);

  const categoryName = currentCategory ? getEntityName(currentCategory) : categoryId;

  // Retrieve items belonging to this category
  const categoryItems = useMemo(() => {
    return getItemsByCategory(categoryId);
  }, [getItemsByCategory, categoryId]);

  // Filter items inside this category by search & dietary filter
  const filteredItems = useMemo(() => {
    return categoryItems.filter((item) => {
      // Dietary filter check
      if (dietaryFilter === 'VEG') {
        const isVeg = String(item.Food_Type).toLowerCase().includes('veg') && !String(item.Food_Type).toLowerCase().includes('non');
        if (!isVeg) return false;
      } else if (dietaryFilter === 'NON_VEG') {
        const isNonVeg = !String(item.Food_Type).toLowerCase().includes('veg') || String(item.Food_Type).toLowerCase().includes('non');
        if (!isNonVeg) return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const localizedName = getEntityName(item).toLowerCase();
      const englishName = (item.Name_EN || '').toLowerCase();
      const localizedDesc = getEntityDescription(item).toLowerCase();

      return (
        localizedName.includes(q) ||
        englishName.includes(q) ||
        localizedDesc.includes(q)
      );
    });
  }, [categoryItems, searchQuery, dietaryFilter, getEntityName, getEntityDescription]);

  if (loading && categoryItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF8EF]">
        <Header refreshing={false} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8EF]">
      {/* Header */}
      <Header refreshing={refreshing} onRefresh={refreshMenu} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 pt-4 pb-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-xs font-semibold text-darkbrown-800 hover:bg-cream-100 hover:text-terracotta-700 transition shadow-soft-card group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t('backToHome')}</span>
          </Link>

          <span className="text-xs text-darkbrown-500 font-medium">
            {filteredItems.length} {t('categoryItemsCount')}
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cream-card border border-cream-300 shadow-soft-card mb-4 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
              Café Aurora Menu
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-darkbrown-900 tracking-tight">
              {categoryName}
            </h1>
          </div>
          <div className="p-2.5 rounded-xl bg-terracotta-50 text-terracotta-700 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        {/* Other Categories Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3">
          {categories.map((cat) => {
            const isCurrent = cat.Category_ID === categoryId;
            return (
              <Link
                key={cat.Category_ID}
                to={`/category/${cat.Category_ID}`}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  isCurrent
                    ? 'bg-terracotta-700 text-white border-terracotta-700 shadow-xs'
                    : 'bg-white text-darkbrown-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                {getEntityName(cat)}
              </Link>
            );
          })}
        </div>

        {/* Search & Filter Inside Category */}
        <div className="space-y-2 mb-5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-darkbrown-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t('searchLabel')} in ${categoryName}...`}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-cream-300 text-darkbrown-900 placeholder:text-darkbrown-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-600 shadow-soft-card"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-darkbrown-400 hover:text-darkbrown-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
                dietaryFilter === 'ALL'
                  ? 'bg-terracotta-700 text-white border-terracotta-700'
                  : 'bg-white text-darkbrown-700 border-cream-300'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
                dietaryFilter === 'VEG'
                  ? 'bg-mutedgreen-600 text-white border-mutedgreen-600'
                  : 'bg-white text-darkbrown-700 border-cream-300'
              }`}
            >
              {t('filterVeg')}
            </button>
            <button
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
                dietaryFilter === 'NON_VEG'
                  ? 'bg-terracotta-700 text-white border-terracotta-700'
                  : 'bg-white text-darkbrown-700 border-cream-300'
              }`}
            >
              {t('filterNonVeg')}
            </button>
          </div>
        </div>

        {/* Two-Column Grid of Food Items */}
        {filteredItems.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-white border border-cream-300 shadow-soft-card space-y-2">
            <SearchX className="w-10 h-10 text-terracotta-400 mx-auto opacity-70" />
            <h3 className="font-serif font-bold text-base text-darkbrown-900">
              {t('noResultsTitle')}
            </h3>
            <p className="text-xs text-darkbrown-600 max-w-xs mx-auto">
              {t('noResultsDesc')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('ALL');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-terracotta-50 text-terracotta-700 text-xs font-semibold hover:bg-terracotta-100 transition border border-terracotta-200"
            >
              {t('clearSearch')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.Item_ID} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Back to Top */}
      <BackToTop />

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} dataSource={dataSource} onRefresh={refreshMenu} />
    </div>
  );
}
