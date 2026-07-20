import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppCategory } from '../types';

export const DEFAULT_CATEGORIES: AppCategory[] = [
  { id: '1', title: 'علمی', icon: 'Atom', color: 'text-purple-600' },
  { id: '2', title: 'کنسرت', icon: 'Music', color: 'text-rose-600' },
  { id: '3', title: 'هنر', icon: 'Palette', color: 'text-amber-600' },
  { id: '4', title: 'ورزش', icon: 'Trophy', color: 'text-emerald-600' },
  { id: '5', title: 'فنی', icon: 'Cpu', color: 'text-indigo-600' },
  { id: '6', title: 'آموزش', icon: 'GraduationCap', color: 'text-blue-600' },
  { id: '7', title: 'عکس', icon: 'Image', color: 'text-orange-600' },
  { id: '8', title: 'بازی', icon: 'Gamepad2', color: 'text-cyan-600' },
  { id: '9', title: 'مذهبی', icon: 'Moon', color: 'text-teal-600' },
  { id: '10', title: 'تجاری', icon: 'Briefcase', color: 'text-rose-600' },
  { id: '11', title: 'سلامت', icon: 'Heart', color: 'text-pink-600' },
  { id: '12', title: 'سفر', icon: 'Compass', color: 'text-emerald-600' },
];

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelect: (category: string) => void;
  categories?: AppCategory[];
}

export function CategoryDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelect,
  categories = DEFAULT_CATEGORIES,
}: CategoryDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with high z-index and premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 z-[400] backdrop-blur-[4px]"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-[#F8F9FC] z-[410] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header section matching other premium drawers */}
            <div className="px-6 pt-3 pb-2 space-y-4 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 text-right">
                  <h3 className="text-base font-black text-gray-900 tracking-tight">انتخاب دسته‌بندی</h3>
                  <p className="text-[10px] font-bold text-gray-400">یک دسته‌بندی برای مشخص شدن موضوع رویداد انتخاب کنید</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60 shadow-xs"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Box */}
              <div
                className={`flex items-center bg-white border rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                  isFocused
                    ? 'border-slate-900 shadow-[0_0_0_3px_rgba(15,23,42,0.08)]'
                    : 'border-gray-250/80 hover:border-gray-300'
                }`}
              >
                <LucideIcons.Search className={`w-4.5 h-4.5 ml-3 transition-colors duration-200 ${isFocused ? 'text-slate-900' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="جستجوی دسته‌بندی..."
                  value={searchTerm}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 outline-none border-none p-0 focus:ring-0"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <LucideIcons.X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid Selection Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar bg-gray-50/50">
              <div className="grid grid-cols-2 gap-3 mt-1 pb-6">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => {
                    const IconComponent = (LucideIcons as any)[cat.icon];
                    const isSelected = selectedCategory === cat.title;
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          onSelect(cat.title);
                          onClose();
                        }}
                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all gap-2.5 relative cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900/5 border-slate-900 shadow-sm'
                            : 'bg-white border-gray-100/70 hover:bg-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl shadow-xs flex items-center justify-center ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {IconComponent && <IconComponent className="w-5.5 h-5.5" />}
                        </div>
                        <span className={`text-xs font-black ${isSelected ? 'text-slate-900' : 'text-gray-600'}`}>
                          {cat.title}
                        </span>

                        {isSelected && (
                          <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-white">
                            <LucideIcons.Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-16 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <LucideIcons.SearchX className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs">موردی یافت نشد</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Close Button */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white h-13 rounded-2xl text-sm font-black shadow-lg shadow-slate-900/10 border-none cursor-pointer transition-all active:scale-98"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
