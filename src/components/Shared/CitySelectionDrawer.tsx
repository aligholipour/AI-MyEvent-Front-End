import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";

function CitySelectionDrawer({
    isOpen,
    onClose,
    onSelect,
    currentCity
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (city: string) => void;
    currentCity: string;
}) {
    const allCities = [
        'تهران', 'شیراز', 'اصفهان', 'رشت', 'گرگان',
        'تبریز', 'مشهد', 'کرج', 'اهواز', 'قم',
        'کرمانشاه', 'یزد', 'اردبیل', 'بندرعباس', 'همدان',
        'زنجان', 'سنندج', 'قزوین', 'خرم‌آباد', 'ساری'
    ];

    const [search, setSearch] = useState('');

    const filteredCities = allCities.filter(city =>
        city.includes(search)
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
                        className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[70vh] bg-white z-[90] rounded-t-2xl shadow-2xl flex flex-col"
                        dir="rtl"
                    >
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

                        <div className="px-6 pb-4 space-y-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900">انتخاب شهر</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="جستجوی نام شهر..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 pb-20 bg-gray-50/50 no-scrollbar">
                            <div className="space-y-1 mt-2">
                                {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => onSelect(city)}
                                            className={`w-full text-right px-6 py-4 rounded-2xl flex items-center justify-between transition-all ${city === currentCity
                                                ? 'bg-white shadow-sm border border-blue-100 text-blue-600'
                                                : 'hover:bg-white/60 text-gray-700'
                                                }`}
                                        >
                                            <span className="font-black">{city}</span>
                                            {city === currentCity && (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-10 text-center">
                                        <p className="text-gray-400 font-bold">شهری پیدا نشد</p>
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

export default CitySelectionDrawer;