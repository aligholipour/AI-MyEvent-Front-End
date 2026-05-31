import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Search, } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { CreateEventCategory } from '../../services/categories'
import { AppCategory } from "../../types";

function CategoryDrawer({
    isOpen,
    onClose,
    categoryTitle,
    onSelect }: {
        isOpen: boolean;
        onClose: () => void;
        categoryTitle: string;
        onSelect: (categoryId: number, categoryTitle: string) => void;
    }) {

    const [categories, setCategories] = useState<AppCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    // const CATEGORIES: AppCategory[] = StaticCATEGORIES;

    const filteredCategories = categories.filter(cat =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // دریافت دسته‌بندی‌ها هنگام باز شدن دراو
    useEffect(() => {
        if (isOpen && categories.length === 0) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CreateEventCategory();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'خطا در دریافت دسته‌بندی‌ها');
            console.error('Error loading categories:', err);
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
                                <h3 className="text-xl font-black text-gray-900">انتخاب دسته‌بندی</h3>
                                <p className="text-xs font-bold text-gray-400">یک دسته‌بندی برای رویداد خود انتخاب کنید</p>
                            </div>
                            <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="relative shrink-0">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="جستجوی دسته‌بندی..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                            <div className="grid grid-cols-2 gap-4">
                                {filteredCategories.map(cat => {
                                    const IconComponent = (LucideIcons as any)[cat.icon];
                                    const isSelected = categoryTitle === cat.title;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                onSelect(cat.id, cat.title);
                                                onClose();
                                            }}
                                            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 ${isSelected
                                                ? 'bg-gray-900/5 border-gray-900 shadow-sm'
                                                : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center bg-white ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {IconComponent && <IconComponent className="w-6 h-6" />}
                                            </div>
                                            <span className={`text-xs font-black ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{cat.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg transition-all shrink-0 active:scale-[0.98]"
                        >
                            بستن
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default CategoryDrawer;
