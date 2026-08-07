import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppEvent, AppUser } from '../../types';

export interface EventShortMemory {
    id: string;
    type: 'video' | 'gallery'; // Video reel or photo album gallery
    title: string;
    eventTitle: string;
    thumbnail: string;
    images?: string[];         // Additional photos for gallery albums
    videoUrl?: string;
    likesCount: number;
    viewsCount: string;
    duration?: string;        // e.g. "0:35"
    photoCount?: number;      // e.g. 5 photos
    date: string;
    commentsCount: number;
    description?: string;
}

export interface OrganizerData {
    id: string;
    name: string;             // Brand/Company Name
    logo: string;             // Company Logo
    founderName: string;      // Founder/Organizer Individual Name
    founderAvatar: string;    // Founder Photo
    founderRole: string;      // Role e.g. "مدیر ارشد و بنیان‌گذار"
    isVerified: boolean;
    about: string;            // Bio / Description
    establishedYear: string;  // e.g. "۱۳۹۸"
    location: string;
    totalEventsCount: number;
    totalAttendeesCount: string;
    rating: number;
    ratingCount: number;
    followerCount: string;
    isFollowing?: boolean;
    website?: string;
    phone?: string;
    email?: string;
    instagram?: string;
    tags: string[];
    shorts: EventShortMemory[];
}

interface OrganizerProfilePageProps {
    onBack: () => void;
    organizer?: OrganizerData;
    events?: AppEvent[];
    user?: AppUser | null;
    onSelectEvent?: (eventId: string) => void;
    onOpenSupportTickets?: () => void;
    onDrawerStateChange?: (isOpen: boolean) => void;
}

// Default rich mock data for the Organizer Profile
export const DEFAULT_ORGANIZER_DATA: OrganizerData = {
    id: 'org-1',
    name: 'خانه و کانون نوآوری برنا',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    founderName: 'مهندس علی صادقی',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    founderRole: 'بنیان‌گذار و دبیر کل رویدادها',
    isVerified: true,
    about: 'کانون نوآوری و رویدادهای برنا یکی از پیشگام‌ترین مجموعه‌های برگزاری کارگاه‌های تخصصی، همایش‌های تکنولوژی، دورهمی‌های شبکه‌سازی و تورهای فرهنگی در ایران است. ما از سال ۱۳۹۸ با هدف ارتقای سطح دانش و ایجاد ارتباطات مؤثر میان متخصصان، بیش از ۴۸ رویداد موفق برگزار کرده‌ایم.',
    establishedYear: '۱۳۹۸',
    location: 'تهران، خیابان آزادی، مرکز نوآوری شریف',
    totalEventsCount: 48,
    totalAttendeesCount: '۸,۵۰۰+',
    rating: 4.9,
    ratingCount: 320,
    followerCount: '۱۲.۴k',
    isFollowing: false,
    website: 'www.bornaevents.ir',
    phone: '۰۲۱-۶۶۱۲۴۵۸۰',
    email: 'info@bornaevents.ir',
    instagram: 'borna_events',
    tags: ['تکنولوژی', 'طراحی محصول', 'کارگاه عملی', 'شبکه‌سازی', 'طبیعت‌گردی'],
    shorts: [
        {
            id: 'short-1',
            type: 'video',
            title: 'لحظه اهدای جوایز بوت‌کمپ پاییزی 🏆',
            eventTitle: 'بوت‌کمپ هوش مصنوعی و کدنویسی',
            thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
            likesCount: 1420,
            viewsCount: '۱۸.۴k',
            duration: '0:35',
            date: '۱۴۰۲/۰۸/۲۰',
            commentsCount: 84,
            description: 'افتتاحیه عالی و اهدای تندیس یادبود به تیم‌های برتر کارگاه عملی پاییزی'
        },
        {
            id: 'short-2',
            type: 'gallery',
            title: 'آلبوم عکس‌های شبکه‌سازی و گپ‌وگفت 📸',
            eventTitle: 'همایش سراسری معماران نرم‌افزار',
            thumbnail: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600',
            images: [
                'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
            ],
            photoCount: 5,
            likesCount: 980,
            viewsCount: '۱۲.۱k',
            date: '۱۴۰۲/۰۷/۱۵',
            commentsCount: 42,
            description: 'گزارش تصویری کامل از بخش استراحت، پذیرایی و گفتگوهای دونفره شرکت‌کنندگان'
        },
        {
            id: 'short-3',
            type: 'video',
            title: 'اجرای زنده موسیقی سنتی در اختتامیه 🎵',
            eventTitle: 'دورهمی هنرمندان و طراحان خلاق',
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
            likesCount: 2300,
            viewsCount: '۲۵.۸k',
            duration: '0:50',
            date: '۱۴۰۲/۰۶/۳۰',
            commentsCount: 156,
            description: 'لحظات ماندگار اجرای زنده ساز سنتی در پایان همایش طراحی'
        },
        {
            id: 'short-4',
            type: 'gallery',
            title: 'گالری خاطرات کمپینگ کوهستانی و کویر 🌅',
            eventTitle: 'تور ۲ روزه شبکه‌سازی رصد ستارگان',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
            images: [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
            ],
            photoCount: 4,
            likesCount: 3100,
            viewsCount: '۳۴.۵k',
            date: '۱۴۰۲/۰۵/۱۲',
            commentsCount: 210,
            description: 'تصاویر به یادماندنی از رصد ستارگان، کمپینگ شبانه دور آتش و طلوع خورشید'
        },
        {
            id: 'short-5',
            type: 'video',
            title: 'خلاصه هایلایت کارگاه تجربه کاربری (UX) 🚀',
            eventTitle: 'کارگاه عملی طراحی تجربه کاربری',
            thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
            likesCount: 1850,
            viewsCount: '۱۹.۲k',
            duration: '0:40',
            date: '۱۴۰۲/۰۴/۱۸',
            commentsCount: 95,
            description: 'هایلایت فشرده از تمرین گروهی و فیچرهای طراحی شده در کلاس'
        },
        {
            id: 'short-6',
            type: 'gallery',
            title: 'تصاویر اختتامیه و عکس‌های دسته‌جمعی 📷',
            eventTitle: 'همایش سالانه هم‌مسیر',
            thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
            images: [
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
            ],
            photoCount: 3,
            likesCount: 2750,
            viewsCount: '۲۸.۰k',
            date: '۱۴۰۲/۰۳/۲۵',
            commentsCount: 130,
            description: 'عکس‌های خاطره‌انگیز پایان همایش به همراه اساتید و سخنرانان برجسته'
        },
    ]
};

