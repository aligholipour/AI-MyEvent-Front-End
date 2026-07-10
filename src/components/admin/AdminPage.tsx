import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { AppEvent, AppUsers, EventDetailForAdminResponse } from "../../types";
import { getEventsFormAdminPage, getEventDetailForAdmin, approveEvent, rejectEvent, changeStatusEvent } from "../../services/events";
import {
    ArrowRight, UserIcon, Play,
    Pause, Check, ChevronLeft, MapPin, Calendar, X, Users, PlusCircle, Compass, Store, AlertCircle, Heart,
    Phone, ShieldCheck, Share2, Briefcase, Tickets
} from "lucide-react";
import { getUserDetailForAdmin, GetUserDetailForAdminResponse, getUsereForAdmin, getUsers } from "../../services/users";

function AdminPage({
    // onConfirm,
    // onReject,
    // onDisable,
    onBack
}: {
    // onConfirm: (id: string) => void;
    // onReject: (id: string, reason: string) => void;
    // onDisable: (id: string) => void;
    onBack: () => void;
}) {
    const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
    const [selectedEventForReject, setSelectedEventForReject] = useState<number>(0);
    const [selectedEventForReason, setSelectedEventForReason] = useState<AppEvent | null>(null);
    const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventDetailForAdminResponse | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [eventsHasMore, setEventsHasMore] = useState(true);
    const [EventedLoading, setEventedLoading] = useState(true);
    const hasFetched = useRef(false);

    const [users, setUsers] = useState<AppUsers[]>([]);
    const [usersHasMore, setUsersHasMore] = useState(true);
    const [useredLoading, setUseredLoading] = useState(true);

    const [userDetail, setUserDetail] = useState<GetUserDetailForAdminResponse | null>(null);

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
        setSelectedUser(userId);
        var response = await getUserDetailForAdmin(userId);
        if (response.data) {
            setUserDetail(response.data)
        }
    }

    const getEventDetail = async (eventId: number) => {
        var response = await getEventDetailForAdmin(eventId);
        if (response.data) {
            setSelectedEventForDetails(response.data);
        }
    }

    const approveEventHandle = async (eventId: number) => {
        var response = await approveEvent(eventId)
        if (response.success) {
            // onConfirm(eventId.toString());

            setEvents(prev => prev.map(event =>
                event.id === eventId
                    ? { ...event, isActive: true, status: 2 }
                    : event
            ));

            setSelectedEventForDetails(null);
        }
    }

    const rejectEventHandle = async (reason: string) => {
        var response = await rejectEvent({ bahamId: selectedEventForReject, reason: reason })
        if (response.success) {
            setSelectedEventForReject(0);
            setRejectionReason('');
        }
    }

    const changeStatusEventHandle = async (bahamId: number) => {
        var response = await changeStatusEvent(bahamId)
        if (response.success) {
            // onDisable(bahamId.toString());

            setEvents(prev => prev.map(event =>
                event.id === bahamId
                    ? { ...event, isActive: !event.isActive }
                    : event
            ));
            // همچنین selectedEventForDetails رو هم آپدیت کن
            if (selectedEventForDetails && selectedEventForDetails.id === bahamId) {
                setSelectedEventForDetails({
                    ...selectedEventForDetails,
                    isActive: !selectedEventForDetails.isActive
                });
            }

            setSelectedEventForDetails(null);
        }
    }

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchEvents(1, true);
        fetchUsers(1, true);
    }, []);

    console.log('isActive:', selectedEventForDetails?.isActive);

    return (
        <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto no-scrollbar pb-24"
            dir="rtl">
            <header className="px-6 pt-8 pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-gray-900">مدیریت سایت</h1>
                        <p className="text-xs font-bold text-gray-400">بررسی رویدادها و کاربران</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <ArrowRight className="w-5 h-5 text-gray-900" />
                    </button>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'events'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}>
                        رویدادها
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'users'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        کاربران
                    </button>
                </div>
            </header>

            <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'events' ? (
                        <motion.div
                            key="events-list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => getEventDetail(event.id)}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col sm:flex-row transition-all hover:shadow-md cursor-pointer group items-stretch">
                                    <div className="w-full sm:w-28 relative flex-shrink-0 min-h-[100px] sm:h-auto">
                                        <img src={process.env.File_BaseURL + event.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        {/* {event.status === 2 && (
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                                                    تایید 2
                                                </span>
                                            </div>
                                        )} */}
                                    </div>

                                    <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0 bg-white">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 space-y-0.5">
                                                <h3 className="text-sm font-black text-gray-900 truncate">{event.title}</h3>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                                    <UserIcon className="w-3 h-3" />
                                                    <span>{event.organizer}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1.5 ${event.status === 1 ? 'bg-yellow-50 text-yellow-600' :
                                                    event.status === 2 ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${event.status === 1 ? 'bg-yellow-500' : event.status === 2 ? 'bg-emerald-500' : 'bg-red-500'
                                                        // 'bg-amber-500 animate-pulse'
                                                        }`} />
                                                    {
                                                        event.status === 1 ? 'منتظر تایید' : event.status === 2 ? 'تایید شده' : 'رد شده'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4">

                                            {event.status === 2 ? (
                                                <div className="flex-1 flex gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => changeStatusEventHandle(event.id)}
                                                        // onClick={() => onDisable(event.id.toString())}
                                                        className={`flex-1 h-9 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 border-none 
                                                            ${event.isActive
                                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            }`}
                                                    >
                                                        {event.isActive ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                                                        <span>{event.isActive ? 'غیرفعال کردن' : 'فعال کردن'}</span>
                                                    </button>
                                                    {/* <button
                                                        onClick={() => setSelectedEventForReject(event.id)}
                                                        className="bg-red-50 text-red-500 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all border-none"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button> */}
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        // onClick={() => onConfirm(event.id.toString())}
                                                        onClick={() => approveEventHandle(event.id)}
                                                        className="flex-[2] bg-emerald-500 text-white h-9 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5 border-none">
                                                        <Check className="w-3.5 h-3.5" />
                                                        تایید رویداد
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedEventForReject(event.id)}
                                                        className="flex-1 bg-red-50 text-red-500 h-9 rounded-xl text-[10px] font-black hover:bg-red-100 transition-all border-none">
                                                        رد کردن
                                                    </button>
                                                </div>
                                            )
                                            }

                                            {/* {event.status === 'pending' || event.status === 'rejected' ? (
                                                <div className="flex-1 flex gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        // onClick={() => onConfirm(event.id.toString())}
                                                        className="flex-[2] bg-emerald-500 text-white h-9 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5 border-none">
                                                        <Check className="w-3.5 h-3.5" />
                                                        تایید نهایی
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedEventForReject(event.id)}
                                                        className="flex-1 bg-red-50 text-red-500 h-9 rounded-xl text-[10px] font-black hover:bg-red-100 transition-all border-none">
                                                        رد کردن
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        // onClick={() => onDisable(event.id.toString())}
                                                        className={`flex-1 h-9 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 border-none ${event.isActive
                                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            }`}
                                                    >
                                                        {event.isActive ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                                                        <span>{event.isActive ? 'غیرفعال کردن' : 'فعال کردن'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedEventForReject(event.id)}
                                                        className="bg-red-50 text-red-500 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all border-none"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="users-list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3">
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => getUserDetail(user.id)}
                                    // onClick={() => setSelectedUser(user)}
                                    className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 text-right hover:shadow-lg hover:shadow-gray-100 transition-all active:scale-[0.99]">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={process.env.File_BaseURL + user.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black text-gray-900">{user.name}</h4>
                                        {/* <p className="text-[10px] font-bold text-gray-400 mt-0.5">{user.email}</p> */}
                                    </div>
                                    <div className="text-left flex flex-col items-end gap-1">
                                        <span className="text-[9px] font-black text-gray-300">عضویت</span>
                                        <span className="text-[10px] font-black text-gray-600">{user.registeredDate}</span>
                                    </div>
                                    <ChevronLeft className="w-5 h-5 text-gray-300" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Rejection Reason Drawer */}
            <AnimatePresence>
                {selectedEventForDetails && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForDetails(null)}
                            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[4px]"
                        />
                        <motion.div
                            initial={{ y: "100%", x: "-50%" }}
                            animate={{ y: 0, x: "-50%" }}
                            exit={{ y: "100%", x: "-50%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-[32px] shadow-2xl flex flex-col h-[90vh] overflow-hidden"
                            dir="rtl">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 shrink-0" />

                            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6">
                                <div className="space-y-6">
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                                        <img src={process.env.File_BaseURL + selectedEventForDetails.image} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-gray-900 border border-white/50 shadow-sm">
                                            {selectedEventForDetails.category}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-black text-gray-900">{selectedEventForDetails.title}</h2>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${selectedEventForDetails.isFree ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {selectedEventForDetails.isFree ? 'رایگان' : selectedEventForDetails.price}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">مکان</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700 truncate">{selectedEventForDetails.address}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">تاریخ و زمان</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700 truncate">{selectedEventForDetails.eventTime}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <UserIcon className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">برگزارکننده</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700 truncate">{selectedEventForDetails.organizer}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">رده سنی</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700">{selectedEventForDetails.ageRange}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Compass className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">ظرفیت</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700">{selectedEventForDetails.capacity}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">نوع رویداد</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700">{selectedEventForDetails.isOnline ? 'آنلاین' : 'حضوری'}</p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Store className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">شهر و استان</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700 truncate">
                                                    {selectedEventForDetails.city}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Heart className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">علاقه‌مندی‌ها</span>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-700 truncate">{selectedEventForDetails.favourites?.join(', ') || 'وجود ندارد'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black text-gray-400 px-1 italic">درباره رویداد</h4>
                                            <div className="bg-gray-100/50 p-4 rounded-2xl border border-gray-100">
                                                <p
                                                    className="text-[11px] font-black text-gray-700 truncate"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedEventForDetails?.description || 'توضیحاتی برای این رویداد ثبت نشده است.'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-50 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    {selectedEventForDetails.status === 2 ? (
                                        <>
                                            <button
                                                onClick={() => changeStatusEventHandle(selectedEventForDetails.id)}
                                                className={`
                                                        flex-1 h-11 cursor-pointer rounded-xl text-[11px] font-black w-full 
                                                        transition-all flex items-center justify-center gap-2
                                                        ${selectedEventForDetails.isActive
                                                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'  // ← این رو عوض کنید
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'  // ← و این رو
                                                    }
                                                    `}
                                            >
                                                <span>{selectedEventForDetails.isActive ? 'غیرفعال کردن' : 'فعال کردن 2'}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                disabled={selectedEventForDetails.status === 2}
                                                onClick={() => approveEventHandle(selectedEventForDetails.id)}
                                                className="flex-1 cursor-pointer bg-emerald-50 text-emerald-600 h-11 rounded-xl text-[11px] font-black disabled:opacity-50">
                                                تایید رویداد 1
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEventForReject(selectedEventForDetails.id);
                                                    setSelectedEventForDetails(null);
                                                }}
                                                className="flex-1 bg-red-50 cursor-pointer text-red-500 h-11 rounded-xl text-[11px] font-black">
                                                رد کردن 2
                                            </button>
                                        </>
                                    )}
                                </div>


                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedEventForReject && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForReject(0)}
                            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ y: "100%", x: "-50%" }}
                            animate={{ y: 0, x: "-50%" }}
                            exit={{ y: "100%", x: "-50%" }}
                            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col pt-2"
                            dir="rtl"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />
                            <div className="px-8 pb-10 space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-gray-900">دلیل رد رویداد</h2>
                                    <p className="text-sm font-bold text-gray-400">لطفا علت عدم تایید این رویداد را بنویسید تا به کاربر اطلاع داده شود.</p>
                                </div>

                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="مثلا: اطلاعات رویداد ناقص است یا محتوای نامناسب دارد..."
                                    className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 transition-all resize-none"
                                />

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => rejectEventHandle(rejectionReason)}
                                        disabled={!rejectionReason.trim()}
                                        className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:shadow-none transition-all">
                                        ثبت رد رویداد
                                    </button>
                                    <button
                                        onClick={() => setSelectedEventForReject(0)}
                                        className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-base">
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedEventForReason && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEventForReason(null)}
                            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ y: "100%", x: "-50%" }}
                            animate={{ y: 0, x: "-50%" }}
                            exit={{ y: "100%", x: "-50%" }}
                            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col pt-2"
                            dir="rtl"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />
                            <div className="px-8 pb-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-gray-900">علت رد رویداد</h2>
                                        <p className="text-[11px] font-bold text-gray-400">{selectedEventForReason.title}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                        {selectedEventForReason.rejectionReason || 'توضیحاتی برای رد این رویداد ثبت نشده است.'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedEventForReason(null)}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-base transition-all active:scale-95"
                                >
                                    بستن
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* User Detail Drawer */}
            <AnimatePresence>
                {userDetail && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[4px]"
                        />
                        <motion.div
                            initial={{ y: "100%", x: "-50%" }}
                            animate={{ y: 0, x: "-50%" }}
                            exit={{ y: "100%", x: "-50%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-[32px] shadow-2xl flex flex-col max-h-[90vh]"
                            dir="rtl"
                        >
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

                            <div className="flex-1 overflow-y-auto no-scrollbar px-6">
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-4 mt-2">
                                        <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl ring-4 ring-gray-50 relative group">
                                            <img src={process.env.File_BaseURL + userDetail.profileImage} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                            {true && (
                                                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-2 border-white shadow-lg">
                                                    <ShieldCheck className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h2 className="text-xl font-black text-gray-900">{userDetail.fullName}</h2>
                                            {true ? (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-emerald-600 flex items-center justify-center gap-1 bg-emerald-50 px-3 py-1 rounded-full mx-auto w-fit">
                                                        <Check className="w-3 h-3" />
                                                        کاربر تایید شده
                                                    </p>
                                                    {userDetail.aboutMe && (
                                                        <p className="text-[11px] font-bold text-gray-400 max-w-[280px] mx-auto leading-relaxed italic">
                                                            "{userDetail.aboutMe}"
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full mx-auto w-fit">کاربر عادی</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">شماره تماس</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700">{userDetail.phone}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">تاریخ تولد</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700">{userDetail.birthDate || 'ثبت نشده'}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Heart className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">وضعیت تاهل</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700">
                                                {userDetail.maritalStatus}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <UserIcon className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">جنسیت</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700">
                                                {userDetail.gender}
                                                {/* {selectedUser.gender === 'male' ? 'آقا' : (selectedUser.gender === 'female' ? 'خانم' : 'ثبت نشده')} */}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">شغل</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700 truncate">{userDetail.job}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <PlusCircle className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">علاقه‌مندی‌ها</span>
                                            </div>
                                            <p className="text-[11px] font-black text-gray-700 truncate">{userDetail.favourites}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl space-y-1 col-span-2 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">لینک دعوت اختصاصی</span>
                                                </div>
                                                <button className="text-[10px] font-black text-blue-500 hover:underline">کپی لینک</button>
                                            </div>
                                            <p className="text-[11px] font-black text-blue-600 truncate underline">{userDetail.referralCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-50">
                                <button
                                    onClick={() => setUserDetail(null)}
                                    className="w-full bg-gray-900 text-white h-12 rounded-2xl text-sm font-black shadow-xl">
                                    بستن پروفایل کاربر
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.main>
    );
}

export default AdminPage;