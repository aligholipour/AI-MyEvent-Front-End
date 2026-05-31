import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

function ConfirmationDrawer({
  isOpen,
  onClose,
  event,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onConfirm?: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-2xl shadow-2xl flex flex-col pt-2"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />

            <div className="px-6 pb-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">تایید نهایی</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">نام رویداد</span>
                  <span className="text-lg font-black text-gray-900 leading-tight">{event.title}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400">تاریخ و ساعت</span>
                    <span className="text-sm font-black text-gray-800">{event.eventTime}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400">برگزارکننده</span>
                    <span className="text-sm font-black text-gray-800">{event.organizerName}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm font-bold text-center leading-relaxed">
                آیا از شرکت در این رویداد اطمینان دارید؟ با تایید نهایی حضور شما ثبت خواهد شد.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="w-full bg-[#ED1C24] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#ED1C24]/20 transition-all"
                >
                  تایید و ثبت نام
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-lg transition-all"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmationDrawer;