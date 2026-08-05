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

    const [categories, setCategories] = useState<AppCategory[]>()

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
            dir="rtl">

            <div className="px-6 py-10">
                <div className="grid grid-cols-3 gap-3.5">
                    {categories?.map((cat) => {
                        const Icon = getCategoryIcon(cat.icon);
                        return (
                            <motion.button
                                key={cat.id}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => onSelectCategory(cat.id)}
                                className='flex flex-col items-center justify-center aspect-[1.35] rounded-[20px] transition-all relative bg-[#F3F4F6]/80 hover:bg-[#E5E7EB] border border-transparent'>
                                <div className='mb-3 flex items-center justify-center text-[#1F2937]'>
                                    <Icon className="w-7 h-7 stroke-[1.8]" />
                                </div>

                                <span className='text-[11px] font-black tracking-tight text-[#374151]'>
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
