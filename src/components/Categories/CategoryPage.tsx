// CategoriesPage.tsx
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppCategory } from '../../types';
import { useEffect, useState } from 'react';
import { initCategories } from '@/src/services/categories';

interface CategoriesPageProps {
    onSelectCategory: (categoryId: number) => void;
}

export function CategoriesPage({
    onSelectCategory,
}: CategoriesPageProps) {

    const getCategoryIcon = (iconName: string) => {
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent || LucideIcons.Compass;
    };

    const [categories, setCategories] = useState<AppCategory[]>([])

    useEffect(() => {
        initCategories()
            .then((data: AppCategory[]) => {
                setCategories(data)
            });
    }, []);

    return (
        <motion.main
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-white"
            dir="rtl"
        >
            <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-3.5">
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon);
                        return (
                            <motion.button
                                key={cat.id}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => onSelectCategory(cat.id)}
                                className="flex flex-col items-center justify-center py-4 px-2 rounded-[22px] transition-all relative group border cursor-pointer bg-white hover:bg-gray-50/80 border-gray-200/70 hover:border-gray-300 shadow-2xs"
                            >
                                {/* Dedicated Sleek Icon Container - AI Design */}
                                <div className="w-11 h-11 mb-2.5 rounded-2xl flex items-center justify-center transition-all bg-gray-100/80 text-gray-800 group-hover:bg-gray-200/60 group-hover:scale-105">
                                    <Icon className="w-5.5 h-5.5 stroke-[2.2]" />
                                </div>

                                {/* Category Label - AI Design */}
                                <span className="text-[11px] font-black tracking-tight text-gray-800 group-hover:text-gray-900">
                                    {cat.title}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.main>
    );
}