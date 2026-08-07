import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppEvent, AppUser } from '../../types';
import { toPersianDigits } from '@/src/lib/utils';

interface PersonalEventCalendarProps {
    onBack: () => void;
    events?: AppEvent[];
    registeredEventIds?: string[];
    onSelectEvent?: (id: string) => void;
    user?: AppUser | null;
}

interface EventReminder {
    eventId: string;
    enabled: boolean;
    timeBefore: string; // e.g. '1h', '3h', '1d', '15m'
    timeBeforeLabel: string;
    channel: 'push' | 'sms' | 'email';
}

/**
 * Utility function to convert English digits (0-9) to Persian digits (۰-۹)
 */
const MONTHS_PERSIAN = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند'
];

const DAYS_OF_WEEK = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export interface CategoryTheme {
    name: string;
    dotBg: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    tileBg: string;
    tileText: string;
    tileBorder: string;
    ringColor: string;
}

export function getCategoryTheme(category?: string): CategoryTheme {
    const cat = (category || '').trim();
    if (cat.includes('علمی') || cat.includes('آموزشی') || cat.includes('دانشگاهی')) {
        return {
            name: 'علمی',
            dotBg: 'bg-blue-600',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-700',
            badgeBorder: 'border-blue-200',
            tileBg: 'bg-blue-50/90',
            tileText: 'text-blue-800',
            tileBorder: 'border-blue-200',
            ringColor: 'ring-blue-500',
        };
    }
    if (cat.includes('فنی') || cat.includes('تکنولوژی') || cat.includes('دیزاین') || cat.includes('IT')) {
        return {
            name: 'فنی',
            dotBg: 'bg-purple-600',
            badgeBg: 'bg-purple-50',
            badgeText: 'text-purple-700',
            badgeBorder: 'border-purple-200',
            tileBg: 'bg-purple-50/90',
            tileText: 'text-purple-800',
            tileBorder: 'border-purple-200',
            ringColor: 'ring-purple-500',
        };
    }
    if (cat.includes('کنسرت') || cat.includes('موسیقی') || cat.includes('هنری') || cat.includes('سینما')) {
        return {
            name: 'کنسرت و هنر',
            dotBg: 'bg-pink-600',
            badgeBg: 'bg-pink-50',
            badgeText: 'text-pink-700',
            badgeBorder: 'border-pink-200',
            tileBg: 'bg-pink-50/90',
            tileText: 'text-pink-800',
            tileBorder: 'border-pink-200',
            ringColor: 'ring-pink-500',
        };
    }
    if (cat.includes('کسب') || cat.includes('استارتاپ') || cat.includes('تجاری') || cat.includes('مالی')) {
        return {
            name: 'کسب‌وکار',
            dotBg: 'bg-emerald-600',
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-700',
            badgeBorder: 'border-emerald-200',
            tileBg: 'bg-emerald-50/90',
            tileText: 'text-emerald-800',
            tileBorder: 'border-emerald-200',
            ringColor: 'ring-emerald-500',
        };
    }
    if (cat.includes('گردشگری') || cat.includes('تفریحی') || cat.includes('ورزشی') || cat.includes('سفر')) {
        return {
            name: 'گردشگری',
            dotBg: 'bg-amber-500',
            badgeBg: 'bg-amber-50',
            badgeText: 'text-amber-800',
            badgeBorder: 'border-amber-200',
            tileBg: 'bg-amber-50/90',
            tileText: 'text-amber-800',
            tileBorder: 'border-amber-200',
            ringColor: 'ring-amber-500',
        };
    }
    return {
        name: 'عمومی',
        dotBg: 'bg-[#ED1C24]',
        badgeBg: 'bg-red-50',
        badgeText: 'text-[#ED1C24]',
        badgeBorder: 'border-red-200',
        tileBg: 'bg-red-50/90',
        tileText: 'text-red-800',
        tileBorder: 'border-red-200',
        ringColor: 'ring-red-500',
    };
}

