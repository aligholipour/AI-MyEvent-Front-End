import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Check } from "lucide-react";

function SelectionDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  showSearch = false
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showSearch?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-[2.5rem] p-8 pb-10 space-y-6 shadow-2xl flex flex-col max-h-[90vh]"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto shrink-0" />

            <div className="flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs font-bold text-gray-400">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {showSearch && (
              <div className="relative shrink-0">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none"
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { onSelect(opt.value); onClose(); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group border-b border-gray-50 last:border-0 ${isSelected ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-900/20 animate-in zoom-in-50 duration-300">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center mx-auto text-gray-200">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-gray-400">موردی یافت نشد</p>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-gray-900/10 transition-all shrink-0 active:scale-[0.98]"
            >
              تایید و بازگشت
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SelectionDrawer;