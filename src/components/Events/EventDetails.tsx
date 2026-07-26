// EventDetailsPage.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Check, Calendar, ArrowRight, ChevronDown, MapPin, Share2,
    Flag, Star, Sparkles, Lock, ChevronLeft, Diamond
} from 'lucide-react';
import EmptyState from "./EmptyState";
import CommentSection from "./CommentSection";
import ParticipantsDrawer from "./ParticipantsDrawer";
import NavigationDrawer from "../Shared/NavigationDrawer";
import ReportDrawer from "./ReportDrawer";
import ConfirmationDrawer from "./ConfirmationDrawer";
import { getEventById, getEventParticipants, registerForEvent } from "../../services/events";
import { getEventComments, submitComment } from "../../services/comments";
import * as LucideIcons from 'lucide-react';

export interface EventDetailsResponse {
    id: string;
    title: string;
    description: string;
    image: string;
    eventTime: string;
    startTime: string;
    endTime: string;
    location: string;
    address: string;
    lat: number;
    lng: number;
    isFree: boolean;
    price: number | null;
    organizerName: string;
    organizerId: number;
    organizerAvatar?: string;
    organizerRating?: number;
    categoryId: number;
    categoryTitle: string;
    provinceId: number;
    provinceName: string;
    cityId: number;
    cityName: string;
    minAge: number | null;
    maxAge: number | null;
    minCapacity: number;
    maxCapacity: number;
    currentParticipants: number;
    hasWaitlist: boolean;
    isOnline: boolean;
    onlineLink: string | null;
    status: string;
    createdAt: string;
    participants?: Participant[];
    comments?: Comment[];
    rating?: number;
    totalRatings?: number;
    coverAddress: string;
    locationName: string;
    userProfile: string;
    isRegistered: boolean;
    isCapacity: boolean
}

export interface Participant {
    id: number;
    fullname: string;
    role?: string;
    profileAddress?: string;
    joinedAt: string;
}

export interface Comment {
    id: number;
    userId: number;
    fullname?: string;
    userProfileAddress?: string;
    rate: number;
    text: string;
    createdDateTime: string;
    isActive: boolean;
}