// Rich mock fallback registered events with distinct categories and multiple events per day
const DEMO_REGISTERED_EVENTS: AppEvent[] = [
    {
        id: 1,
        title: 'همایش سراسری هوش مصنوعی و آینده فناوری',
        category: 'علمی',
        date: 'پنجشنبه، ۱۵ مرداد - ۱۶:۰۰',
        location: 'تهران، مرکز همایش‌های برج میلاد، پلاک ۱',
        organizer: 'کانون نوآوری برنا',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۱۵۰,۰۰۰ تومان',
        startTime: '۱۶:۰۰',
        isCanceled: true,
        status: 1,
        categoryId: 0,
        eventTime: '',
        description: 'همایشی ویژه با حضور بیش از ۵۰۰ متخصص حوزه هوش مصنوعی، ارائه مقالات برتر و فرصت‌های شبکه‌سازی.',
    },
    {
        id: 2,
        title: 'کارگاه عملی طراحی تجربه کاربری UX و فیگما',
        category: 'فنی',
        date: 'دوشنبه، ۲۱ مرداد - ۱۷:۰۰',
        location: 'تهران، خیابان ولیعصر، پلاک ۴۲',
        organizer: 'آکادمی دیزاین ایران',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        startTime: '۱۷:۰۰',
        status: 1,
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        description: 'کلاس حضوری تمرین اصول پروتوتایپ‌سازی، وایرفریمینگ و تست کاربرپذیری.',
    },
    {
        id: 3,
        title: 'دورهمی شبکه‌سازی استارتاپ‌ها و سرمایه‌گذاران',
        category: 'کسب‌وکار',
        date: 'جمعه، ۲۵ مرداد - ۱۸:۳۰',
        location: 'تهران، پارک علم و فناوری، سالن ۳',
        organizer: 'مرکز رشد استارتاپ‌ها',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        startTime: '۱۸:۳۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'جلسه دورهمی صمیمی، ارائه آسانسوری ایده و گفتگوی مستقیم با سرمایه‌گذاران خطرپذیر.',
    },
    {
        id: 4,
        title: 'تور عکاسی و کویرنوردی گروهی مرنجاب',
        category: 'گردشگری',
        date: 'پنجشنبه، ۵ مرداد - ۰۶:۰۰',
        location: 'کاشان، کویر مرنجاب، کیلومتر ۱۲',
        organizer: 'باشگاه گردشگری نوآور',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۴۵۰,۰۰۰ تومان',
        startTime: '۰۶:۰۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'یک سفر شگفت‌انگیز همراه با رصد ستارگان، عکاسی و کارگاه‌های تفکر خلاق در دل کویر.',
    },
    {
        id: 5,
        title: 'کنسرت ارکستر بزرگ موسیقی فیوژن',
        category: 'کنسرت و هنر',
        date: 'چهارشنبه، ۱۰ مرداد - ۲۰:۰۰',
        location: 'تهران، تالار وحدت، صندلی‌های بخش A',
        organizer: 'مؤسسه فرهنگی آوا',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۳۸۰,۰۰۰ تومان',
        startTime: '۲۰:۰۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'اجرای زنده موسیقی باکیفیت عالی همراه با نورپردازی تصویری مدرن.',
    },
    {
        id: 6,
        title: 'کارگاه تخصصی کدنویسی هوش مصنوعی با پایتون',
        category: 'فنی',
        date: 'پنجشنبه، ۱۵ مرداد - ۱۸:۳۰',
        location: 'تهران، برج میلاد، طبقه ۲، سالن B',
        organizer: 'انجمن برنامه‌نویسان ایران',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۲۰۰,۰۰۰ تومان',
        startTime: '۱۸:۳۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'تمرین کدنویسی مدل‌های یادگیری ماشین به صورت زنده و ساخت پروژه.',
    },
    {
        id: 7,
        title: 'اجرای اختصاصی تئاتر موزیکال شبانه',
        category: 'کنسرت و هنر',
        date: 'پنجشنبه، ۱۵ مرداد - ۲۱:۰۰',
        location: 'تهران، مرکز همایش‌های برج میلاد، سالن اصلی',
        organizer: 'گروه هنری صبا',
        image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۲۵۰,۰۰۰ تومان',
        startTime: '۲۱:۰۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'نمایش موزیکال هیجان‌انگیز همراه با اجرای زنده گروه ارکستر.',
    },
    {
        id: 8,
        title: 'نشست تخصصی آینده استارتاپ‌های بومی',
        category: 'کسب‌وکار',
        date: 'دوشنبه، ۲۱ مرداد - ۱۹:۳۰',
        location: 'تهران، خیابان ولیعصر، مجتمع نوآوری',
        organizer: 'اتاق بازرگانی جوانان',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        startTime: '۱۹:۳۰',
        categoryId: 0,
        isCanceled: true,
        eventTime: '',
        status: 1,
        description: 'بررسی چالش‌های جذب سرمایه و راهکارهای رشد استارتاپ‌ها.',
    },
];

