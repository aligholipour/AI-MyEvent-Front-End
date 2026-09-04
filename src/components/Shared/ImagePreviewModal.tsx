import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface ImagePreviewDrawerProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  confirmText?: string;
}

export function ImagePreviewModal({
  image,
  isOpen,
  onClose,
  onConfirm,
  title = 'پیش‌نمایش تصویر',
  confirmText = 'تایید',
}: ImagePreviewDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && image && (
        <>
          {/* بکدراپ با blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[8px]"
          />

          {/* مودال پیش‌نمایش */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* هدر */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <LucideIcons.Image className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base font-bold text-gray-900">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors active:scale-95"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              {/* محتوای تصویر */}
              <div className="relative bg-gray-900/5 p-4 flex items-center justify-center min-h-[300px] max-h-[60vh]">
                <img
                  src={image}
                  alt="پیش‌نمایش"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                />
              </div>

              {/* فوتر با دکمه‌ها */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  انصراف
                </button>
                {onConfirm && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onConfirm}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-900/20 transition-all"
                  >
                    {confirmText}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ImagePreviewModal;