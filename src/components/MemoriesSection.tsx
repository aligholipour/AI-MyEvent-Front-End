import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface MemoryItem {
  id: string;
  eventId: string;
  title: string;
  location: string;
  image: string;
  organizerName: string;
  organizerAvatar: string;
  gallery: string[];
}

const MEMORIES_DATA: MemoryItem[] = [
  {
    id: 'm1',
    eventId: '3',
    title: 'شب نشینی جذاب مافیا',
    location: 'شیراز، کافه هنر',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    organizerName: 'گروه بازی‌های دورهمی',
    organizerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'm2',
    eventId: '1',
    title: 'کارگاه طراحی تجربه کاربری',
    location: 'تهران، خیابان ولیعصر',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    organizerName: 'آکادمی دیزاین تهرانی',
    organizerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'm3',
    eventId: '2',
    title: 'نشست استارتاپ‌های نوپا',
    location: 'اصفهان، شهرک علمی تحقیقاتی',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    organizerName: 'شتاب‌دهنده هاب',
    organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    gallery: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

interface MemoriesSectionProps {
  onSelectEvent: (eventId: string) => void;
}

export function MemoriesSection({ onSelectEvent }: MemoriesSectionProps) {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemory && viewerIndex !== null) {
      setViewerIndex((viewerIndex + 1) % selectedMemory.gallery.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemory && viewerIndex !== null) {
      setViewerIndex((viewerIndex - 1 + selectedMemory.gallery.length) % selectedMemory.gallery.length);
    }
  };

  return (
    <section className="px-6 py-6 bg-white border-t border-gray-50/80">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-100/30">
            <LucideIcons.Heart className="w-4 h-4 fill-amber-500/10" />
          </div>
          <h2 className="text-xl font-black text-gray-900">خاطره‌ها</h2>
        </div>
        <button className="text-[#ED1C24] font-black text-xs underline decoration-dotted offset-4">
          مشاهده همه
        </button>
      </div>

      {/* Horizontal Scrollable Memories */}
      <div 
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2" 
        dir="rtl"
      >
        {MEMORIES_DATA.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMemory(item)}
            className="flex-shrink-0 w-[58vw] max-w-[240px] aspect-[4/5] rounded-2xl overflow-hidden relative shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 cursor-pointer group"
          >
            {/* Memory Cover Photo */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />

            {/* Dark Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

            {/* Overlaid Info */}
            <div className="absolute bottom-4 left-4 right-4 z-20 text-right">
              <h3 className="text-white text-xs font-black leading-tight mb-1 break-words">
                {item.title}
              </h3>
              <div className="flex items-center justify-end gap-1 text-white/80 text-[9px] font-bold">
                <span>{item.location}</span>
                <LucideIcons.MapPin className="w-2.5 h-2.5 shrink-0 text-white/90" />
              </div>
            </div>

            {/* View indicators (Stack avatars of people from past events if we want, similar to mockup) */}
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-xs rounded-full px-2 py-0.5 z-20 flex items-center gap-1 border border-white/10">
              <LucideIcons.Camera className="w-3 h-3 text-white" />
              <span className="text-white text-[9px] font-black">{item.gallery.length} عکس</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Drawer for Selected Memory */}
      <AnimatePresence>
        {selectedMemory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemory(null)}
              className="fixed inset-0 bg-black z-[150]"
            />

            {/* RTL Bottom Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-[32px] z-[160] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh]"
              dir="rtl"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 shrink-0" />

              {/* Drawer Header */}
              <div className="px-6 pb-4 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMemory.organizerAvatar}
                    alt={selectedMemory.organizerName}
                    className="w-10 h-10 rounded-full border border-gray-100 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-gray-400">برگزارکننده: {selectedMemory.organizerName}</span>
                    <h3 className="text-sm font-black text-gray-900 leading-tight mt-0.5">{selectedMemory.title}</h3>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectEvent(selectedMemory.eventId);
                    setSelectedMemory(null);
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-colors border border-indigo-100/30"
                >
                  <LucideIcons.ArrowLeft className="w-3.5 h-3.5" />
                  <span>صفحه دورهمی</span>
                </motion.button>
              </div>

              {/* Grid of Photos */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {selectedMemory.gallery.map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setViewerIndex(index)}
                      className="aspect-square rounded-2xl overflow-hidden shadow-xs border border-gray-100 cursor-pointer relative group"
                    >
                      <img
                        src={photo}
                        alt={`خاطره ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full-screen photo viewer */}
      <AnimatePresence>
        {viewerIndex !== null && selectedMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-between p-6 select-none"
            onClick={() => setViewerIndex(null)}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between z-10 text-white max-w-[480px]">
              <span className="text-xs font-black" dir="rtl">
                خاطره {viewerIndex + 1} از {selectedMemory.gallery.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex(null);
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/5"
              >
                <LucideIcons.X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main Interactive Photo Viewer Container */}
            <div className="flex-1 w-full flex items-center justify-center relative max-w-[480px]">
              {/* Left arrow navigation button */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/5 flex items-center justify-center z-20 text-white transition-all active:scale-95"
              >
                <LucideIcons.ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <motion.img
                key={viewerIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                src={selectedMemory.gallery[viewerIndex]}
                alt="نمای بزرگ"
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />

              {/* Right arrow navigation button */}
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/5 flex items-center justify-center z-20 text-white transition-all active:scale-95"
              >
                <LucideIcons.ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Footer with basic swipe hint */}
            <div className="z-10 pb-4 text-center">
              <p className="text-white/40 text-[10px] font-bold">برای جابجایی از دکمه‌های کناری استفاده کنید</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
