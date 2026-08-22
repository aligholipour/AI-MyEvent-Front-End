// ConfirmationDrawer.tsx
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { X, Check, ArrowRight } from "lucide-react";

// Interactive Swipe to Confirm button component
function SwipeButton({ onConfirm }: { onConfirm: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [trackWidth, setTrackWidth] = useState(0);
    const handleWidth = 48;
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            setTrackWidth(containerRef.current.offsetWidth);
        }

        const handleResize = () => {
            if (containerRef.current) {
                setTrackWidth(containerRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const measureWidth = () => {
        if (containerRef.current) {
            setTrackWidth(containerRef.current.offsetWidth);
        }
    };

    const maxDrag = trackWidth > 0 ? trackWidth - handleWidth - 8 : 280;
    const x = useMotionValue(0);

    const progressWidth = useTransform(x, (value) => {
        return `${value + handleWidth}px`;
    });

    const textOpacity = useTransform(x, [0, maxDrag * 0.7], [1, 0]);

    const handleDragEnd = () => {
        const currentX = x.get();
        if (currentX >= maxDrag * 0.9) {
            setIsSuccess(true);
            animate(x, maxDrag, { type: 'spring', stiffness: 350, damping: 25 });
            
            if (navigator.vibrate) {
                try {
                    navigator.vibrate(80);
                } catch (e) {
                    console.log('Vibration not supported or blocked:', e);
                }
            }

            setTimeout(() => {
                onConfirm();
            }, 350);
        } else {
            animate(x, 0, { type: 'spring', stiffness: 250, damping: 22 });
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseDown={measureWidth}
            onTouchStart={measureWidth}
            className="relative w-full h-14 bg-gray-100 rounded-full p-1 flex items-center overflow-hidden select-none border border-gray-200/50"
            dir="ltr"
        >
            {/* Dynamic progress bar */}
            <motion.div
                style={{ width: progressWidth }}
                className="absolute left-1 top-1 bottom-1 bg-emerald-500/10 rounded-full z-0 pointer-events-none"
            />

            {/* Persian Slide to confirm guide text */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 font-black text-xs select-none z-0"
                dir="rtl"
            >
                <span>⟫ بکشید برای تایید حضور</span>
            </motion.div>

            {/* Draggable slider handle */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.03}
                dragMomentum={false}
                style={{ x }}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="w-12 h-12 bg-[#ED1C24] rounded-full flex items-center justify-center text-white shadow-md cursor-grab active:cursor-grabbing z-10 border border-red-600/10 shrink-0"
            >
                {isSuccess ? (
                    <Check className="w-5 h-5 text-white animate-bounce" />
                ) : (
                    <ArrowRight className="w-5 h-5 text-white" />
                )}
            </motion.div>
        </div>
    );
}

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
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[260] backdrop-blur-[3px]"
                    />
                    
                    {/* Bottom Sheet - Premium design */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 220 }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[270] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
                        dir="rtl"
                    >
                        {/* Elegant handle bar */}
                        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

                        <div className="px-6 pb-8 space-y-5 text-right">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-black text-gray-900">تایید نهایی ثبت نام</h2>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">اطلاعات حضور خود را نهایی کنید</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Event Info - Redesigned */}
                            <div className="bg-gray-50/70 p-4.5 rounded-2xl border border-gray-100/50 space-y-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] font-bold text-gray-400">نام رویداد</span>
                                    <span className="text-sm font-black text-gray-900 leading-tight">{event.title}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold text-gray-400">تاریخ برگزاری</span>
                                        <span className="text-xs font-black text-gray-800">{event.eventTime}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold text-gray-400">برگزارکننده</span>
                                        <span className="text-xs font-black text-gray-800">{event.organizerName}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 text-[11px] font-bold text-center leading-relaxed">
                                کاربر گرامی، حضور شما در رویداد با کشیدن دکمه زیر به سمت راست قطعی خواهد شد.
                            </p>

                            {/* Swipe Button + Cancel */}
                            <div className="flex flex-col gap-3 pt-1">
                                <SwipeButton onConfirm={onConfirm || (() => {})} />
                                {/* <button
                                    onClick={onClose}
                                    className="w-full bg-gray-100 text-gray-500 hover:bg-gray-200/80 py-3 rounded-2xl font-black text-xs transition-all"
                                >
                                    انصراف
                                </button> */}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ConfirmationDrawer;