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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"/>
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col pt-2"
                        dir="rtl">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />

                        <div className="px-8 pb-10 space-y-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                                    <AlertCircle className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-gray-900">لغو ثبت نام</h2>
                                    <p className="text-sm font-bold text-gray-400 leading-relaxed">
                                        آیا از لغو ثبت‌نام در این رویداد اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onConfirm}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-base shadow-lg transition-all">
                                    بله، لغو ثبت‌نام
                                </motion.button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-base active:scale-[0.98] transition-all">
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