export function PersonalEventCalendar({
    onBack,
    events = [],
    registeredEventIds = [],
    onSelectEvent,
}: PersonalEventCalendarProps) {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(4); // مرداد
    const [selectedDay, setSelectedDay] = useState<number | null>(15);
    const [activeTab, setActiveTab] = useState<'calendar' | 'reminders' | 'list'>('calendar');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Multi-event summary card modal state
    const [modalEventsList, setModalEventsList] = useState<AppEvent[] | null>(null);
    const [modalActiveIndex, setModalActiveIndex] = useState<number>(0);

    // Reminders state per event ID
    const [reminders, setReminders] = useState<Record<string, EventReminder>>(() => {
        return {
            'cal-evt-1': { eventId: 'cal-evt-1', enabled: true, timeBefore: '1d', timeBeforeLabel: '۱ روز قبل', channel: 'push' },
            'cal-evt-2': { eventId: 'cal-evt-2', enabled: true, timeBefore: '1h', timeBeforeLabel: '۱ ساعت قبل', channel: 'push' },
            'cal-evt-3': { eventId: 'cal-evt-3', enabled: false, timeBefore: '3h', timeBeforeLabel: '۳ ساعت قبل', channel: 'sms' },
            'cal-evt-4': { eventId: 'cal-evt-4', enabled: true, timeBefore: '2d', timeBeforeLabel: '۲ روز قبل', channel: 'push' },
            'cal-evt-5': { eventId: 'cal-evt-5', enabled: true, timeBefore: '3h', timeBeforeLabel: '۳ ساعت قبل', channel: 'push' },
            'cal-evt-6': { eventId: 'cal-evt-6', enabled: true, timeBefore: '1h', timeBeforeLabel: '۱ ساعت قبل', channel: 'push' },
            'cal-evt-7': { eventId: 'cal-evt-7', enabled: false, timeBefore: '3h', timeBeforeLabel: '۳ ساعت قبل', channel: 'sms' },
            'cal-evt-8': { eventId: 'cal-evt-8', enabled: true, timeBefore: '1d', timeBeforeLabel: '۱ روز قبل', channel: 'push' },
        };
    });

    // Calculate actual user registered events list
    const userEventsList = useMemo(() => {
        const fromProps = events.filter((e) => registeredEventIds.includes(e.id.toString()));
        if (fromProps.length > 0) {
            return fromProps;
        }
        return DEMO_REGISTERED_EVENTS;
    }, [events, registeredEventIds]);

    // Days mapping for current month (31 days for Mordad)
    const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);

    // Map event day numbers for graphic indicators and multi-event support
    const eventDaysMap = useMemo<Record<number, AppEvent[]>>(() => {
        return {
            15: [
                userEventsList[0] || DEMO_REGISTERED_EVENTS[0],
                DEMO_REGISTERED_EVENTS[5],
                DEMO_REGISTERED_EVENTS[6],
            ],
            21: [
                userEventsList[1] || DEMO_REGISTERED_EVENTS[1],
                DEMO_REGISTERED_EVENTS[7],
            ],
            25: [userEventsList[2] || DEMO_REGISTERED_EVENTS[2]],
            5: [userEventsList[3] || DEMO_REGISTERED_EVENTS[3]],
            10: [userEventsList[4] || DEMO_REGISTERED_EVENTS[4]],
        };
    }, [userEventsList]);

    // Currently displayed events list depending on selectedDay or filter
    const displayedEvents = selectedDay && eventDaysMap[selectedDay]
        ? eventDaysMap[selectedDay]
        : userEventsList;

    // Show Toast feedback
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3500);
    };

    // Toggle Reminder
    const toggleReminder = (eventId: string, eventTitle: string) => {
        setReminders((prev) => {
            const current = prev[eventId] || {
                eventId,
                enabled: false,
                timeBefore: '1h',
                timeBeforeLabel: '۱ ساعت قبل',
                channel: 'push',
            };
            const nextEnabled = !current.enabled;
            const updated = { ...current, enabled: nextEnabled };

            if (nextEnabled) {
                triggerToast(`🔔 یادآوری برای رویداد «${eventTitle}» (${updated.timeBeforeLabel}) فعال شد.`);
            } else {
                triggerToast(`🔕 یادآوری رویداد «${eventTitle}» غیرفعال گردید.`);
            }

            return { ...prev, [eventId]: updated };
        });
    };

    // Change Reminder Timing
    const changeReminderTiming = (eventId: string, timeCode: string, timeLabel: string) => {
        setReminders((prev) => {
            const current = prev[eventId] || {
                eventId,
                enabled: true,
                timeBefore: timeCode,
                timeBeforeLabel: timeLabel,
                channel: 'push',
            };
            const updated = { ...current, enabled: true, timeBefore: timeCode, timeBeforeLabel: timeLabel };
            triggerToast(`⏱ زمان یادآوری به ${timeLabel} تغییر یافت.`);
            return { ...prev, [eventId]: updated };
        });
    };

    // Open Modal with a list of events (e.g. for a specific day or single event)
    const openSummaryModal = (eventsList: AppEvent[], initialIndex = 0) => {
        setModalEventsList(eventsList);
        setModalActiveIndex(initialIndex);
    };

    const closeSummaryModal = () => {
        setModalEventsList(null);
        setModalActiveIndex(0);
    };

    // Active event currently shown inside modal
    const activeModalEvent = modalEventsList && modalEventsList[modalActiveIndex] ? modalEventsList[modalActiveIndex] : null;

    // Count active reminders
    const activeRemindersCount = Object.values(reminders).filter((r) => r.enabled).length;

    return (
        <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex-1 overflow-y-auto no-scrollbar pb-12 bg-[#F8F9FC] relative"
            dir="rtl"
        >
            {/* Toast Notification Container */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-5 left-5 right-5 z-50 max-w-sm mx-auto bg-gray-900 text-white p-3.5 rounded-2xl shadow-xl border border-gray-800 flex items-center gap-3 text-xs font-bold leading-tight"
                    >
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <LucideIcons.BellRing className="w-4 h-4 animate-bounce" />
                        </div>
                        <p className="flex-1">{toastMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MULTI-EVENT SUMMARY CARD MODAL WITH SWIPE GESTURE SUPPORT */}
            <AnimatePresence>
                {activeModalEvent && modalEventsList && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 space-y-0 relative"
                        >
                            {/* Modal Top Control Header (Multi-event navigation & Close) */}
                            <div className="text-white px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
                                {/* Multi-event counter & Navigation */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-lg">
                                        {modalEventsList.length > 1
                                            ? `رویداد ${toPersianDigits(modalActiveIndex + 1)} از ${toPersianDigits(modalEventsList.length)}`
                                            : 'خلاصه رویداد'}
                                    </span>

                                    {modalEventsList.length > 1 && (
                                        <div className="flex items-center gap-1 bg-white/10 rounded-xl p-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setModalActiveIndex((prev) => Math.max(0, prev - 1))}
                                                disabled={modalActiveIndex === 0}
                                                className="p-1 text-black disabled:opacity-30 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                                                title="رویداد قبلی"
                                            >
                                                <LucideIcons.ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setModalActiveIndex((prev) => Math.min(modalEventsList.length - 1, prev + 1))}
                                                disabled={modalActiveIndex === modalEventsList.length - 1}
                                                className="p-1 text-black disabled:opacity-30 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                                                title="رویداد بعدی"
                                            >
                                                <LucideIcons.ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Category Badge with custom theme */}
                                    {(() => {
                                        const theme = getCategoryTheme(activeModalEvent.category);
                                        return (
                                            <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-lg shadow-xs border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                                                {activeModalEvent.category || 'رویداد'}
                                            </span>
                                        );
                                    })()}

                                    <button
                                        type="button"
                                        onClick={closeSummaryModal}
                                        className="p-1 bg-white/10 hover:bg-white/20 text-black rounded-full transition-colors cursor-pointer"
                                    >
                                        <LucideIcons.X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* SWIPEABLE CARD CONTENT WITH TOUCH DRAG SUPPORT */}
                            <motion.div
                                key={activeModalEvent.id}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => {
                                    const swipeThreshold = 40;
                                    if (info.offset.x < -swipeThreshold) {
                                        // Swiped left -> next event in RTL
                                        if (modalActiveIndex < modalEventsList.length - 1) {
                                            setModalActiveIndex((prev) => prev + 1);
                                        }
                                    } else if (info.offset.x > swipeThreshold) {
                                        // Swiped right -> previous event in RTL
                                        if (modalActiveIndex > 0) {
                                            setModalActiveIndex((prev) => prev - 1);
                                        }
                                    }
                                }}
                                className="touch-pan-y"
                            >
                                {/* Cover Header */}
                                <div className="relative h-36 bg-gray-900 overflow-hidden">
                                    <img
                                        src={activeModalEvent.image}
                                        alt={activeModalEvent.title}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-black/20" />

                                    {/* Mobile Swipe Hint Badge */}
                                    {modalEventsList.length > 1 && (
                                        <div className="absolute top-2.5 left-3 bg-black/60 backdrop-blur-md text-amber-300 text-[8.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-400/30">
                                            <LucideIcons.MoveHorizontal className="w-3 h-3 animate-pulse" />
                                            <span>ورق بزنید (Swipe)</span>
                                        </div>
                                    )}

                                    {/* Event Title over Cover bottom */}
                                    <div className="absolute bottom-3 right-3 left-3 space-y-0.5">
                                        <h3 className="text-xs font-black text-white leading-snug drop-shadow-xs line-clamp-1">
                                            {activeModalEvent.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-200 font-bold">
                                            <LucideIcons.Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                                            <span className="truncate">برگزارکننده: {activeModalEvent.organizer}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body Details */}
                                <div className="p-4 space-y-3 bg-white">
                                    {/* Stats & Metadata Grid with Persian Digits */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                        <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
                                            <span className="text-gray-400 flex items-center gap-1 text-[9px]">
                                                <LucideIcons.Clock className="w-3 h-3 text-amber-500" />
                                                زمان برگزاری
                                            </span>
                                            <span className="text-gray-900 font-black block truncate">
                                                {toPersianDigits(activeModalEvent.date)}
                                            </span>
                                        </div>

                                        <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
                                            <span className="text-gray-400 flex items-center gap-1 text-[9px]">
                                                <LucideIcons.Ticket className="w-3 h-3 text-emerald-500" />
                                                مبلغ ثبت‌نام
                                            </span>
                                            <span className="text-gray-900 font-black block truncate">
                                                {toPersianDigits(activeModalEvent.price || 'رایگان')}
                                            </span>
                                        </div>

                                        <div className="col-span-2 p-2.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
                                            <span className="text-gray-400 flex items-center gap-1 text-[9px]">
                                                <LucideIcons.MapPin className="w-3 h-3 text-red-500" />
                                                مکان روی نقشه و آدرس
                                            </span>
                                            <span className="text-gray-900 font-black block truncate">
                                                {toPersianDigits(activeModalEvent.location)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Interactive Map Location Quick-View Badge */}
                                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-[10px] font-black shadow-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                                                <LucideIcons.Map className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[10px] text-gray-100 font-black block leading-none truncate">
                                                    موقعیت رویداد روی نقشه
                                                </span>
                                                <span className="text-[8.5px] text-gray-400 block mt-0.5 font-bold truncate">
                                                    مختصات: {toPersianDigits('۳۵.۶۹۶۱° N, ۵۱.۴۲۳۱° E')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="bg-white/10 text-amber-400 border border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-black shrink-0">
                                            مسیریابی
                                        </span>
                                    </div>

                                    {/* Registration Confirmation Badge */}
                                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-[10px] font-black">
                                        <div className="flex items-center gap-1.5">
                                            <LucideIcons.CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>ثبت‌نام شما نهایی و بلیط صادر شده است.</span>
                                        </div>
                                        <span className="bg-emerald-200/80 px-2 py-0.5 rounded-md text-[9px]">تایید شده</span>
                                    </div>

                                    {/* Quick Reminder Toggle inside Summary Card */}
                                    {(() => {
                                        const rem = reminders[activeModalEvent.id] || {
                                            eventId: activeModalEvent.id,
                                            enabled: false,
                                            timeBefore: '1h',
                                            timeBeforeLabel: '۱ ساعت قبل',
                                            channel: 'push',
                                        };
                                        return (
                                            <div className="p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <LucideIcons.BellRing className={`w-4 h-4 text-amber-600 ${rem.enabled ? 'animate-bounce' : ''}`} />
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-black text-gray-900 block leading-none">
                                                            {rem.enabled ? 'هشدار یادآوری فعال است' : 'یادآوری خاموش است'}
                                                        </span>
                                                        <span className="text-[8.5px] font-bold text-gray-500 block mt-0.5">
                                                            {rem.enabled ? `ارسال: ${toPersianDigits(rem.timeBeforeLabel)}` : 'کلیک کنید تا فعال گردد'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleReminder(activeModalEvent.id.toString(), activeModalEvent.title)}
                                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all ${rem.enabled
                                                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {rem.enabled ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                                                </button>
                                            </div>
                                        );
                                    })()}

                                    {/* Modal Multi-Event Pager Indicator Dots */}
                                    {modalEventsList.length > 1 && (
                                        <div className="flex items-center justify-center gap-1.5 pt-1">
                                            {modalEventsList.map((evt, idx) => {
                                                const isCurrent = idx === modalActiveIndex;
                                                const theme = getCategoryTheme(evt.category);
                                                return (
                                                    <button
                                                        key={evt.id}
                                                        type="button"
                                                        onClick={() => setModalActiveIndex(idx)}
                                                        className={`h-2 rounded-full transition-all cursor-pointer ${isCurrent ? `w-6 ${theme.dotBg}` : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                            }`}
                                                        title={`رویداد ${toPersianDigits(idx + 1)}: ${evt.title}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const id = activeModalEvent.id;
                                                closeSummaryModal();
                                                onSelectEvent?.(id.toString());
                                            }}
                                            className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-[10.5px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                                        >
                                            <LucideIcons.ExternalLink className="w-3.5 h-3.5" />
                                            <span>مشاهده صفحه کامل رویداد</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={closeSummaryModal}
                                            className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-[10.5px] font-black transition-colors cursor-pointer"
                                        >
                                            بستن
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header Bar */}
            <header className="sticky top-0 z-30 px-5 pt-8 pb-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center font-black">
                        <LucideIcons.CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-xs font-black text-gray-900 leading-none">تقویم شخصی و یادآوری رویدادها</h1>
                        <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">برنامه‌ریزی، زمان‌بندی و هشدارهای ثبت‌نام</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => triggerToast('🔔 اعلان‌های سیستم فعال است. یادآوری‌ها به‌موقع ارسال می‌شوند.')}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors cursor-pointer border border-amber-200/80 active:scale-95 relative"
                        title="وضعیت هشدارها"
                    >
                        <LucideIcons.Bell className="w-4 h-4" />
                        {activeRemindersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ED1C24] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {toPersianDigits(activeRemindersCount)}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
                        title="بازگشت"
                    >
                        <LucideIcons.ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="p-5 space-y-5">
                {/* Navigation Tabs */}
                <div className="flex items-center justify-between gap-1 p-1 bg-white rounded-2xl border border-gray-100 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('calendar')}
                        className={`flex-1 py-2 text-[10.5px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'calendar' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LucideIcons.Calendar className="w-3.5 h-3.5" />
                        <span>تقویم تصویری</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('reminders')}
                        className={`flex-1 py-2 text-[10.5px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${activeTab === 'reminders' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LucideIcons.BellRing className="w-3.5 h-3.5" />
                        <span>یادآوری‌های فعال</span>
                        {activeRemindersCount > 0 && (
                            <span className={`px-1.5 py-0.2 text-[8.5px] rounded-full font-black ${activeTab === 'reminders' ? 'bg-amber-400 text-slate-950' : 'bg-red-100 text-[#ED1C24]'}`}>
                                {toPersianDigits(activeRemindersCount)}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-2 text-[10.5px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'list' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LucideIcons.ListFilter className="w-3.5 h-3.5" />
                        <span>لیست ثبت‌نامی‌ها</span>
                    </button>
                </div>

                {/* TAB 1: GRAPHIC CALENDAR VIEW WITH CATEGORY COLOR CODING AND MULTI-EVENT SUPPORT */}
                {activeTab === 'calendar' && (
                    <div className="space-y-4">
                        {/* Graphic Calendar Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
                            {/* Month Navigator Header with Persian Numbers */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
                                >
                                    <LucideIcons.ChevronRight className="w-4 h-4" />
                                </button>

                                <div className="text-center">
                                    <h2 className="text-xs font-black text-gray-900 flex items-center justify-center gap-1.5">
                                        <span>{MONTHS_PERSIAN[selectedMonthIndex]}</span>
                                        <span className="text-gray-400">{toPersianDigits('۱۴۰۲')}</span>
                                    </h2>
                                    <span className="text-[9px] font-bold text-amber-600 block mt-0.5">
                                        {toPersianDigits(userEventsList.length)} رویداد ثبت‌شده در برنامه‌ها
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedMonthIndex((prev) => Math.min(11, prev + 1))}
                                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
                                >
                                    <LucideIcons.ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Days of week titles */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {DAYS_OF_WEEK.map((day, idx) => (
                                    <div key={idx} className="text-[10px] font-black text-gray-400 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days Grid with Persian Numbers & Multi-Event indicators */}
                            <div className="grid grid-cols-7 gap-1.5 text-center pt-1">
                                {currentMonthDays.map((dayNum) => {
                                    const dayEvents = eventDaysMap[dayNum] || [];
                                    const hasEvent = dayEvents.length > 0;
                                    const isSelected = selectedDay === dayNum;
                                    const primaryEvent = dayEvents[0];
                                    const primaryTheme = primaryEvent ? getCategoryTheme(primaryEvent.category) : null;

                                    return (
                                        <button
                                            key={dayNum}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDay(dayNum);
                                                if (hasEvent) {
                                                    openSummaryModal(dayEvents, 0);
                                                }
                                            }}
                                            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer ${isSelected
                                                ? 'bg-gray-900 text-white shadow-md font-black ring-2 ring-gray-900 ring-offset-1'
                                                : hasEvent && primaryTheme
                                                    ? `${primaryTheme.tileBg} ${primaryTheme.tileText} font-black border ${primaryTheme.tileBorder} shadow-2xs hover:scale-105`
                                                    : 'bg-gray-50/70 text-gray-700 font-bold hover:bg-gray-100 border border-transparent'
                                                }`}
                                            title={
                                                hasEvent
                                                    ? `روز ${toPersianDigits(dayNum)}: ${toPersianDigits(dayEvents.length)} رویداد`
                                                    : undefined
                                            }
                                        >
                                            {/* Day Number formatted in Persian */}
                                            <span className="text-xs">{toPersianDigits(dayNum)}</span>

                                            {/* Graphic Distinct Category Color Dots for Single or Multiple Events */}
                                            {hasEvent && (
                                                <div className="mt-0.5 flex items-center justify-center gap-0.5 max-w-full overflow-hidden px-0.5">
                                                    {dayEvents.map((evt, idx) => {
                                                        if (idx > 2) return null; // limit dots rendering to max 3
                                                        const t = getCategoryTheme(evt.category);
                                                        return (
                                                            <span
                                                                key={evt.id}
                                                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-400 animate-ping' : t.dotBg
                                                                    }`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Multi-event count badge indicator (e.g. +۲) */}
                                            {dayEvents.length > 1 && (
                                                <span
                                                    className={`absolute -top-1 -left-1 text-[8px] font-black px-1 rounded-full border shadow-2xs ${isSelected
                                                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                                                        : 'bg-gray-900 text-white border-gray-800'
                                                        }`}
                                                >
                                                    +{toPersianDigits(dayEvents.length)}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* CATEGORY COLOR CODING LEGEND */}
                            <div className="pt-3 border-t border-gray-100 space-y-2">
                                <span className="text-[9.5px] font-black text-gray-400 block px-0.5">
                                    رنگ‌بندی موضوعی رویدادها در تقویم:
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-bold">
                                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                                        <span>علمی</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                                        <span>فنی و فناوری</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                        <span>کسب‌وکار</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-pink-600" />
                                        <span>کنسرت و هنر</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span>گردشگری</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Date Events Container */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <LucideIcons.Sparkles className="w-3.5 h-3.5 text-[#ED1C24]" />
                                    <h3 className="text-xs font-black text-gray-900">
                                        {selectedDay
                                            ? `رویدادهای روز ${toPersianDigits(selectedDay)} ${MONTHS_PERSIAN[selectedMonthIndex]}`
                                            : 'همه رویدادهای ثبت‌نام شده'}
                                    </h3>
                                    {displayedEvents.length > 1 && (
                                        <span className="bg-red-50 text-[#ED1C24] border border-red-200 text-[9px] font-black px-2 py-0.5 rounded-lg">
                                            {toPersianDigits(displayedEvents.length)} رویداد در این روز
                                        </span>
                                    )}
                                </div>

                                {selectedDay && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(null)}
                                        className="text-[10px] font-bold text-gray-400 hover:text-gray-700 underline"
                                    >
                                        نمایش همه
                                    </button>
                                )}
                            </div>

                            {/* Events Cards with Reminders & Summary Card Preview button */}
                            {displayedEvents.map((event, eventIdx) => {
                                const reminderConfig = reminders[event.id] || {
                                    eventId: event.id,
                                    enabled: false,
                                    timeBefore: '1h',
                                    timeBeforeLabel: '۱ ساعت قبل',
                                    channel: 'push',
                                };
                                const theme = getCategoryTheme(event.category);

                                return (
                                    <div
                                        key={event.id}
                                        className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs space-y-3 relative overflow-hidden group hover:border-gray-200 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Event Image */}
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                onClick={() => openSummaryModal(displayedEvents, eventIdx)}
                                                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-2xs cursor-pointer hover:opacity-90 transition-opacity"
                                            />

                                            {/* Event Main Details */}
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                                                        {event.category || 'برنامه‌ریزی شده'}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => openSummaryModal(displayedEvents, eventIdx)}
                                                        className="text-[9.5px] font-black text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                                                    >
                                                        <LucideIcons.LayoutTemplate className="w-3 h-3 text-amber-500" />
                                                        <span>خلاصه کارت</span>
                                                    </button>
                                                </div>

                                                <h4
                                                    onClick={() => openSummaryModal(displayedEvents, eventIdx)}
                                                    className="text-xs font-black text-gray-900 hover:text-[#ED1C24] transition-colors cursor-pointer truncate"
                                                >
                                                    {event.title}
                                                </h4>

                                                <div className="space-y-0.5 text-[10px] font-bold text-gray-500">
                                                    <div className="flex items-center gap-1.5 text-amber-700">
                                                        <LucideIcons.Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                                        <span>{toPersianDigits(event.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-500 truncate">
                                                        <LucideIcons.MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                        <span className="truncate">{toPersianDigits(event.location)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interactive Reminder Control Bar */}
                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleReminder(event.id.toString(), event.title)}
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${reminderConfig.enabled
                                                        ? 'bg-amber-500 text-slate-950 shadow-xs active:scale-95'
                                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                        }`}
                                                    title={reminderConfig.enabled ? 'غیرفعال‌سازی هشدار' : 'فعال‌سازی هشدار'}
                                                >
                                                    <LucideIcons.BellRing className={`w-4 h-4 ${reminderConfig.enabled ? 'animate-pulse' : ''}`} />
                                                </button>

                                                <div>
                                                    <span className="text-[10px] font-black text-gray-900 block leading-tight">
                                                        {reminderConfig.enabled ? 'یادآوری فعال است' : 'یادآوری خاموش است'}
                                                    </span>
                                                    <span className="text-[8.5px] font-bold text-gray-400 block">
                                                        {reminderConfig.enabled ? `هشدار: ${toPersianDigits(reminderConfig.timeBeforeLabel)}` : 'کلیک کنید تا فعال شود'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Reminder Timing Dropdown Selector */}
                                            {reminderConfig.enabled && (
                                                <div className="flex items-center gap-1">
                                                    <select
                                                        value={reminderConfig.timeBefore}
                                                        onChange={(e) => {
                                                            const sel = e.target;
                                                            const label = sel.options[sel.selectedIndex].text;
                                                            changeReminderTiming(event.id.toString(), e.target.value, label);
                                                        }}
                                                        className="bg-white text-[10px] font-black text-gray-800 border border-gray-200 rounded-xl px-2 py-1 outline-none cursor-pointer shadow-2xs"
                                                    >
                                                        <option value="15m">۱۵ دقیقه قبل</option>
                                                        <option value="1h">۱ ساعت قبل</option>
                                                        <option value="3h">۳ ساعت قبل</option>
                                                        <option value="1d">۱ روز قبل</option>
                                                        <option value="2d">۲ روز قبل</option>
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() => triggerToast(`📣 هشدار آزمایشی رویداد «${event.title}» ارسال شد.`)}
                                                        className="p-1 bg-white hover:bg-amber-50 text-amber-600 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                                                        title="تست هشدار"
                                                    >
                                                        <LucideIcons.Volume2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 2: ACTIVE REMINDERS LIST */}
                {activeTab === 'reminders' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                                        <LucideIcons.BellRing className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-gray-900">لیست یادآوری‌های فعال شما</h3>
                                        <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">زمان‌بندی اعلان‌های پیامکی و نوتیفیکیشن سیستم</p>
                                    </div>
                                </div>

                                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-xl">
                                    {toPersianDigits(activeRemindersCount)} فعال
                                </span>
                            </div>

                            {activeRemindersCount === 0 ? (
                                <div className="p-8 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 space-y-2">
                                    <LucideIcons.BellOff className="w-8 h-8 text-gray-300 mx-auto" />
                                    <p className="text-xs font-black text-gray-700">هیچ یادآوری فعالی ثبت نشده است.</p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        از تب «تقویم تصویری» می‌توانید برای رویدادهای ثبت‌نام شده هشدار تنظیم کنید.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userEventsList.map((evt) => {
                                        const rem = reminders[evt.id];
                                        if (!rem || !rem.enabled) return null;
                                        const theme = getCategoryTheme(evt.category);

                                        return (
                                            <div
                                                key={evt.id}
                                                className="bg-gray-50/90 p-3.5 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <img
                                                        src={evt.image}
                                                        alt={evt.title}
                                                        onClick={() => openSummaryModal([evt], 0)}
                                                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200 cursor-pointer"
                                                    />
                                                    <div className="min-w-0 space-y-0.5">
                                                        <h4
                                                            onClick={() => openSummaryModal([evt], 0)}
                                                            className="text-xs font-black text-gray-900 hover:text-purple-600 transition-colors cursor-pointer truncate"
                                                        >
                                                            {evt.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                            <span className="flex items-center gap-1 text-amber-600">
                                                                <LucideIcons.Clock className="w-3 h-3 text-amber-500" />
                                                                {toPersianDigits(evt.date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 pt-0.5">
                                                            <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                                                                {evt.category}
                                                            </span>
                                                            <span className="bg-amber-100 text-amber-800 text-[8.5px] font-black px-2 py-0.2 rounded-md">
                                                                هشدار: {toPersianDigits(rem.timeBeforeLabel)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => openSummaryModal([evt], 0)}
                                                        className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                                                        title="مشاهده خلاصه کارت"
                                                    >
                                                        <LucideIcons.Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleReminder(evt.id.toString(), evt.title)}
                                                        className="p-2 bg-white hover:bg-red-50 text-[#ED1C24] rounded-xl border border-gray-200 transition-colors cursor-pointer"
                                                        title="حذف یادآوری"
                                                    >
                                                        <LucideIcons.Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Notification Settings Banner */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                                    <LucideIcons.SmartphoneNfc className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black">کانال‌های دریافت نوتیفیکیشن</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">ارسال همزمان پیامک و نوتیفیکیشن روی گوشی</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-black pt-1">
                                <div className="bg-white/10 p-2.5 rounded-xl flex items-center justify-between">
                                    <span>پیامک (SMS)</span>
                                    <span className="text-emerald-400 text-[9px]">فعال</span>
                                </div>
                                <div className="bg-white/10 p-2.5 rounded-xl flex items-center justify-between">
                                    <span>پوش نوتیفیکیشن</span>
                                    <span className="text-emerald-400 text-[9px]">فعال</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: REGISTERED EVENTS ALL LIST */}
                {activeTab === 'list' && (
                    <div className="space-y-3">
                        {userEventsList.map((evt, idx) => {
                            const theme = getCategoryTheme(evt.category);
                            return (
                                <div
                                    key={evt.id}
                                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs flex items-center justify-between gap-3 hover:border-gray-200 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={evt.image}
                                            alt={evt.title}
                                            onClick={() => openSummaryModal(userEventsList, idx)}
                                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100 cursor-pointer"
                                        />
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                                                    {evt.category}
                                                </span>
                                                <span className="text-[9.5px] font-bold text-amber-600 truncate">{toPersianDigits(evt.date)}</span>
                                            </div>
                                            <h4
                                                onClick={() => openSummaryModal(userEventsList, idx)}
                                                className="text-xs font-black text-gray-900 hover:text-[#ED1C24] cursor-pointer truncate"
                                            >
                                                {evt.title}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-400 truncate">{evt.organizer}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => openSummaryModal(userEventsList, idx)}
                                            className="h-8 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                                            title="خلاصه کارت"
                                        >
                                            <LucideIcons.Eye className="w-3.5 h-3.5 text-gray-500" />
                                            <span>کارت</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.main>
    );
}
