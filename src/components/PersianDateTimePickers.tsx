import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toFarsiNumber = (num: number | string) => {
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

const PERSIAN_MONTHS = [
  { name: 'فروردین', id: 1 },
  { name: 'اردیبهشت', id: 2 },
  { name: 'خرداد', id: 3 },
  { name: 'تیر', id: 4 },
  { name: 'مرداد', id: 5 },
  { name: 'شهریور', id: 6 },
  { name: 'مهر', id: 7 },
  { name: 'آبان', id: 8 },
  { name: 'آذر', id: 9 },
  { name: 'دی', id: 10 },
  { name: 'بهمن', id: 11 },
  { name: 'اسفند', id: 12 },
];

interface PersianDatePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSelect: (val: string) => void;
  title?: string;
  minYear?: number;
  maxYear?: number;
}

export function PersianDatePickerDrawer({
  isOpen,
  onClose,
  value,
  onSelect,
  title = 'انتخاب تاریخ',
  minYear = 1340,
  maxYear = 1406,
}: PersianDatePickerDrawerProps) {
  const cleanVal = value ? value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()) : '';
  const parts = cleanVal.split('/');

  const initialYear = parts.length === 3 ? parseInt(parts[0]) : minYear === 1340 ? 1375 : 1405;
  const initialMonth = parts.length === 3 ? parseInt(parts[1]) : 1;
  const initialDay = parts.length === 3 ? parseInt(parts[2]) : 1;

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);

  useEffect(() => {
    if (isOpen) {
      const clean = value ? value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()) : '';
      const p = clean.split('/');
      setYear(p.length === 3 ? parseInt(p[0]) : minYear === 1340 ? 1375 : 1405);
      setMonth(p.length === 3 ? parseInt(p[1]) : 1);
      setDay(p.length === 3 ? parseInt(p[2]) : 1);
    }
  }, [isOpen, value, minYear]);

  let maxDays = 31;
  if (month >= 7 && month <= 11) {
    maxDays = 30;
  } else if (month === 12) {
    const isLeap = [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
    maxDays = isLeap ? 30 : 29;
  }

  useEffect(() => {
    if (day > maxDays) {
      setDay(maxDays);
    }
  }, [month, year, maxDays, day]);

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleConfirm = () => {
    const formattedYear = year.toString();
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedVal = `${formattedYear}/${formattedMonth}/${formattedDay}`;
    const farsiVal = formattedVal.replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
    onSelect(farsiVal);
    onClose();
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
            className="fixed inset-0 bg-black/40 z-[300] backdrop-blur-[4px]"
          />

          {/* Bottom Sheet - matching CitySelection and Auth Drawers */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[58vh] bg-[#F8F9FC] z-[310] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header section matching other premium drawers */}
            <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800">
                  <LucideIcons.Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="text-base font-black text-gray-900 tracking-tight">{title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                    تاریخ انتخابی: {toFarsiNumber(year)}/{toFarsiNumber(month.toString().padStart(2, '0'))}/{toFarsiNumber(day.toString().padStart(2, '0'))} ({PERSIAN_MONTHS[month - 1].name})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable multi-columns selection area */}
            <div className="flex-1 grid grid-cols-3 gap-3 px-6 py-4 overflow-hidden h-full bg-gray-50/30">
              {/* Day column */}
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="bg-gray-50/80 py-2.5 text-center text-[10px] font-black text-gray-500 border-b border-gray-100 flex-shrink-0">
                  روز
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 space-y-1">
                  {days.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDay(d)}
                      className={`w-full py-2.5 text-xs font-black transition-all rounded-xl flex items-center justify-center border-none ${
                        day === d
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {toFarsiNumber(d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month column */}
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="bg-gray-50/80 py-2.5 text-center text-[10px] font-black text-gray-500 border-b border-gray-100 flex-shrink-0">
                  ماه
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 space-y-1">
                  {PERSIAN_MONTHS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMonth(m.id)}
                      className={`w-full py-2.5 text-xs font-black transition-all rounded-xl flex items-center justify-center border-none ${
                        month === m.id
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year column */}
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="bg-gray-50/80 py-2.5 text-center text-[10px] font-black text-gray-500 border-b border-gray-100 flex-shrink-0">
                  سال
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 space-y-1">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`w-full py-2.5 text-xs font-black transition-all rounded-xl flex items-center justify-center border-none ${
                        year === y
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {toFarsiNumber(y)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={handleConfirm}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white h-13 rounded-2xl text-sm font-black shadow-lg shadow-slate-900/10 border-none cursor-pointer transition-all active:scale-98"
              >
                تایید تاریخ
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface PersianTimePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSelect: (val: string) => void;
  title?: string;
}

export function PersianTimePickerDrawer({
  isOpen,
  onClose,
  value,
  onSelect,
  title = 'انتخاب ساعت',
}: PersianTimePickerDrawerProps) {
  const cleanVal = value ? value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()) : '';
  const parts = cleanVal.split(':');

  const initialHour = parts.length === 2 ? parseInt(parts[0]) : 12;
  const initialMinute = parts.length === 2 ? parseInt(parts[1]) : 0;

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  useEffect(() => {
    if (isOpen) {
      const clean = value ? value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()) : '';
      const p = clean.split(':');
      setHour(p.length === 2 ? parseInt(p[0]) : 12);
      setMinute(p.length === 2 ? parseInt(p[1]) : 0);
    }
  }, [isOpen, value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const formattedVal = `${formattedHour}:${formattedMinute}`;
    const farsiVal = formattedVal.replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
    onSelect(farsiVal);
    onClose();
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
            className="fixed inset-0 bg-black/40 z-[300] backdrop-blur-[4px]"
          />

          {/* Bottom Sheet - matching Map and Date Pickers */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[55vh] bg-[#F8F9FC] z-[310] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header Area */}
            <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800">
                  <LucideIcons.Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="text-base font-black text-gray-900 tracking-tight">{title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                    ساعت انتخابی: {toFarsiNumber(hour.toString().padStart(2, '0'))}:{toFarsiNumber(minute.toString().padStart(2, '0'))}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Columns selector for Hours and Minutes */}
            <div className="flex-1 grid grid-cols-2 gap-4 px-6 py-4 overflow-hidden h-full bg-gray-50/30">
              {/* Hour column */}
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="bg-gray-50/80 py-2.5 text-center text-[10px] font-black text-gray-500 border-b border-gray-100 flex-shrink-0">
                  ساعت
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 space-y-1">
                  {hours.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHour(h)}
                      className={`w-full py-2.5 text-xs font-black transition-all rounded-xl flex items-center justify-center border-none ${
                        hour === h
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {toFarsiNumber(h.toString().padStart(2, '0'))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minute column */}
              <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden">
                <div className="bg-gray-50/80 py-2.5 text-center text-[10px] font-black text-gray-500 border-b border-gray-100 flex-shrink-0">
                  دقیقه
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1.5 space-y-1">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinute(m)}
                      className={`w-full py-2.5 text-xs font-black transition-all rounded-xl flex items-center justify-center border-none ${
                        minute === m
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {toFarsiNumber(m.toString().padStart(2, '0'))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={handleConfirm}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white h-13 rounded-2xl text-sm font-black shadow-lg shadow-slate-900/10 border-none cursor-pointer transition-all active:scale-98"
              >
                تایید ساعت
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
