import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { type AppCategory, type AppUser } from '../types';

interface CategoriesPageProps {
  categories: AppCategory[];
  currentUser: AppUser | null;
  onSelectCategory: (categoryTitle: string) => void;
  activeCategory: string | null;
  onClearCategory: () => void;
}

export function CategoriesPage({
  categories,
  currentUser,
  onSelectCategory,
  activeCategory,
  onClearCategory,
}: CategoriesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Determine time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صبح بخیر ☀️';
    if (hour < 18) return 'روز بخیر 🌤️';
    return 'عصر بخیر 🌙';
  };

  // Map category titles to their design/visual-friendly Lucide icon names if they don't match
  const getCategoryIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Compass;
  };

  // Filter categories by search query
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.32, 0.94, 0.6, 1] }}
      className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-white"
      dir="rtl"
    >
      {/* Header Profile & Actions */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
              alt="User Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-gray-400">خوش آمدید</span>
            <span className="text-sm font-black text-gray-900">
              {currentUser?.name || "کاربر مهمان"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Audio/Sliders Grid Button */}
          <button className="w-11 h-11 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all rounded-full flex items-center justify-center border border-gray-100/60 text-gray-800">
            <LucideIcons.SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
          
          {/* Notification Button */}
          <button className="w-11 h-11 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all rounded-full flex items-center justify-center border border-gray-100/60 text-gray-800 relative">
            <LucideIcons.Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#ED1C24] rounded-full" />
          </button>
        </div>
      </div>

      {/* Greeting Banner */}
      <div className="px-6 py-4 text-right">
        <h1 className="text-[28px] font-black text-gray-900 leading-tight">
          {getGreeting()}
        </h1>
        <p className="text-sm font-bold text-gray-400 mt-1">
          دسته بندی‌های متنوع رویدادهای دورهمی را کاوش کنید
        </p>
      </div>

      {/* Modern Search Box styled perfectly like the layout boxes */}
      <div className="px-6 mb-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="جستجو در دسته‌بندی‌ها..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F3F4F6]/80 focus:bg-white focus:border-gray-200 border-2 border-transparent rounded-[20px] py-4 pr-14 pl-12 focus:ring-4 focus:ring-gray-100/50 transition-all outline-none text-sm text-right font-black text-gray-800 placeholder-gray-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#ED1C24] rounded-full shadow-sm shadow-[#ED1C24]/10">
            <LucideIcons.Search className="w-4 h-4 text-white" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Category Alert / Clear Filter */}
      {activeCategory && (
        <div className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-[#ED1C24]">
              <LucideIcons.Filter className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-[#ED1C24]">
              فیلتر فعال: {activeCategory}
            </p>
          </div>
          <button
            onClick={onClearCategory}
            className="text-xs font-black text-gray-400 hover:text-gray-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm"
          >
            حذف فیلتر
          </button>
        </div>
      )}

      {/* Modern Minimalist Grid (Exactly like the design image) */}
      <div className="px-6 py-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3 bg-gray-50/50 rounded-[28px] border-2 border-dashed border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto">
              <LucideIcons.Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-gray-700">نتیجه‌ای یافت نشد</h3>
            <p className="text-xs text-gray-400 font-bold">دسته‌بندی با مشخصات وارد شده پیدا نشد.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#ED1C24] font-black hover:underline mt-2 block mx-auto bg-red-50 px-3 py-1.5 rounded-lg border border-red-100/50"
            >
              پاک کردن فیلتر جستجو
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3.5">
            {filteredCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const isSelected = activeCategory === cat.title;

              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectCategory(cat.title)}
                  className={`flex flex-col items-center justify-center aspect-[1.35] rounded-[20px] transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#ED1C24]/10 to-[#ED1C24]/5 border-2 border-[#ED1C24] shadow-sm'
                      : 'bg-[#F3F4F6]/80 hover:bg-[#E5E7EB] border border-transparent'
                  }`}
                >
                  {/* Center Icon */}
                  <div className={`mb-3 flex items-center justify-center ${isSelected ? 'text-[#ED1C24]' : 'text-[#1F2937]'}`}>
                    <Icon className="w-7 h-7 stroke-[1.8]" />
                  </div>

                  {/* Category Label */}
                  <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-[#ED1C24]' : 'text-[#374151]'}`}>
                    {cat.title}
                  </span>

                  {/* Glow/Dot Indicator if selected */}
                  {isSelected && (
                    <span className="absolute bottom-2.5 w-1.5 h-1.5 bg-[#ED1C24] rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Horizontal featured block under category grid */}
      <div className="mt-6 px-6">
        <div className="bg-gray-50 rounded-[32px] p-5 flex items-center justify-between border border-gray-100/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <LucideIcons.Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-black text-gray-900">پیشنهادهای ویژه روز</span>
              <span className="text-[11px] font-bold text-gray-400">برترین رویدادهای امروز بر اساس سلیقه شما</span>
            </div>
          </div>
          <LucideIcons.ChevronLeft className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Subtle bottom info indicator */}
      <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-gray-400">
        <span className="text-[11px] font-bold">برای جزئیات بیشتر به بخش رویدادها بروید</span>
        <LucideIcons.ArrowLeft className="w-3.5 h-3.5" />
      </div>
    </motion.main>
  );
}
