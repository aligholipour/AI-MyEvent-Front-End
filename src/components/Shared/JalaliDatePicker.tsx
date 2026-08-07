import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-jalaali';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, ChevronLeft, ChevronsUp, ChevronsDown, X } from 'lucide-react';

const PERSIAN_MONTHS = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
];

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toFaDigits = (input: string | number) =>
    String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 460;

type Anchor = { top: number; right: number };
type ViewMode = 'days' | 'months' | 'years';

function JalaliDatePicker({
    label,
    value,
    onChange,
    className = '',
    placeholder = 'انتخاب تاریخ',
    error,
    minYear = 1300,
    maxYear = 1450,
    minDate,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    error?: string;
    minYear?: number;
    maxYear?: number;
    minDate?: string;
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const yearsContainerRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<Anchor | null>(null);
    const [viewYear, setViewYear] = useState(moment().jYear());
    const [viewMonth, setViewMonth] = useState(moment().jMonth());
    const [viewMode, setViewMode] = useState<ViewMode>('days');

    const parseValue = () => {
        if (!value) return null;
        const cleanVal = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        const m = moment(cleanVal, 'jYYYY/jMM/jD');
        return m.isValid() ? m : null;
    };

    const parseMinDate = () => {
        if (!minDate) return null;
        const cleanVal = minDate.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        const m = moment(cleanVal, 'jYYYY/jMM/jD');
        return m.isValid() ? m.startOf('day') : null;
    };

    const minDateMoment = parseMinDate();

    const openPicker = () => {
        const m = parseValue() || moment();
        if (minDateMoment && m.valueOf() < minDateMoment.valueOf()) {
            setViewYear(minDateMoment.jYear());
            setViewMonth(minDateMoment.jMonth());
        }
        setViewYear(m.jYear());
        setViewMonth(m.jMonth());
        setViewMode('days');

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

    useEffect(() => {
        // اسکرول به سال انتخاب شده در حالت سال‌ها
        if (viewMode === 'years' && yearsContainerRef.current) {
            const yearIndex = viewYear - minYear;
            const itemHeight = 36; // ارتفاع هر آیتم
            const container = yearsContainerRef.current;
            container.scrollTop = yearIndex * itemHeight - container.clientHeight / 2 + itemHeight / 2;
        }
    }, [viewMode, viewYear, minYear]);

    const goPrevMonth = () => {
        if (viewMonth === 0) {
            setViewYear((y) => y - 1);
            setViewMonth(11);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goNextMonth = () => {
        if (viewMonth === 11) {
            setViewYear((y) => y + 1);
            setViewMonth(0);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const goToday = () => {
        const today = moment();
        setViewYear(today.jYear());
        setViewMonth(today.jMonth());
        onChange(today.format('jYYYY/jMM/jD'));
        setOpen(false);
    };

    const buildDays = () => {
        const first = moment(`${viewYear}/${viewMonth + 1}/1`, 'jYYYY/jM/jD');
        const startPad = (first.day() + 1) % 7;
        const cells: ReturnType<typeof moment>[] = [];
        for (let i = 0; i < 42; i++) {
            cells.push(first.clone().add(i - startPad, 'days'));
        }
        return cells;
    };

    const handleYearSelect = (year: number) => {
        setViewYear(year);
        setViewMode('months');
    };

    const handleMonthSelect = (month: number) => {
        setViewMonth(month);
        setViewMode('days');
    };

    const todayStr = moment().format('jYYYY/jMM/jD');

    // تولید لیست سال‌ها
    const generateYears = () => {
        const years = [];
        for (let year = minYear; year <= maxYear; year++) {
            years.push(year);
        }
        return years;
    };

    const renderDaysView = () => (
        <>
            {/* Header با قابلیت کلیک روی سال و ماه */}
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
                <button
                    type="button"
                    onClick={goPrevMonth}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode('months')}
                        className="text-sm font-black text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                    >
                        {PERSIAN_MONTHS[viewMonth]}
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('years')}
                        className="text-sm font-black text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                    >
                        {toFaDigits(viewYear)}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={goNextMonth}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* روزهای هفته */}
            <div className="grid grid-cols-7 px-3 pt-3">
                {WEEKDAYS.map((d) => (
                    <div
                        key={d}
                        className="text-center text-[10px] font-black text-gray-400 pb-2"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* روزهای ماه */}
            <div className="grid grid-cols-7 px-3 pb-3">
                {buildDays().map((cell, i) => {
                    const cellStr = cell.format('jYYYY/jMM/jD');
                    const inCurrentMonth = cell.jMonth() === viewMonth;
                    const isSelected = value && parseValue()?.format('jYYYY/jMM/jD') === cellStr;
                    const isToday = todayStr === cellStr;
                    const isDisabled = minDateMoment ? cell.valueOf() < minDateMoment.valueOf() : false;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                if (isDisabled) return;
                                onChange(cellStr);
                                setOpen(false);
                            }}
                            disabled={isDisabled}
                            className={`w-full aspect-square rounded-2xl text-xs font-black transition-all flex items-center justify-center ${isSelected
                                ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/30'
                                : isToday
                                    ? 'bg-[#ED1C24]/10 text-[#ED1C24]'
                                    : isDisabled
                                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                        : inCurrentMonth
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {toFaDigits(cell.jDate())}
                        </button>
                    );
                })}
            </div>

            {/* دکمه‌های پایین */}
            <div className="p-3 border-t border-gray-50 flex items-center justify-between">
                <button
                    type="button"
                    onClick={goToday}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black transition-colors hover:bg-gray-800"
                >
                    امروز
                </button>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-[10px] font-black transition-colors hover:bg-gray-200"
                >
                    بستن
                </button>
            </div>
        </>
    );

    const renderMonthsView = () => (
        <>
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
                <button
                    type="button"
                    onClick={() => setViewMode('days')}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode('years')}
                        className="text-sm font-black text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                    >
                        {toFaDigits(viewYear)}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setViewMode('days')}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4">
                {PERSIAN_MONTHS.map((month, index) => {
                    const isCurrentMonth = index === viewMonth;
                    return (
                        <button
                            key={month}
                            type="button"
                            onClick={() => handleMonthSelect(index)}
                            className={`py-3 rounded-xl text-sm font-black transition-all ${isCurrentMonth
                                ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/30'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {month}
                        </button>
                    );
                })}
            </div>
        </>
    );

    const renderYearsView = () => (
        <>
            <div className="flex items-center justify-between p-3 border-b border-gray-50">
                <button
                    type="button"
                    onClick={() => {
                        const newYear = Math.max(minYear, viewYear - 10);
                        setViewYear(newYear);
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <ChevronsUp className="w-4 h-4" />
                </button>
                <div className="text-sm font-black text-gray-900">
                    {toFaDigits(viewYear)}
                </div>
                <button
                    type="button"
                    onClick={() => {
                        const newYear = Math.min(maxYear, viewYear + 10);
                        setViewYear(newYear);
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <ChevronsDown className="w-4 h-4" />
                </button>
            </div>

            <div
                ref={yearsContainerRef}
                className="h-64 overflow-y-auto px-2 py-2 custom-scrollbar"
                style={{
                    scrollBehavior: 'smooth',
                }}
            >
                {generateYears().map((year) => {
                    const isSelected = year === viewYear;
                    return (
                        <button
                            key={year}
                            type="button"
                            onClick={() => handleYearSelect(year)}
                            className={`w-full py-2 px-4 rounded-xl text-sm font-black transition-all text-right ${isSelected
                                ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/30'
                                : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            {toFaDigits(year)}
                        </button>
                    );
                })}
            </div>

            <div className="p-3 border-t border-gray-50 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black transition-colors hover:bg-gray-800"
                >
                    انتخاب ماه
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode('days')}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-[10px] font-black transition-colors hover:bg-gray-200"
                >
                    بازگشت
                </button>
            </div>
        </>
    );

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center justify-between px-2">
                <label className="text-xs font-black text-gray-500">{label}</label>
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
                className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold flex items-center justify-between transition-all outline-none text-right ${error ? 'border-[#ED1C24]' : 'border-gray-100 hover:border-gray-300'
                    }`}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value ? toFaDigits(value) : placeholder}
                </span>
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
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
                            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                            {viewMode === 'days' && renderDaysView()}
                            {viewMode === 'months' && renderMonthsView()}
                            {viewMode === 'years' && renderYearsView()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }
                `}</style>
            </>
        </div>
    );
}

export default JalaliDatePicker;