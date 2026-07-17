import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export function KhitananEventCard() {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
  ];

  return (
    <section className="px-6 py-4 bg-white" dir="rtl">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-gray-900">رویداد ویژه سنتی</h2>
        <span className="text-[11px] font-black text-[#ED1C24] flex items-center gap-1">
          <LucideIcons.Sparkles className="w-3 h-3 text-[#ED1C24]" />
          پیشنهاد ویژه
        </span>
      </div>

      {/* Main Card */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.01)] p-4 flex flex-col gap-3.5"
      >
        {/* Upper Layout: Horizontal split */}
        <div className="flex gap-4 items-center">
          
          {/* Left Side: Photo with rounded corners exactly like the reference */}
          <div className="w-[100px] h-[100px] shrink-0 rounded-2xl overflow-hidden relative shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=300"
              alt="Khitanan Ceremony"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Traditional Badge */}
            <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-md text-[8px] font-black text-gray-700 px-1.5 py-0.5 rounded-md shadow-xs">
              سنتی
            </div>
          </div>

          {/* Right Side: Content info (Text and descriptions) */}
          <div className="flex-1 flex flex-col justify-between text-right min-w-0">
            <div>
              {/* Event Title */}
              <h3 className="text-sm font-black text-gray-900 leading-tight mb-0.5">
                مراسم ختنان سنتی (Khitanan Ceremony)
              </h3>
              
              {/* Event Subtitle/Description (Shortened according to design) */}
              <p className="text-[11px] font-bold text-gray-400 leading-normal line-clamp-2">
                جشن شادی و پاسداشت سنت دیرینه آیین ختنان به همراه پذیرایی سنتی مجلل.
              </p>
            </div>

            {/* Row of avatars & participant count */}
            <div className="flex items-center gap-4 mt-2">
              {/* Avatar stack */}
              <div className="flex items-center shrink-0">
                <div className="flex -space-x-1.5 space-x-reverse">
                  {avatars.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`شرکت‌کننده ${index + 1}`}
                      className="w-6 h-6 rounded-full border border-white object-cover shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black text-gray-400 mr-1.5">۱۲+</span>
              </div>

              {/* Participant count matching design icon and look */}
              <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                <LucideIcons.Users className="w-3.5 h-3.5 text-gray-400" />
                <span>۱۲/۱۲۰ نفر</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Layout: Unified single continuous background pill (#F3F4F6) with metadata */}
        <div className="bg-[#F3F4F6]/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-gray-500 text-[10px] font-black gap-2">
          
          {/* Location Info */}
          <div className="flex items-center gap-1">
            <LucideIcons.MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>گاتهام سیتی (Gotham City)</span>
          </div>

          {/* Dot Separator */}
          <span className="text-gray-300">•</span>

          {/* Date Info */}
          <div className="flex items-center gap-1">
            <LucideIcons.Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>۱۲ دی ۱۴۰۳</span>
          </div>

          {/* Dot Separator */}
          <span className="text-gray-300">•</span>

          {/* Time Info */}
          <div className="flex items-center gap-1">
            <LucideIcons.Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>۱۲:۰۰</span>
          </div>

        </div>
      </motion.div>
    </section>
  );
}

