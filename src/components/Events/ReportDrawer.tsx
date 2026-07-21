// ReportDrawer.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";

function ReportDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const options = [
        { id: 1, text: 'محتوای نامناسب یا غیراخلاقی' },
        { id: 2, text: 'رفتار نادرست برگزارکننده' },
        { id: 3, text: 'محل برگزاری نامناسب' },
        { id: 4, text: 'قیمت یا اطلاعات نادرست' },
        { id: 5, text: 'سایر موارد فنی یا امنیتی' }
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
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
                    />
                    
                    {/* Bottom Sheet - Premium design */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 220 }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
                        dir="rtl"
                    >
                        {/* Elegant handle bar */}
                        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

                        <AnimatePresence mode="wait">
                            {isSubmitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-6 py-12 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-base font-black text-gray-900">گزارش شما ثبت شد</h3>
                                    <p className="text-xs font-bold text-gray-400">تیم پشتیبانی ما موضوع را سریعاً بررسی خواهد کرد.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" className="px-6 pb-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h2 className="text-lg font-black text-gray-900">گزارش تخلف رویداد</h2>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">علت گزارش خود را مشخص نمایید</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Options - Redesigned */}
                                    <div className="space-y-2">
                                        {options.map((opt) => {
                                            const isSelected = selectedIds.includes(opt.id);
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => toggleOption(opt.id)}
                                                    className={`w-full text-right px-4 py-3 rounded-2xl flex items-center justify-between transition-all border text-xs font-bold ${
                                                        isSelected
                                                            ? 'border-[#ED1C24] bg-red-50/5 text-[#ED1C24]'
                                                            : 'border-gray-200/80 bg-white hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span>{opt.text}</span>
                                                    <div
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                            isSelected ? 'border-[#ED1C24] bg-[#ED1C24] text-white' : 'border-gray-300'
                                                        }`}
                                                    >
                                                        {isSelected && <Check className="w-2.5 h-2.5" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Description - Redesigned */}
                                    <div className="space-y-1 text-right">
                                        <label className="text-[10px] font-black text-gray-500 mr-1">توضیحات تکمیلی (اختیاری)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="اگر جزئیات بیشتری دارید، اینجا بنویسید..."
                                            className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#007AFF] focus:bg-white focus:ring-4 focus:ring-blue-50/20 transition-all min-h-[100px] resize-none"
                                        />
                                    </div>

                                    {/* Buttons - Redesigned */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        disabled={selectedIds.length === 0}
                                        onClick={handleSendReport}
                                        className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 outline-none transition-all ${
                                            selectedIds.length > 0
                                                ? 'bg-[#ED1C24] hover:bg-[#D0171E] text-white shadow-md'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <span>ارسال گزارش</span>
                                    </motion.button>
                                    
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-gray-50/80 text-gray-500 hover:bg-gray-100/80 py-3.5 rounded-2xl font-black text-sm transition-all"
                                    >
                                        انصراف
                                    </button>
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