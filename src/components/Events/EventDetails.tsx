import { useState, useEffect, useRef } from "react";
import { AppEvent } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { Check, Calendar, ArrowRight, ChevronDown, MapPin, Share2, MoreVertical, Star } from 'lucide-react';
import EmptyState from "./EmptyState";
import EventInsights from "./EventInsights";
import CommentSection from "./CommentSection";
import ParticipantsDrawer from "./ParticipantsDrawer";
import NavigationDrawer from "../Shared/NavigationDrawer";
import ReportDrawer from "./ReportDrawer";
import ConfirmationDrawer from "./ConfirmationDrawer";
import { getEventById, getEventParticipants, registerForEvent } from "../../services/events";
import { getEventComments, submitComment } from "../../services/comments";
import authService, { User } from '../../services/Auth/Auth';

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
    userProfile: string
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

const EVENTS: AppEvent[] = [
    {
        id: 1,
        title: 'کارگاه طراحی تجربه کاربری',
        categoryId: 1,
        date: 'دوشنبه، ۲۱ اردیبهشت - ۱۷:۰۰',
        location: 'تهران، خیابان ولیعصر',
        organizer: 'آکادمی دیزاین',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 35.7152,
        lng: 51.4043,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false,
        description: 'در این کارگاه با اصول اولیه طراحی تجربه کاربری و ابزارهای پرکاربرد این حوزه آشنا خواهید شد.',
        city: 'تهران',
        provinceId: 1,
        startTime: '۱۷:۰۰',
        minAge: '۱۸',
        maxAge: '۴۵',
        maxCapacity: '۳۰',
        isOnline: false
    },
    {
        id: 11,
        title: 'سمینار هوش مصنوعی در پزشکی',
        categoryId: 2,
        date: 'شنبه، ۵ خرداد - ۱۰:۰۰',
        location: 'تهران، دانشگاه علوم پزشکی',
        organizer: 'انجمن علمی هوش مصنوعی',
        image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۲۵۰,۰۰۰ تومان',
        isConfirmed: false,
        status: 'pending',
        isDisabled: true,
        description: 'بررسی آخرین دستاوردهای هوش مصنوعی در تشخیص و درمان بیماری‌ها با حضور اساتید برجسته.',
        city: 'تهران',
        provinceId: 1,
        startTime: '۱۰:۰۰',
        minAge: '۲۰',
        maxAge: '۶۰',
        maxCapacity: '۱۵۰',
        isOnline: false
    },
    {
        id: 12,
        title: 'کارگاه عکاسی غیرحرفه‌ای',
        categoryId: 3,
        date: 'یکشنبه، ۶ خرداد - ۱۶:۰۰',
        location: 'اصفهان، بوستان ملت',
        organizer: 'کانون عکاسان',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        isConfirmed: false,
        status: 'rejected',
        rejectionReason: 'کیفیت تصاویر بارگذاری شده مناسب نیست و توضیحات رویداد ناقص است.',
        isDisabled: true,
        description: 'آموزش عکاسی با موبایل برای علاقمندان به ثبت لحظات روزمره.',
        city: 'اصفهان',
        provinceId: 3,
        startTime: '۱۶:۰۰',
        minAge: '۱۲',
        maxAge: '۹۹',
        maxCapacity: '۲۰',
        isOnline: false
    },
    {
        id: 2,
        title: 'نشست استارتاپ‌های نوپا',
        categoryId: 4,
        date: 'سه‌شنبه، ۲۲ اردیبهشت - ۱۸:۳۰',
        location: 'اصفهان، شهرک علمی تحقیقاتی',
        organizer: 'شتاب‌دهنده هاب',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۱۵۰,۰۰۰ تومان',
        lat: 32.7214,
        lng: 51.5222,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 3,
        title: 'شب نشینی مافیا',
        categoryId: 5,
        date: 'چهارشنبه، ۲۳ اردیبهشت - ۲۰:۰۰',
        location: 'شیراز، کافه هنر',
        organizer: 'گروه بازی‌های دورهمی',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 29.6264,
        lng: 52.5295,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 4,
        title: 'نمایشگاه بین‌المللی کتاب',
        categoryId: 6,
        date: 'پنج‌شنبه، ۲۴ اردیبهشت - ۱۰:۰۰',
        location: 'تهران، مصلی امام خمینی',
        organizer: 'وزارت فرهنگ',
        image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 35.7339,
        lng: 51.4243,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 5,
        title: 'کنسرت علی یاسینی',
        categoryId: 7,
        date: 'جمعه، ۲۵ اردیبهشت - ۲۱:۰۰',
        location: 'تهران، برج میلاد',
        organizer: 'لیما کنسرت',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۴۵۰,۰۰۰ تومان',
        lat: 35.7448,
        lng: 51.3753,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 6,
        title: 'تور دوچرخه‌سواری کوهستان',
        categoryId: 8,
        date: 'شنبه، ۲۶ اردیبهشت - ۰۷:۰۰',
        location: 'مازندران، نمک‌آبرود',
        organizer: 'باشگاه دوچرخه‌سواران',
        image: 'https://images.unsplash.com/photo-1544191714-3d9adabddf65?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 36.6713,
        lng: 51.3061,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 7,
        title: 'کارگاه آموزش پایتون',
        categoryId: 9,
        date: 'یکشنبه، ۲۷ اردیبهشت - ۱۶:۰۰',
        location: 'تبریز، دانشگاه سراسری',
        organizer: 'انجمن علمی کامپیوتر',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۲۰۰,۰۰۰ تومان',
        lat: 38.0667,
        lng: 46.3333,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 8,
        title: 'همایش بازاریابی دیجیتال',
        categoryId: 10,
        date: 'دوشنبه، ۲۸ اردیبهشت - ۰۹:۰۰',
        location: 'تهران، مرکز همایش‌های صدا و سیما',
        organizer: 'دی‌ام بورد',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        isFree: false,
        price: '۹۸۰,۰۰۰ تومان',
        lat: 35.7767,
        lng: 51.4117,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 9,
        title: 'جشنواره غذای خیابانی',
        categoryId: 11,
        date: 'سه‌شنبه، ۲۹ اردیبهشت - ۱۸:۰۰',
        location: 'مشهد، بوستان ملت',
        organizer: 'شهرداری مشهد',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 36.3150,
        lng: 59.5390,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    },
    {
        id: 10,
        title: 'شب شعر معاصر',
        categoryId: 12,
        date: 'چهارشنبه، ۳۰ اردیبهشت - ۱۹:۳۰',
        location: 'شیراز، حافظیه',
        organizer: 'انجمن ادبی حافظ',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
        isFree: true,
        price: 'رایگان',
        lat: 29.6258,
        lng: 52.5586,
        isConfirmed: true,
        status: 'approved',
        isDisabled: false
    }
];

