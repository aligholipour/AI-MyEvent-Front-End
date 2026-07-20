import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_CATEGORIES = [
  'ورزشی', 'آموزشی', 'هنری', 'تکنولوژی', 'موسیقی', 
  'کتاب‌خوانی', 'سینما', 'طبیعت‌گردی', 'عکاسی', 'آشپزی', 
  'بازی و سرگرمی', 'کسب و کار', 'روانشناسی', 'ادبیات', 
  'نجوم', 'کدنویسی', 'تئاتر', 'صنایع دستی', 'یوگا', 'بوردگیم'
];

const ALL_INTERESTS = [
  'یوگا', 'نقاشی', 'برنامه‌نویسی', 'عکاسی', 'آشپزی',
  'فوتبال', 'شطرنج', 'فلسفه', 'پادکست', 'بستنی', 
  'طراحی رابط کاربری', 'کمپینگ', 'فیلم کوتاه', 'کافه‌گردی', 
  'نجاری', 'باغبانی', 'مافیا', 'نویسندگی', 'ساز دهنی', 'سفالگری'
];

export function FiltersDrawer({ isOpen, onClose }: FiltersDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState('مختلط');
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  // States for "View More" overlays
  const [moreType, setMoreType] = useState<'category' | 'interest' | null>(null);
  const [moreSearch, setMoreSearch] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedInterests([]);
    setSelectedAgeRange(null);
    setActiveGender('مختلط');
    setIsFreeOnly(false);
  };

  // Extract first 5 items to display on the main screen, the 6th is always the "+ بیشتر" (More) trigger
  const mainCategories = ALL_CATEGORIES.slice(0, 5);
  const mainInterests = ALL_INTERESTS.slice(0, 5);

  const filteredMoreList =
    moreType === 'category'
      ? ALL_CATEGORIES.filter((c) => c.includes(moreSearch))
      : ALL_INTERESTS.filter((i) => i.includes(moreSearch));

  // Determine if there are any active filters
  const hasActiveFilters = selectedCategory || selectedInterests.length > 0 || selectedAgeRange || activeGender !== 'مختلط' || isFreeOnly;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[4px]"
          />

          {/* Left Side Drawer/Modal (sliding left-to-right as requested) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 w-full max-w-[390px] h-full bg-[#F8F9FC] z-[160] shadow-[12px_0_40px_rgba(0,0,0,0.12)] flex flex-col"
            dir="rtl"
          >
            {/* Elegant top accent indicator matching other drawers */}
            <div className="w-10 h-1 bg-gray-300/50 rounded-full mx-auto mt-3 shrink-0" />

            {/* Header Area */}
            <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <h2 className="text-base font-black text-gray-900 tracking-tight">فیلترهای پیشرفته</h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">رویدادها را بر اساس سلیقه خود سفارشی کنید</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className="text-[10px] font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors px-2.5 py-1.5 rounded-xl border border-gray-200/50"
                    >
                      پاک کردن همه
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60"
                  >
                    <LucideIcons.X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-gray-50/40">

              {/* Category Section (Grid format) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <LucideIcons.Grid className="w-3.5 h-3.5" />
                    </div>
                    دسته‌بندی اصلی
                  </h3>
                </div>

                {/* Selected Category Box (placed directly above) */}
                {selectedCategory && (
                  <div className="flex flex-wrap gap-1.5 bg-white border border-gray-100/80 p-2.5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                    <span className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300/80 text-slate-900 text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xs">
                      <span>دسته‌بندی فعال: {selectedCategory}</span>
                      <button onClick={() => setSelectedCategory(null)} className="hover:bg-slate-300/60 p-0.5 rounded-full transition-colors flex items-center justify-center">
                        <LucideIcons.X className="w-3 h-3 text-slate-800 stroke-[3.5px]" />
                      </button>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {mainCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(isSelected ? null : cat)}
                        className={`px-4 py-3 rounded-2xl border text-xs font-black text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-200 border-slate-300/90 text-slate-900 shadow-xs font-black'
                            : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50 shadow-xs'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <LucideIcons.Check className="w-3.5 h-3.5 text-slate-800 stroke-[3px]" />}
                      </motion.button>
                    );
                  })}
                  {/* More Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMoreType('category');
                      setMoreSearch('');
                    }}
                    className="px-4 py-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-gray-500 text-xs font-black text-right hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span>بیشتر ({ALL_CATEGORIES.length - 5}+)</span>
                    <LucideIcons.ChevronLeft className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Interests Section (Flex wrapped tags) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <LucideIcons.Heart className="w-3.5 h-3.5" />
                    </div>
                    علاقه‌مندی‌ها
                  </h3>
                </div>

                {/* Selected Interests Box (placed directly above) */}
                {selectedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 bg-white border border-gray-100/80 p-2.5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                    {selectedInterests.map(interest => (
                      <span key={interest} className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300/80 text-slate-900 text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xs">
                        <span>{interest}</span>
                        <button onClick={() => toggleInterest(interest)} className="hover:bg-slate-300/60 p-0.5 rounded-full transition-colors flex items-center justify-center">
                          <LucideIcons.X className="w-3 h-3 text-slate-800 stroke-[3.5px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {mainInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <motion.button
                        key={interest}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-200 border-slate-300/90 text-slate-900 shadow-xs font-black'
                            : 'bg-white border-gray-100/80 text-gray-600 hover:bg-gray-50 shadow-xs'
                        }`}
                      >
                        <span>{interest}</span>
                        {isSelected && <LucideIcons.Check className="w-3 h-3 text-slate-800 stroke-[3px]" />}
                      </motion.button>
                    );
                  })}
                  {/* More Button */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setMoreType('interest');
                      setMoreSearch('');
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 text-gray-500 text-xs font-black hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <span>+ بیشتر ({ALL_INTERESTS.length - 5}+)</span>
                  </motion.button>
                </div>
              </div>

              {/* Gender Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <LucideIcons.Users2 className="w-3.5 h-3.5" />
                  </div>
                  جنسیت مجاز حضور
                </h3>

                <div className="flex gap-2">
                  {['آقا', 'خانم', 'مختلط'].map((gen) => {
                    const isSelected = activeGender === gen;
                    return (
                      <button
                        key={gen}
                        onClick={() => setActiveGender(gen)}
                        className={`flex-1 py-3 rounded-2xl border text-xs font-black transition-all ${
                          isSelected
                            ? 'bg-slate-200 border-slate-300/90 text-slate-900 shadow-xs font-black'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 shadow-xs'
                        }`}
                      >
                        {gen}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age Range Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <LucideIcons.Smile className="w-3.5 h-3.5" />
                  </div>
                  رده سنی مخاطبین
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {['کودک (۵ تا ۱۲)', 'نوجودان (۱۲ تا ۱۸)', 'جوان (۱۸ تا ۳۵)', 'بزرگسال (+۳۵)'].map((age) => {
                    const isSelected = selectedAgeRange === age;
                    return (
                      <motion.button
                        key={age}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAgeRange(isSelected ? null : age)}
                        className={`px-4 py-3 rounded-2xl border text-xs font-black text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-200 border-slate-300/90 text-slate-900 shadow-xs font-black'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 shadow-xs'
                        }`}
                      >
                        <span>{age}</span>
                        {isSelected && <LucideIcons.Check className="w-3.5 h-3.5 text-slate-800 stroke-[3px]" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Free Only Toggle Button Card */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100/80 shadow-xs">
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-gray-900">رویدادهای بدون هزینه</h3>
                  <p className="text-[10px] font-bold text-gray-400">نمایش فقط دورهمی‌های رایگان و داوطلبانه</p>
                </div>
                <div
                  onClick={() => setIsFreeOnly(!isFreeOnly)}
                  className={`w-12 h-6.5 rounded-full relative cursor-pointer transition-colors duration-200 ${
                    isFreeOnly ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: isFreeOnly ? -22 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute right-1 top-1 w-4.5 h-4.5 bg-white rounded-full shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Action Footer (Black/Charcoal button as requested) */}
            <div className="p-6 bg-white border-t border-gray-100 shrink-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2"
              >
                <LucideIcons.Filter className="w-4 h-4" />
                <span>اعمال فیلترهای منتخب</span>
              </motion.button>
            </div>

            {/* Nested Slide-over Modal for Rich List Search of "More Categories/Interests" */}
            <AnimatePresence>
              {moreType && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  className="absolute inset-0 bg-[#F8F9FC] z-[170] flex flex-col"
                >
                  {/* Inner Modal Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col text-right">
                        <h3 className="text-sm font-black text-gray-900">
                          {moreType === 'category' ? 'انتخاب دسته‌بندی' : 'انتخاب علاقه‌مندی‌ها'}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                          جستجو و فیلتر دقیق‌تر در بانک جامع
                        </p>
                      </div>
                      <button
                        onClick={() => setMoreType(null)}
                        className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100"
                      >
                        <LucideIcons.ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search Field */}
                    <div className="mt-4 flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2">
                      <LucideIcons.Search className="w-4 h-4 text-gray-400 ml-2" />
                      <input
                        type="text"
                        placeholder="جستجوی عنوان..."
                        value={moreSearch}
                        onChange={(e) => setMoreSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs font-bold text-gray-800 placeholder-gray-400 p-0 focus:ring-0"
                      />
                      {moreSearch && (
                        <button onClick={() => setMoreSearch('')}>
                          <LucideIcons.X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List items with checkmarks (Pale gray selections inside modal list as well) */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 no-scrollbar bg-gray-50/30">
                    {filteredMoreList.length > 0 ? (
                      filteredMoreList.map((item) => {
                        const isSelected =
                          moreType === 'category'
                            ? selectedCategory === item
                            : selectedInterests.includes(item);

                        return (
                          <motion.button
                            key={item}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (moreType === 'category') {
                                setSelectedCategory(isSelected ? null : item);
                              } else {
                                toggleInterest(item);
                              }
                            }}
                            className={`w-full text-right px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-slate-200 border-slate-300/90 text-slate-900 shadow-xs font-black'
                                : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-xs font-black">{item}</span>
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-white">
                                <LucideIcons.Check className="w-3 h-3 stroke-[3px]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-200" />
                            )}
                          </motion.button>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-gray-400 font-bold text-xs">
                        آیتمی پیدا نشد
                      </div>
                    )}
                  </div>

                  {/* Submit Inner View Button */}
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <button
                      onClick={() => setMoreType(null)}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-xs font-black shadow-lg shadow-gray-900/10"
                    >
                      تایید و بازگشت
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
