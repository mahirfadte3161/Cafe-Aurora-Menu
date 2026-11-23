import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import WelcomeBanner from '../components/WelcomeBanner';
import SearchBar from '../components/SearchBar';
import PopularItems from '../components/PopularItems';
import CategoryNavigation from '../components/CategoryNavigation';
import FoodCard from '../components/FoodCard';
import BackToTop from '../components/BackToTop';
import LoadingState from '../components/LoadingState';
import Footer from '../components/Footer';
import { useMenu } from '../hooks/useMenu';
import { useLanguage } from '../context/LanguageContext';
import { SearchX, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const { menu, categories, popularItems, loading, refreshing, error, lastUpdated, dataSource, refreshMenu } = useMenu();
  const { t, getEntityName, getEntityDescription } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // ALL, VEG, NON_VEG

  // Filtered menu items based on active search and dietary filter
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // 1. Dietary filter check
      if (dietaryFilter === 'VEG') {
        const isVeg = String(item.Food_Type).toLowerCase().includes('veg') && !String(item.Food_Type).toLowerCase().includes('non');
        if (!isVeg) return false;
      } else if (dietaryFilter === 'NON_VEG') {
        const isNonVeg = !String(item.Food_Type).toLowerCase().includes('veg') || String(item.Food_Type).toLowerCase().includes('non');
        if (!isNonVeg) return false;
      }

      // 2. Search query check
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const localizedName = getEntityName(item).toLowerCase();
      const englishName = (item.Name_EN || '').toLowerCase();
      const localizedDesc = getEntityDescription(item).toLowerCase();
      const englishDesc = (item.Description_EN || '').toLowerCase();

      return (
        localizedName.includes(q) ||
        englishName.includes(q) ||
        localizedDesc.includes(q) ||
        englishDesc.includes(q)
      );
    });
  }, [menu, searchQuery, dietaryFilter, getEntityName, getEntityDescription]);

  const isFiltering = searchQuery.trim().length > 0 || dietaryFilter !== 'ALL';

  if (loading && menu.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF8EF]">
        <Header refreshing={false} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8EF]">
      {/* 1. Header */}
      <Header refreshing={refreshing} onRefresh={refreshMenu} />

      <main className="flex-grow max-w-4xl mx-auto w-full">
        {/* Error notification if live sync failed but cache is shown */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('offlineNotice')} ({error})</span>
            </div>
            <button
              onClick={() => refreshMenu()}
              className="px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 font-semibold text-[11px] shrink-0 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('retryBtn')}</span>
            </button>
          </div>
        )}

        {/* 2. Welcome Banner */}
        <WelcomeBanner />

        {/* 3. Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dietaryFilter={dietaryFilter}
          setDietaryFilter={setDietaryFilter}
        />

        {/* Search Results Display OR Standard Homepage Flow */}
        {isFiltering ? (
          <section className="px-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-darkbrown-900">
                {searchQuery ? `"${searchQuery}"` : t('allCategories')}
              </h2>
              <span className="text-xs text-darkbrown-500 font-medium">
                {filteredItems.length} {t('categoryItemsCount')}
              </span>
            </div>

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
          </section>
        ) : (
          <>
            {/* 4. Popular / Recommended Items */}
            {popularItems.length > 0 && <PopularItems items={popularItems} />}

            {/* 5. Explore Categories */}
            <CategoryNavigation categories={categories} />

            {/* 6. Menu Preview Section */}
            <section className="px-4 mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-terracotta-600" />
                  <h2 className="font-serif font-bold text-base sm:text-lg text-darkbrown-900">
                    {t('viewAllDishes')}
                  </h2>
                </div>
                <span className="text-xs text-darkbrown-500 font-medium">
                  {menu.length} {t('categoryItemsCount')}
                </span>
              </div>

              {/* Two-column grid on mobile devices */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {menu.map((item) => (
                  <FoodCard key={item.Item_ID} item={item} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* 7. Floating Back-to-Top Button */}
      <BackToTop />

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} dataSource={dataSource} onRefresh={refreshMenu} />
    </div>
  );
}
