import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from '../../lib/utils';

function ImageCropperDrawer({
  image,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9
}: {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  aspectRatio?: number;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
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
        console.error(e);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && image && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 z-[200] backdrop-blur-md" />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-white z-[210] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            dir="rtl"
          >
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">برش تصویر</h3>
              <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 relative bg-gray-900">
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

            <div className="p-6 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-500">میزان زوم</span>
                  <span className="text-xs font-bold text-gray-900">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ED1C24]"
                />
              </div>

              <button
                onClick={handleDone}
                className="w-full py-4 bg-[#ED1C24] text-white rounded-2xl font-black shadow-lg shadow-[#ED1C24]/20 transition-all hover:opacity-90"
              >
                تایید و برش
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ImageCropperDrawer;