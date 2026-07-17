import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface SliderItem {
  id: string;
  image: string;
  title: string;
  tagline: string;
  badge: string;
  badgeColor: string;
}

const SLIDER_ITEMS: SliderItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
    badge: 'برگزیده',
    badgeColor: 'bg-amber-500',
    title: 'کافه هنر و گفتگو "برنا"',
    tagline: 'تجربه طعم اصیل قهوه لاته در فضایی گرم و دنج',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    badge: 'جدید',
    badgeColor: 'bg-emerald-500',
    title: 'کارگاه پخت نان ترش فرانسوی',
    tagline: 'یادگیری فوت‌وفن پخت نان‌های حجیم و لذیذ سنتی',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
    badge: 'پیشنهاد امروز',
    badgeColor: 'bg-[#ED1C24]',
    title: 'کارگاه نقاشی و خلاقیت بوم سفید',
    tagline: 'آزاد کردن پتانسیل هنری در جمعی صمیمی و پرانرژی',
  }
];

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<any>(null);

  // Auto advance every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDER_ITEMS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  // Pause autoplay briefly on user interaction
  const handleInteraction = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Resume autoplay after 7 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 7000);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % SLIDER_ITEMS.length;
    handleInteraction(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + SLIDER_ITEMS.length) % SLIDER_ITEMS.length;
    handleInteraction(prevIndex);
  };

  // We want a beautifully styled Peek effect:
  // Show active item centered fully, and part of left/right items visible on edges with smaller scale and lower opacity.
  return (
    <div 
      className="relative w-full py-4 bg-white overflow-hidden select-none" 
      dir="rtl"
    >
      {/* Sub-header info context */}
      <div className="px-6 pb-3 flex items-center justify-between">
        <span className="text-xs font-black text-gray-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ED1C24] rounded-full animate-pulse" />
          رویدادهای داغ هفته
        </span>
        <button className="text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
          مشاهده همه
          <LucideIcons.ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Main Container for Peek Effect Slider */}
      <div className="relative flex items-center justify-center h-[230px] overflow-hidden px-4">
        {/* Carousel Tracks */}
        <div className="relative flex items-center justify-center w-full h-full">
          {SLIDER_ITEMS.map((item, idx) => {
            // Calculate relative offset for positioning/scaling
            let offset = idx - activeIndex;
            // Handle circular wrapping
            if (offset < -1) offset += SLIDER_ITEMS.length;
            if (offset > 1) offset -= SLIDER_ITEMS.length;

            const isActive = idx === activeIndex;
            const isLeft = offset === -1 || (activeIndex === 0 && idx === SLIDER_ITEMS.length - 1 && SLIDER_ITEMS.length > 2);
            const isRight = offset === 1 || (activeIndex === SLIDER_ITEMS.length - 1 && idx === 0 && SLIDER_ITEMS.length > 2);

            // Determine rendering state
            let positionX = '0%';
            let scale = 0.85;
            let opacity = 0;
            let zIndex = 10;

            if (isActive) {
              positionX = '0%';
              scale = 1.0;
              opacity = 1;
              zIndex = 30;
            } else if (isLeft) {
              positionX = '-82%'; // Peek offset to the left
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
            } else if (isRight) {
              positionX = '82%'; // Peek offset to the right
              scale = 0.88;
              opacity = 0.65;
              zIndex = 20;
            }

            return (
              <motion.div
                key={item.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x > swipeThreshold) {
                    handlePrev();
                  } else if (info.offset.x < -swipeThreshold) {
                    handleNext();
                  }
                }}
                animate={{
                  x: positionX,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                }}
                className="absolute w-[82%] sm:w-[86%] h-full rounded-[24px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 bg-white cursor-grab active:cursor-grabbing"
                style={{ originY: '50%' }}
                onClick={() => {
                  if (!isActive) {
                    handleInteraction(idx);
                  }
                }}
              >
                {/* Background image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000s] ease-linear"
                  style={{ transform: isActive ? 'scale(1.08)' : 'scale(1.0)' }}
                  referrerPolicy="no-referrer"
                />

                {/* Ambient vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Floating Content over Slider */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-right z-10 select-none">
                  <div className="flex items-center justify-between">
                    {/* Badge */}
                    <span className={`px-2.5 py-1 text-[9px] font-black text-white rounded-full ${item.badgeColor} shadow-sm backdrop-blur-md bg-opacity-95`}>
                      {item.badge}
                    </span>
                    
                    {/* Floating micro clock */}
                    <span className="text-[9px] font-black text-white/85 bg-black/25 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                      <LucideIcons.Clock className="w-2.5 h-2.5" />
                      ۵ دقیقه پیش
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Event Title */}
                    <h3 className="text-white text-[16px] sm:text-lg font-black leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                    
                    {/* Event Tagline */}
                    <p className="text-white/80 text-[11px] sm:text-xs font-bold leading-normal line-clamp-1">
                      {item.tagline}
                    </p>

                    {/* Footer Actions Inside Slider Card */}
                    <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          <img className="inline-block h-4 w-4 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=50" alt="" />
                          <img className="inline-block h-4 w-4 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50" alt="" />
                          <img className="inline-block h-4 w-4 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50" alt="" />
                        </div>
                        <span className="text-[9px] font-black text-white/90">۱۲ نفر عضو شده‌اند</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                        <span>رزرو سریع</span>
                        <LucideIcons.ChevronLeft className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modern minimal Navigation Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-3.5">
        {SLIDER_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleInteraction(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-5 bg-[#ED1C24]' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
