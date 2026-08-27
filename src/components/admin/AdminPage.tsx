// AdminPage.tsx
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { AppEvent, AppUsers, EventDetailForAdminResponse } from "../../types";
import { getEventsFormAdminPage, getEventDetailForAdmin, approveEvent, rejectEvent, changeStatusEvent, getEventParticipantsForAdmin } from "../../services/events";
import {
    Play, Pause, Check, ChevronLeft, MapPin,
    Calendar, X, Users, AlertCircle, Heart,
    CalendarX, UserCog,
    Eye, RotateCcw, Globe, Tag, Briefcase as BriefcaseIcon,
    Calendar as CalendarIcon, Search,
    UserX,
    XCircle, User as UserIcon
} from "lucide-react";
import { getUserDetailForAdmin, GetUserDetailForAdminResponse, getUsereForAdmin } from "../../services/users";
import { toPersianDigits } from "@/src/lib/utils";

function EventStatusBadge({ status, isDisabled }: { status: number; isDisabled?: boolean }) {
    if (isDisabled) {
        return (
            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                غیرفعال شده
            </span>
        );
    }

    if (status === 2) {
        return (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                تایید شده
            </span>
        );
    }

    if (status === 3) {
        return (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                رد شده
            </span>
        );
    }

    return (
        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            در انتظار تایید
        </span>
    );
}

function DetailBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-2xl space-y-0.5">
            <div className="flex items-center gap-1.5 text-gray-400">
                {icon}
                <span className="text-[9.5px] font-black">{label}</span>
            </div>
            <p className="text-[11px] font-black text-gray-800 truncate">{value}</p>
        </div>
    );
}

const PRESET_REJECTION_REASONS = [
    'اطلاعات رویداد ناقص است',
    'محتوا یا تصویر ناصل و نامناسب است',
    'زمان یا مکان برگزاری نامشخص است',
    'مغایرت با قوانین و مقررات هم‌مسیر',
    'درخواست لغو توسط برگزارکننده',
];

