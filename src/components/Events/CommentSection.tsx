import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import * as LucideIcons from 'lucide-react';

function CommentSection({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    onSubmit(rating, commentText);
    setCommentText('');
  };

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[9990] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[9995] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3" />

        <div className="px-6 pb-8 space-y-5 text-right flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-gray-900">ثبت نظر و امتیاز جدید</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">تجربه ارزشمندتان را با ما به اشتراک بگذارید</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Stars interactive control */}
          <div className="flex flex-col items-center gap-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/40">
            <span className="text-[10px] font-black text-gray-400">به این رویداد چند ستاره می‌دهید؟</span>
            <div className="flex items-center gap-1.5" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 outline-none"
                >
                  <LucideIcons.Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Text area */}
          <div className="space-y-1 text-right">
            <label className="text-[10px] font-black text-gray-500 mr-1">متن نظر شما</label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="نکات مثبت، محیط برگزاری یا پیشنهاداتی که برای برگزارکننده دارید بنویسید..."
              className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#007AFF] focus:bg-white focus:ring-4 focus:ring-blue-50/20 transition-all min-h-[100px] resize-none"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all outline-none"
          >
            <LucideIcons.Send className="w-4 h-4" />
            <span>ثبت نهایی نظر</span>
          </motion.button>
        </div>
      </motion.div>
    </>,
    document.body
  );
}

export default CommentSection;