import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X } from 'lucide-react';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toFaDigits = (input: string | number) =>
    String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

const POPUP_WIDTH = 260;
const POPUP_HEIGHT = 360;

type Anchor = { top: number; right: number };

interface JalaliTimePickerProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    error?: string;
    minuteStep?: number;
}

function JalaliTimePicker({
    label,
    value,
    onChange,
    className = '',
    placeholder = '--:--',
    error,
    minuteStep = 5,
}: JalaliTimePickerProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<Anchor | null>(null);
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);

    const parseTime = (timeStr: string) => {
        if (!timeStr) return { hour: 0, minute: 0 };
        const clean = timeStr.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        const parts = clean.split(':');
        if (parts.length === 2) {
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            if (!isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60) {
                return { hour: h, minute: m };
            }
        }
        return { hour: 0, minute: 0 };
    };

    useEffect(() => {
        if (value) {
            const parsed = parseTime(value);
            setSelectedHour(parsed.hour);
            setSelectedMinute(parsed.minute);
        }
    }, [value]);

    const openPicker = () => {
        const parsed = parseTime(value);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);

        const el = buttonRef.current;
        if (el) {
            const rect = el.getBoundingClientRect();
            const right = Math.min(
                Math.max(window.innerWidth - rect.right, 8),
                window.innerWidth - 8 - POPUP_WIDTH
            );
            const spaceBelow = window.innerHeight - rect.bottom - 8;
            const top =
                spaceBelow >= POPUP_HEIGHT
                    ? rect.bottom + 8
                    : Math.max(8, rect.top - POPUP_HEIGHT - 8);
            setAnchor({ top, right });
        }
        setOpen(true);
    };

    // استفاده از useLayoutEffect برای اسکرول فوری قبل از رندر
    useLayoutEffect(() => {
        if (open) {
            // اسکرول فوری ساعت - بدون انیمیشن
            if (hourListRef.current) {
                const container = hourListRef.current;
                const itemHeight = 36;
                const selectedIndex = selectedHour;
                const containerHeight = container.clientHeight;
                const scrollTo = (selectedIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
                container.scrollTop = Math.max(0, scrollTo);
            }

            // اسکرول فوری دقیقه - بدون انیمیشن
            if (minuteListRef.current) {
                const container = minuteListRef.current;
                const itemHeight = 36;
                const selectedIndex = selectedMinute / minuteStep;
                const containerHeight = container.clientHeight;
                const scrollTo = (selectedIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
                container.scrollTop = Math.max(0, scrollTo);
            }
        }
    }, [open]); // فقط وابسته به open

    useEffect(() => {
        if (!open) return;
        const closeOnResize = () => setOpen(false);
        const closeOnKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('resize', closeOnResize);
        window.addEventListener('keydown', closeOnKey);
        return () => {
            window.removeEventListener('resize', closeOnResize);
            window.removeEventListener('keydown', closeOnKey);
        };
    }, [open]);

    const handleHourChange = (hour: number) => {
        setSelectedHour(hour);
        const minuteStr = String(selectedMinute).padStart(2, '0');
        const hourStr = String(hour).padStart(2, '0');
        onChange(`${hourStr}:${minuteStr}`);
    };

    const handleMinuteChange = (minute: number) => {
        setSelectedMinute(minute);
        const hourStr = String(selectedHour).padStart(2, '0');
        const minuteStr = String(minute).padStart(2, '0');
        onChange(`${hourStr}:${minuteStr}`);
    };

    const handleConfirm = () => {
        const hourStr = String(selectedHour).padStart(2, '0');
        const minuteStr = String(selectedMinute).padStart(2, '0');
        onChange(`${hourStr}:${minuteStr}`);
        setOpen(false);
    };

    const handleClear = () => {
        onChange('');
        setOpen(false);
    };

    const formatDisplay = (timeStr: string) => {
        if (!timeStr) return placeholder;
        return toFaDigits(timeStr);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-gray-500">{label}</label>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold text-[#ED1C24]"
                    >
                        {error}
                    </motion.span>
                )}
            </div>

            <button
                ref={buttonRef}
                type="button"
                onClick={openPicker}
                className={`w-full bg-gray-50 border rounded-xl py-3 px-4 text-sm font-bold flex items-center justify-between transition-all outline-none text-right ${
                    error ? 'border-[#ED1C24]' : 'border-gray-100 hover:border-gray-300'
                }`}
            >
                <span className={value ? 'text-gray-900 text-xs' : 'text-gray-400 text-xs'}>
                    {formatDisplay(value)}
                </span>
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            </button>

            <AnimatePresence>
                {open && anchor && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            ref={popupRef}
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                top: anchor.top,
                                right: anchor.right,
                                width: POPUP_WIDTH,
                                zIndex: 50,
                            }}
                            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-[10px] font-black text-gray-400 hover:text-[#ED1C24] transition-colors"
                                >
                                    پاک‌کردن
                                </button>
                                <span className="text-[10px] font-black text-gray-400">انتخاب زمان</span>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Time Display - دقیقه : ساعت */}
                            <div className="flex items-center justify-center gap-2 py-3 bg-gray-50/30">
                                <span className="text-xl font-black text-gray-900">
                                    {toFaDigits(String(selectedMinute).padStart(2, '0'))}
                                </span>
                                <span className="text-xl font-black text-gray-300">:</span>
                                <span className="text-xl font-black text-gray-900">
                                    {toFaDigits(String(selectedHour).padStart(2, '0'))}
                                </span>
                            </div>

                            {/* Time Pickers */}
                            <div className="flex gap-1 px-3 py-2 h-56">
                                {/* دقیقه - سمت راست */}
                                <div className="flex-1 relative">
                                    <div 
                                        ref={minuteListRef}
                                        className="h-full overflow-y-auto no-scrollbar"
                                        style={{ scrollBehavior: 'auto' }} // تغییر به auto برای اسکرول فوری
                                    >
                                        <div className="py-3">
                                            {minutes.map((minute) => (
                                                <button
                                                    key={minute}
                                                    type="button"
                                                    onClick={() => handleMinuteChange(minute)}
                                                    className={`w-full h-9 flex items-center justify-center text-xs font-black transition-all rounded-lg ${
                                                        minute === selectedMinute
                                                            ? 'bg-[#ED1C24] text-white shadow-sm'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {toFaDigits(String(minute).padStart(2, '0'))}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* جداکننده */}
                                <div className="flex items-center justify-center text-lg font-black text-gray-200 px-0.5">
                                    :
                                </div>

                                {/* ساعت - سمت چپ */}
                                <div className="flex-1 relative">
                                    <div 
                                        ref={hourListRef}
                                        className="h-full overflow-y-auto no-scrollbar"
                                        style={{ scrollBehavior: 'auto' }} // تغییر به auto برای اسکرول فوری
                                    >
                                        <div className="py-3">
                                            {hours.map((hour) => (
                                                <button
                                                    key={hour}
                                                    type="button"
                                                    onClick={() => handleHourChange(hour)}
                                                    className={`w-full h-9 flex items-center justify-center text-xs font-black transition-all rounded-lg ${
                                                        hour === selectedHour
                                                            ? 'bg-[#ED1C24] text-white shadow-sm'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {toFaDigits(String(hour).padStart(2, '0'))}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-2 px-3 py-2.5 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-black transition-colors hover:bg-gray-100"
                                >
                                    پاک‌کردن
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-[10px] font-black transition-colors hover:bg-gray-800"
                                >
                                    تأیید
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* استایل حذف اسکرول‌بار */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

export default JalaliTimePicker;