import { SAMPLE_MENU, SAMPLE_CATEGORIES } from '../data/sampleData';

const CACHE_KEY = 'cafe_aurora_menu_cache_v2';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes revalidation interval

/**
 * Normalizes item row fields ensuring correct types
 */
function normalizeItem(raw) {
  return {
    ...raw,
    Item_ID: String(raw.Item_ID || '').trim(),
    Category_ID: String(raw.Category_ID || '').trim(),
    Name_EN: String(raw.Name_EN || '').trim(),
    Name_HI: String(raw.Name_HI || '').trim(),
    Name_KOK_DEV: String(raw.Name_KOK_DEV || '').trim(),
    Name_KOK_ROM: String(raw.Name_KOK_ROM || '').trim(),
    Description_EN: String(raw.Description_EN || '').trim(),
    Description_HI: String(raw.Description_HI || '').trim(),
    Description_KOK_DEV: String(raw.Description_KOK_DEV || '').trim(),
    Description_KOK_ROM: String(raw.Description_KOK_ROM || '').trim(),
    Half_Price: raw.Half_Price !== null && raw.Half_Price !== undefined && raw.Half_Price !== '' ? Number(raw.Half_Price) : null,
    Full_Price: raw.Full_Price !== null && raw.Full_Price !== undefined && raw.Full_Price !== '' ? Number(raw.Full_Price) : null,
    Single_Price: raw.Single_Price !== null && raw.Single_Price !== undefined && raw.Single_Price !== '' ? Number(raw.Single_Price) : null,
    Image_URL: String(raw.Image_URL || '').trim(),
    Availability: String(raw.Availability).toUpperCase() !== 'FALSE',
    Food_Type: String(raw.Food_Type || 'Non-Veg').trim(),
    Popular: String(raw.Popular).toUpperCase() === 'TRUE',
    Display_Order: raw.Display_Order ? Number(raw.Display_Order) : 999,
    Source_Notes: String(raw.Source_Notes || '').trim()
  };
}

function normalizeCategory(raw) {
  return {
    ...raw,
    Category_ID: String(raw.Category_ID || '').trim(),
    Name_EN: String(raw.Name_EN || '').trim(),
    Name_HI: String(raw.Name_HI || '').trim(),
    Name_KOK_DEV: String(raw.Name_KOK_DEV || '').trim(),
    Name_KOK_ROM: String(raw.Name_KOK_ROM || '').trim(),
    Display_Order: raw.Display_Order ? Number(raw.Display_Order) : 999
  };
}

/**
 * Retrieve cached menu data from localStorage
 */
export function getLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.timestamp || !Array.isArray(parsed.menu)) return null;

    const age = Date.now() - parsed.timestamp;
    return {
      ...parsed,
      isStale: age > CACHE_DURATION_MS,
      age
    };
  } catch {
    return null;
  }
}

/**
 * Save menu data to localStorage
 */
export function saveLocalCache(menu, categories, source = 'api') {
  try {
    const payload = {
      menu,
      categories,
      timestamp: Date.now(),
      source
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Unable to persist menu cache to localStorage:', err);
  }
}

/**
 * Centralized data service to fetch menu and categories
 */
export async function fetchMenuData(forceRefresh = false) {
  const cached = getLocalCache();

  // If we have fresh cached data and no force-refresh requested, return immediately
  if (!forceRefresh && cached && !cached.isStale) {
    return {
      menu: cached.menu,
      categories: cached.categories,
      timestamp: cached.timestamp,
      source: 'cache',
      isStale: false
    };
  }

  // Attempt to fetch from serverless API endpoint
  try {
    const response = await fetch('/api/menu', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.success && Array.isArray(result.menu)) {
        const normalizedMenu = result.menu.map(normalizeItem);
        const normalizedCategories = (result.categories || []).map(normalizeCategory);

        saveLocalCache(normalizedMenu, normalizedCategories, 'api');

        return {
          menu: normalizedMenu,
          categories: normalizedCategories,
          timestamp: Date.now(),
          source: 'api',
          isStale: false
        };
      }
    }
  } catch (apiError) {
    console.info('Live /api/menu fetch unreachable (likely in local development or offline):', apiError.message);
  }

  // Fallback 1: If we have an existing cache (even if stale), use it
  if (cached) {
    return {
      menu: cached.menu,
      categories: cached.categories,
      timestamp: cached.timestamp,
      source: 'stale-cache',
      isStale: true
    };
  }

  // Fallback 2: Local development / offline initial load with the 15 verified items
  const fallbackMenu = SAMPLE_MENU.map(normalizeItem);
  const fallbackCategories = SAMPLE_CATEGORIES.map(normalizeCategory);

  saveLocalCache(fallbackMenu, fallbackCategories, 'sample');

  return {
    menu: fallbackMenu,
    categories: fallbackCategories,
    timestamp: Date.now(),
    source: 'sample',
    isStale: false
  };
}
