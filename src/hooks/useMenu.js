import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchMenuData, getLocalCache } from '../services/menuService';

export function useMenu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSource, setDataSource] = useState('initial');

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchMenuData(isManualRefresh);
      setMenu(data.menu);
      setCategories(data.categories);
      setLastUpdated(data.timestamp);
      setDataSource(data.source);
    } catch (err) {
      console.error('Failed to load menu data:', err);
      setError(err.message || 'Unable to load menu.');
      // Attempt to load from cache if state is empty
      const cached = getLocalCache();
      if (cached) {
        setMenu(cached.menu);
        setCategories(cached.categories);
        setLastUpdated(cached.timestamp);
        setDataSource('stale-cache');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load and periodic 30-minute revalidation timer
  useEffect(() => {
    loadData();

    // 30-minute background check interval (1800000 ms)
    const intervalId = setInterval(() => {
      loadData(false);
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  // Derived: Popular items
  const popularItems = useMemo(() => {
    return menu
      .filter((item) => item.Popular === true && item.Availability !== false)
      .sort((a, b) => a.Display_Order - b.Display_Order);
  }, [menu]);

  // Derived: Categories sorted by Display_Order
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.Display_Order - b.Display_Order);
  }, [categories]);

  // Helper: Get items for a given category ID
  const getItemsByCategory = useCallback((categoryId) => {
    if (!categoryId) return [];
    return menu
      .filter((item) => item.Category_ID === categoryId)
      .sort((a, b) => {
        // Available items first, then by Display_Order
        if (a.Availability !== b.Availability) {
          return a.Availability ? -1 : 1;
        }
        return a.Display_Order - b.Display_Order;
      });
  }, [menu]);

  return {
    menu,
    categories: sortedCategories,
    popularItems,
    loading,
    refreshing,
    error,
    lastUpdated,
    dataSource,
    refreshMenu: () => loadData(true),
    getItemsByCategory
  };
}
