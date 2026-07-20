import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface SelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showSearch?: boolean;
}

export function SelectionDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  showSearch = false,
}: SelectionDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h3 className="text-base font-black text-gray-900 tracking-tight">{title}</h3>
                  {subtitle && <p className="text-[10px] font-bold text-gray-400">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60 shadow-xs"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              {/* Optional Search Box */}
              {showSearch && (
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
                    placeholder="جستجو..."
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
              )}
            </div>

            {/* List Selection Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar bg-gray-50/50">
              <div className="space-y-2 mt-1 pb-6">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedValue === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelect(opt.value);
                          onClose();
                        }}
                        className={`w-full text-right px-5 py-4 rounded-2xl flex items-center justify-between transition-all border ${
                          isSelected
                            ? 'bg-slate-900/5 border-slate-900/30 text-slate-900 shadow-xs'
                            : 'bg-white border-gray-100/70 text-gray-700 hover:bg-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <LucideIcons.MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-black text-xs">{opt.label}</span>
                        </div>

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
                      <LucideIcons.MapPinOff className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs">موردی یافت نشد</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Confirm/Close Button */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white h-13 rounded-2xl text-sm font-black shadow-lg shadow-slate-900/10 border-none cursor-pointer transition-all active:scale-98"
              >
                تایید و بازگشت
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
