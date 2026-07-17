import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  isLoggedIn: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenMoreMenu?: () => void;
  onOpenCreateEvent?: () => void;
}

export function BottomNavigation({
  activeTab,
  isLoggedIn,
  onNavigate,
  onOpenAuth,
  onOpenCreateEvent,
}: BottomNavigationProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Bottom Navigation Items config (Left to Right visually)
  // 1. Profile (leftmost)
  // 2. Categories
  // 3. Gathering / Dorhami (primary center)
  // 4. Home
  // 5. More (rightmost)

  const handleTabClick = (tab: string) => {
    if (tab === 'profile' && !isLoggedIn) {
      onOpenAuth();
    } else if (tab === 'more') {
      setIsMoreMenuOpen(!isMoreMenuOpen);
    } else {
      onNavigate(tab);
      setIsMoreMenuOpen(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Navigation Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[440px] z-[120]" dir="ltr">
        
        {/* Soft 3D Raised Pill Container */}
        <div 
          className="bg-white rounded-[28px] border border-gray-100/90 px-4 py-2.5 flex items-center justify-between shadow-[0_16px_36px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.03),inset_0_-3px_0_rgba(0,0,0,0.03)]"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {/* 1. Profile Icon (Leftmost) */}
          <button
            onClick={() => handleTabClick('profile')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 relative group"
            title="پروفایل"
          >
            <div className={`p-1.5 rounded-full transition-all ${activeTab === 'profile' ? 'text-[#ED1C24] bg-red-50/50' : 'text-[#2C3E50] hover:text-gray-900'}`}>
              <LucideIcons.User className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className={`text-[9px] font-black mt-0.5 transition-colors ${activeTab === 'profile' ? 'text-[#ED1C24]' : 'text-gray-400'}`}>
              پروفایل
            </span>
            {activeTab === 'profile' && (
              <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 w-1.5 h-1.5 bg-[#ED1C24] rounded-full" />
            )}
          </button>

          {/* 2. Categories Icon */}
          <button
            onClick={() => handleTabClick('categories')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 relative group"
            title="دسته‌بندی"
          >
            <div className={`p-1.5 rounded-full transition-all ${activeTab === 'categories' ? 'text-[#ED1C24] bg-red-50/50' : 'text-[#2C3E50] hover:text-gray-900'}`}>
              <LucideIcons.LayoutGrid className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className={`text-[9px] font-black mt-0.5 transition-colors ${activeTab === 'categories' ? 'text-[#ED1C24]' : 'text-gray-400'}`}>
              دسته‌بندی
            </span>
            {activeTab === 'categories' && (
              <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 w-1.5 h-1.5 bg-[#ED1C24] rounded-full" />
            )}
          </button>

          {/* 3. Dorhami / Gathering Icon (Primary Center - orange-gold #FF9F1C style) */}
          <button
            onClick={() => handleTabClick('events')}
            className="flex-shrink-0 -mt-6 px-3 relative group"
            title="دورهمی‌ها"
          >
            {/* Pulsing Warm Glow Aura */}
            <div className="absolute inset-0 bg-[#FF9F1C]/20 rounded-full blur-xl scale-125 opacity-70 animate-pulse" />

            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`w-15 h-15 rounded-2xl flex flex-col items-center justify-center relative border-2 transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-br from-[#FF9F1C] to-[#E68A00] border-white shadow-lg shadow-[#FF9F1C]/35 text-white'
                  : 'bg-white border-gray-100/80 hover:border-[#FF9F1C]/50 shadow-md shadow-gray-200/40 text-[#FF9F1C]'
              }`}
            >
              <div className="relative">
                <LucideIcons.Sparkles className="w-6 h-6 stroke-[1.8]" />
                
                {/* Micro dots of celebration */}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute -bottom-0.5 -left-1 w-1.5 h-1.5 rounded-full bg-red-400" />
              </div>
              <span className={`text-[8px] font-black mt-0.5 ${activeTab === 'events' ? 'text-white' : 'text-[#FF9F1C]'}`}>
                دورهمی
              </span>
            </motion.div>
          </button>

          {/* 4. Home Icon */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 relative group"
            title="خانه"
          >
            <div className={`p-1.5 rounded-full transition-all ${activeTab === 'home' ? 'text-[#ED1C24] bg-red-50/50' : 'text-[#2C3E50] hover:text-gray-900'}`}>
              <LucideIcons.Home className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className={`text-[9px] font-black mt-0.5 transition-colors ${activeTab === 'home' ? 'text-[#ED1C24]' : 'text-gray-400'}`}>
              خانه
            </span>
            {activeTab === 'home' && (
              <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 w-1.5 h-1.5 bg-[#ED1C24] rounded-full" />
            )}
          </button>

          {/* 5. More Icon (Rightmost) */}
          <button
            onClick={() => handleTabClick('more')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 relative group"
            title="بیشتر"
          >
            <div className={`p-1.5 rounded-full transition-all ${isMoreMenuOpen ? 'text-[#ED1C24] bg-red-50/50' : 'text-[#2C3E50] hover:text-gray-900'}`}>
              <LucideIcons.Menu className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className={`text-[9px] font-black mt-0.5 transition-colors ${isMoreMenuOpen ? 'text-[#ED1C24]' : 'text-gray-400'}`}>
              بیشتر
            </span>
            {isMoreMenuOpen && (
              <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 w-1.5 h-1.5 bg-[#ED1C24] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Elegant slide-up sheet/menu when "More" is clicked */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreMenuOpen(false)}
              className="fixed inset-0 bg-black z-[110]"
            />

            {/* Bottom Sheet Menu */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[440px] bg-white rounded-3xl border border-gray-100 p-5 shadow-2xl z-[115]"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <span className="text-sm font-black text-gray-900">منوی خدمات و دسترسی‌ها</span>
                <button 
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100/50 transition-all text-right active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#ED1C24]">
                    <LucideIcons.ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">پنل مدیریت</span>
                    <span className="text-[10px] text-gray-400 font-bold">تایید رویدادها</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (onOpenCreateEvent) {
                      onOpenCreateEvent();
                    } else {
                      onNavigate('home');
                    }
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100/50 transition-all text-right active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <LucideIcons.PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">ایجاد دورهمی جدید</span>
                    <span className="text-[10px] text-gray-400 font-bold">میزبانی کنید</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('categories');
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100/50 transition-all text-right active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF9F1C]">
                    <LucideIcons.Compass className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">رویدادهای جدید</span>
                    <span className="text-[10px] text-gray-400 font-bold">پیشنهاد برتر</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100/50 transition-all text-right active:scale-95 opacity-60"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                    <LucideIcons.Settings className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">تنظیمات</span>
                    <span className="text-[10px] text-gray-400 font-bold">شخصی‌سازی</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
