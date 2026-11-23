import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const currentObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-terracotta-50 text-terracotta-800 border border-terracotta-200/70 hover:bg-terracotta-100 transition shadow-sm active:scale-95"
        aria-label={t('languageSelectLabel')}
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-terracotta-600" />
        <span className="font-semibold">{currentObj.script}</span>
        <span className="hidden xs:inline text-[11px] text-terracotta-700">· {currentObj.label.split(' ')[0]}</span>
        <ChevronDown className={`w-3 h-3 text-terracotta-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white shadow-elevated border border-terracotta-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-darkbrown-400 border-b border-cream-200">
            {t('languageSelectLabel')}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                  isSelected
                    ? 'bg-terracotta-50 text-terracotta-800 font-semibold'
                    : 'text-darkbrown-800 hover:bg-cream-100'
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.label}</span>
                  <span className="text-[10px] text-darkbrown-400 font-normal">{lang.script}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-terracotta-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
