import { useState, useEffect } from "react";
import { Favourite } from '../../types';
import { getAllFavourite } from '../../services/favourites';
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { X } from "lucide-react";

function InterestsDrawer({
  isOpen,
  onClose,
  selectedInterests,
  onToggle,
  onFavouritesLoaded
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: number[];
  onToggle: (interest: number) => void;
  onFavouritesLoaded?: (favourites: Favourite[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredInterests = favourites.filter(interest =>
    interest.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && favourites.length === 0) {
      loadFavourites();
    }
  }, [isOpen]);

  const loadFavourites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFavourite();
      setFavourites(data);

      if (onFavouritesLoaded) {
        onFavouritesLoaded(data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت علاقه مندی ها');
      console.error('Error loading favourites:', err);
    } finally {
      setLoading(false);
    }
  };

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
                <h3 className="text-xl font-black text-gray-900">انتخاب علاقه‌مندی‌ها</h3>
                <p className="text-sm font-bold text-gray-400">یک یا چند مورد را انتخاب کنید</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="relative shrink-0">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی علاقه‌مندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              <div className="flex flex-wrap gap-2">
                {filteredInterests.length > 0 ? (
                  filteredInterests.map(interest => (
                    <button
                      key={interest.id}
                      onClick={() => onToggle(interest.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${selectedInterests.includes(interest.id)
                        ? 'bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-900/10'
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                      {interest.title}
                    </button>
                  ))
                ) : (
                  <div className="w-full py-10 text-center text-gray-400 font-bold text-sm">موردی یافت نشد</div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg transition-all shrink-0 active:scale-[0.98]"
            >
              تایید انتخاب‌ها
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default InterestsDrawer;