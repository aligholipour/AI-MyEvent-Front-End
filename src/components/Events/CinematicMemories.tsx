import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface CinematicMemory {
  id: string;
  title: string;
  location: string;
  coverImage: string;
  gallery: string[];
}

const CINEMATIC_MEMORIES: CinematicMemory[] = [
  {
    id: 'cm1',
    title: 'دورهمی شب یلدا • ویلای شمال',
    location: 'مازندران، ویلای نمک‌آبرود',
    coverImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'cm2',
    title: 'کافه گردی پاییزه • کافه گالری',
    location: 'تهران، خیابان فرشته',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'cm3',
    title: 'کمپینگ در جنگل الیمستان',
    location: 'مازندران، ارتفاعات آمل',
    coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'cm4',
    title: 'بستنی پارتی در بام تهران',
    location: 'تهران، ولنجک',
    coverImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'cm5',
    title: 'رصد ستارگان کویر مرنجاب',
    location: 'اصفهان، کویر مرنجاب',
    coverImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export function CinematicMemories() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with central card as active
  const [galleryOpen, setGalleryOpen] = useState<CinematicMemory | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CINEMATIC_MEMORIES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CINEMATIC_MEMORIES.length) % CINEMATIC_MEMORIES.length);
  };

  // Support swipe/drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> Next
        handleNext();
      } else {
        // Swipe right -> Prev
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-8 bg-gray-950 text-white border-t border-gray-900 overflow-hidden relative">
      {/* Absolute Decorative Lights */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#ED1C24]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between mb-8" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/5 text-rose-500 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
            <LucideIcons.Tv className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-right">
            <h2 className="text-base font-black tracking-tight text-white">سینمای خاطره‌ها</h2>
            <p className="text-[9px] font-bold text-gray-500">قاب‌های زنده از گردهمایی‌های گذشته</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handlePrev}
            className="w-7 h-7 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-lg flex items-center justify-center border border-white/5 transition-all"
          >
            <LucideIcons.ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="w-7 h-7 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-lg flex items-center justify-center border border-white/5 transition-all"
          >
            <LucideIcons.ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overlapping Movie Poster Carousel Stage */}
      <div 
        className="relative h-[280px] flex items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-[320px] h-full flex items-center justify-center">
          {CINEMATIC_MEMORIES.map((item, index) => {
            // Relative offset calculation wrapping nicely
            let offset = index - activeIndex;
            const len = CINEMATIC_MEMORIES.length;
            
            // Adjust offset to get shortest path for wrapping
            if (offset > len / 2) offset -= len;
            if (offset < -len / 2) offset += len;

            // Absolute visibility constraint: only render if distance <= 2
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            // Compute dynamic 3D styles based on offset
            const isCenter = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;

            let zIndex = 10;
            let scale = 0.7;
            let rotateY = 0;
            let rotateZ = 0;
            let translateX = '0%';
            let opacity = 1;

            if (isCenter) {
              zIndex = 30;
              scale = 1.0;
              rotateY = 0;
              rotateZ = 0;
              translateX = '0%';
              opacity = 1;
            } else if (Math.abs(offset) === 1) {
              zIndex = 20;
              scale = 0.85;
              rotateY = isLeft ? 15 : -15;
              rotateZ = isLeft ? -5 : 5;
              translateX = isLeft ? '-45%' : '45%';
              opacity = 0.85;
            } else if (Math.abs(offset) === 2) {
              zIndex = 10;
              scale = 0.72;
              rotateY = isLeft ? 28 : -28;
              rotateZ = isLeft ? -9 : 9;
              translateX = isLeft ? '-82%' : '82%';
              opacity = 0.45;
            }

            return (
              <motion.div
                key={item.id}
                style={{ zIndex }}
                animate={{
                  scale,
                  x: translateX,
                  rotateY,
                  rotate: rotateZ,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                }}
                onClick={() => {
                  if (isCenter) {
                    setGalleryOpen(item);
                    setActivePhotoIndex(0);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute w-[180px] h-[250px] rounded-2xl overflow-hidden cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/10 preserve-3d"
              >
                {/* Image */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />

                {/* Overlaid texts */}
                <div className="absolute bottom-3 left-3 right-3 z-20 text-right" dir="rtl">
                  <h3 className="text-white text-[10px] font-black leading-tight truncate mb-0.5">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-end gap-1 text-[8px] text-gray-400 font-bold">
                    <span>{item.location}</span>
                    <LucideIcons.MapPin className="w-2.5 h-2.5 text-[#ED1C24]/80 shrink-0" />
                  </div>
                </div>

                {/* Cinematic Badge */}
                {isCenter && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 left-2 bg-[#ED1C24] text-white text-[7px] font-black tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-20"
                  >
                    <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                    مشاهده آلبوم
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Cinematic Photo Viewer */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950 z-[250] flex flex-col items-center justify-between p-6 select-none"
            dir="rtl"
          >
            {/* Ambient Background Blur of the current photo */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
              <img
                src={galleryOpen.gallery[activePhotoIndex]}
                alt="blur background"
                className="w-full h-full object-cover blur-[50px] scale-120"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Header Toolbar */}
            <div className="w-full flex items-center justify-between z-10 max-w-[480px]">
              <div className="flex flex-col text-right">
                <h3 className="text-white text-xs font-black">{galleryOpen.title}</h3>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">{galleryOpen.location}</p>
              </div>
              <button
                onClick={() => setGalleryOpen(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center transition-all border border-white/5"
              >
                <LucideIcons.X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main Carousel Viewer with Swipe */}
            <div className="flex-1 w-full flex items-center justify-center relative max-w-[480px] z-10">
              {/* Left Action Button (Next image in RTL is left) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev + 1) % galleryOpen.gallery.length);
                }}
                className="absolute left-2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
              >
                <LucideIcons.ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Photo Card */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhotoIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  src={galleryOpen.gallery[activePhotoIndex]}
                  alt="album view"
                  className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/5"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Right Action Button (Prev image in RTL is right) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev - 1 + galleryOpen.gallery.length) % galleryOpen.gallery.length);
                }}
                className="absolute right-2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
              >
                <LucideIcons.ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Indicators */}
            <div className="w-full flex flex-col items-center gap-2 z-10 pb-4 max-w-[480px]">
              <span className="text-[10px] font-black text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                {activePhotoIndex + 1} از {galleryOpen.gallery.length}
              </span>
              <div className="flex gap-1">
                {galleryOpen.gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activePhotoIndex ? 'w-4 bg-rose-500' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
