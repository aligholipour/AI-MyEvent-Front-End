import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface CitySelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  currentCity: string;
}

export function CitySelectionDrawer({
  isOpen,
  onClose,
  onSelect,
  currentCity,
}: CitySelectionDrawerProps) {
  const allCities = [
    'تهران', 'شیراز', 'اصفهان', 'رشت', 'گرگان', 
    'تبریز', 'مشهد', 'کرج', 'اهواز', 'قم', 
    'کرمانشاه', 'یزد', 'اردبیل', 'بندرعباس', 'همدان',
    'زنجان', 'سنندج', 'قزوین', 'خرم‌آباد', 'ساری'
  ];

  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filteredCities = allCities.filter((city) =>
    city.includes(search)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[4px]"
          />

          {/* Bottom Sheet - matching AuthDrawer premium layout */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-[#F8F9FC] z-[160] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
            dir="rtl"
            style={{ maxHeight: '85vh' }}
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header Area */}
            <div className="px-6 pt-3 pb-2 space-y-4 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 text-right">
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">انتخاب شهر</h2>
                  <p className="text-[11px] font-black text-gray-400">
                    شهر خود را برای فیلتر کردن رویدادها انتخاب کنید
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60 shadow-xs"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              {/* Search input with premium styling */}
              <div
                className={`flex items-center bg-white border rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                  isFocused
                    ? 'border-[#007AFF] shadow-[0_0_0_3px_rgba(0,122,255,0.08)]'
                    : 'border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <LucideIcons.Search className={`w-4.5 h-4.5 ml-3 transition-colors duration-200 ${isFocused ? 'text-[#007AFF]' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="جستجوی نام شهر..."
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 outline-none border-none p-0 focus:ring-0"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <LucideIcons.X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable list area */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 no-scrollbar bg-gray-50/50">
              <div className="space-y-2 mt-2">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => {
                    const isSelected = city === currentCity;
                    return (
                      <motion.button
                        key={city}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelect(city);
                          onClose();
                        }}
                        className={`w-full text-right px-5 py-4 rounded-2xl flex items-center justify-between transition-all border ${
                          isSelected
                            ? 'bg-blue-50/40 border-blue-200 text-blue-600 shadow-xs'
                            : 'bg-white border-gray-100/70 text-gray-700 hover:bg-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-blue-100/50 text-blue-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                            <LucideIcons.MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-black text-sm">{city}</span>
                        </div>
                        
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <LucideIcons.Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-200/80" />
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <LucideIcons.MapPinOff className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs">شهری با این نام پیدا نشد</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
