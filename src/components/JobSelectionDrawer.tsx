import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface JobSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const JOBS_LIST = [
  'برنامه‌نویس / توسعه‌دهنده',
  'طراح / گرافیست',
  'پزشک / کادر درمان',
  'مهندس (عمران، مکانیک، برق و...)',
  'معلم / استاد دانشگاه / مدرس',
  'دانشجو / دانش‌آموز',
  'کارمند اداری / دولتی',
  'نویسنده / مترجم / روزنامه‌نگار',
  'فروشنده / مغازه‌دار / کاسب',
  'مدیر عامل / کارآفرین / صاحب کسب‌وکار',
  'بازاریاب / کارشناس فروش',
  'شغل آزاد',
  'خانه‌دار',
  'بازنشسته',
  'بیکار / در جستجوی کار',
  'هنرمند / موسیقی‌دان / عکاس',
  'سایر موارد'
];

export function JobSelectionDrawer({
  isOpen,
  onClose,
  selectedValue,
  onSelect,
}: JobSelectionDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredJobs = JOBS_LIST.filter((job) =>
    job.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[78vh] bg-[#F8F9FC] z-[410] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header section matching other premium drawers */}
            <div className="px-6 pt-3 pb-2 space-y-4 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 text-right">
                  <h3 className="text-base font-black text-gray-900 tracking-tight">انتخاب شغل</h3>
                  <p className="text-[10px] font-bold text-gray-400">شغل یا حوزه فعالیت خود را از لیست زیر انتخاب کنید</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60 shadow-xs cursor-pointer"
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
                  placeholder="جستجوی شغل..."
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

            {/* List Selection Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar bg-gray-50/50">
              <div className="space-y-2 mt-1 pb-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const isSelected = selectedValue === job;
                    return (
                      <motion.button
                        key={job}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelect(job);
                          onClose();
                        }}
                        className={`w-full text-right px-5 py-4 rounded-2xl flex items-center justify-between transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900/5 border-slate-900/30 text-slate-900 shadow-xs font-black'
                            : 'bg-white border-gray-100/70 text-gray-700 hover:bg-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        <span className="font-black text-xs">{job}</span>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-white">
                            <LucideIcons.Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-200" />
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <LucideIcons.Search className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs">شغلی با این عنوان یافت نشد</p>
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
