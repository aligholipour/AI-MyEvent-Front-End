import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { type AppCategory } from '../../types';
import { initCategories } from '../../services/categories'
import { Compass, Users, Heart, Dumbbell, Laptop, Palette, Gamepad2, Briefcase, Atom, Music, GraduationCap, Image, Cpu, Moon, Trophy } from 'lucide-react';

function CategoryForHomePage() {

    const IconMap: Record<string, any> = { Compass, Users, Heart, Dumbbell, Laptop, Palette, Gamepad2, Briefcase, Atom, Music, GraduationCap, Image, Cpu, Moon, Trophy };
    const [categories, setCategories] = useState<AppCategory[]>()

    useEffect(() => {
        initCategories()
            .then((data: AppCategory[]) => {
                setCategories(data)
            });
    }, []);

    return (
        <section className="px-6 py-6 bg-gray-50" >
            {/* <h2 className="text-lg font-black mb-6 text-center">دسته‌بندی رویدادها</h2> */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {categories?.map((cat) => {
                    const Icon = IconMap[cat.icon] || Compass;
                    return (
                        <motion.div
                            key={cat.id}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center transition-all">
                                <Icon className={`w-8 h-8 text-gray-400`} />
                            </div>
                            <span className="text-[12px] font-bold text-gray-500 text-center tracking-tight leading-tight px-1">
                                {cat.title}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

export default CategoryForHomePage;
