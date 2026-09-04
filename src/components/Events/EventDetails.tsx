import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Check, Calendar, ArrowRight, ChevronDown, MapPin, Share2,
    Flag, Sparkles, ChevronLeft, Maximize2,
    QrCode, UserCheck, Users, Compass,
    Ticket, ScanLine, Copy, Link, CheckCircle2, UserMinus,
    Building2, Video
} from 'lucide-react';
import CommentSection from "./CommentSection";
import NavigationDrawer from "../Shared/NavigationDrawer";
import ReportDrawer from "./ReportDrawer";
import ConfirmationDrawer from "./ConfirmationDrawer";
import { getEventById, registerForEvent } from "../../services/events";
import { getEventComments, submitComment } from "../../services/comments";
import * as LucideIcons from 'lucide-react';
import LeafletEventMap from "../Shared/LeafletEventMap";
import FullScreenMapModal from "../Shared/FullScreenMapModal";
import { toPersianDigits } from "@/src/lib/utils";

const getCategoryIconComponent = (categoryName?: string) => {
    switch (categoryName) {
        case 'علمی': return LucideIcons.Atom;
        case 'کنسرت': return LucideIcons.Music;
        case 'هنر': return LucideIcons.Palette;
        case 'ورزش': return LucideIcons.Trophy;
        case 'فنی': return LucideIcons.Cpu;
        case 'آموزش': return LucideIcons.GraduationCap;
        case 'عکس': return LucideIcons.Image;
        case 'بازی': return LucideIcons.Gamepad2;
        case 'مذهبی': return LucideIcons.Moon;
        case 'تجاری': return LucideIcons.Briefcase;
        case 'سلامت': return LucideIcons.Heart;
        case 'سفر': return LucideIcons.Compass;
        default: return LucideIcons.Tag;
    }
};

const getGenderText = (ev: EventDetailsResponse) => {
    // Default to mixed gender if not specified
    return 'بانوان و آقایان';
};

const getAgeRangeText = (ev: EventDetailsResponse) => {
    if (ev.minAge && ev.maxAge) {
        return `${toPersianDigits(ev.minAge)} تا ${toPersianDigits(ev.maxAge)} سال`;
    }
    if (ev.minAge) {
        return `بالای ${toPersianDigits(ev.minAge)} سال`;
    }
    if (ev.maxAge) {
        return `تا ${toPersianDigits(ev.maxAge)} سال`;
    }
    return 'بدون محدودیت سنی';
};

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
    registrationType: number
}

