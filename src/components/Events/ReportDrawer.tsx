import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";

function ReportDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const options = [
        { id: 1, text: 'محتوای غیراخلاقی' },
        { id: 2, text: 'رفتار میزبان خوب نبود' },
        { id: 3, text: 'اطلاعات نادرست' },
        { id: 4, text: 'هرزنامه' },
        { id: 5, text: 'گزینه دیگر' }
    ];

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleOption = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSendReport = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            // Reset state after the animation would have completed
            setTimeout(() => {
                setIsSubmitted(false);
                setSelectedIds([]);
                setDescription('');
            }, 500);
        }, 1500);
    };

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
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-2xl shadow-2xl flex flex-col pt-2 max-h-[90vh] overflow-y-auto no-scrollbar"
                        dir="rtl"
                    >
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

                        <AnimatePresence mode="wait">
                            {isSubmitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-6 py-12 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                                        <Check className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">گزارش شما ثبت شد</h3>
                                    <p className="text-sm font-bold text-gray-400">از اینکه ما را در بهبود جامعه کمک می‌کنید سپاسگزاریم.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                                    <div className="px-6 pb-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <h2 className="text-xl font-black text-gray-900">گزارش تخلف</h2>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1">تیم پشتیبانی در اسرع وقت بررسی خواهد کرد</p>
                                            </div>
                                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <span className="text-xs font-bold text-gray-400 block mb-2 px-1">علت گزارش را انتخاب کنید:</span>
                                            <div className="grid grid-cols-1 gap-2">
                                                {options.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => toggleOption(opt.id)}
                                                        className={`w-full text-right px-5 py-4 rounded-2xl flex items-center justify-between transition-all border ${selectedIds.includes(opt.id)
                                                            ? 'bg-red-50 border-red-100 text-[#ED1C24]'
                                                            : 'bg-gray-50/50 border-transparent text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="font-bold text-sm">{opt.text}</span>
                                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedIds.includes(opt.id) ? 'border-[#ED1C24] bg-[#ED1C24]' : 'border-gray-200'
                                                            }`}>
                                                            {selectedIds.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-2">
                                            <span className="text-xs font-bold text-gray-400 block mb-2 px-1">توضیحات تکمیلی (اختیاری):</span>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="اگر جزئیات بیشتری دارید، اینجا بنویسید..."
                                                className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900/5 transition-all min-h-[120px] resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 py-6 border-t border-gray-50 flex flex-col gap-3">
                                        <motion.button
                                            whileTap={selectedIds.length > 0 ? { scale: 0.98 } : {}}
                                            onClick={handleSendReport}
                                            disabled={selectedIds.length === 0}
                                            className={`w-full py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${selectedIds.length > 0
                                                ? 'bg-[#ED1C24] text-white shadow-[#ED1C24]/20'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            ارسال گزارش
                                        </motion.button>
                                        <button
                                            onClick={onClose}
                                            className="w-full bg-gray-50 text-gray-500 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors"
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ReportDrawer;