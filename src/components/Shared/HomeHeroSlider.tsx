import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface SliderItem {
  id: string;
  brand: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  image: string;
  sideColor?: string;
  productBadge?: string;
}

const SLIDER_ITEMS: SliderItem[] = [
  {
    id: '1',
    brand: 'Vitalayer',
    headline: 'تابستان با ویتالیر شروع میشه',
    subtitle: 'محصولات تخصصی پوست',
    buttonText: 'خرید',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    sideColor: '#045B47',
    productBadge: 'SPF 50+',
  },
  {
    id: '2',
    brand: 'Vitalayer',
    headline: 'سرم جوانساز و ضدچروک',
    subtitle: 'حس طراوت و شادابی بی‌نظیر پوست',
    buttonText: 'مشاهده',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
    sideColor: '#0055A5',
    productBadge: 'ویتامین C',
  },
  {
    id: '3',
    brand: 'Vitalayer',
    headline: 'کرم آبرسان عمیق ۲۴ ساعته',
    subtitle: 'تغذیه کامل و شاداب‌کننده لایه‌های پوست',
    buttonText: 'خرید آنلاین',
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a86465ae?auto=format&fit=crop&q=80&w=1000',
    sideColor: '#8E24AA',
    productBadge: 'آبرسان',
  },
  {
    id: '4',
    brand: 'Vitalayer',
    headline: 'محافظت کامل در برابر آفتاب',
    subtitle: 'ژل کرم ضدآفتاب بی‌رنگ فاقد چربی',
    buttonText: 'اطلاعات بیشتر',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000',
    sideColor: '#045B47',
    productBadge: 'ضدآفتاب',
  }
];

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<any>(null);

  // Auto advance slider in reverse direction
  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev - 1 + SLIDER_ITEMS.length) % SLIDER_ITEMS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000);
  };

  const handleNext = () => {
    handleInteraction((activeIndex + 1) % SLIDER_ITEMS.length);
  };

  const handlePrev = () => {
    handleInteraction((activeIndex - 1 + SLIDER_ITEMS.length) % SLIDER_ITEMS.length);
  };

  return (
    <section className="w-full py-3.5 select-none" dir="rtl">

      {/* Main Slider Track with peek effect */}
      <div className="relative w-full h-[185px] sm:h-[210px] overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {SLIDER_ITEMS.map((item, idx) => {
            let offset = idx - activeIndex;

            // Normalize offset to closest wrapped distance
            while (offset > SLIDER_ITEMS.length / 2) offset -= SLIDER_ITEMS.length;
            while (offset <= -SLIDER_ITEMS.length / 2) offset += SLIDER_ITEMS.length;

            const isActive = idx === activeIndex;
            const isVisible = Math.abs(offset) <= 1;
            const xPosition = `${offset * 102}%`;

            return (
              <motion.div
                key={item.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 40) {
                    handlePrev();
                  } else if (info.offset.x < -40) {
                    handleNext();
                  }
                }}
                animate={{
                  x: xPosition,
                  opacity: isVisible ? 1 : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => {
                  if (!isActive) handleInteraction(idx);
                }}
                className={`absolute w-[82%] sm:w-[84%] h-full rounded-2xl overflow-hidden shadow-sm cursor-pointer bg-slate-900 ${
                  isActive ? 'shadow-md' : ''
                }`}
                style={{ zIndex: isActive ? 20 : 10 }}
              >
                {/* Background Image - Sea/Beach or Skincare Photography */}
                <img
                  src={item.image}
                  alt={item.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-right">
                  {/* Top Header Bar: Vitalayer Logo on Top Left */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-amber-400 text-gray-900 font-black text-[10px] flex items-center justify-center shadow-xs">
                        V
                      </div>
                      <span className="text-white font-sans tracking-wider text-xs sm:text-sm font-extrabold drop-shadow-sm">
                        {item.brand}
                      </span>
                    </div>

                    {item.productBadge && (
                      <span className="px-2.5 py-0.5 text-[9px] font-black text-emerald-950 bg-emerald-200/90 rounded-md shadow-xs backdrop-blur-xs">
                        {item.productBadge}
                      </span>
                    )}
                  </div>

                  {/* Persian Headline, Subtitle and Buy Button on Right side */}
                  <div className="flex flex-col items-start space-y-2 max-w-[75%] my-auto">
                    <div className="space-y-1">
                      <h3 className="text-white text-base sm:text-lg font-black leading-snug drop-shadow-md">
                        {item.headline}
                      </h3>
                      <p className="text-white/90 text-[11px] sm:text-xs font-bold drop-shadow-xs line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Small rounded Buy button ("خرید") */}
                    <button
                      type="button"
                      className="mt-1 bg-white text-gray-900 hover:bg-gray-100 text-[11px] font-black px-4 py-1.2 rounded-full shadow-md transition-all active:scale-95 cursor-pointer border-none"
                    >
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        {SLIDER_ITEMS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInteraction(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex ? 'w-5 bg-[#ED1C24]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}