function EventDetailsPage({
    eventId,
    onBack,
    isLoggedIn,
    onOpenAuth,
    onOverlayStateChange,
    onRegister: onRegisterParent,
}: {
    eventId: number;
    onBack: () => void;
    isLoggedIn: boolean;
    onOpenAuth: () => void;
    onOverlayStateChange?: (hidden: boolean) => void;
    onRegister?: (id: string) => void;
    key?: React.Key
}) {
    const [event, setEvent] = useState<EventDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [participants, setParticipants] = useState<Participant[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
    const [isRegistrationFailed, setIsRegistrationFailed] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');

    const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
    const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
    const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
    const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState(false);
    const [activeParticipantId, setActiveParticipantId] = useState<number | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const hasFetched = useRef(false);
    const [isCommentSuccess, setIsCommentSuccess] = useState(false);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

    useEffect(() => {
        onOverlayStateChange?.(isAddReviewOpen || isConfirmDrawerOpen);
        return () => {
            onOverlayStateChange?.(false);
        };
    }, [isAddReviewOpen, isConfirmDrawerOpen, onOverlayStateChange]);

    const handleAddComment = (rating: number, text: string) => {
        const newComment = {
            id: Date.now(),
            fullname: 'کاربر مهمان',
            userId: 1,
            createdDateTime: 'هم‌اکنون',
            isActive: true,
            text: text || 'امتیاز ثبت شد',
            userProfileAddress: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            rate: rating,
        };
        setComments([newComment, ...comments]);
        setIsAddReviewOpen(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: event?.title,
            text: `در این رویداد شرکت کنید: ${event?.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsSharing(true);
                setTimeout(() => setIsSharing(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            setIsLoading(true);
            setError(null);
            try {
                const eventData = await getEventById(eventId);
                setEvent(eventData);

                // const participantsData = await getEventParticipants(eventId);
                // setParticipants(participantsData.data);

                const commentsData = await getEventComments(eventId);
                setComments(commentsData.data);

                if (eventData.description.length > 5)
                    setIsDescriptionExpanded(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات رویداد');
                console.error('Error fetching event details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    const handleSubmitComment = async (rating: number, text: string) => {
        try {
            const result = await submitComment(eventId, rating, text);
            setIsCommentSuccess(true)
            setTimeout(() => setIsCommentSuccess(false), 7000);

            if (result.success && result.text) {
                const newComment: Comment = {
                    id: Date.now(),
                    userId: 5,
                    fullname: "علی قلی پور",
                    rate: result.rate,
                    text: result.text,
                    createdDateTime: new Date().toLocaleDateString('fa-IR'),
                    userProfileAddress: "",
                    isActive: false
                };
                setComments(prev => [newComment, ...prev]);
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    const handleRegister = async () => {
        if (!isLoggedIn) {
            onOpenAuth();
            return;
        }
        let registrationSucceeded = false;
        try {
            const result = await registerForEvent(eventId);
            if (result.success) {
                registrationSucceeded = true;
                setIsRegistrationSuccess(true);
                setRegistrationMessage(result.message);
                setTimeout(() => setIsRegistrationSuccess(false), 3000);

                const updatedEvent = await getEventById(eventId);
                setEvent(updatedEvent);

                onRegisterParent?.(eventId.toString());
                return;
            }

            setRegistrationMessage(result.message);
            setIsRegistrationFailed(true);
            setTimeout(() => setIsRegistrationFailed(false), 5000);
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            if (registrationSucceeded) {
                setEvent(prev => prev ? { ...prev, isRegistered: true } : prev);
            }
            setIsConfirmDrawerOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#007AFF]" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <div className="text-red-500 text-xl mb-4">⚠️</div>
                <p className="text-gray-600 font-bold">{error || 'رویداد یافت نشد'}</p>
                <button
                    onClick={onBack}
                    className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold"
                >
                    بازگشت
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex flex-col min-h-0 bg-white overflow-hidden w-full">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex-1 overflow-y-auto no-scrollbar pb-20"
                dir="rtl"
            >
                {/* Top Sticky/Float Header - Redesigned */}
                <div className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={onBack}
                        className="w-9 h-9 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-800 pointer-events-auto border border-gray-100"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    <div className="flex items-center gap-2 pointer-events-auto">
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={handleShare}
                            className={`w-9 h-9 ${isSharing ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white/90 text-gray-800 border-gray-100'} backdrop-blur shadow-md rounded-full flex items-center justify-center transition-all border`}
                        >
                            {isSharing ? (
                                <span className="text-[10px] font-black">کپی شد!</span>
                            ) : (
                                <Share2 className="w-4.5 h-4.5" />
                            )}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsReportDrawerOpen(true)}
                            className="w-9 h-9 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-800 border border-gray-100"
                        >
                            <Flag className="w-4.5 h-4.5" />
                        </motion.button>
                    </div>
                </div>

                {/* Hero Image Header - Redesigned */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img
                        src={process.env.File_BaseURL + event.coverAddress}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                    {event.isFree && (
                        <div className="absolute bottom-4 right-6 bg-[#ED1C24] text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
                            رایگان
                        </div>
                    )}
                </div>

                {/* Main Details Body - Redesigned */}
                <div className="px-6 -mt-3 relative z-10 bg-white rounded-t-[24px] pt-5 space-y-5">
                    {/* Title & Host info - Redesigned */}
                    <div className="space-y-1.5 text-right">
                        <h1 className="text-xl font-black text-gray-900 leading-tight tracking-tight">
                            {event.title}
                        </h1>

                        <div className="flex items-center justify-between bg-gray-50/70 p-2.5 rounded-2xl border border-gray-100/50">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src={process.env.File_BaseURL + event.userProfile}
                                    alt="Host Avatar"
                                    className="w-8 h-8 rounded-full border border-white shadow-xs object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="flex flex-col text-right">
                                    <span className="text-[11px] font-black text-gray-900">{event.organizerName}</span>
                                    <span className="text-[9px] font-bold text-gray-400">میزبان تایید شده رویداد</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-2xs">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-[10px] font-black text-gray-700">۴.۹</span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Cards - Redesigned */}
                    <div className="flex flex-col gap-2.5">
                        <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-blue-50/70 text-[#007AFF] rounded-xl flex items-center justify-center shrink-0">
                                <Calendar className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex flex-col text-right min-w-0 flex-1">
                                <span className="text-[9px] font-bold text-gray-400 leading-none">تاریخ برگزاری</span>
                                <span className="text-xs font-black text-gray-800 mt-1 leading-normal break-words">{event.eventTime}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-emerald-50/70 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex flex-col text-right min-w-0 flex-1">
                                <span className="text-[9px] font-bold text-gray-400 leading-none">مکان رویداد</span>
                                <span className="text-xs font-black text-gray-800 mt-1 leading-normal break-words">{event.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Map Preview - Redesigned */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsNavigationDrawerOpen(true)}
                        className="relative w-full h-24 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer shadow-3xs"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-30" />
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                            <div className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#ED1C24]">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-gray-700 bg-white/90 border border-gray-100 px-3 py-1 rounded-full shadow-2xs">
                                مسیریابی و آدرس دقیق رویداد
                            </span>
                        </div>
                    </motion.div>

                    {/* Participants - Redesigned Horizontal Layout */}
                    {/* <div
                        onClick={() => participants.length > 0 ? setIsParticipantsDrawerOpen(true) : null}
                        className="bg-gray-50/40 border border-gray-100 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5 space-x-reverse">
                                {participants.slice(0, 4).map((person) => (
                                    <img
                                        key={person.id}
                                        src={process.env.File_BaseURL! + person.profileAddress}
                                        alt={person.fullname}
                                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                                    />
                                ))}
                                {participants.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-gray-600">
                                        +{participants.length - 4}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-black text-gray-800">شرکت‌کنندگان</span>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {participants.length} نفر ثبت‌نام کرده‌اند
                                </span>
                            </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </div> */}

                    {/* Description Section - Redesigned */}
                    <div className="space-y-1.5 text-right">
                        <h2 className="text-sm font-black text-gray-900">توضیحات رویداد</h2>
                        <div className="relative">
                            <p
                                className={`text-gray-500 text-xs font-bold leading-relaxed text-justify transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-3' : ''
                                    }`}
                            >
                                {event.description}
                            </p>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-1 text-[#007AFF] text-[10px] font-black flex items-center gap-0.5"
                            >
                                <span>{isDescriptionExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}</span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Smart Member Analysis Section - New Premium Section */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                        <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-3xs border border-indigo-100/30">
                                    <Sparkles className="w-3.5 h-3.5 fill-indigo-500/10" />
                                </div>
                                <div className="flex flex-col text-right">
                                    <h3 className="text-xs font-black text-gray-900">تحلیل هوشمند اعضا</h3>
                                    <p className="text-[9px] font-bold text-gray-400">آنالیز هوش مصنوعی شرکت‌کنندگان</p>
                                </div>
                            </div>
                            {!isLoggedIn && (
                                <div className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded-lg border border-amber-100/40 flex items-center gap-1">
                                    <Diamond className="w-2.5 h-2.5" />
                                    ویژه
                                </div>
                            )}
                        </div>

                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed text-right">
                            تحلیل آماری و رفتاری حاضرین بر اساس رده سنی، جنسیت و علاقه‌مندی‌های ثبت‌شده در پروفایل کاربری.
                        </p>

                        {/* Gender Distribution */}
                        <div className="space-y-1.5 bg-gray-50/50 border border-gray-100/40 p-2.5 rounded-xl">
                            <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                                <span>توزیع جنسیتی</span>
                                {isLoggedIn && <span className="text-[8px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">پرمیوم</span>}
                            </div>

                            <div className="h-1.5 w-full bg-gray-200/60 rounded-full overflow-hidden flex">
                                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '45%' : '0%' }} className="h-full bg-[#007AFF]" />
                                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '50%' : '0%' }} className="h-full bg-orange-400" />
                                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '5%' : '0%' }} className="h-full bg-gray-300" />
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-black text-gray-700">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
                                    <span>بانوان: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? '۴۵٪' : '••'}</span></span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    <span>آقایان: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? '۵۰٪' : '••'}</span></span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span>سایر: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? '۵٪' : '•'}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Age Range */}
                        <div className="space-y-1.5 bg-gray-50/50 border border-gray-100/40 p-2.5 rounded-xl">
                            <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                                <span>بازه سنی میانگین</span>
                                <span className="text-[9px] font-black text-gray-700">
                                    {isLoggedIn ? '۱۸ تا ۴۰ سال' : '•• تا •• سال'}
                                </span>
                            </div>

                            <div className="relative pt-1 pb-1">
                                <div className="h-1 w-full bg-gray-200/60 rounded-full relative">
                                    {isLoggedIn ? (
                                        <motion.div
                                            initial={{ left: '100%', right: '100%' }}
                                            animate={{ left: '20%', right: '35%' }}
                                            className="absolute h-full bg-indigo-500 rounded-full"
                                        />
                                    ) : (
                                        <div className="absolute h-full left-1/3 right-1/3 bg-gray-200 rounded-full blur-[2px]" />
                                    )}
                                </div>
                                {isLoggedIn && (
                                    <>
                                        <div className="absolute top-0.5 left-[20%] w-2 h-2 bg-white border-2 border-indigo-500 rounded-full shadow-xs -translate-x-1/2" />
                                        <div className="absolute top-0.5 right-[35%] w-2 h-2 bg-white border-2 border-indigo-500 rounded-full shadow-xs translate-x-1/2" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interest Tags */}
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-400 pr-0.5 text-right block">علایق مشترک حاضرین</span>
                            <div className="flex flex-wrap gap-1.5 bg-gray-50/50 border border-gray-100/40 p-2 rounded-xl">
                                {isLoggedIn ? (
                                    ['ورزش', 'موسیقی', 'تکنولوژی', 'هنر'].map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-white px-2 py-0.5 rounded-lg text-[9px] font-bold text-gray-600 border border-gray-100 shadow-3xs"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    ['••••', '••••', '••••'].map((placeholder, i) => (
                                        <span
                                            key={i}
                                            className="bg-white/60 px-2 py-0.5 rounded-lg text-[9px] font-bold text-gray-200 border border-gray-100 shadow-3xs blur-[2px]"
                                        >
                                            {placeholder}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {!isLoggedIn && (
                            <div className="pt-2 border-t border-dashed border-gray-100 flex flex-col gap-1.5">
                                <p className="text-[9px] font-bold text-gray-400 text-center leading-relaxed">
                                    جهت حفظ حریم خصوصی، مشاهده تحلیل دقیق رفتارشناختی اعضا نیازمند ورود به حساب کاربری است.
                                </p>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onOpenAuth}
                                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100/50 py-2 rounded-xl font-black text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <Lock className="w-3 h-3" />
                                    <span>ورود و فعال‌سازی تحلیل هوشمند</span>
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section - Redesigned */}
                    <div className="border-t border-gray-100 pt-4 space-y-3 text-right">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-gray-900">نظرات شرکت‌کنندگان</h3>
                                <div className="flex items-center gap-1 bg-yellow-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black border border-yellow-100/50">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{event.rating || '۴.۹'}</span>
                                    <span className="text-gray-400 font-bold">({comments.length})</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAddReviewOpen(true)}
                                className="text-[10px] font-black text-[#007AFF] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                            >
                                <LucideIcons.Plus className="w-3.5 h-3.5" />
                                <span>نوشتن نظر</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {comments.slice(0, 3).map((comment) => (
                                <div
                                    key={comment.id}
                                    className={`bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/40 space-y-2 
                                    ${!comment.isActive ? "border-amber-100 bg-amber-50/30 opacity-70" : ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={process.env.File_BaseURL! + comment.userProfileAddress}
                                                alt={comment.fullname}
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs font-black text-gray-800">{comment.fullname}</span>
                                                <span className="text-[9px] font-bold text-gray-400">{comment.createdDateTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-2.5 h-2.5 ${i < comment.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed text-right">
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {comments.length === 0 && (
                            <EmptyState message="هنوز نظری ثبت نشده است" />
                        )}
                    </div>

                    {/* Comment Section Component - Updated */}
                    <div className="pb-10">
                        {/* <CommentSection onSubmit={handleSubmitComment} /> */}
                        {isAddReviewOpen && (
                            <CommentSection
                                isOpen={isAddReviewOpen}
                                onClose={() => {
                                    setIsAddReviewOpen(false);
                                    onOverlayStateChange?.(false);
                                }}
                                onSubmit={handleAddComment}
                            />
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Modern Fixed Bottom Action Panel - Redesigned */}
            <div className={`fixed bottom-[102px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[440px] z-[100] bg-white/95 backdrop-blur-md border border-gray-100 px-5 py-3 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between transition-opacity duration-300 ${isAddReviewOpen || isConfirmDrawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">هزینه نهایی شرکت</span>
                    <span className={`text-sm font-black mt-0.5 ${event.isFree ? 'text-emerald-500' : 'text-gray-900'}`}>
                        {event.isFree ? 'رایگان' : event.price}
                    </span>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        if (!isLoggedIn) {
                            onOpenAuth();
                            return;
                        }
                        setIsConfirmDrawerOpen(true);
                    }}
                    disabled={event.isRegistered || !event.isCapacity}
                    className={`px-8 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition-all ${event.isRegistered || !event.isCapacity
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-[#ED1C24] hover:bg-[#D0171E] text-white shadow-[0_4px_16px_rgba(237,28,36,0.25)]'
                        }`}
                >
                    <span>{event.isRegistered ? 'ثبت‌نام شده‌اید' : !event.isCapacity ? 'ظرفیت تکمیل' : 'شرکت در دورهمی'}</span>
                    {!event.isRegistered && event.isCapacity ? (
                        <ArrowRight className="w-4 h-4" />
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                </motion.button>
            </div>

            {/* Drawers */}
            <ReportDrawer
                isOpen={isReportDrawerOpen}
                onClose={() => setIsReportDrawerOpen(false)} />

            <ConfirmationDrawer
                isOpen={isConfirmDrawerOpen}
                onClose={() => setIsConfirmDrawerOpen(false)}
                event={event}
                onConfirm={handleRegister} />

            {/* {isParticipantsDrawerOpen && (
                <ParticipantsDrawer
                    isOpen={isParticipantsDrawerOpen}
                    onClose={() => setIsParticipantsDrawerOpen(false)}
                    participants={participants}
                />
            )} */}

            <NavigationDrawer
                isOpen={isNavigationDrawerOpen}
                onClose={() => setIsNavigationDrawerOpen(false)}
                lat={event.lat}
                lng={event.lng}
                locationName={event.location} />

            {/* Notifications */}
            <AnimatePresence>
                {isRegistrationSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-32 left-1/2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl z-[200] font-black flex items-center gap-2 whitespace-nowrap text-xs"
                    >
                        <Check className="w-4 h-4" />
                        <span>{registrationMessage}</span>
                    </motion.div>
                )}

                {isRegistrationFailed && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-32 left-1/2 bg-yellow-600 text-white px-5 py-3 rounded-xl shadow-xl z-[200] font-black flex items-center gap-2 whitespace-nowrap text-xs"
                    >
                        <Check className="w-4 h-4" />
                        <span>{registrationMessage}</span>
                    </motion.div>
                )}

                {isCommentSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-32 left-1/2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl z-[200] font-black flex items-center gap-2 whitespace-nowrap text-xs"
                    >
                        <Check className="w-4 h-4" />
                        <span>با تشکر از ثبت نظر. بعد از تایید نمایش داده خواهد شد</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EventDetailsPage;