export interface Participant {
    id: number;
    fullname: string;
    role?: string;
    profileAddress?: string;
    registeredAt: string;
    phone: string
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
    const [isFullScreenImage, setIsFullScreenImage] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isEventQrModalOpen, setIsEventQrModalOpen] = useState(false);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [isFullScreenMap, setIsFullScreenMap] = useState(false);

    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shouldShowOnlineLink = (isOnline: boolean, registrationType: number, isRegistered: boolean) => {
        return isOnline && (registrationType === 1 || isRegistered === true);

        // if (registrationType === 1)
        //     return true;

        // if (isRegistered === true)
        //     return true;

        // return false;
    };

    useEffect(() => {
        onOverlayStateChange?.(isAddReviewOpen || isConfirmDrawerOpen || isCancelConfirmOpen);
        return () => {
            onOverlayStateChange?.(false);
        };
    }, [isAddReviewOpen, isConfirmDrawerOpen, isCancelConfirmOpen, onOverlayStateChange]);

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

                // const commentsData = await getEventComments(eventId);
                // setComments(commentsData.data);

                if (eventData.description.length > 100)
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

    const CategoryIcon = getCategoryIconComponent(event.categoryTitle);
    const genderText = getGenderText(event);
    const ageRangeText = getAgeRangeText(event);
    const avgRating = comments.length > 0
        ? (comments.reduce((sum, c) => sum + c.rate, 0) / comments.length).toFixed(1)
        : event.rating?.toFixed(1) || '۵.۰';

    return (
        <div className="relative flex-1 flex flex-col min-h-0 bg-white overflow-hidden w-full">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex-1 overflow-y-auto no-scrollbar pb-12"
                dir="rtl"
            >
                {/* Top Sticky/Float Header - AI Design */}
                <div className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={onBack}
                        className="w-9 h-9 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-800 pointer-events-auto border border-gray-100"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    <div className="flex items-center gap-2 pointer-events-auto">
                        {/* Event Specifications QR Code button - AI */}
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsEventQrModalOpen(true)}
                            className="w-9 h-9 bg-white/90 text-gray-800 border-gray-100 backdrop-blur shadow-md rounded-full flex items-center justify-center transition-all border hover:bg-white"
                            title="کد QR مشخصات رویداد"
                        >
                            <QrCode className="w-4.5 h-4.5 text-slate-800" />
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={handleShare}
                            className={`w-9 h-9 ${isSharing ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white/90 text-gray-800 border-gray-100'} backdrop-blur shadow-md rounded-full flex items-center justify-center transition-all border`}
                            title="اشتراک‌گذاری"
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
                            title="گزارش خطای رویداد"
                        >
                            <Flag className="w-4.5 h-4.5" />
                        </motion.button>
                    </div>
                </div>

                {/* Hero Image Header with Fullscreen trigger - AI */}
                <div
                    onClick={() => setIsFullScreenImage(true)}
                    className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer group"
                >
                    <img
                        src={process.env.File_BaseURL + event.coverAddress}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Fullscreen Expand indicator badge - AI */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white/90 hover:bg-black/70 px-3 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-1.5 shadow-lg border border-white/20 transition-all group-hover:scale-105">
                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                        <span>تصویر کامل</span>
                    </div>

                    {event.isFree && (
                        <div className="absolute bottom-4 right-6 bg-[#ED1C24] text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
                            رایگان
                        </div>
                    )}
                </div>

                {/* Main Details Body */}
                <div className="px-6 -mt-3 relative z-10 bg-white rounded-t-[24px] pt-5 space-y-4">
                    {/* Minimal Event Title & Header Bar - AI */}
                    <div className="space-y-2 text-right">
                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200/60 shadow-2xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-black">{avgRating}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    <span>۱,۴۲۰ بازدید</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>ثبت‌نام فعال</span>
                                </div>
                            </div>
                        </div> */}

                        <h1 className="text-base sm:text-lg font-black text-gray-900 leading-snug tracking-tight">
                            {event.title}
                        </h1>
                    </div>

                    {/* Compact Organizer Card - AI */}
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-3 rounded-2xl hover:border-slate-300 hover:bg-slate-100/60 transition-all cursor-pointer group shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={process.env.File_BaseURL + event.userProfile}
                                    alt={event.organizerName}
                                    className="w-9 h-9 rounded-full border-2 border-white shadow-xs object-cover group-hover:scale-105 transition-transform"
                                    referrerPolicy="no-referrer"
                                />
                                {/* <div className="absolute -bottom-0.5 -right-0.5 bg-slate-800 text-white p-0.5 rounded-full border border-white">
                                    <Check className="w-2 h-2 stroke-[3]" />
                                </div> */}
                            </div>
                            <div className="flex flex-col text-right">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-slate-900 group-hover:text-black transition-colors">
                                        {event.organizerName}
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                                    برگزارکننده رویداد
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-700 bg-white border border-slate-200/80 group-hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors shadow-3xs">
                            <span>پروفایل</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Date & Location Sections - AI */}
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                                    <Calendar className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col text-right min-w-0">
                                    <span className="text-[9.5px] font-bold text-slate-400">زمان و تاریخ برگزاری</span>
                                    <span className="text-xs font-black text-slate-900 mt-0.5 truncate">{toPersianDigits(event.eventTime)}</span>
                                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                                        ساعت {toPersianDigits(event.startTime || '۱۸:۰۰')} الی {toPersianDigits(event.endTime || '۲۰:۳۰')}
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <span className="bg-white border border-slate-200/80 text-slate-700 text-[9.5px] font-black px-2.5 py-1 rounded-xl shadow-2xs">
                                    {event.isOnline ? 'آنلاین' : 'حضوری'}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Formal Unified 2-Column Rectangular Feature Boxes Grid - AI */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Box 1: Category */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                <CategoryIcon className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">دسته‌بندی</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5" title={event.categoryTitle || 'عمومی'}>
                                    {event.categoryTitle || 'عمومی'}
                                </span>
                            </div>
                        </div>

                        {/* Box 2: Format */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                {event.isOnline ? <Video className="w-4 h-4 stroke-[2]" /> : <Building2 className="w-4 h-4 stroke-[2]" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">نوع برگزاری</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5">
                                    {event.isOnline ? 'آنلاین' : 'حضوری'}
                                </span>
                            </div>
                        </div>

                        {/* Box 3: Province & City */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                <MapPin className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">استان و شهر</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5" title={`${event.locationName} || ''}`}>
                                    {event.locationName || ''}
                                </span>
                            </div>
                        </div>

                        {/* Box 4: Capacity */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                <Users className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">ظرفیت رویداد</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5">
                                    {event.maxCapacity ? `${toPersianDigits(event.maxCapacity)} نفر` : 'نامحدود'}
                                </span>
                            </div>
                        </div>

                        {/* Box 5: Gender */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                <UserCheck className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">جنسیت مجاز</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5" title={genderText}>
                                    {genderText}
                                </span>
                            </div>
                        </div>

                        {/* Box 6: Age Range */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs hover:bg-slate-100/60 hover:border-slate-300 transition-all text-right min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
                                <Sparkles className="w-4 h-4 stroke-[2]" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400 leading-tight">بازه سنی</span>
                                <span className="text-[11px] font-black text-slate-900 leading-snug truncate mt-0.5" title={ageRangeText}>
                                    {ageRangeText}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-1.5 text-right">
                        <h2 className="text-sm font-black text-gray-900">توضیحات رویداد</h2>
                        <div className="relative">
                            <p
                                className={`text-gray-500 text-xs font-bold leading-relaxed text-justify transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-3' : ''
                                    }`}
                            >
                                <div dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            </p>
                            {event?.description?.length > 100 && (
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
                            )}
                        </div>
                    </div>


                    <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                        {shouldShowOnlineLink(event.isOnline, event.registrationType, event.isRegistered) ? (
                            // حالت نمایش لینک دورهمی
                            <>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                                        <Link className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="flex flex-col text-right min-w-0">
                                        <span className="text-[9.5px] font-bold text-slate-400">لینک دورهمی</span>
                                        <span className="text-xs font-black text-slate-900 mt-0.5 direction-ltr text-left">
                                            {event.address}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopyLink(event.address)}
                                    className={`shrink-0 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-all duration-300 flex items-center gap-1.5 ${isCopied
                                        ? 'bg-emerald-600 hover:bg-emerald-700 scale-105'
                                        : 'bg-slate-900 hover:bg-black'
                                        }`}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-white" />
                                            <span>لینک کپی شد!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>کپی لینک</span>
                                        </>
                                    )}
                                </button>
                            </>
                        ) : event.isOnline ? (
                            // حالت آنلاین اما لینک قفل است (نیاز به ثبت‌نام)
                            <>
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-9 h-9 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                                        <LucideIcons.Lock className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="flex flex-col text-right min-w-0">
                                        <span className="text-[9.5px] font-bold text-slate-400">لینک دورهمی</span>
                                        <span className="text-xs font-medium text-slate-600 mt-0.5">
                                            بعد از ثبت‌نام لینک برای شما نمایش داده می‌شود
                                        </span>
                                    </div>
                                </div>

                                {/* یک جای خالی یا المان غیرفعال برای حفظ تعادل بصری */}
                                <div className="w-[72px] shrink-0"></div>
                            </>
                        ) : (
                            // حالت حضوری (آفلاین)
                            <>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                                        <MapPin className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="flex flex-col text-right min-w-0">
                                        <span className="text-[9.5px] font-bold text-slate-400">مکان و آدرس رویداد</span>
                                        <span className="text-xs font-black text-slate-900 mt-0.5">{event.address}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsNavigationDrawerOpen(true)}
                                    className="shrink-0 bg-slate-900 hover:bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>مسیریابی</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-white border border-slate-200/80 text-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-3xs">
                                <MapPin className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex flex-col text-right min-w-0">
                                <span className="text-[9.5px] font-bold text-slate-400">مکان و آدرس رویداد</span>
                                <span className="text-xs font-black text-slate-900 mt-0.5">{event.address}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsNavigationDrawerOpen(true)}
                            className="shrink-0 bg-slate-900 hover:bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-emerald-400" />
                            <span>مسیریابی</span>
                        </button>
                    </div> */}

                    {!event.isOnline && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                {/* <h3 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                                <LucideIcons.Map className="w-4 h-4 text-[#ED1C24]" />
                                <span>موقعیت روی نقشه تعاملی</span>
                            </h3> */}
                                <button
                                    onClick={() => setIsFullScreenMap(true)}
                                    className="text-[10px] font-black text-[#007AFF] hover:underline flex items-center gap-1"
                                >
                                    {/* <LucideIcons.Maximize2 className="w-3 h-3" />
                                <span>تمام صفحه</span> */}
                                </button>
                            </div>

                            <LeafletEventMap
                                lat={event.lat}
                                lng={event.lng}
                                title={event.title}
                                locationName={event.location}
                                onExpand={() => setIsFullScreenMap(true)}
                            />
                        </div>
                    )}

                    {/* Participants - AI Horizontal Layout */}
                    {/* <div
                        onClick={() => setIsParticipantsDrawerOpen(true)}
                        className="bg-gray-50/40 border border-gray-100 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5 space-x-reverse">
                                {event.participants && event.participants.slice(0, 4).map((person) => (
                                    <img
                                        key={person.id}
                                        src={process.env.File_BaseURL! + person.profileAddress}
                                        alt={person.fullname}
                                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                                    />
                                ))}
                                {event.participants && event.participants.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-gray-600">
                                        +{event.participants.length - 4}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-black text-gray-800">شرکت‌کنندگان</span>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {event.participants?.length || 0} نفر ثبت‌نام کرده‌اند
                                </span>
                            </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </div> */}

                    {/* Smart Member Analysis Section */}
                    {/* <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
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
                    </div> */}

                    {/* Reviews Section */}
                    {/* <div className="border-t border-gray-100 pt-4 space-y-3 text-right">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-gray-900">نظرات شرکت‌کنندگان</h3>
                                <div className="flex items-center gap-1 bg-yellow-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black border border-yellow-100/50">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{avgRating}</span>
                                    <span className="text-gray-400 font-bold">({comments.length})</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAddReviewOpen(true)}
                                className="text-[10px] font-black text-[#007AFF] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
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
                    </div> */}

                    {/* Comment Section */}
                    <div className="pb-10">
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

            {/* Modern Fixed Bottom Action Panel - AI Design */}
            <div className={`fixed bottom-[102px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[440px] z-[100] bg-white/95 backdrop-blur-md border border-gray-100 px-5 py-3 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between transition-opacity duration-300 ${isAddReviewOpen || isConfirmDrawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                {event.registrationType === 1 ? (
                    // حالت حضور آزاد بدون ثبت‌نام
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-black text-emerald-600">حضور آزاد</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mr-2">بدون نیاز به ثبت‌نام</span>
                    </div>
                ) : (
                    // حالت‌های دیگر (نیاز به ثبت‌نام)
                    <>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">هزینه نهایی شرکت</span>
                            <span className={`text-sm font-black mt-0.5 ${event.registrationType === 3 ? 'text-emerald-500' : 'text-gray-900'}`}>
                                {event.registrationType !== 3 ? 'رایگان' : event.price}
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
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-[0_4px_16px_rgba(237,28,36,0.25)]'
                                }`}
                        >
                            <span>
                                {event.isRegistered
                                    ? 'ثبت‌نام شده‌اید'
                                    : !event.isCapacity
                                        ? 'ظرفیت تکمیل'
                                        : 'شرکت در دورهمی'
                                }
                            </span>
                            {!event.isRegistered && event.isCapacity ? (
                                <ArrowRight className="w-4 h-4" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                        </motion.button>
                    </>
                )}
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

            {isFullScreenMap && (
                <FullScreenMapModal
                    isOpen={isFullScreenMap}
                    onClose={() => setIsFullScreenMap(false)}
                    lat={event.lat}
                    lng={event.lng}
                    title={event.title}
                    locationName={event.location}
                    onOpenNavigation={() => {
                        setIsFullScreenMap(false);
                        setIsNavigationDrawerOpen(true);
                    }}
                />
            )}

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

            {/* Cancel Confirmation Drawer - AI */}
            <AnimatePresence>
                {isCancelConfirmOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCancelConfirmOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[180] backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ y: '100%', x: '-50%' }}
                            animate={{ y: 0, x: '-50%' }}
                            exit={{ y: '100%', x: '-50%' }}
                            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[190] rounded-t-[32px] p-6 shadow-2xl flex flex-col gap-4 dir-rtl"
                            dir="rtl"
                        >
                            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto" />
                            <div className="text-center space-y-2 mt-1">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-100">
                                    <UserMinus className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-black text-gray-900">انصراف از شرکت در رویداد</h3>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed px-4">
                                    شما در رویداد «{event.title}» ثبت‌نام شده‌اید. آیا از انصراف خود اطمینان دارید؟
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => setIsCancelConfirmOpen(false)}
                                    className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-xs transition-colors"
                                >
                                    بازگشت
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle unregister logic here
                                        setIsCancelConfirmOpen(false);
                                    }}
                                    className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs shadow-md shadow-rose-500/20 transition-all"
                                >
                                    تایید انصراف
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Ticket Pass Modal - AI */}
            <AnimatePresence>
                {isTicketModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTicketModalOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                            exit={{ scale: 0.92, opacity: 0, x: '-50%', y: '-50%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                            className="fixed top-1/2 left-1/2 w-[calc(100%-40px)] max-w-[380px] bg-slate-900 text-white z-[160] rounded-[28px] shadow-[0_24px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col p-5 border border-slate-700/60"
                            dir="rtl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                                        <Ticket className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs font-black text-white">کارت ورود دیجیتال</span>
                                        <span className="text-[9px] font-bold text-slate-400">تأییدیه حضور در رویداد</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsTicketModalOpen(false)}
                                    className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <LucideIcons.X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* White Ticket Core Body */}
                            <div className="relative my-3.5 bg-white text-slate-900 rounded-2xl p-4 shadow-lg overflow-hidden text-center">
                                <div className="absolute top-1/2 -left-3 w-5 h-5 rounded-full bg-slate-900" />
                                <div className="absolute top-1/2 -right-3 w-5 h-5 rounded-full bg-slate-900" />

                                <span className="inline-block bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md mb-1">
                                    {event.categoryTitle || 'رویداد رسمی'}
                                </span>
                                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2 px-2">
                                    {event.title}
                                </h3>

                                <div className="my-3 flex flex-col items-center justify-center">
                                    <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner relative group">
                                        <LucideIcons.QrCode className="w-[135px] h-[135px] text-slate-900" />
                                        <div className="absolute inset-0 border border-emerald-500/30 rounded-2xl pointer-events-none" />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                                        <ScanLine className="w-3 h-3 text-emerald-600" />
                                        <span>جهت پذیرش در ورودی اسکن شود</span>
                                    </span>
                                </div>

                                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between">
                                    {/* <div className="flex flex-col text-right">
                                        <span className="text-[9px] font-bold text-slate-400">کد اختصاصی پذیرش</span>
                                        <span className="text-xs font-black text-slate-900 font-mono tracking-wider">
                                            {rawParticipationCode}
                                        </span>
                                    </div> */}
                                    <button className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1">
                                        <Copy className="w-3 h-3" />
                                        <span>کپی کد</span>
                                    </button>
                                </div>

                                <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-200 grid grid-cols-2 gap-2 text-right">
                                    <div>
                                        <span className="text-[9px] font-bold text-slate-400 block">زمان</span>
                                        <span className="text-[10px] font-black text-slate-800">{toPersianDigits(event.eventTime)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-slate-400 block">نوع برگزاری</span>
                                        <span className="text-[10px] font-black text-slate-800">{event.isOnline ? 'آنلاین' : 'حضوری'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700">
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>اشتراک بلیت</span>
                                </button>
                                <button
                                    onClick={() => setIsTicketModalOpen(false)}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>متوجه شدم</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Event QR Modal - AI */}
            <AnimatePresence>
                {isEventQrModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEventQrModalOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[180] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                            className="fixed top-1/2 left-1/2 w-[calc(100%-40px)] max-w-[360px] bg-slate-900 border border-slate-700/80 text-white z-[190] rounded-[28px] p-5 shadow-2xl flex flex-col dir-rtl"
                            dir="rtl"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                                        <QrCode className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs font-black text-white">QR کد مشخصات رویداد</span>
                                        <span className="text-[9px] font-bold text-slate-400">جهت اشتراک‌گذاری و دسترسی سریع</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEventQrModalOpen(false)}
                                    className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <LucideIcons.X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="my-4 bg-white rounded-2xl p-4 text-center text-slate-900 flex flex-col items-center shadow-lg">
                                <span className="inline-block bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md mb-2">
                                    {event.categoryTitle || 'رویداد رسمی'}
                                </span>
                                <h3 className="text-xs font-black text-slate-900 mb-3 px-2 line-clamp-2">
                                    {event.title}
                                </h3>
                                <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner relative group">
                                    <LucideIcons.QrCode className="w-[145px] h-[145px] text-slate-900" />
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 mt-2.5">
                                    جهت مشاهده جزییات و اسکن سریع رویداد
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button className="py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                                    <Link className="w-3.5 h-3.5" />
                                    <span>کپی لینک</span>
                                </button>
                                <button
                                    onClick={() => setIsEventQrModalOpen(false)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-colors shadow-xs"
                                >
                                    <span>بستن</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Modal - AI */}
            <AnimatePresence>
                {isFullScreenImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4"
                        dir="rtl"
                    >
                        <div className="flex items-center justify-between text-white z-10 pt-2 px-2">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-black text-white/90 leading-tight">{event.title}</span>
                            </div>
                            <button
                                onClick={() => setIsFullScreenImage(false)}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white backdrop-blur-md transition-colors"
                            >
                                <LucideIcons.X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center my-auto p-2 overflow-hidden">
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                src={process.env.File_BaseURL + event.coverAddress}
                                alt={event.title}
                                className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EventDetailsPage;