function EventDetailsPage({
    eventId,
    events = [],
    onBack,
    isLoggedIn,
    onOpenAuth,
    registeredEventIds = [],
    onRegister: onRegisterParent,
    onUnregister
}: {
    eventId: number;
    events?: AppEvent[];
    onBack: () => void;
    isLoggedIn: boolean;
    onOpenAuth: () => void;
    registeredEventIds?: string[];
    onRegister?: (id: string) => void;
    onUnregister?: (id: string) => void;
    key?: React.Key
}) {
    // const event = events.find(e => e.id === eventId) || events[0] || EVENTS[0];
    const [event, setEvent] = useState<EventDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
    const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
    const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
    const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
    const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState(false);
    const [activeParticipantId, setActiveParticipantId] = useState<number | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const isRegistered = registeredEventIds.includes(eventId.toString());
    const hasFetched = useRef(false);
    const [isCommentSuccess, setIsCommentSuccess] = useState(false);

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
            // Fallback: Copy to clipboard
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

                const participantsData = await getEventParticipants(eventId);
                setParticipants(participantsData.data);

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
        // if (!isLoggedIn) {
        //     onOpenAuth();
        //     return;
        // }

        try {
            const result = await submitComment(eventId, rating, text);
            setIsCommentSuccess(true)
            setTimeout(() => setIsCommentSuccess(false), 7000);

            if (result.success && result.text) {
                // var user = authService.getUser();
                const newComment: Comment = {
                    id: 5,
                    userId: 5,
                    fullname: "علی قلی پور",
                    // userName: user?.username,
                    rate: result.rate,
                    text: result.text,
                    createdDateTime: Date.now.toString(),
                    userProfileAddress: "",
                    isActive: false
                    // userProfileAddress: user?.profileAddress
                };
                setComments(prev => [newComment!, ...prev]);
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    // تابع ثبت‌نام
    const handleRegister = async () => {
        // if (!isLoggedIn) {
        //     onOpenAuth();
        //     return;
        // }
        setIsRegistering(true);
        try {
            const result = await registerForEvent(eventId);
            if (result.success) {
                setIsRegistrationSuccess(true);
                setTimeout(() => setIsRegistrationSuccess(false), 3000);

                const updatedEvent = await getEventById(eventId);
                setEvent(updatedEvent);

                // const updatedParticipants = await getEventParticipants(eventId, 1, 10);

                // var currentUser = authService.getUser();
                // if (currentUser) {
                //     const newParticipant: Participant = {
                //         id: currentUser.id,
                //         fullname: currentUser.username || currentUser.username,
                //         profileAddress: currentUser.profileAddress,
                //         joinedAt: new Date().toISOString()
                //     };
                //     setParticipants(prev => [newParticipant, ...prev]);
                // }

                // setParticipants(updatedParticipants.participants);
                onRegisterParent?.(eventId.toString());
            }
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setIsRegistering(false);
            setIsConfirmDrawerOpen(false);
        }
    };

    //#region 
    // const participants = [
    //     { id: 1, name: 'علی اکبری', role: 'طراح محصول', avatar: 'https://i.pravatar.cc/100?u=1' },
    //     { id: 2, name: 'نیلوفر کریمی', role: 'برنامه‌نویس', avatar: 'https://i.pravatar.cc/100?u=2' },
    //     { id: 3, name: 'رضا امینی', role: 'مدیر پروژه', avatar: 'https://i.pravatar.cc/100?u=3' },
    //     { id: 4, name: 'مریم نوری', role: 'تحلیل‌گر', avatar: 'https://i.pravatar.cc/100?u=4' },
    //     { id: 5, name: 'حسین محسنی', role: 'دیزاینر', avatar: 'https://i.pravatar.cc/100?u=5' },
    //     { id: 6, name: 'سارا رضایی', role: 'استراتژیست', avatar: 'https://i.pravatar.cc/100?u=6' },
    //     { id: 7, name: 'کامران بختیاری', role: 'توسعه‌دهنده', avatar: 'https://i.pravatar.cc/100?u=7' },
    //     { id: 8, name: 'لادن طباطبایی', role: 'طراح UI', avatar: 'https://i.pravatar.cc/100?u=8' },
    //     { id: 9, name: 'پیمان معادی', role: 'منتور', avatar: 'https://i.pravatar.cc/100?u=9' },
    //     { id: 10, name: 'مهتاب کرامتی', role: 'سخنران', avatar: 'https://i.pravatar.cc/100?u=10' },
    // ];

    // const [comments, setComments] = useState([
    //     {
    //         id: 1,
    //         name: 'سارا احمدی',
    //         date: '۲ روز پیش',
    //         text: 'واقعا کارگاه عالی بود، خیلی مطالب مفیدی یاد گرفتم. خسته نباشید به تیم برگزار کننده.',
    //         avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    //         rating: 5
    //     },
    //     {
    //         id: 2,
    //         name: 'محمد رضایی',
    //         date: '۵ روز پیش',
    //         text: 'محیط برگزاری خیلی خوب بود ولی ای کاش زمان بیشتری برای پرسش و پاسخ اختصاص داده میشد.',
    //         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    //         rating: 4
    //     }
    // ]);

    // const handleAddComment = () => {
    //     if (!commentText.trim()) return;
    //     const newComment = {
    //         id: Date.now(),
    //         name: 'کاربر مهمان',
    //         date: 'هم‌اکنون',
    //         text: commentText,
    //         avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    //         rating: 5
    //     };
    //     setComments([newComment, ...comments]);
    //     setCommentText('');
    // };
    //#endregion

    // نمایش لودینگ
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#ED1C24]" />
            </div>
        );
    }

    // نمایش خطا
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
        <div className="relative flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 overflow-y-auto no-scrollbar pb-10"
                dir="rtl">
                {/* Top Header */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 px-6 py-4 flex items-center justify-between">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        className="w-10 h-10 bg-white/80 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-gray-700"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </motion.button>
                    <div className="flex items-center gap-2">
                        {/* Organizer Info Group */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-sm rounded-full pl-1 pr-3 py-1 border border-white/50"
                        >
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-gray-900 leading-none">{event.organizerName}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                                    <span className="text-[9px] font-black text-gray-500">۴.۹</span>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full mx-0.5" />
                                    <span className="text-[9px] font-bold text-gray-400">۱۵۰+ امتیاز</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img
                                    src={"http://localhost:5066" + event.userProfile}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleShare}
                            className={`w-10 h-10 ${isSharing ? 'bg-green-50 text-green-600' : 'bg-white/80'} backdrop-blur shadow-sm rounded-full flex items-center justify-center transition-colors border border-white/50`}
                        >
                            {isSharing ? <div className="text-[10px] font-black">کپی شد!</div> : <Share2 className="w-5 h-5" />}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsReportDrawerOpen(true)}
                            className="w-10 h-10 bg-white/80 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-gray-700 border border-white/50"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative w-full aspect-[3/2] rounded-b-2xl overflow-hidden shadow-lg mb-6">
                    <img
                        src={"http://localhost:5066" + event.coverAddress}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                    {/* Stronger bottom-up shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {event.isFree && (
                        <div className="absolute bottom-6 right-6 bg-[#ED1C24] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-10">
                            رایگان
                        </div>
                    )}
                </div>

                <div className="px-6 space-y-6">
                    {/* Title & Organizer */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-gray-900 leading-tight">{event.title}</h1>
                        <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-xl border border-gray-100 px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <img
                                        src={"http://localhost:5066" + event.userProfile}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-900">{event.organizerName}</span>
                                    <section className="flex items-center gap-1">
                                        <Check className="w-3 h-3 text-blue-500" />
                                        <span className="text-[10px] font-bold text-gray-400">برگزار کننده تایید شده</span>
                                    </section>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-[10px] font-black text-gray-700">۴.۹</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">زمان برگزاری</span>
                                <span className="text-sm font-black text-gray-800">{event.eventTime}</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">مکان رویداد - {event.locationName}</span>
                                <span className="text-sm font-black text-gray-800">{event.address}</span>
                            </div>
                        </div>

                        {/* Map Preview Box */}
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsNavigationDrawerOpen(true)}
                            className="relative w-full h-32 rounded-2xl overflow-hidden shadow-inner border border-gray-100 cursor-pointer group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#ED1C24]">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-gray-700 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                                    مشاهده روی نقشه و مسیریابی
                                </span>
                            </div>
                            {/* Animated Pin Pulse */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <motion.div
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-12 h-12 bg-red-400/30 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Participants */}
                    <div
                        className="space-y-4 cursor-pointer group/ps"
                        onClick={() => participants.length > 0 ? setIsParticipantsDrawerOpen(true) : setIsParticipantsDrawerOpen(false)}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-gray-900">افراد شرکت کننده</h2>
                            {participants.length > 0 && (
                                <div className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg opacity-0 group-hover/ps:opacity-100 transition-opacity">
                                    مشاهده همه
                                </div>
                            )}
                        </div>
                        {participants.length > 0 ? (
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-3 space-x-reverse items-center">
                                    {participants.slice(0, 5).map((person) => (
                                        <div
                                            key={person.id}
                                            className="relative group"
                                            // onMouseEnter={() => setActiveParticipantId(person.id)}
                                            // onMouseLeave={() => setActiveParticipantId(null)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveParticipantId(activeParticipantId === person.id ? null : person.id);
                                            }}
                                        >
                                            <img
                                                src={"http://localhost:5066/" + person.profileAddress}
                                                alt={person.fullname}
                                                className={`w-10 h-10 rounded-full border-2 border-white shadow-sm transition-transform ${activeParticipantId === person.id ? 'scale-110 z-10' : 'z-0'}`}
                                            />
                                            <AnimatePresence>
                                                {activeParticipantId === person.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                                                        animate={{ opacity: 1, y: -45, x: '-50%' }}
                                                        exit={{ opacity: 0, y: 10, x: '-50%' }}
                                                        className="absolute bottom-full left-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-[10px] whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10"
                                                    >
                                                        <div className="font-black mb-0.5">{person.fullname}</div>
                                                        <div className="opacity-70">{person.role}</div>
                                                        {/* Little arrow */}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/90" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                    {participants.length > 5 && (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-gray-500 z-0">
                                            +{participants.length - 5}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-400 mr-2">{participants.length} نفر شرکت کرده‌اند</span>
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold text-gray-400 bg-gray-50 p-4 rounded-2xl border border-gray-50">اولین کسی باشید که در این رویداد شرکت می‌کند!</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-gray-900">توضیحات رویداد</h2>
                        <div className="relative">
                            <p className={`text-gray-600 text-sm font-bold leading-loose text-justify transition-all duration-500 overflow-hidden ${!isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                                {event.description}
                            </p>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-2 text-[#ED1C24] text-xs font-black flex items-center gap-1 hover:opacity-80 transition-opacity">
                                <span>{isDescriptionExpanded ? 'بستن' : 'مشاهده بیشتر'}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Event Insights (Premium Section) */}
                    <EventInsights
                        isLoggedIn={isLoggedIn}
                        onOpenAuth={onOpenAuth} />

                    {/* Join Event Section (Moved out of Insights) */}
                    <div className="mt-4 pt-2 border-t border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">هزینه نهایی</span>
                                <span className={`text-sm font-black ${event.isFree ? 'text-emerald-500' : 'text-gray-900'}`}>
                                    {event.isFree ? 'رایگان' : event.price}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500">
                                <Check className="w-4 h-4" />
                                <span className="text-[10px] font-black">ظرفیت موجود</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => isRegistered ? null : setIsConfirmDrawerOpen(true)}
                            disabled={isRegistered}
                            className={`w-full h-14 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isRegistered
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none'
                                : 'bg-gradient-to-r from-[#ED1C24] to-[#c4151b] text-white shadow-[#ED1C24]/20 shadow-lg'
                                }`}>
                            <span>{isRegistered ? 'قبلاً ثبت‌نام کرده‌اید' : 'شرکت در دورهمی'}</span>
                            {!isRegistered && <ArrowRight className="w-5 h-5 rotate-180" />}
                            {isRegistered && <Check className="w-5 h-5" />}
                        </motion.button>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-6 pt-4 pb-10">
                        <h2 className="text-lg font-black text-gray-900">آخرین نظرات</h2>

                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3 
                                    ${!comment.isActive ? "border-amber-100 bg-amber-50/30 opacity-70 border-red-200" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={"http://localhost:5066/" + comment.userProfileAddress} alt="" className="w-10 h-10 rounded-full" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-800">{comment.fullname}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">{comment.createdDateTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < comment.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-gray-600 leading-relaxed">
                                            {comment.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="هنوز نظری ثبت نشده است" />
                        )}

                        {/* Rating Section */}
                        <div className="mt-12">
                            <CommentSection
                                onSubmit={handleSubmitComment}/>
                        </div>
                    </div>
                </div>

                <ReportDrawer
                    isOpen={isReportDrawerOpen}
                    onClose={() => setIsReportDrawerOpen(false)} />

                <ConfirmationDrawer
                    isOpen={isConfirmDrawerOpen}
                    onClose={() => setIsConfirmDrawerOpen(false)}
                    event={event}
                    onConfirm={handleRegister} />

                <AnimatePresence>
                    {isRegistrationSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 50, x: "-50%" }}
                            className="fixed bottom-24 left-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 font-black flex items-center gap-3 whitespace-nowrap">
                            <Check className="w-5 h-5" />
                            <span>ثبت‌نام شما با موفقیت انجام شد</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isCommentSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 50, x: "-50%" }}
                            className="fixed bottom-24 left-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 font-black flex items-center gap-3 whitespace-nowrap">
                            <Check className="w-5 h-5" />
                            <span>با تشکراز ثبت نظر. بعد از تایید نمایش داده خواهد شد</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ParticipantsDrawer
                    isOpen={isParticipantsDrawerOpen}
                    onClose={() => setIsParticipantsDrawerOpen(false)}
                    participants={participants} />

                <NavigationDrawer
                    isOpen={isNavigationDrawerOpen}
                    onClose={() => setIsNavigationDrawerOpen(false)}
                    lat={event.lat}
                    lng={event.lng}
                    locationName={event.location} />
            </motion.div>

            {/* Cost Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
                <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
                    <div className="bg-gray-50 h-12 rounded-2xl flex items-center justify-between px-6 border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400">هزینه شرکت در رویداد:</span>
                        <span className={`text-sm font-black ${event.isFree ? 'text-emerald-500' : 'text-gray-900'}`}>
                            {event.isFree ? 'رایگان' : event.price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailsPage;