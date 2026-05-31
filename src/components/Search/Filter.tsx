import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initCategories } from '../../services/categories'
import { getAllFavourite } from '../../services/favourites'
import { AppCategory, Favourite } from '../../types';
import { parse } from 'path';

function FilterDrawer({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = {}
}: {
  isOpen: boolean;
  onClose: () => void;
  onClearFilters?: () => void;
  onApplyFilters?: (filters: {
    categoryId?: string;
    interestIds: string[];
    gender: string;
    ageRange: string | null;
    isFreeOnly: boolean;
    eventType: string
  }) => void;
  initialFilters?: {
    categoryId?: string;
    interestIds?: string[];
    gender?: string;
    ageRange?: string | null;
    isFreeOnly?: boolean;
    eventType?: string
  };
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState('مختلط');
  const [activeEventType, setActiveEventType] = useState('همه');
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const [favourites, setFavoroties] = useState<Favourite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedInterests([]);
    setSelectedAgeRange(null);
    setIsFreeOnly(false);
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // ✅ تابع اعمال فیلترها
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        categoryId: selectedCategory || undefined,
        interestIds: selectedInterests,
        gender: activeGender,
        ageRange: selectedAgeRange,
        isFreeOnly: isFreeOnly,
        eventType: activeEventType
      });
    }
    onClose(); // بستن drawer بعد از اعمال فیلترها
  };

  useEffect(() => {
    initCategories()
      .then((data: AppCategory[]) => {
        setCategories(data)
      });
  }, []);

  useEffect(() => {
    getAllFavourite()
      .then((data: Favourite[]) => {
        setFavoroties(data)
      });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]" />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]" dir="rtl">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

            <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-8 no-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">فیلترها</h2>
                <button onClick={clearAll} className="text-sm font-bold text-[#ED1C24]">پاک کردن همه</button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900">دسته‌بندی</h3>
                  <div className="grid grid-cols-2 gap-2">

                    {categories?.map(cat => (
                      <button
                        key={cat.id}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id.toString() ? null : cat.id.toString())}
                        className={`px-4 py-3 rounded-2xl border text-xs font-bold text-right transition-all ${selectedCategory === cat.id.toString()
                          ? 'bg-gray-900/5 border-gray-900 text-gray-900'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        {cat.title}
                      </button>
                    ))

                    }
                  </div>
                </div>

                {/* Interest */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900">علاقه‌مندی‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {favourites?.map(fav => (
                      <button
                        key={fav.id}
                        onClick={() => toggleInterest(fav.id.toString())}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedInterests.includes(fav.id.toString())
                          ? 'bg-gray-900/5 border-gray-900 text-gray-900'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                        {fav.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900">جنسیت</h3>
                  <div className="flex gap-2">
                    {['آقا', 'خانم', 'مختلط'].map(gen => (
                      <button
                        key={gen}
                        onClick={() => setActiveGender(gen)}
                        className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${activeGender === gen
                          ? 'bg-gray-900/5 border-gray-900 text-gray-900'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online Events Toggle */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900">نحوه برگزاری</h3>
                  <div className="flex gap-2">
                    {['حضوری', 'آنلاین', 'همه'].map(eventType => (
                      <button
                        key={eventType}
                        onClick={() => setActiveEventType(eventType)}
                        className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${activeEventType === eventType
                          ? 'bg-gray-900/5 border-gray-900 text-gray-900'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        {eventType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900">رده سنی</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['کودک (۵ تا ۱۲)', 'نوجوان (۱۲ تا ۱۸)', 'جوان (۱۸ تا ۳۵)', 'بزرگسال (+۳۵)'].map(age => (
                      <button
                        key={age}
                        onClick={() => setSelectedAgeRange(selectedAgeRange === age ? null : age)}
                        className={`px-4 py-3 rounded-2xl border text-xs font-bold text-right transition-all ${selectedAgeRange === age
                          ? 'bg-gray-900/5 border-gray-900 text-gray-900'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Events Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-900">رویدادهای رایگان</h3>
                    <p className="text-[10px] font-bold text-gray-400">نمایش فقط رویدادهای بدون هزینه</p>
                  </div>
                  <div
                    onClick={() => setIsFreeOnly(!isFreeOnly)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isFreeOnly ? 'bg-gray-900' : 'bg-gray-200'}`}>
                    <motion.div animate={{ x: isFreeOnly ? -24 : 0 }} className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleApplyFilters}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-base shadow-xl mt-8">
                اعمال فیلترها
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FilterDrawer;