import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../translations/uiTranslations';

const LanguageContext = createContext();

const STORAGE_KEY = 'cafe_aurora_lang';
const DEFAULT_LANG = 'en';

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && UI_TRANSLATIONS[saved]) {
        return saved;
      }
    } catch {
      // localStorage unavailable fallback
    }
    return DEFAULT_LANG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch {
      // Silently ignore storage errors
    }
  }, [currentLanguage]);

  // Translate static UI labels with fallback to English
  const t = (key) => {
    const langDict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS[DEFAULT_LANG];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    return UI_TRANSLATIONS[DEFAULT_LANG][key] || key;
  };

  /**
   * Helper to get translated field from database entity (Menu item or Category)
   * Follows the specified naming convention:
   * English: Name_EN / Description_EN
   * Hindi: Name_HI / Description_HI
   * Konkani Devanagari: Name_KOK_DEV / Description_KOK_DEV
   * Konkani Roman: Name_KOK_ROM / Description_KOK_ROM
   *
   * Fallback rule: If translation is empty/missing, automatically falls back to English.
   */
  const getEntityField = (entity, fieldPrefix) => {
    if (!entity) return '';

    let suffix = 'EN';
    if (currentLanguage === 'hi') suffix = 'HI';
    else if (currentLanguage === 'kok_dev') suffix = 'KOK_DEV';
    else if (currentLanguage === 'kok_rom') suffix = 'KOK_ROM';

    const localizedKey = `${fieldPrefix}_${suffix}`;
    const localizedValue = entity[localizedKey];

    if (localizedValue && typeof localizedValue === 'string' && localizedValue.trim().length > 0) {
      return localizedValue.trim();
    }

    // Fallback to English
    const englishKey = `${fieldPrefix}_EN`;
    return entity[englishKey] || '';
  };

  const getEntityName = (entity) => getEntityField(entity, 'Name');
  const getEntityDescription = (entity) => getEntityField(entity, 'Description');

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: setCurrentLanguage,
        languages: SUPPORTED_LANGUAGES,
        t,
        getEntityName,
        getEntityDescription
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