// ================= اضافه شده: داده‌های استانی =================
const PROVINCES_DATA = [
    { id: '1', name: 'تهران', cities: ['تهران', 'بومهن', 'پردیس', 'دماوند', 'فیروزکوه'] },
    { id: '2', name: 'فارس', cities: ['شیراز', 'مرودشت', 'کازرون', 'جهرم', 'لار'] },
    { id: '3', name: 'اصفهان', cities: ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شاهین‌شهر'] },
    { id: '4', name: 'مازندران', cities: ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بهشهر'] },
];

function AdminPage({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
    const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'disabled'>('all');
    const [eventSearchQuery, setEventSearchQuery] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    // ================= اضافه شده: فیلتر تایید کاربران =================
    const [userFilterVerified, setUserFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

    const [selectedEventForReject, setSelectedEventForReject] = useState<number>(0);
    // ================= اضافه شده: برای نمایش دلیل رد =================
    const [selectedEventForReason, setSelectedEventForReason] = useState<AppEvent | null>(null);
    const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventDetailForAdminResponse | null>(null);
    // ================= اضافه شده: برای نمایش شرکت‌کنندگان =================
    const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<AppEvent | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedUser, setSelectedUser] = useState<GetUserDetailForAdminResponse | null>(null);

    const [events, setEvents] = useState<AppEvent[]>([]);
    const [eventsHasMore, setEventsHasMore] = useState(true);
    const [EventedLoading, setEventedLoading] = useState(true);
    const hasFetched = useRef(false);

    const [users, setUsers] = useState<AppUsers[]>([]);
    const [usersHasMore, setUsersHasMore] = useState(true);
    const [useredLoading, setUseredLoading] = useState(true);
    const [userDetail, setUserDetail] = useState<GetUserDetailForAdminResponse | null>(null);

    // Participants fetched from server for admin attendees modal
    const [participantsForSelectedEvent, setParticipantsForSelectedEvent] = useState<Array<{ fullname: string; profileAddress?: string; joinedAt: string; phone?: string }>>([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [participantsError, setParticipantsError] = useState<string | null>(null);
    const participantsPageRef = useRef(1);


    // ================= اضافه شده: داده‌های ثبت‌نام شرکت‌کنندگان =================
    // const [eventRegistrations, setEventRegistrations] = useState<Record<string, string[]>>({
    //     '1': ['1', '2', '3'],
    //     '2': ['2', '4'],
    //     '3': ['1', '3', '4'],
    // });

    // Statistics
    const pendingEventsCount = events.filter((e) => e.status === 1).length;
    const approvedEventsCount = events.filter((e) => e.status === 2 && e.isActive).length;
    const rejectedEventsCount = events.filter((e) => e.status === 3).length;
    const disabledEventsCount = events.filter((e) => e.isActive === false).length;
    const totalUsersCount = users.length;
    // ================= اضافه شده: آمار کاربران تایید شده =================
    // const verifiedUsersCount = users.filter((u) => u.isActive).length;

    // Filtered Events
    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
            event.organizer.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
            (event.category && event.category.toLowerCase().includes(eventSearchQuery.toLowerCase())) ||
            (event.city && event.city.toLowerCase().includes(eventSearchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (eventStatusFilter === 'pending') return event.status === 1;
        if (eventStatusFilter === 'approved') return event.status === 2 && event.isActive;
        if (eventStatusFilter === 'rejected') return event.status === 3;
        if (eventStatusFilter === 'disabled') return !event.isActive;
        return true;
    });

    // ================= اضافه شده: فیلتر کاربران با وضعیت تایید =================
    // const filteredUsers = users.filter((u) => {
    //     const matchesSearch =
    //         u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    //         (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
    //         (u.phone && u.phone.includes(userSearchQuery));

    //     if (!matchesSearch) return false;

    //     if (userFilterVerified === 'verified') return u.isActive;
    //     if (userFilterVerified === 'unverified') return !u.isActive;
    //     return true;
    // });

    const fetchEvents = async (page: number, isRefresh = false) => {
        try {
            const result = await getEventsFormAdminPage({ pageNumber: page, pageSize: 10 });

            if (isRefresh) {
                setEvents(result.data);
            } else {
                setEvents(prev => {
                    const existingIds = new Set(prev.map(e => e.id));
                    const newEvents = result.data.filter(e => !existingIds.has(e.id));
                    return [...prev, ...newEvents];
                });
            }
            setEventsHasMore(result.hasNextPage);
        } catch (error) {
            console.error('Error fetching registered events:', error);
        } finally {
            setEventedLoading(false);
        }
    };

    const fetchUsers = async (page: number, isRefresh = false) => {
        try {
            const result = await getUsereForAdmin({ pageNumber: page, pageSize: 10 });

            if (isRefresh) {
                setUsers(result.data);
            } else {
                setUsers(prev => {
                    const existingIds = new Set(prev.map(e => e.id));
                    const newEvents = result.data.filter(e => !existingIds.has(e.id));
                    return [...prev, ...newEvents];
                });
            }
            setUsersHasMore(result.hasNextPage);
        } catch (error) {
            console.error('Error fetching registered events:', error);
        } finally {
            setUseredLoading(false);
        }
    };

    const getUserDetail = async (userId: number) => {
        var response = await getUserDetailForAdmin(userId);
        if (response.data) {
            setUserDetail(response.data);
            setSelectedUser(response.data);
        }
    };

    const getEventDetail = async (eventId: number) => {
        var response = await getEventDetailForAdmin(eventId);
        if (response.data) {
            setSelectedEventForDetails(response.data);
        }
    };

    const approveEventHandle = async (eventId: number) => {
        var response = await approveEvent(eventId);
        if (response.success) {
            setEvents(prev => prev.map(event =>
                event.id === eventId
                    ? { ...event, isActive: true, status: 2 }
                    : event
            ));
            setSelectedEventForDetails(null);
        }
    };

    const rejectEventHandle = async (reason: string) => {
        var response = await rejectEvent({ bahamId: selectedEventForReject, reason: reason });
        if (response.success) {
            setEvents(prev => prev.map(event =>
                event.id === selectedEventForReject
                    ? { ...event, status: 3 }
                    : event
            ));
            setSelectedEventForReject(0);
            setRejectionReason('');
            setSelectedEventForDetails(null);
        }
    };

    const changeStatusEventHandle = async (bahamId: number) => {
        var response = await changeStatusEvent(bahamId);
        if (response.success) {
            setEvents(prev => prev.map(event =>
                event.id === bahamId
                    ? { ...event, isActive: !event.isActive }
                    : event
            ));
            if (selectedEventForDetails && selectedEventForDetails.id === bahamId) {
                setSelectedEventForDetails({
                    ...selectedEventForDetails,
                    isActive: !selectedEventForDetails.isActive
                });
            }
            setSelectedEventForDetails(null);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchEvents(1, true);
        fetchUsers(1, true);
    }, []);

    useEffect(() => {
        const fetchParticipants = async () => {
            if (!selectedEventForAttendees) return;
            setParticipantsLoading(true);
            setParticipantsError(null);
            participantsPageRef.current = 1;
            try {
                const res = await getEventParticipantsForAdmin(selectedEventForAttendees.id, 1, 200);
                setParticipantsForSelectedEvent(res);
            } catch (err) {
                console.error('Error fetching admin participants:', err);
                setParticipantsError(err instanceof Error ? err.message : 'خطا در دریافت شرکت‌کنندگان');
                setParticipantsForSelectedEvent([]);
            } finally {
                setParticipantsLoading(false);
            }
        };

        if (selectedEventForAttendees) {
            void fetchParticipants();
        } else {
            // clear when closed
            setParticipantsForSelectedEvent([]);
            setParticipantsError(null);
            setParticipantsLoading(false);
        }
    }, [selectedEventForAttendees]);

    return (
        <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-[#F8F9FC]"
            dir="rtl"
        >
            {/* Sticky Header - AI Design */}
            <header className="sticky top-0 z-30 px-5 pt-7 pb-3 bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-2xs">
                {/* <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#ED1C24] to-rose-500 text-white rounded-2xl flex items-center justify-center font-black shadow-md shadow-red-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black text-gray-900 leading-none">مدیریت</h1>
                                <span className="bg-red-50 text-[#ED1C24] text-[9.5px] font-black px-2 py-0.5 rounded-md border border-red-100">
                                    ADMIN PANEL
                                </span>
                            </div>
                            <p className="text-[10.5px] font-bold text-gray-400 mt-1">
                                بررسی رویدادها و نظارت بر کاربران
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95 flex items-center gap-1.5"
                        title="بازگشت"
                    >
                        <span className="text-xs font-bold hidden sm:inline">بازگشت</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div> */}

                {/* Top Summary Stats Bar - AI Design */}
                {/* <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-2.5 rounded-2xl border border-amber-500/20 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[9.5px] font-bold text-amber-800 block truncate">در انتظار تایید</span>
                            <span className="text-sm font-black text-amber-900 leading-tight block">{pendingEventsCount} رویداد</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-2.5 rounded-2xl border border-emerald-500/20 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[9.5px] font-bold text-emerald-800 block truncate">رویدادهای فعال</span>
                            <span className="text-sm font-black text-emerald-900 leading-tight block">{approvedEventsCount} رویداد</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 p-2.5 rounded-2xl border border-blue-500/20 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[9.5px] font-bold text-blue-800 block truncate">کل کاربران</span>
                            <span className="text-sm font-black text-blue-900 leading-tight block">{totalUsersCount} کاربر</span>
                        </div>
                    </div>
                </div> */}

                {/* Tab Switcher - AI Design */}
                <div className="flex bg-gray-100/80 p-1 rounded-2xl border border-gray-200/60">
                    <button
                        type="button"
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'events'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <Calendar className="w-3.5 h-3.5 text-[#ED1C24]" />
                        <span>مدیریت رویدادها</span>
                        <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-md ${pendingEventsCount > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {events.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'users'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <UserCog className="w-3.5 h-3.5 text-blue-600" />
                        <span>مدیریت کاربران</span>
                        <span className="text-[9.5px] font-black px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded-md">
                            {users.length}
                        </span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="p-5 space-y-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'events' ? (
                        <motion.div
                            key="events-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {/* Event Filters & Search - AI Design */}
                            <div className="bg-white p-3.5 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={eventSearchQuery}
                                        onChange={(e) => setEventSearchQuery(e.target.value)}
                                        placeholder="جستجو در عنوان، برگزارکننده، دسته‌بندی یا شهر..."
                                        className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400"
                                    />
                                    {eventSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setEventSearchQuery('')}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Status Filter Pills - AI Design */}
                                {/* <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
                                    <FilterChip
                                        label="همه رویدادها"
                                        count={events.length}
                                        active={eventStatusFilter === 'all'}
                                        onClick={() => setEventStatusFilter('all')}
                                    />
                                    <FilterChip
                                        label="در انتظار تایید"
                                        count={pendingEventsCount}
                                        active={eventStatusFilter === 'pending'}
                                        color="amber"
                                        onClick={() => setEventStatusFilter('pending')}
                                    />
                                    <FilterChip
                                        label="تایید شده"
                                        count={approvedEventsCount}
                                        active={eventStatusFilter === 'approved'}
                                        color="emerald"
                                        onClick={() => setEventStatusFilter('approved')}
                                    />
                                    <FilterChip
                                        label="رد شده"
                                        count={rejectedEventsCount}
                                        active={eventStatusFilter === 'rejected'}
                                        color="red"
                                        onClick={() => setEventStatusFilter('rejected')}
                                    />
                                    <FilterChip
                                        label="غیرفعال شده"
                                        count={disabledEventsCount}
                                        active={eventStatusFilter === 'disabled'}
                                        color="slate"
                                        onClick={() => setEventStatusFilter('disabled')}
                                    />
                                </div> */}
                            </div>

                            {/* Events Cards List - AI Design */}
                            {filteredEvents.length === 0 ? (
                                <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-gray-100 shadow-2xs">
                                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                                        <CalendarX className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800">هیچ رویدادی یافت نشد</h3>
                                    <p className="text-xs font-bold text-gray-400">
                                        با فیلترها و عبارت جستجوی فعلی رویدادی با این مشخصات وجود ندارد.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {filteredEvents.map((event) => {
                                        const attendeesCount = event.attendeesCount;
                                        return (
                                            <div
                                                key={event.id}
                                                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden"
                                            >
                                                <div className="p-4 flex flex-col sm:flex-row gap-3.5 items-start">
                                                    {/* Event Cover Image - AI Design */}
                                                    <div
                                                        className="relative w-full sm:w-28 h-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-100 cursor-pointer group"
                                                        onClick={() => getEventDetail(event.id)}
                                                    >
                                                        <img
                                                            src={process.env.File_BaseURL + event.image}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-lg border border-white/20">
                                                            {event.category}
                                                        </div>
                                                        {event.isOnline && (
                                                            <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white text-[8.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                <Globe className="w-3 h-3" />
                                                                آنلاین
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Event Details Content - AI Design */}
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="space-y-1 min-w-0">
                                                                <h3
                                                                    onClick={() => getEventDetail(event.id)}
                                                                    className="text-sm font-black text-gray-900 hover:text-[#ED1C24] transition-colors cursor-pointer leading-tight truncate"
                                                                >
                                                                    {event.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 text-[10.5px] font-bold text-gray-500 flex-wrap">
                                                                    <span className="flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                                        <UserIcon className="w-3 h-3 text-gray-400" />
                                                                        {event.organizer}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-gray-500">
                                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                                        {event.location || 'نامشخص'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-gray-500">
                                                                        <Calendar className="w-3 h-3 text-gray-400" />
                                                                        {event.eventTime}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Status Badge - AI Design */}
                                                            <EventStatusBadge
                                                                status={event.status}
                                                                isDisabled={!event.isActive}
                                                            />
                                                        </div>

                                                        {/* ================= اضافه شده: شرکت‌کنندگان و ظرفیت ================= */}
                                                        <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2 flex-wrap text-xs">
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedEventForAttendees(event)}
                                                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-100"
                                                            >
                                                                <Users className="w-3.5 h-3.5" />
                                                                <span>شرکت‌کنندگان ({attendeesCount} نفر)</span>
                                                            </button>

                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-gray-400">
                                                                    ظرفیت: {event.maxCapacity ? `${event.maxCapacity} نفر` : 'نامحدود'}
                                                                </span>
                                                                <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
                                                                    {event.isFree ? 'رایگان' : event.price}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ================= اضافه شده: بنر دلیل رد ================= */}
                                                {event.status === 3 && (
                                                    <div className="px-4 py-2 bg-rose-50/80 border-t border-rose-100 flex items-center justify-between gap-2 text-xs">
                                                        <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] min-w-0">
                                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                علت عدم تایید: {event.rejectionReason || 'توضیحات ثبت نشده است.'}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                // ================= اضافه شده: تنظیم رویداد برای نمایش دلیل =================
                                                                setSelectedEventForReason({
                                                                    ...event,
                                                                    rejectionReason: event.rejectionReason || 'توضیحات ثبت نشده است.'
                                                                } as any);
                                                            }}
                                                            className="text-[10px] font-black text-rose-700 underline shrink-0 hover:text-rose-900"
                                                        >
                                                            مشاهده کامل
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Actions Toolbar - AI Design */}
                                                <div className="px-4 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => getEventDetail(event.id)}
                                                        className="text-gray-600 hover:text-gray-900 text-[11px] font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-gray-200/60 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>جزئیات رویداد</span>
                                                    </button>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {event.status === 1 ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => approveEventHandle(event.id)}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition-all cursor-pointer active:scale-98"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    <span>تایید رویداد</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedEventForReject(event.id)}
                                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer border border-rose-100"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                    <span>رد کردن</span>
                                                                </button>
                                                            </>
                                                        ) : event.status === 2 ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => changeStatusEventHandle(event.id)}
                                                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer border ${!event.isActive
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                                        }`}
                                                                >
                                                                    {!event.isActive ? (
                                                                        <>
                                                                            <Play className="w-3.5 h-3.5 fill-emerald-600" />
                                                                            <span>فعالسازی رویداد</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Pause className="w-3.5 h-3.5 fill-amber-600" />
                                                                            <span>غیرفعال‌سازی موقت</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedEventForReject(event.id)}
                                                                    className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                                                                    title="تغییر وضعیت به رد شده"
                                                                >
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => approveEventHandle(event.id)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                                            >
                                                                <RotateCcw className="w-3.5 h-3.5" />
                                                                <span>بررسی و تایید مجدد</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        /* Users Tab - AI Design */
                        <motion.div
                            key="users-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {/* Users Search & Filter - AI Design */}
                            <div className="bg-white p-3.5 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        placeholder="جستجو در نام کاربر، ایمیل، شماره تماس..."
                                        className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pr-10 pl-4 py-2.5 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                                    />
                                    {userSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setUserSearchQuery('')}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* ================= اضافه شده: فیلتر تایید کاربران ================= */}
                                {/* <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                    <FilterChip
                                        label="همه کاربران"
                                        count={users.length}
                                        active={userFilterVerified === 'all'}
                                        onClick={() => setUserFilterVerified('all')}
                                    />
                                    <FilterChip
                                        label="تایید شده"
                                        count={verifiedUsersCount}
                                        active={userFilterVerified === 'verified'}
                                        color="emerald"
                                        onClick={() => setUserFilterVerified('verified')}
                                    />
                                    <FilterChip
                                        label="عادی"
                                        count={users.length - verifiedUsersCount}
                                        active={userFilterVerified === 'unverified'}
                                        color="slate"
                                        onClick={() => setUserFilterVerified('unverified')}
                                    />
                                </div> */}
                            </div>

                            {/* Users Grid/List - AI Design */}
                            {users.length === 0 ? (
                                <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-gray-100 shadow-2xs">
                                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                                        <UserX className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800">هیچ کاربری یافت نشد</h3>
                                    <p className="text-xs font-bold text-gray-400">با عبارت جستجوی فعلی کاربری پیدا نشد.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => getUserDetail(user.id)}
                                            className="bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={process.env.File_BaseURL + user.image}
                                                        alt={user.name}
                                                        className="w-12 h-12 rounded-2xl object-cover bg-gray-100 group-hover:scale-105 transition-transform"
                                                    />
                                                    {/* {user.isActive && (
                                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-md border border-white shadow-2xs">
                                                            <Check className="w-2.5 h-2.5" />
                                                        </div>
                                                    )} */}
                                                </div>

                                                <div className="min-w-0 space-y-0.5">
                                                    <h4 className="text-xs font-black text-gray-900 truncate">{user.name}</h4>
                                                    {/* <div className="flex items-center gap-2">
                                                        {user.isActive ? (
                                                            <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-emerald-100">
                                                                تایید شده
                                                            </span>
                                                        ) : (
                                                            <span className="bg-gray-100 text-gray-500 text-[8.5px] font-bold px-1.5 py-0.2 rounded">
                                                                عادی
                                                            </span>
                                                        )}
                                                    </div> */}
                                                    <p className="text-[10px] font-bold text-gray-400 truncate" dir="ltr">
                                                        {user.phone || 'بدون شماره'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="text-left sm:block">
                                                    <span className="text-[9px] font-bold text-gray-400 block">تاریخ عضویت</span>
                                                    <span className="text-[10px] font-black text-gray-700 block">{user.registeredDate || '۱۴۰۲'}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-700 flex items-center justify-center transition-colors">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ================= MODAL 1: EVENT DETAILS MODAL - AI Design ================= */}
            <AnimatePresence>
                {selectedEventForDetails && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForDetails(null)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
                        />

                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-[210] overflow-hidden flex flex-col max-h-[90vh]"
                            dir="rtl"
                        >
                            {/* Header Bar - AI Design */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center font-black">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-gray-900">جزئیات کامل رویداد</h3>
                                        <p className="text-[9.5px] font-bold text-gray-400">شناسه: {selectedEventForDetails.id}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedEventForDetails(null)}
                                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                                {/* Hero Cover Image */}
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xs bg-gray-100">
                                    <img
                                        src={process.env.File_BaseURL + selectedEventForDetails.image}
                                        alt={selectedEventForDetails.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-black border border-white/20">
                                        {selectedEventForDetails.category}
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <EventStatusBadge
                                            status={selectedEventForDetails.status}
                                            isDisabled={!selectedEventForDetails.isActive}
                                        />
                                    </div>
                                </div>

                                {/* Title & Price */}
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-base font-black text-gray-900 leading-snug">
                                        {selectedEventForDetails.title}
                                    </h2>
                                    <span className="bg-red-50 text-[#ED1C24] border border-red-100 text-xs font-black px-3 py-1 rounded-xl shrink-0">
                                        {selectedEventForDetails.isFree ? 'رایگان' : selectedEventForDetails.price}
                                    </span>
                                </div>

                                {/* Key Attributes Grid - AI Design */}
                                <div className="grid grid-cols-2 gap-2.5 text-xs">
                                    <DetailBox
                                        icon={<UserIcon className="w-3.5 h-3.5 text-blue-500" />}
                                        label="برگزارکننده"
                                        value={selectedEventForDetails.organizer}
                                    />
                                    <DetailBox
                                        icon={<MapPin className="w-3.5 h-3.5 text-rose-500" />}
                                        label="شهر و مکان"
                                        value={`${selectedEventForDetails.city || ''} - ${selectedEventForDetails.address || ''}`}
                                    />
                                    <DetailBox
                                        icon={<Calendar className="w-3.5 h-3.5 text-amber-500" />}
                                        label="تاریخ برگزاری"
                                        value={selectedEventForDetails.eventTime}
                                    />
                                    <DetailBox
                                        icon={<Users className="w-3.5 h-3.5 text-emerald-500" />}
                                        label="ظرفیت و رده سنی"
                                        value={`ظرفیت ${selectedEventForDetails.capacity || 'نامحدود'}`}
                                    />
                                    <DetailBox
                                        icon={<Globe className="w-3.5 h-3.5 text-indigo-500" />}
                                        label="نوع رویداد"
                                        value={selectedEventForDetails.isOnline ? 'آنلاین / غیرحضوری' : 'حضوری'}
                                    />
                                    <DetailBox
                                        icon={<Heart className="w-3.5 h-3.5 text-purple-500" />}
                                        label="علاقه‌مندی‌ها"
                                        value={selectedEventForDetails.favourites?.join('، ') || 'ثبت نشده'}
                                    />
                                </div>

                                {/* ================= اضافه شده: نمایش دلیل رد در مودال جزئیات ================= */}
                                {selectedEventForDetails.status === 3 && (
                                    <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl space-y-1">
                                        <span className="text-[10px] font-black text-rose-700 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            دلیل عدم تایید این رویداد:
                                        </span>
                                        {/* <p className="text-xs font-bold text-rose-900 leading-relaxed">
                                            {selectedEventForDetails.rejectionReason || 'توضیحاتی ثبت نشده است.'}
                                        </p> */}
                                    </div>
                                )}

                                {/* Event Full Description */}
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-black text-gray-700">درباره رویداد</h4>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs font-bold text-gray-700 leading-relaxed text-justify">
                                        <div dangerouslySetInnerHTML={{ __html: selectedEventForDetails.description || 'توضیحات بیشتری برای این رویداد ثبت نشده است.' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Footer - AI Design */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                                {selectedEventForDetails.status === 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => approveEventHandle(selectedEventForDetails.id)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>تایید و انتشار</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedEventForReject(selectedEventForDetails.id);
                                                setSelectedEventForDetails(null);
                                            }}
                                            className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-rose-100 flex items-center justify-center gap-1.5"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>رد کردن رویداد</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => changeStatusEventHandle(selectedEventForDetails.id)}
                                            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${!selectedEventForDetails.isActive
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                                }`}
                                        >
                                            {!selectedEventForDetails.isActive ? (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    <span>فعالسازی مجدد</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Pause className="w-4 h-4" />
                                                    <span>غیرفعال‌سازی موقت</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedEventForReject(selectedEventForDetails.id);
                                                setSelectedEventForDetails(null);
                                            }}
                                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-rose-100"
                                        >
                                            رد کردن
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ================= MODAL 2: REJECTION REASON MODAL - AI Design ================= */}
            <AnimatePresence>
                {selectedEventForReject > 0 && (
                    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForReject(0)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 15 }}
                            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-[230] border border-gray-100 text-right space-y-4"
                            dir="rtl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900">ثبت دلیل عدم تایید رویداد</h3>
                                    <p className="text-[10.5px] font-bold text-gray-400">
                                        این پیام برای برگزارکننده رویداد ارسال می‌شود.
                                    </p>
                                </div>
                            </div>

                            {/* Preset Reasons - AI Design */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-gray-400 block">انتخاب سریع علت:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {PRESET_REJECTION_REASONS.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setRejectionReason(preset)}
                                            className="text-[10px] font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200/60 transition-colors cursor-pointer active:scale-95"
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Textarea */}
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="متن دلیل رد کردن رویداد را بنویسید..."
                                className="w-full h-28 bg-gray-50 border border-gray-200/80 rounded-2xl p-3 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none placeholder:text-gray-400"
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedEventForReject) {
                                            rejectEventHandle(rejectionReason || 'محتوای رویداد تایید نشد.');
                                        }
                                    }}
                                    disabled={!rejectionReason.trim()}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-98"
                                >
                                    ثبت و عدم تایید
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedEventForReject(0)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                                >
                                    انصراف
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ================= MODAL 3: VIEW REJECTION REASON - اضافه شده ================= */}
            <AnimatePresence>
                {selectedEventForReason && (
                    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForReason(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 15 }}
                            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-[230] border border-gray-100 text-right space-y-4"
                            dir="rtl"
                        >
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6" />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="text-sm font-black text-gray-900">علت عدم تایید رویداد</h3>
                                <p className="text-xs font-bold text-gray-400 truncate">{selectedEventForReason.title}</p>
                            </div>

                            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 text-xs font-bold text-rose-900 leading-relaxed text-justify space-y-3">
                                {selectedEventForReason.reasons && selectedEventForReason.reasons.length > 0 ? (
                                    selectedEventForReason.reasons
                                        .slice()
                                        .sort((a, b) => {
                                            const aDate = Date.parse(a.createDateTime ?? a.createdAt ?? '');
                                            const bDate = Date.parse(b.createDateTime ?? b.createdAt ?? '');
                                            return bDate - aDate;
                                        })
                                        .map((reason, index) => (
                                            <div key={`${reason.createDateTime ?? reason.createdAt ?? index}-${index}`} className="space-y-1">
                                                <p className="text-[11px] font-black text-rose-900">{reason.reason}</p>
                                                {(() => {
                                                    const reasonDate = reason.createDateTime ?? (reason as any).createdAt;
                                                    return reasonDate ? (
                                                        <p className="text-[10px] text-rose-900">{toPersianDigits(reasonDate)}
                                                            {/* {new Date(reasonDate).toLocaleString('fa-IR', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })} */}
                                                        </p>
                                                    ) : null;
                                                })()}
                                            </div>
                                        ))
                                ) : (
                                    <p>{selectedEventForReason.rejectionReason || 'علتی ثبت نشده است.'}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedEventForReason(null)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                            >
                                بستن
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ================= MODAL 4: ATTENDEES LIST MODAL - اضافه شده ================= */}
            <AnimatePresence>
                {selectedEventForAttendees && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForAttendees(null)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
                        />

                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-[210] overflow-hidden flex flex-col max-h-[85vh]"
                            dir="rtl"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-gray-900">لیست شرکت‌کنندگان ثبت‌نام‌شده</h3>
                                        <p className="text-[10px] font-bold text-gray-400 truncate max-w-[280px]">
                                            {selectedEventForAttendees.title}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedEventForAttendees(null)}
                                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
                                {(() => {
                                    const participants = participantsForSelectedEvent || [];

                                    if (participantsLoading) {
                                        return (
                                            <div className="text-center py-10 space-y-3">
                                                <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                                                    <Users className="w-7 h-7 animate-pulse" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400">در حال بارگذاری شرکت‌کنندگان...</p>
                                            </div>
                                        );
                                    }

                                    if (participantsError) {
                                        return (
                                            <div className="text-center py-10 space-y-3">
                                                <p className="text-xs font-bold text-rose-600">{participantsError}</p>
                                            </div>
                                        );
                                    }

                                    if (!participants || participants.length === 0) {
                                        return (
                                            <div className="text-center py-10 space-y-3">
                                                <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                                                    <Users className="w-7 h-7" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400">
                                                    هنوز هیچ کاربری در این رویداد ثبت‌نام نکرده است.
                                                </p>
                                            </div>
                                        );
                                    }

                                    return participants.map((participant) => (
                                        <div
                                            key={participant.fullname}
                                            className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    src={participant.profileAddress ? (participant.profileAddress.startsWith('http') ? participant.profileAddress : process.env.File_BaseURL + participant.profileAddress) : process.env.File_BaseURL + '/default-avatar.png'}
                                                    alt={participant.fullname}
                                                    className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0"
                                                />
                                                <div className="min-w-0 space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="text-xs font-black text-gray-900 truncate">{participant.fullname}</h4>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 truncate" dir="ltr">{participant.phone || 'شماره ثبت نشده'}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs font-black text-gray-600">{toPersianDigits(participant.joinedAt)}</p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setSelectedEventForAttendees(null)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                                >
                                    بستن لیست
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ================= MODAL 5: USER DETAIL MODAL - AI Design ================= */}
            <AnimatePresence>
                {userDetail && (
                    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setUserDetail(null)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
                        />

                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-[210] overflow-hidden flex flex-col max-h-[90vh]"
                            dir="rtl"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                                        <UserCog className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-xs font-black text-gray-900">پروفایل و اطلاعات کاربر</h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setUserDetail(null)}
                                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Scrollable */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                                {/* User Header Profile */}
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="relative shrink-0">
                                        <img
                                            src={process.env.File_BaseURL + userDetail.profileImage}
                                            alt={userDetail.fullName}
                                            className="w-16 h-16 rounded-2xl object-cover bg-gray-200"
                                        />
                                        {/* {userDetail.isActive && (
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                        )} */}
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-black text-gray-900">{userDetail.fullName}</h3>
                                            {/* {userDetail.isActive ? (
                                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md border border-emerald-100">
                                                    تایید شده
                                                </span>
                                            ) : (
                                                <span className="bg-gray-200 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md">
                                                    عادی
                                                </span>
                                            )} */}
                                        </div>
                                        <p className="text-xs font-bold text-gray-400" dir="ltr">
                                            {userDetail.phone || 'شماره ثبت نشده'}
                                        </p>
                                        {/* <p className="text-[10.5px] font-bold text-gray-500">
                                            عضویت: {userDetail.registeredDate || '۱۴۰۲'}
                                        </p> */}
                                    </div>
                                </div>

                                {/* Information Grid - AI Design */}
                                <div className="grid grid-cols-2 gap-2.5 text-xs">
                                    {/* <DetailBox
                                        icon={<Mail className="w-3.5 h-3.5 text-blue-500" />}
                                        label="پست الکترونیک"
                                        value={userDetail.email || 'ثبت نشده'}
                                    /> */}
                                    <DetailBox
                                        icon={<BriefcaseIcon className="w-3.5 h-3.5 text-amber-500" />}
                                        label="شغل و فعالیت"
                                        value={userDetail.job || 'ثبت نشده'}
                                    />
                                    <DetailBox
                                        icon={<CalendarIcon className="w-3.5 h-3.5 text-emerald-500" />}
                                        label="تاریخ تولد"
                                        value={toPersianDigits(userDetail.birthDate) || 'ثبت نشده'}
                                    />
                                    <DetailBox
                                        icon={<Heart className="w-3.5 h-3.5 text-rose-500" />}
                                        label="وضعیت تاهل"
                                        value={userDetail.maritalStatus || 'ثبت نشده'}
                                    />
                                    <DetailBox
                                        icon={<UserIcon className="w-3.5 h-3.5 text-indigo-500" />}
                                        label="جنسیت"
                                        value={userDetail.gender || 'ثبت نشده'}
                                    />
                                    {/* <DetailBox
                                        icon={<Tag className="w-3.5 h-3.5 text-purple-500" />}
                                        label="علاقه‌مندی‌ها"
                                        value={userDetail.favourites || 'ثبت نشده'}
                                    /> */}
                                </div>

                                <div className="space-y-1">
                                    <DetailBox
                                        icon={<Tag className="w-3.5 h-3.5 text-purple-500" />}
                                        label="علاقه‌مندی‌ها"
                                        value={userDetail.favourites || 'ثبت نشده'}
                                    />
                                </div>

                                {/* About Section */}
                                {userDetail.aboutMe && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400">درباره کاربر:</span>
                                        <p className="text-xs font-bold text-gray-700 italic bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            «{userDetail.aboutMe}»
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setUserDetail(null)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                                >
                                    بستن پروفایل کاربر
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.main>
    );
}

export default AdminPage;