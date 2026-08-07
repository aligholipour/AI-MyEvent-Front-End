// CancellationConfirmDrawer.tsx
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle } from "lucide-react";

function CancellationConfirmDrawer({
    isOpen,
    onClose,
    onConfirm
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                    />
                    
                    {/* Bottom Sheet Drawer */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col pt-2"
                        dir="rtl"
                    >
                        {/* Elegant drag handle */}
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-3" />
                        
                        {/* Content */}
                        <div className="px-6 pb-8 space-y-5 text-center">
                            {/* Icon */}
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            
                            {/* Title & Description */}
                            <div className="space-y-1.5">
                                <h2 className="text-base font-black text-gray-900">لغو ثبت‌نام رویداد</h2>
                                <p className="text-xs font-bold text-gray-400 leading-relaxed">
                                    آیا از لغو ثبت‌نام در این رویداد اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white h-10 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-98"
                                >
                                    بله، لغو شود
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 h-10 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-98"
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

export default CancellationConfirmDrawer;