export function OrganizerProfilePage({
    onBack,
    organizer = DEFAULT_ORGANIZER_DATA,
    events = [],
    onSelectEvent,
    onOpenSupportTickets,
    onDrawerStateChange,
}: OrganizerProfilePageProps) {
    const [isFollowing, setIsFollowing] = useState(organizer.isFollowing || false);
    const [followerCount, setFollowerCount] = useState(organizer.followerCount);
    const [activeTab, setActiveTab] = useState<'about' | 'events' | 'shorts' | 'reviews'>('about');
    const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    // YouTube Shorts / Photo Gallery Fullscreen Modal State
    const [selectedShort, setSelectedShort] = useState<EventShortMemory | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
    const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});

    // Notify parent to hide/show bottom navigation when modal opens or closes
    useEffect(() => {
        if (selectedShort) {
            onDrawerStateChange?.(true);
        } else {
            onDrawerStateChange?.(false);
        }
        return () => {
            onDrawerStateChange?.(false);
        };
    }, [selectedShort, onDrawerStateChange]);

    const toggleFollow = () => {
        setIsFollowing((prev) => !prev);
        if (!isFollowing) {
            setFollowerCount('۱۲.۵k');
        } else {
            setFollowerCount(organizer.followerCount);
        }
    };

    const handleLikeShort = (shortId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLikedShorts((prev) => ({
            ...prev,
            [shortId]: !prev[shortId],
        }));
    };

    const openShortItem = (item: EventShortMemory) => {
        setSelectedShort(item);
        setActivePhotoIndex(0);
    };

    // Mock hosted events if not passed
    const hostedEventsList: AppEvent[] = events.length > 0 ? events : [
        {
            id: 1,
            title: 'کارگاه عملی طراحی تجربه کاربری (UX Masterclass)',
            date: 'پنجشنبه، ۲۶ مرداد - ساعت ۱۶:۰۰',
            location: 'تهران، برج میلاد - سالن همایش',
            organizer: organizer.name,
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
            isFree: false,
            price: '۴۵۰,۰۰۰ تومان',
            category: 'تکنولوژی',
            status: 1,
            description: 'آموزش گام‌به‌گام متدولوژی‌های طراحی محصول با پروژه‌های واقعی',
            categoryId: 0,
            eventTime: '',
            isCanceled: false
        },
        {
            id: 2,
            title: 'همایش شبکه‌سازی بنیان‌گذاران استارتاپی',
            date: 'جمعه، ۱۰ شهریور - ساعت ۱۸:۰۰',
            location: 'تهران، مرکز نوآوری شریف',
            organizer: organizer.name,
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
            isFree: true,
            category: 'کسب‌وکار',
            status: 1,
            description: 'فرصت طلایی جهت تبادل نظر، جذب سرمایه‌گذار و هم‌بنیان‌گذار',
            categoryId: 0,
            eventTime: '',
            isCanceled: false
        },
        {
            id: 3,
            title: 'تور طبیعت‌گردی و رصد ستارگان کویر مرنجاب',
            date: 'پنجشنبه، ۱۵ مهر - ساعت ۰۶:۰۰',
            location: 'کاشان، کویر مرنجاب',
            organizer: organizer.name,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
            isFree: false,
            price: '۱,۲۰۰,۰۰۰ تومان',
            category: 'طبیعت‌گردی',
            status: 1,
            description: 'دو روز اقامت در اقامتگاه بوم‌گردی همراه با لیدر مجرب و تلسکوپ پیشرفته',
            categoryId: 0,
            eventTime: '',
            isCanceled: false
        },
        {
            id: 4,
            title: 'کارگاه پردازش تصویر با پایتون و هوش مصنوعی',
            date: 'دوشنبه، ۵ تیر - پایان‌یافته',
            location: 'آنلاین (برپایه اسکای‌روم)',
            organizer: organizer.name,
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
            isFree: false,
            price: '۲۸۰,۰۰۰ تومان',
            category: 'هوش مصنوعی',
            status: 1,
            description: 'کارگاه تخصصی بررسی الگوریتم‌های بینایی ماشین',
            categoryId: 0,
            eventTime: '',
            isCanceled: false
        },
    ];

    const filteredEvents = hostedEventsList.filter((evt) => {
        if (eventFilter === 'upcoming') return !evt.date.includes('پایان‌یافته');
        if (eventFilter === 'past') return evt.date.includes('پایان‌یافته');
        return true;
    });

    return (
        <motion.main
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex-1 overflow-y-auto no-scrollbar pb-12 bg-[#F8F9FC]"
            dir="rtl"
        >
            {/* Sticky Header Bar */}
            <header className="sticky top-0 z-30 px-5 pt-8 pb-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center font-black">
                        <LucideIcons.Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-xs font-black text-gray-900 leading-none">پروفایل برگزارکننده</h1>
                        <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">شناسنامه رسمی، رویدادها و آلبوم خاطرات</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: organizer.name,
                                    text: organizer.about,
                                    url: window.location.href,
                                }).catch(() => { });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('لینک پروفایل برگزارکننده کپی شد.');
                            }
                        }}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
                        title="اشتراک‌گذاری"
                    >
                        <LucideIcons.Share2 className="w-4 h-4" />
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
                {/* Section 1: Combined Organizer & Management Profile Card */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-4">
                    {/* Header row: Company Logo & Brand Name + Follow Button */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                            {/* Company Logo */}
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200/80 p-1 flex items-center justify-center shadow-2xs">
                                    <img
                                        src={organizer.logo}
                                        alt={organizer.name}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                                {organizer.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-md border-2 border-white shadow-2xs" title="برگزارکننده تایید شده">
                                        <LucideIcons.CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Company Title & Location */}
                            <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h2 className="text-sm font-black text-gray-900 leading-tight truncate">{organizer.name}</h2>
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[8.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                        <LucideIcons.Award className="w-3 h-3 text-amber-500" />
                                        <span>برگزارکننده طلایی</span>
                                    </span>
                                </div>
                                <p className="text-[10.5px] font-bold text-gray-500 flex items-center gap-1 truncate">
                                    <LucideIcons.MapPin className="w-3 h-3 text-[#ED1C24] shrink-0" />
                                    <span>{organizer.location}</span>
                                </p>
                            </div>
                        </div>

                        {/* Follow Button */}
                        <button
                            type="button"
                            onClick={toggleFollow}
                            className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border active:scale-95 ${isFollowing
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
                                    : 'bg-[#ED1C24] hover:bg-red-700 text-white border-red-600 shadow-2xs'
                                }`}
                        >
                            {isFollowing ? (
                                <>
                                    <LucideIcons.Check className="w-3.5 h-3.5" />
                                    <span>دنبال شده</span>
                                </>
                            ) : (
                                <>
                                    <LucideIcons.UserPlus className="w-3.5 h-3.5" />
                                    <span>دنبال کردن</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Integrated Founder / Management Details Bar */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <img
                                src={organizer.founderAvatar}
                                alt={organizer.founderName}
                                className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1 truncate">
                                    <span className="text-[9.5px] font-bold text-gray-400 shrink-0">مدیریت:</span>
                                    <span className="text-xs font-black text-gray-900 truncate">{organizer.founderName}</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 truncate">{organizer.founderRole}</p>
                            </div>
                        </div>

                        <div className="text-left shrink-0">
                            <span className="text-[9px] font-bold text-gray-400 block">سابقه فعالیت</span>
                            <span className="text-[11px] font-black text-gray-900 block">از سال {organizer.establishedYear}</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Key Statistics Grid (4 Clean Standalone Cards - No Outer White Card) */}
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors">
                        <span className="text-xs font-black text-gray-900 block">{organizer.totalEventsCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 block mt-0.5">رویدادها</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors">
                        <span className="text-xs font-black text-gray-900 block">{organizer.totalAttendeesCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 block mt-0.5">شرکت‌کننده</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors">
                        <span className="text-xs font-black text-amber-500 block flex items-center justify-center gap-0.5">
                            <LucideIcons.Star className="w-3 h-3 fill-amber-400" />
                            <span>{organizer.rating}</span>
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 block mt-0.5">امتیاز ({organizer.ratingCount})</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors">
                        <span className="text-xs font-black text-gray-900 block">{followerCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 block mt-0.5">دنبال‌کننده</span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-100 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer text-center ${activeTab === 'about'
                                ? 'bg-gray-900 text-white shadow-xs'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        درباره برگزارکننده
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('shorts')}
                        className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${activeTab === 'shorts'
                                ? 'bg-[#ED1C24] text-white shadow-xs'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LucideIcons.Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>خاطرات</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer text-center ${activeTab === 'events'
                                ? 'bg-gray-900 text-white shadow-xs'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        رویدادها ({hostedEventsList.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer text-center ${activeTab === 'reviews'
                                ? 'bg-gray-900 text-white shadow-xs'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        نظرات
                    </button>
                </div>

                {/* TAB 1: ABOUT ORGANIZER */}
                {activeTab === 'about' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Bio Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-gray-900">
                                <LucideIcons.Info className="w-4 h-4 text-[#ED1C24]" />
                                <h3 className="text-xs font-black">معرفی و سوابق کانون</h3>
                            </div>
                            <p className="text-xs font-bold text-gray-600 leading-relaxed text-justify">
                                {organizer.about}
                            </p>

                            {/* Tags */}
                            <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                                {organizer.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gray-100"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Contact & Social Links Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-gray-900">
                                <LucideIcons.PhoneCall className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs font-black">اطلاعات تماس و راه‌های ارتباطی</h3>
                            </div>

                            <div className="space-y-2.5 pt-1">
                                {organizer.phone && (
                                    <a
                                        href={`tel:${organizer.phone}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                                <LucideIcons.Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 block">تلفن دفتر مرکزی</span>
                                                <span className="text-xs font-black text-gray-900 block" dir="ltr">{organizer.phone}</span>
                                            </div>
                                        </div>
                                        <LucideIcons.ChevronLeft className="w-4 h-4 text-gray-400" />
                                    </a>
                                )}

                                {organizer.website && (
                                    <a
                                        href={`https://${organizer.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                                <LucideIcons.Globe className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 block">وب‌سایت رسمی</span>
                                                <span className="text-xs font-black text-gray-900 block" dir="ltr">{organizer.website}</span>
                                            </div>
                                        </div>
                                        <LucideIcons.ExternalLink className="w-4 h-4 text-gray-400" />
                                    </a>
                                )}

                                {organizer.instagram && (
                                    <a
                                        href={`https://instagram.com/${organizer.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                                                <LucideIcons.Instagram className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 block">صفحه اینستاگرام</span>
                                                <span className="text-xs font-black text-gray-900 block" dir="ltr">@{organizer.instagram}</span>
                                            </div>
                                        </div>
                                        <LucideIcons.ExternalLink className="w-4 h-4 text-gray-400" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 2: COMBINED SHORTS (VIDEOS + PHOTO GALLERIES) */}
                {activeTab === 'shorts' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-red-100 text-[#ED1C24] flex items-center justify-center">
                                    <LucideIcons.Sparkles className="w-3.5 h-3.5 text-[#ED1C24]" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-gray-900">خاطرات، ویدیوها و آلبوم تصاویر</h3>
                                    <p className="text-[9.5px] font-bold text-gray-400">ترکیب شورت‌های ویدیویی و گالری عکس‌های رویدادها</p>
                                </div>
                            </div>
                        </div>

                        {/* Combined Media Grid (Videos + Photo Albums) */}
                        <div className="grid grid-cols-2 gap-3">
                            {organizer.shorts.map((shortItem) => {
                                const isLiked = !!likedShorts[shortItem.id];
                                const isGallery = shortItem.type === 'gallery';

                                return (
                                    <motion.div
                                        key={shortItem.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => openShortItem(shortItem)}
                                        className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-2xs cursor-pointer group border border-gray-100"
                                    >
                                        {/* Background Thumbnail */}
                                        <img
                                            src={shortItem.thumbnail}
                                            alt={shortItem.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                                        {/* Top Badges (Distinct for Video vs Photo Gallery) */}
                                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                                            {isGallery ? (
                                                <span className="bg-amber-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs">
                                                    <LucideIcons.Images className="w-3 h-3" />
                                                    <span>{shortItem.photoCount || shortItem.images?.length || 4} تصویر</span>
                                                </span>
                                            ) : (
                                                <span className="bg-red-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs">
                                                    <LucideIcons.Video className="w-3 h-3" />
                                                    <span>{shortItem.duration || '0:30'}</span>
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => handleLikeShort(shortItem.id, e)}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isLiked
                                                        ? 'bg-rose-500 text-white shadow-sm'
                                                        : 'bg-black/40 text-white hover:bg-black/60'
                                                    }`}
                                            >
                                                <LucideIcons.Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Center Action Overlay (Play for Video / Images icon for Gallery) */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                                            {isGallery ? (
                                                <div className="w-10 h-10 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 backdrop-blur-xs group-hover:scale-110 transition-transform">
                                                    <LucideIcons.Images className="w-5 h-5" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/30 backdrop-blur-xs group-hover:scale-110 transition-transform">
                                                    <LucideIcons.Play className="w-4 h-4 fill-white ml-0.5" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Details */}
                                        <div className="absolute bottom-0 inset-x-0 p-3 space-y-1 z-10 text-right">
                                            <span className="bg-white/90 text-gray-900 text-[8.5px] font-black px-1.5 py-0.5 rounded-md inline-block max-w-full truncate">
                                                {shortItem.eventTitle}
                                            </span>
                                            <h4 className="text-white text-xs font-black line-clamp-2 leading-tight drop-shadow-xs">
                                                {shortItem.title}
                                            </h4>

                                            <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-300 pt-1">
                                                <span className="flex items-center gap-1">
                                                    <LucideIcons.Eye className="w-3 h-3 text-slate-400" />
                                                    <span>{shortItem.viewsCount}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <LucideIcons.Heart className="w-3 h-3 text-rose-400" />
                                                    <span>{shortItem.likesCount + (isLiked ? 1 : 0)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 3: HOSTED EVENTS */}
                {activeTab === 'events' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <LucideIcons.Calendar className="w-4 h-4 text-[#ED1C24]" />
                                <h3 className="text-xs font-black text-gray-900">رویدادهای برگزارشده و پیش‌رو</h3>
                            </div>

                            {activeTab === 'events' && (
                                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-[10px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setEventFilter('all')}
                                        className={`px-2 py-1 rounded-lg transition-colors ${eventFilter === 'all' ? 'bg-white font-black text-gray-900 shadow-2xs' : 'text-gray-500'
                                            }`}
                                    >
                                        همه
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEventFilter('upcoming')}
                                        className={`px-2 py-1 rounded-lg transition-colors ${eventFilter === 'upcoming' ? 'bg-white font-black text-gray-900 shadow-2xs' : 'text-gray-500'
                                            }`}
                                    >
                                        پیش‌رو
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEventFilter('past')}
                                        className={`px-2 py-1 rounded-lg transition-colors ${eventFilter === 'past' ? 'bg-white font-black text-gray-900 shadow-2xs' : 'text-gray-500'
                                            }`}
                                    >
                                        پایان‌یافته
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {filteredEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    onClick={() => onSelectEvent?.(evt.id.toString())}
                                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-3 group"
                                >
                                    <img
                                        src={evt.image}
                                        alt={evt.title}
                                        className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-102 transition-transform"
                                    />
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="bg-red-50 text-[#ED1C24] text-[9px] font-black px-2 py-0.5 rounded-md">
                                                    {evt.category || 'رویداد'}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {evt.isFree ? 'رایگان' : evt.price}
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-[#ED1C24] transition-colors">
                                                {evt.title}
                                            </h4>
                                        </div>

                                        <div className="text-[10px] font-bold text-gray-500 space-y-0.5 pt-1 border-t border-gray-50">
                                            <p className="flex items-center gap-1 truncate">
                                                <LucideIcons.Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                                                <span>{evt.date}</span>
                                            </p>
                                            <p className="flex items-center gap-1 truncate">
                                                <LucideIcons.MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                <span>{evt.location}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: REVIEWS & TESTIMONIALS */}
                {activeTab === 'reviews' && (
                    <div className="space-y-3">
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xs font-black text-gray-900">میزان رضایت شرکت‌کنندگان</h3>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">بر اساس ۳۲۰ نظر ثبت‌شده در هم‌مسیر</p>
                                </div>
                                <div className="text-left">
                                    <span className="text-lg font-black text-amber-500 flex items-center gap-1">
                                        <LucideIcons.Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                        <span>۴.۹</span>
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 block">از ۵ امتیاز</span>
                                </div>
                            </div>

                            {/* Sample User Testimonial Quotes */}
                            <div className="space-y-3">
                                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                                                alt="کاربر"
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                            <span className="text-xs font-black text-gray-800">سارا محمدی</span>
                                        </div>
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <LucideIcons.Star key={i} className="w-3 h-3 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                                        «کارگاه UX توسط تیم برنا واقعاً عالی و کاربردی بود. زمان‌بندی دقیق، فضای پرانرژی و پذیرایی بسیار عالی. حتما در رویدادهای بعدی شرکت می‌کنم.»
                                    </p>
                                    <span className="text-[9px] font-bold text-gray-400 block text-left">۱۴۰۲/۰۷/۲۲</span>
                                </div>

                                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                                                alt="کاربر"
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                            <span className="text-xs font-black text-gray-800">امیرحسین رضایی</span>
                                        </div>
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <LucideIcons.Star key={i} className="w-3 h-3 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                                        «شبکه‌سازی منظم و ایجاد ارتباط با افراد هم‌مسیر از نقاط قوت اصلی رویدادهای کانون برناست. دست مریزاد به مهندس صادقی و تیم منظمشون.»
                                    </p>
                                    <span className="text-[9px] font-bold text-gray-400 block text-left">۱۴۰۲/۰۶/۱۰</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* YOUTUBE SHORTS & PHOTO GALLERY FULLSCREEN REEL PLAYER MODAL */}
            <AnimatePresence>
                {selectedShort && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
                    >
                        <div className="relative w-full max-w-[420px] h-full sm:h-[90vh] bg-slate-950 sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
                            {/* Media Display (Photo Gallery vs Video Reel) */}
                            {selectedShort.type === 'gallery' ? (
                                /* PHOTO GALLERY VIEWER */
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                                    <motion.img
                                        key={activePhotoIndex}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        src={(selectedShort.images && selectedShort.images[activePhotoIndex]) || selectedShort.thumbnail}
                                        alt={`${selectedShort.title} - ${activePhotoIndex + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

                                    {/* Photo Navigation Prev/Next Arrows */}
                                    {selectedShort.images && selectedShort.images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedShort.images!.length - 1))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors"
                                                title="تصویر بعدی"
                                            >
                                                <LucideIcons.ChevronRight className="w-6 h-6" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setActivePhotoIndex((prev) => (prev < selectedShort.images!.length - 1 ? prev + 1 : 0))}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors"
                                                title="تصویر قبلی"
                                            >
                                                <LucideIcons.ChevronLeft className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                /* VIDEO REEL VIEWER */
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                                    <img
                                        src={selectedShort.thumbnail}
                                        alt={selectedShort.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

                                    {/* Play icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/40 backdrop-blur-xs">
                                            <LucideIcons.Play className="w-6 h-6 fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Top Bar inside Player */}
                            <div className="relative z-30 p-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={organizer.logo}
                                        alt={organizer.name}
                                        className="w-8 h-8 rounded-full object-cover border border-amber-400 shrink-0"
                                    />
                                    <div>
                                        <span className="text-xs font-black block leading-none">{organizer.name}</span>
                                        <span className="text-[9.5px] font-bold text-amber-300 block mt-0.5 flex items-center gap-1">
                                            {selectedShort.type === 'gallery' ? (
                                                <>
                                                    <LucideIcons.Images className="w-3 h-3 text-amber-300" />
                                                    <span>گالری تصاویر ({activePhotoIndex + 1} از {selectedShort.images?.length || selectedShort.photoCount || 1})</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LucideIcons.Video className="w-3 h-3 text-rose-400" />
                                                    <span>شورت ویدیویی ({selectedShort.duration})</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedShort(null)}
                                    className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors border border-white/10"
                                >
                                    <LucideIcons.X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Side Floating Action Buttons */}
                            <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4 text-white">
                                {/* Like Button */}
                                <button
                                    type="button"
                                    onClick={(e) => handleLikeShort(selectedShort.id, e)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${likedShorts[selectedShort.id]
                                            ? 'bg-rose-500 text-white shadow-lg'
                                            : 'bg-black/50 text-white hover:bg-black/70'
                                        }`}>
                                        <LucideIcons.Heart className={`w-5 h-5 ${likedShorts[selectedShort.id] ? 'fill-white' : ''}`} />
                                    </div>
                                    <span className="text-[10px] font-bold">
                                        {selectedShort.likesCount + (likedShorts[selectedShort.id] ? 1 : 0)}
                                    </span>
                                </button>

                                {/* Comment Button */}
                                <button
                                    type="button"
                                    onClick={() => alert(`ثبت دیدگاه جدید برای ${selectedShort.title}`)}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-all">
                                        <LucideIcons.MessageCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold">{selectedShort.commentsCount}</span>
                                </button>

                                {/* Share Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('لینک کپی شد.');
                                    }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-all">
                                        <LucideIcons.Share2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold">اشتراک</span>
                                </button>
                            </div>

                            {/* Bottom Details & Photo Strip */}
                            <div className="relative z-30 p-5 space-y-2.5 text-white text-right max-w-[82%]">
                                <div className="flex items-center gap-2">
                                    <span className="bg-amber-400 text-slate-950 text-[9.5px] font-black px-2 py-0.5 rounded-md inline-block">
                                        {selectedShort.eventTitle}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-slate-300">
                                        {selectedShort.date}
                                    </span>
                                </div>

                                <h3 className="text-sm font-black text-white leading-snug drop-shadow-md">
                                    {selectedShort.title}
                                </h3>
                                {selectedShort.description && (
                                    <p className="text-[11px] font-bold text-slate-200 line-clamp-2 drop-shadow-xs">
                                        {selectedShort.description}
                                    </p>
                                )}

                                {/* Photo Strip Thumbnails if Gallery */}
                                {selectedShort.type === 'gallery' && selectedShort.images && (
                                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                                        {selectedShort.images.map((imgUrl, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActivePhotoIndex(idx)}
                                                className={`w-9 h-9 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${activePhotoIndex === idx
                                                        ? 'border-amber-400 scale-105'
                                                        : 'border-white/30 opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
}
