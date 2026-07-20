import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { Area, Point } from 'react-easy-crop';
import * as LucideIcons from 'lucide-react';
import { getCroppedImg } from '../lib/utils';

interface ImageCropperDrawerProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  aspectRatio?: number;
}

export function ImageCropperDrawer({
  image,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9,
}: ImageCropperDrawerProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteInternal = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    if (image && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        onCropComplete(croppedImage);
        onClose();
      } catch (e) {
        console.error('Error during image crop:', e);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && image && (
        <>
          {/* Premium backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-[4px]"
          />

          {/* Elegant bottom sheet matching Login/City selectors */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-[#F8F9FC] z-[210] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag accent line */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header section matching other premium drawers */}
            <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-white shrink-0 flex items-center justify-between">
              <div className="flex flex-col text-right">
                <h3 className="text-base font-black text-gray-900 tracking-tight">برش تصویر</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">تصویر خود را در کادر تنظیم کنید</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Cropper viewport container */}
            <div className="flex-1 relative bg-gray-950/90 overflow-hidden mx-5 mt-5 rounded-2xl border border-gray-100 shadow-inner">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onCropComplete={onCropCompleteInternal}
                onZoomChange={onZoomChange}
              />
            </div>

            {/* Lower controls area with Zoom and Done Action */}
            <div className="p-6 space-y-5 bg-white border-t border-gray-100 mt-5 shrink-0">
              {/* Zoom control with custom stylings */}
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                    <LucideIcons.ZoomIn className="w-3.5 h-3.5 text-gray-500" />
                    میزان زوم تصویر
                  </span>
                  <span className="text-xs font-black text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-xs">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200/80 rounded-lg appearance-none cursor-pointer accent-gray-800"
                />
              </div>

              {/* Action Button matching other filters / drawers (Black/Charcoal minimal styling) */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleDone}
                className="w-full py-4 bg-gray-900 hover:bg-gray-850 text-white rounded-2xl font-black text-sm shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2 transition-all"
              >
                <LucideIcons.Crop className="w-4 h-4" />
                <span>تایید و برش نهایی</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
