import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Ticket,
  Search,
  Home,
  Calendar,
  PlusCircle,
  Plus,
  X,
  ArrowRight,
  ChevronDown,
  User as UserIcon,
  ChevronLeft,
  MapPin,
  Clock,
  Briefcase,
  Gamepad2,
  Palette,
  Atom,
  Heart,
  Laptop,
  Dumbbell,
  Users,
  Compass,
  Trophy,
  Music,
  GraduationCap,
  Image,
  Camera,
  AlertCircle,
  ShieldCheck,
  Phone,
  Play,
  Pause,
  Cpu,
  Moon,
  ShoppingBag,
  Store,
  Coins,
  Diamond,
  ShoppingCart,
  Mail,
  Headphones,
  Settings,
  Gift,
  Info,
  Share2,
  MoreVertical,
  Send,
  Star,
  Inbox,
  Filter
} from 'lucide-react';
import { initEventsLates } from './services/events';
import { getUsers } from './services/users';
import { initHomeSlider } from './services/homesliders';
import EventsPage from './components/Events/EventPage';
import FilterDrawer from './components/Search/Filter';
import CategoryForHomePage from './components/Shared/CategoriesHomePage';
import ImageCropperDrawer from './components/Shared/ImageCropperDrawer';
import RegisterPage from './components/Auth/Register';
import CreateEvent from './components/Events/CreateEvent';
import InterestsDrawer from '././components/Shared/InterestsDrawer';
import EmptyState from './components/Events/EmptyState';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import Login from './components/Auth/Login';
import EventDetailsPage from './components/Events/EventDetails';
import CustomerEventsPage from './components/Events/CustomerEventsPage';
import { type AppEvent, type AppUser, AppUsers, HomeSlider } from './types';
import AdminPage from './components/admin/AdminPage';

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

const USERS_DATA: AppUser[] = [
  {
    id: '1',
    name: 'علی احمدی',
    email: 'ali@example.com',
    phone: '09121234567',
    joinDate: '۱۴۰۲/۰۲/۱۵',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    birthDate: '۱۳۷۵/۰۵/۱۰',
    maritalStatus: 'single',
    gender: 'male',
    occupation: 'برنامه‌نویس ارشد',
    about: 'علاقمند به سفرهای ماجراجویانه و یادگیری تکنولوژی‌های جدید.',
    // interests: ['کوه نوردی', 'طراحی', 'سینما'],
    invitationLink: 'https://events-app.com/invite/ali-123'
  },
  {
    id: '2',
    name: 'سارا رضایی',
    email: 'sara@example.com',
    phone: '09192345678',
    joinDate: '۱۴۰۲/۰۳/۱۰',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    birthDate: '۱۳۸۰/۱۲/۲۲',
    maritalStatus: 'married',
    gender: 'female',
    occupation: 'مدیر محصول',
    about: 'عاشق دنیای کسب‌وکار و شبکه‌سازی در رویدادهای تخصصی.',
    // interests: ['عکاسی', 'شطرنج', 'سفر'],
    invitationLink: 'https://events-app.com/invite/sara-456'
  },
  {
    id: '3',
    name: 'محمد محمدی',
    email: 'm.m@example.com',
    phone: '09353456789',
    joinDate: '۱۴۰۲/۰۴/۰۵',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    isVerified: false,
    birthDate: '۱۳۷۰/۰۱/۰۱',
    maritalStatus: 'married',
    gender: 'male',
    occupation: 'فعال حوزه تکنولوژی',
    invitationLink: 'https://events-app.com/invite/mmo-789'
  },
  {
    id: '4',
    name: 'مریم حسینی',
    email: 'maryam@example.com',
    phone: '09104567890',
    joinDate: '۱۴۰۲/۰۵/۲۰',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    birthDate: '۱۳۷۸/۰۷/۱۵',
    maritalStatus: 'single',
    gender: 'female',
    occupation: 'طراح گرافیکی',
    invitationLink: 'https://events-app.com/invite/mary-321'
  },
  {
    id: '5',
    name: 'امیر قاسمی',
    email: 'amir@example.com',
    phone: '09125678901',
    joinDate: '۱۴۰۲/۰۶/۱۲',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    birthDate: '۱۳۸۲/۰۹/۰۵',
    invitationLink: 'https://events-app.com/invite/amir-654'
  },
];



const ORGANIZERS_DATA = [
  {
    id: 'org1',
    name: 'بـــریـــر یــــان وان ا پیروزی',
    category: 'نانوایی',
    info: 'کالا برگ اگر گو',
    rating: '۴.۹',
    reviews: '۷۹۳۰+',
    time: '۴۹ دقیقه',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'org2',
    name: 'رستوران سنتی صبا',
    category: 'رستوران',
    info: 'منوی ویژه افطار',
    rating: '۴.۷',
    reviews: '۲۵۰۰+',
    time: '۳۵ دقیقه',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'org3',
    name: 'کافه هنر شیراز',
    category: 'کافه',
    info: 'محیط دنج و آرام',
    rating: '۴.۸',
    reviews: '۱۵۰۰+',
    time: '۲۰ دقیقه',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'org4',
    name: 'باشگاه تنیس انقلاب',
    category: 'ورزشگاه',
    info: 'رزرو زمین و مربی',
    rating: '۴.۹',
    reviews: '۳۰۰۰+',
    time: '۱۵ دقیقه',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [isRegisterPageOpen, setIsRegisterPageOpen] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('تهران');
  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [visibleEventsCount, setVisibleEventsCount] = useState(4);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('closest');
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['1', '5']);
  const [eventsLates, setEventLates] = useState<AppEvent[]>([])
  const [homeSliders, setHomeSliders] = useState<HomeSlider[]>()
  // const [allEvents, setAllEvents] = useState<AppEvent[]>(EVENTS);
  const [allUsers, setAllUsers] = useState<AppUser[]>(USERS_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSelectEvent = useCallback((eventId: string) => {
    // این تابع زمانی صدا زده می‌شود که کاربر روی یک رویداد کلیک کند
    // انجام کارهای مورد نظر مانند:
    // - هدایت به صفحه جزئیات رویداد
    // - باز کردن مودال
    // - هر کار دیگری که نیاز دارید
    // navigateToEventDetail(eventId); // مثال: هدایت به صفحه جزئیات
  }, []);

  // Helper to open create event page uniquely
  const openCreateEvent = () => {
    setSelectedEventId(null);
    setIsCreateEventOpen(true);
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedEventId(null);
    setIsCreateEventOpen(false);
  };

  // const filteredEvents = searchQuery
  //   ? allEvents.filter(e => {
  //     const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
  //     const searchableText = `${e.title} ${e.location} ${e.categoryId || ''} ${e.organizer}`.toLowerCase();
  //     return words.every(word => searchableText.includes(word));
  //   })
  //   : allEvents;

  // const publicEvents = filteredEvents.filter(e => e.isConfirmed && !e.isDisabled);

  useEffect(() => {
    initHomeSlider()
      .then((data: HomeSlider[]) => {
        setHomeSliders(data)
        console.log(data);
      });
  }, []);

  useEffect(() => {
    initEventsLates()
      .then((data: AppEvent[]) => {
        setEventLates(data)
        console.log(data);
      });
  }, []);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleHomeScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (visibleEventsCount < 10 && !isFetching) {
        setIsFetching(true);
        setTimeout(() => {
          setVisibleEventsCount(prev => Math.min(prev + 2, 10));
          setIsFetching(false);
        }, 1200);
      }
    }
  };

  // ✅ STATE های مربوط به فیلترها (برای ارسال به EventsPage)
  const [activeFilters, setActiveFilters] = useState({
    categoryId: undefined as number | undefined,
    interestIds: [] as number[],
    gender: undefined as string | undefined,
    ageRange: undefined as string | undefined,
    isFreeOnly: false,
    eventType: undefined as string | undefined
  });

  // ✅ تابع اعمال فیلترها (از FilterDrawer دریافت می‌کند)
  const handleApplyFilters = useCallback((filters: {
    categoryId?: string;
    interestIds: string[];
    gender: string;
    ageRange: string | null;
    isFreeOnly: boolean;
    eventType: string
  }) => {
    // تبدیل و ذخیره فیلترها در state
    setActiveFilters({
      categoryId: filters.categoryId ? parseInt(filters.categoryId, 10) : undefined,
      interestIds: filters.interestIds?.map(Number) || [],
      gender: filters.gender === 'مختلط' ? undefined : filters.gender,
      ageRange: filters.ageRange || undefined,
      isFreeOnly: filters.isFreeOnly,
      eventType: filters.eventType === 'همه' ? undefined : filters.eventType
    });
    // بستن drawer بعد از اعمال فیلتر
    setIsFilterDrawerOpen(false);
  }, []);

  // ✅ تابع پاک کردن همه فیلترها
  const handleClearFilters = useCallback(() => {
    setActiveFilters({
      categoryId: undefined,
      interestIds: [],
      gender: undefined,
      ageRange: undefined,
      isFreeOnly: false,
      eventType: undefined
    });
  }, []);

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen font-vazir" dir="rtl">
      {/* Mobile Container Wraps */}
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col pb-20 overflow-x-hidden">

        <AnimatePresence mode="wait">
          {isCreateEventOpen ? (
            <CreateEvent
              key="create-event"
              onBack={() => setIsCreateEventOpen(false)}
              onSave={(newEvent) => setAllEvents(prev => [newEvent, ...prev])} />
          ) : isRegisterPageOpen ? (
            <RegisterPage
              phone={pendingPhone}
              onBack={() => setIsRegisterPageOpen(false)}
              onComplete={(userData) => {
                const newUser: AppUser = {
                  ...userData,
                  id: Math.random().toString(36).substr(2, 9),
                  phone: pendingPhone,
                  joinDate: '۱۴۰۳/۰۲/۲۶',
                  avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                  isVerified: false,
                  invitationLink: `https://events-app.com/invite/user-${Math.floor(Math.random() * 1000)}`
                };
                setAllUsers(prev => [...prev, newUser]);
                setCurrentUser(newUser);
                setIsLoggedIn(true);
                setIsRegisterPageOpen(false);
                navigateToTab('profile');
              }} />
          ) : selectedEventId ? (
            <EventDetailsPage
              key="event-details"
              eventId={selectedEventId}
              onBack={() => setSelectedEventId(null)}
              isLoggedIn={isLoggedIn}
              onOpenAuth={() => setIsAuthDrawerOpen(true)}
              registeredEventIds={registeredEventIds}
              onRegister={(id) => setRegisteredEventIds(prev => [...prev, id])}
              onUnregister={(id) => setRegisteredEventIds(prev => prev.filter(eid => eid !== id))} />
          ) : activeTab === 'profile' ? (
            <ProfilePage
              key="profile"
              user={currentUser}
              onBack={() => navigateToTab('home')}
              onLogout={() => {
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigateToTab('home');
              }}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)} />
          ) : (
            <>
              {/* Header Section */}
              <header className="px-6 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#ED1C24] rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-xl">H</span>
                    </div>
                    <span className="text-2xl font-black text-[#ED1C24]">همایش</span>
                  </div>

                  {/* Province/City Selector */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateToTab('admin')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'admin'
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      مدیر سایت
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-400">استان/شهر</span>
                      <button
                        onClick={() => setIsCityDrawerOpen(true)}
                        className="flex items-center gap-1 group">
                        <span className="text-sm font-black text-gray-800 group-hover:text-[#ED1C24] transition-colors">{selectedCity}</span>
                        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#ED1C24] transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>

                {(activeTab === 'home' || activeTab === 'events') && (

                  <div className="space-y-4">

                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative group">
                        <input
                          type="text"
                          placeholder="جستجو در رویدادها..."
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="w-full bg-gray-100 border-none rounded-xl py-4 pr-14 pl-6 focus:ring-2 focus:ring-gray-900/5 transition-all outline-none text-base" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#ED1C24] rounded-full">
                          <Search className="w-5 h-5 text-white" />
                        </div>

                        {/* نمایش وضعیت جستجو */}
                        {searchQuery && (
                          <button onClick={() => handleSearchChange('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            ✕
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setIsFilterDrawerOpen(true)} className="flex items-center gap-2 group active:scale-95 transition-all flex-shrink-0 h-[60px]">
                        <Filter className="w-5 h-5 text-gray-500 group-hover:text-[#ED1C24] transition-colors" />
                        <span className="text-xs font-black text-gray-500 group-hover:text-[#ED1C24]">فیلتر</span>
                      </button>
                    </div>

                    {/* Sorting Pills */}
                    {/* {activeTab === 'events' && (
                      <div className="flex items-center pb-2">
                        <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                          {[
                            { id: 'closest', label: 'نزدیک‌ترین' },
                            { id: 'cheapest', label: 'ارزان‌ترین' },
                            { id: 'best', label: 'برترین' }
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => setSortBy(item.id)}
                              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${sortBy === item.id
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                )}
              </header>

              {activeTab === 'home' ? (
                <motion.main
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onScroll={handleHomeScroll}
                  className="flex-1 overflow-y-auto no-scrollbar"
                >
                  {/* Enhanced Hero Slider Section */}
                  <section>
                    <EnhancedHeroSlider banners={homeSliders} isLoading={isInitialLoading} />
                  </section>

                  {/* Category Grid Section */}
                  <CategoryForHomePage />

                  {/* Latest Events Page List */}
                  <section className="px-6 py-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black">جدیدترین</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                      {isInitialLoading ? (
                        <>
                          <EventCardSkeleton />
                          <EventCardSkeleton />
                        </>
                      ) : eventsLates.length > 0 ? (
                        eventsLates.slice(0, visibleEventsCount).map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-[0.98] border border-transparent hover:border-gray-100">
                              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                <img
                                  src={"http://localhost:5066" + event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-gray-900 group-hover:text-[#ED1C24] transition-colors line-clamp-1">{event.title}</h3>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">
                                      <Clock className="w-3 h-3 text-[#ED1C24]" />
                                      <span>{event.date}</span>
                                    </div>
                                    {event.isFree && (
                                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">رایگان</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate max-w-[120px]">{event.location}</span>
                                  </div>
                                  <div className="text-[10px] font-black text-gray-400 group-hover:text-gray-900 transition-colors flex items-center gap-1 uppercase tracking-tighter">
                                    مشاهده جزییات
                                    <ChevronLeft className="w-3 h-3" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <EmptyState message="رویدادی یافت نشد" />
                      )}

                      {isFetching && (
                        <div className="flex flex-col gap-6">
                          <EventCardSkeleton />
                          <EventCardSkeleton />
                        </div>
                      )}

                      {!isFetching && !isInitialLoading && visibleEventsCount >= 10 && publicEvents.length > 0 && (
                        <div className="py-10 text-center">
                          <p className="text-gray-400 text-sm font-bold">بیش از این رویدادی وجود ندارد</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Event Organizers Section */}
                  {/* <section className="px-6 bg-white border-t border-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-gray-900">برگزار کننده‌های رویداد</h2>
                      <button className="text-[#ED1C24] font-black text-xs underline decoration-dotted offset-4">مشاهده همه</button>
                    </div>

                    <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                      {isInitialLoading ? (
                        <div className="flex gap-4 pb-4">
                          <SkeletonOrganizer />
                          <SkeletonOrganizer />
                          <SkeletonOrganizer />
                          <SkeletonOrganizer />
                        </div>
                      ) : ORGANIZERS_DATA.length > 0 ? (
                        <motion.div
                          className="flex gap-4 pb-4"
                          drag="x"
                          dragConstraints={{ left: 0, right: 500 }}
                          dragElastic={0.05}
                        >
                          {ORGANIZERS_DATA.map((org) => (
                            <OrganizerCard key={org.id} org={org} />
                          ))}

                          <motion.div
                            className="flex-shrink-0 w-[42vw] max-w-[180px] bg-white rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#ED1C24] transition-colors"
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                              <ChevronLeft className="w-6 h-6 text-gray-400" />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">مشاهده همه</span>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="pb-8">
                          <EmptyState message="برگزار کننده‌ای یافت نشد" />
                        </div>
                      )}
                    </div>
                  </section> */}

                  {/* Consultant Slider Section */}
                  <ConsultantSlider isLoading={isInitialLoading} />
                </motion.main>
              ) : activeTab === 'my-events' ? (
                <CustomerEventsPage
                  key="my-events"
                  onSelectEvent={(id) => setSelectedEventId(Number(id))}
                  events={allEvents}
                  registeredEventIds={registeredEventIds}
                  onUnregister={(id) => setRegisteredEventIds(prev => prev.filter(eid => eid !== id))}
                  onNavigate={navigateToTab}
                  onCreateEvent={openCreateEvent}
                  onReRequestApproval={(id) => setAllEvents(prev => prev.map(e => e.id.toString() === id ? { ...e, status: 'pending', isConfirmed: false, rejectionReason: '' } : e))} />
              ) : activeTab === 'admin' ? (
                <AdminPage
                  key="admin"
                  // events={allEvents}
                  users={allUsers}
                  onConfirm={(id) => setAllEvents(prev => prev.map(e => e.id.toString() === id ? { ...e, isConfirmed: true, status: 'approved', isDisabled: false } : e))}
                  onReject={(id, reason) => setAllEvents(prev => prev.map(e => e.id.toString() === id ? { ...e, isConfirmed: false, status: 'rejected', rejectionReason: reason, isDisabled: true } : e))}
                  onDisable={(id) => setAllEvents(prev => prev.map(e => e.id.toString() === id ? { ...e, isDisabled: !e.isDisabled } : e))}
                  onBack={() => navigateToTab('home')} />
              ) : (
                <EventsPage
                  onSelectEvent={handleSelectEvent}
                  searchQuery={searchQuery}
                  filters={{
                    categoryId: activeFilters.categoryId,
                    interestIds: activeFilters.interestIds, // ✅ اضافه شد
                    gender: activeFilters.gender, // ✅ اضافه شد
                    eventType: activeFilters.eventType,
                    isFreeOnly: activeFilters.isFreeOnly // ✅ اضافه شد
                    // ageRange: activeFilters.ageRange,        // ✅ اضافه شد
                  }} />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        {!selectedEventId && (
          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-lg border-t border-gray-100 py-1 flex items-center justify-between px-8 z-[100] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <FooterItem
              icon={<Home className="w-9 h-9" />}
              label="خانه"
              isActive={activeTab === 'home'}
              onClick={() => navigateToTab('home')} />
            <FooterItem
              icon={<Calendar className="w-9 h-9" />}
              label="رویدادها"
              isActive={activeTab === 'events'}
              onClick={() => navigateToTab('events')} />
            <div className="relative -top-7 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={openCreateEvent}
                className="w-16 h-16 bg-gradient-to-br from-[#ED1C24] to-[#c4151b] rounded-full shadow-2xl shadow-[#ED1C24]/40 flex items-center justify-center text-white border-[6px] border-white active:shadow-inner transition-shadow"
              >
                <Plus className="w-9 h-9" />
              </motion.button>
            </div>
            <FooterItem
              icon={<Ticket className="w-9 h-9" />}
              label="رویدادهای من"
              isActive={activeTab === 'my-events'}
              onClick={() => navigateToTab('my-events')} />
            <FooterItem
              icon={<UserIcon className="w-9 h-9" />}
              label="پروفایل"
              isActive={activeTab === 'profile'}
              onClick={() => {
                if (isLoggedIn) {
                  navigateToTab('profile');
                } else {
                  setIsAuthDrawerOpen(true);
                }
              }} />
          </footer>
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        initialFilters={{
          categoryId: activeFilters.categoryId?.toString(),
          interestIds: activeFilters.interestIds.map(String),
          gender: activeFilters.gender || 'مختلط',
          ageRange: activeFilters.ageRange,
          isFreeOnly: activeFilters.isFreeOnly,
        }} />

      <CitySelectionDrawer
        isOpen={isCityDrawerOpen}
        onClose={() => setIsCityDrawerOpen(false)}
        onSelect={(city) => {
          setSelectedCity(city);
          setIsCityDrawerOpen(false);
        }}
        currentCity={selectedCity} />

      <AuthDrawer
        isOpen={isAuthDrawerOpen}
        onClose={() => setIsAuthDrawerOpen(false)}
        onLoginSuccess={(phone) => {
          setIsAuthDrawerOpen(false);
          // if (phone === '09119658224') {
          const existingUser = allUsers.find(u => u.phone === phone);
          if (existingUser) {
            setCurrentUser(existingUser);
          } else {
            setCurrentUser({
              id: 'special-1',
              name: 'علی قلی پور',
              phone: '۰۹۱۱۹۶۵۸۲۲۴',
              email: 'ali@example.com',
              joinDate: '۱۴۰۱/۰۸/۱۲',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              isVerified: true
            });
          }
          setIsLoggedIn(true);
          navigateToTab('profile');
        }}
        onRegisterNeeded={(phone) => {
          setIsAuthDrawerOpen(false);
          setPendingPhone(phone);
          setIsRegisterPageOpen(true);
        }}
      />
    </div>
  );
}

const API_KEY = (typeof process !== 'undefined' ? process.env?.GOOGLE_MAPS_PLATFORM_KEY : (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY) || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function FormInput({
  label,
  placeholder,
  isTextarea,
  type = 'text',
  value,
  onChange,
  className = '',
  isSelect,
  onSelectClick,
  disabled = false,
  error
}: {
  label: string;
  placeholder?: string;
  isTextarea?: boolean;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isSelect?: boolean;
  onSelectClick?: () => void;
  disabled?: boolean;
  error?: string;
}) {
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
      <div className={`relative transition-all ${disabled ? 'opacity-50' : ''}`}>
        {isSelect ? (
          <button
            onClick={(e) => { e.preventDefault(); if (!disabled) onSelectClick?.(); }}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold flex items-center justify-between transition-all outline-none text-right ${error ? 'border-[#ED1C24]' : 'border-gray-100'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
          >
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder || 'انتخاب کنید'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        ) : isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none min-h-[120px] resize-none ${error ? 'border-[#ED1C24]' : 'border-gray-100'}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none ${error ? 'border-[#ED1C24]' : 'border-gray-100'}`}
          />
        )}
      </div>
    </div>
  );
}

function SkeletonEvent() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="w-full aspect-[16/9] skeleton rounded-xl" />
      <div className="space-y-3 px-2">
        <div className="h-6 w-3/4 skeleton rounded-lg" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full skeleton" />
          <div className="h-4 w-1/4 skeleton rounded-md" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-24 rounded-xl skeleton" />
          <div className="h-8 w-24 rounded-xl skeleton" />
        </div>
      </div>
    </div>
  );
}

function SkeletonOrganizer() {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <div className="w-16 h-16 rounded-2xl skeleton" />
      <div className="h-3 w-12 skeleton" />
    </div>
  );
}

function CitySelectionDrawer({
  isOpen,
  onClose,
  onSelect,
  currentCity
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  currentCity: string;
}) {
  const allCities = [
    'تهران', 'شیراز', 'اصفهان', 'رشت', 'گرگان',
    'تبریز', 'مشهد', 'کرج', 'اهواز', 'قم',
    'کرمانشاه', 'یزد', 'اردبیل', 'بندرعباس', 'همدان',
    'زنجان', 'سنندج', 'قزوین', 'خرم‌آباد', 'ساری'
  ];

  const [search, setSearch] = useState('');

  const filteredCities = allCities.filter(city =>
    city.includes(search)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[70vh] bg-white z-[90] rounded-t-2xl shadow-2xl flex flex-col"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

            <div className="px-6 pb-4 space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">انتخاب شهر</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجوی نام شهر..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 bg-gray-50/50 no-scrollbar">
              <div className="space-y-1 mt-2">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => onSelect(city)}
                      className={`w-full text-right px-6 py-4 rounded-2xl flex items-center justify-between transition-all ${city === currentCity
                        ? 'bg-white shadow-sm border border-blue-100 text-blue-600'
                        : 'hover:bg-white/60 text-gray-700'
                        }`}
                    >
                      <span className="font-black">{city}</span>
                      {city === currentCity && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-gray-400 font-bold">شهری پیدا نشد</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AuthDrawer({ isOpen, onClose, onLoginSuccess, onRegisterNeeded }: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string) => void;
  onRegisterNeeded?: (phone: string) => void;
}) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isExistUser, setIsExistUser] = useState(false);

  // Reset step when opening
  useEffect(() => {
    if (isOpen) setStep('phone');
    setStep('phone');
    setPhoneNumber('');
    setIsExistUser(false);

  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
          />

          {/* Slider Container */}
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[70] rounded-t-2xl shadow-2xl overflow-y-auto no-scrollbar pt-2"
            dir="rtl"
          >
            {/* Handle for visual identification of bottom sheet */}
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />

            <div className="flex flex-col min-h-[45vh] px-6 pb-20">
              {step === 'phone' ? (
                <><BrowserRouter>
                  <AuthProvider>
                    <Routes>
                      <Route path="/" element={<Login
                        onClose={onClose}
                        onContinue={(num, isNew) => {
                          setPhoneNumber(num);
                          setIsExistUser(isNew);
                          setStep('otp');
                        }}
                      />} />
                    </Routes>
                  </AuthProvider>
                </BrowserRouter>
                </>
              ) : (
                <StepOTP
                  phoneNumber={phoneNumber}
                  onBack={() => setStep('phone')}
                  onSuccess={() => {
                    if (!isExistUser) {
                      onRegisterNeeded(phoneNumber);
                    } else {
                      onLoginSuccess(phoneNumber);
                    }
                  }
                  }
                />
              )
              }
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

{/* <Login /> */ }

function StepPhoneNumber({ onClose, onContinue }: { onClose: () => void; onContinue: (num: string) => void }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (/^09\d{9}$/.test(phone)) {
      onContinue(phone);
    } else {
      setError('شماره موبایل اشتباه است (مثال: 09123456789)');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">ورود / ثبت نام</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-500 text-sm font-bold leading-relaxed">
          برای ورود یا ثبت‌نام شماره تلفن همراه خود را وارد کنید.
        </p>

        <div className="relative mt-2">
          <label className="absolute -top-2.5 right-4 bg-white px-2 text-[10px] font-black text-blue-500 z-10">
            شماره موبایل
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            placeholder="0912 123 4567"
            className={`w-full border ${error ? 'border-red-500' : 'border-blue-200'} rounded-xl py-3 px-6 text-lg font-black tracking-[0.1em] focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
          />
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 mr-2">{error}</p>}
        </div>
      </div>

      <div>
        <button
          onClick={handleContinue}
          className="w-full mt-4 bg-[#00A1F1] hover:bg-blue-600 text-white py-3 rounded-xl font-black text-sm shadow-blue-200 active:scale-[0.98] transition-all"
        >
          ادامه
        </button>
      </div>
    </div>
  );
}

function StepOTP({ phoneNumber, onBack, onSuccess }: {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
  // onRegisterNeeded: () => void
}) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(v => v !== '')) {
      // Auto-submit
      setTimeout(() => handleVerify(newCode.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (finalCode: string) => {
    if (finalCode === '12345') { // Mock validation
      onSuccess();
    } else {
      setError('کد اشتباه است، دوباره تلاش کنید');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black text-gray-900">کد تایید</h2>
        </div>

        <p className="text-gray-500 text-sm font-bold leading-relaxed">
          کد ۵ رقمی ارسال شده به شماره <span className="text-gray-900" dir="ltr">{phoneNumber}</span> را وارد کنید.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between gap-2" dir="ltr">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 border border-gray-200 rounded-2xl text-center text-xl font-black focus:border-[#007AFF] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2">{error}</p>}
        </div>
      </div>

      <div className="mt-auto py-4 flex flex-col gap-4">
        <button
          disabled={timer > 0}
          onClick={() => { setTimer(60); setError(''); setCode(['', '', '', '', '']); }}
          className={`text-xs font-black transition-colors ${timer > 0 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600 outline-none'}`}
        >
          {timer > 0 ? `ارسال مجدد کد تا (${timer} ثانیه)` : 'ارسال مجدد کد'}
        </button>

        <button
          onClick={() => handleVerify(code.join(''))}
          className="w-full bg-[#00A1F1] hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
        >
          تایید
        </button>
      </div>
    </div>
  );
}

function FooterItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#ED1C24]' : 'text-gray-400 font-medium'}`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-black whitespace-nowrap">{label}</span>
    </button>
  );
}

function NearbyEventCard({ item }: { item: any; key?: React.Key }) {
  return (
    <motion.div
      className="flex-shrink-0 w-52 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col gap-3 relative group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
          <span className="text-[9px] font-black text-gray-900">{item.capacity}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-[#ED1C24]">{item.title}</p>
          <h3 className="text-sm font-black text-gray-900 leading-tight h-10 line-clamp-2">{item.subTitle}</h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-sm font-black text-gray-900">{item.price}</span>
          {item.discount && (
            <div className="bg-[#FF3B30] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              {item.discount}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function OrderCard({ order }: { order: any; key?: React.Key }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] max-w-[340px] bg-white rounded-2xl border border-[#eaeaea] shadow-sm overflow-hidden flex flex-col"
      whileTap={{ scale: 0.98 }}
    >
      {/* Top Bar - Date & Time */}
      <div className="p-4 py-3 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
          <Home className="w-3.5 h-3.5" />
          <span>خانه</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600">
          <Clock className="w-3.5 h-3.5" />
          <span>{order.date}</span>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-4 flex gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-black text-gray-900">{order.storeName}</h3>
          <p className="text-[10px] font-bold text-gray-400">
            {order.summary}
          </p>
        </div>
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center p-3 border border-orange-100 flex-shrink-0">
          <ShoppingBag className="w-full h-full text-orange-500" />
        </div>
      </div>

      {/* Item Previews */}
      <div className="px-4 flex gap-2 pb-4">
        {order.items.map((img: string, idx: number) => (
          <div key={idx} className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1">
            <img src={img} alt="item" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>

      {/* Links & Action Row */}
      <div className="px-4 py-4 flex items-center justify-between border-t border-gray-50">
        <button className="text-[11px] font-black text-gray-900 hover:text-[#ED1C24] transition-colors">
          مشاهده جزئیات
        </button>
        <button className="border border-[#ED1C24] text-[#ED1C24] px-5 py-2.5 rounded-2xl text-[11px] font-black hover:bg-[#ED1C24] hover:text-white transition-all">
          سفارش دوباره
        </button>
      </div>

      {/* Bottom Rating Bar */}
      <button className="bg-[#FFF5F1] p-3 text-center text-[#ED1C24] font-black text-xs hover:bg-[#FFEAE0] transition-colors">
        به این سفارش امتیاز دهید
      </button>
    </motion.div>
  );
}

function OrganizerCard({ org }: { org: any; key?: React.Key }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[42vw] max-w-[180px] bg-white rounded-2xl border border-[#eaeaea] shadow-sm p-4 flex flex-col gap-3 relative group overflow-hidden"
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-1">
        <img
          src={org.image}
          alt={org.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-[12px] font-black text-gray-900 leading-tight h-8 line-clamp-2">{org.name}</h3>
        <p className="text-[10px] font-bold text-[#ED1C24]">{org.category}</p>
        <p className="text-[9px] font-medium text-gray-400">{org.info}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black text-gray-900">{org.rating}</span>
          <span className="text-gray-400 text-[8px] font-bold">({org.reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-[9px] font-bold">{org.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ConsultantSlider({ isLoading }: { isLoading?: boolean }) {
  const [userList, setUsers] = useState<AppUsers[]>([])

  const hasFetched = useRef(false);

  useEffect(() => {

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUsers = async () => {
      try {
        const eventData = await getUsers({ pageNumber: 1, pageSize: 10 });
        setUsers(eventData.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="py-8 bg-gray-50/30 overflow-hidden" dir="rtl">
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">برگزارکنندگان جدید</h2>
        <button className="text-[#ED1C24] font-black text-xs">مشاهده همه</button>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-4 px-6">
            <div className="w-[210px] h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="w-[210px] h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <motion.div
            className="flex gap-4 px-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 650 }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
          >
            {userList?.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}

            <motion.div
              className="flex-shrink-0 w-[210px] h-[240px] bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#ED1C24] transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <ChevronLeft className="w-7 h-7 text-gray-400" />
              </div>
              <div className="text-center">
                <span className="text-gray-900 font-black text-base block">مشاهده همه</span>
                <span className="text-gray-400 text-[10px] font-bold">بیش از ۵۰ مشاور برتر</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ConsultantCard({ consultant }: { consultant: any; key?: React.Key }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[210px] h-[240px] bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative group"
      whileTap={{ scale: 0.98 }}
    >
      <div className="space-y-4">
        {/* Top Badge */}
        <div className="flex justify-end">
          <div className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-orange-100">
            {consultant.badge}
          </div>
        </div>

        {/* Profile Image & Rating */}
        <div className="relative flex justify-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <img
              src={"http://localhost:5066" + consultant.image}
              alt={consultant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 bg-yellow-400 text-white px-2 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5 shadow-sm border border-white">
            <span>{consultant.rating}</span>
            <span className="text-[10px]">★</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-0.5">
          <h3 className="text-gray-900 font-black text-sm leading-none">{consultant.name}</h3>
          <p className="text-gray-400 text-[10px] font-bold">{consultant.title}</p>
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-xl text-[10px] font-black hover:bg-gray-200 transition-colors"
      >
        مشاهده پروفایل
      </motion.button>
    </motion.div>
  );
}

function ProfilePage({ onBack, onLogout, user, onUpdateUser }: { onBack: () => void; onLogout?: () => void; user: AppUser | null; onUpdateUser?: (user: AppUser) => void; key?: React.Key }) {
  const [isInterestsDrawerOpen, setIsInterestsDrawerOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result as string);
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-white"
      dir="rtl"
    >
      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-right">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden transition-all group-hover:border-[#ED1C24]">
              <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            {user.isVerified && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                Verif
              </div>
            )}
          </div>
          <div className="flex flex-col items-start text-right">
            <h1 className="text-lg font-black text-gray-900 leading-none">{user.name}</h1>
            <p className="text-xs font-bold text-gray-400 mt-1" dir="ltr">{user.phone}</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {/* Pro Banner */}
      <section className="px-6 mb-8 mt-2">
        <div className="relative p-6 bg-gradient-to-br from-[#E2F9F5] via-[#FDFCE8] to-[#E2F9F5] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-[#00A091] text-white px-3 py-1 rounded-lg text-[10px] font-black">فعال</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-gray-800">اشتراک اسنپ‌پرو</span>
              <div className="bg-[#00A091] text-white p-0.5 px-1.5 rounded-md text-[8px] font-black">Pro</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 mb-1">زمان باقی‌مانده</p>
              <p className="text-sm font-black text-gray-800">۱۱۷ روز دیگر</p>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-gray-400 mb-1">سود دوره فعلی</p>
              <p className="text-sm font-black text-gray-800">۹۵,۲۵۰ تومان</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="space-y-1">
        <MenuItem icon={<Heart className="w-5 h-5 text-rose-500" />} title="علاقه‌مندی‌ها" onClick={() => setIsInterestsDrawerOpen(true)} />
        <MenuItem icon={<Coins className="w-5 h-5" />} title="بازگشت طلایی" subtitle="تبدیل هزینه سفر به طلا" showBadge />
        <MenuItem icon={<Diamond className="w-5 h-5" />} title="اسنپ‌کلاب" subtitle="باشگاه مشتریان اسنپ" badgeText="۱۰۵,۲۷۰ امتیاز" />
        <MenuItem icon={<ShoppingCart className="w-5 h-5" />} title="سفارش‌ها" />
        <MenuItem icon={<Mail className="w-5 h-5" />} title="پیام‌ها" />
        <div className="h-4 bg-gray-50 my-2" />
        <MenuItem icon={<Headphones className="w-5 h-5" />} title="ارتباط با پشتیبانی" subtitle="همه سرویس‌های اسنپ" secondaryBadge="جدید" />
        <MenuItem icon={<Settings className="w-5 h-5" />} title="تنظیمات" />
        <MenuItem icon={<Gift className="w-5 h-5" />} title="دعوت از دوستان" />
        <MenuItem icon={<Info className="w-5 h-5" />} title="درباره اسنپ!" />
        <MenuItem
          icon={<X className="w-5 h-5" />}
          title="خروج از حساب کاربری"
          variant="destructive"
          onClick={onLogout}
        />
      </section>

      <InterestsDrawer
        isOpen={isInterestsDrawerOpen}
        onClose={() => setIsInterestsDrawerOpen(false)}
        selectedInterests={user.interests || []}
        onToggle={() => { }} // Read-only in profile for now or could implement it
      />

      <ImageCropperDrawer
        image={tempImage}
        isOpen={isCropperOpen}
        onClose={() => { setIsCropperOpen(false); setTempImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        onCropComplete={(croppedImage) => onUpdateUser?.({ ...user, avatar: croppedImage })}
        aspectRatio={1}
      />
    </motion.main>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  showBadge,
  badgeText,
  secondaryBadge,
  variant = 'default',
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  secondaryBadge?: string;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
}) {
  const isDestructive = variant === 'destructive';

  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50/50"
      dir="rtl"
    >
      <div className="flex items-center gap-4 text-right">
        <div className={`${isDestructive ? 'text-red-400' : 'text-gray-400'} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className={`text-sm font-black ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{title}</span>
          {subtitle && <span className="text-[10px] font-bold text-gray-400">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {badgeText && <span className="text-[10px] font-bold text-gray-400">{badgeText}</span>}
        {secondaryBadge && <div className="bg-[#ED1C24] text-white text-[8px] font-black px-2 py-0.5 rounded-full">{secondaryBadge}</div>}
        {showBadge && <div className="w-2.5 h-2.5 bg-[#ED1C24] rounded-full shadow-sm" />}
      </div>
    </button>
  );
}

function EventCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-2xl bg-gray-100 animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-md w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function EnhancedHeroSlider({ banners, isLoading }: { banners: any[]; isLoading?: boolean }) {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = banners?.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || isLoading) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total, isLoading]);

  const handleManualInteraction = () => {
    setIsAutoPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

    pauseTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000); // Resume after 6 seconds
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 500) {
      setIndex((prev) => (prev - 1 + total) % total);
    } else if (offset < -threshold || velocity < -500) {
      setIndex((prev) => (prev + 1) % total);
    }
    handleManualInteraction();
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-4">
        <div className="w-full h-[200px] sm:h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden py-4 select-none touch-pan-y"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        if (!pauseTimeoutRef.current) setIsAutoPlaying(true);
      }}
    >
      <div className="relative h-[200px] sm:h-[240px] px-2.5 overflow-visible">
        <motion.div
          className="flex h-full"
          style={{ width: `${total * 100}%` }}
          animate={{ x: `${index * (100 / total)}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsAutoPlaying(false)}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="px-1 h-full"
              style={{ width: `calc(100% / ${total})` }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center p-8 text-right">
                <img
                  src={"http://localhost:5066" + banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
                <div className="z-10 relative flex-1 space-y-2">
                  <h3 className="text-white text-3xl font-black leading-tight drop-shadow-lg">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 text-sm font-bold leading-relaxed max-w-[85%]">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); handleManualInteraction(); }}
            className={`transition-all duration-300 rounded-full h-1.5 ${i === index ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-200'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

function OfferCard({ item }: { item: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex-shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-md snap-center relative border border-gray-100"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-0 z-10">
          <div className="bg-[#ED1C24] text-white text-[9px] font-black px-3 py-1 rounded-l-lg">
            {item.badge}
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <span>{item.rating}</span>
          <span className="text-yellow-500">★</span>
        </div>
      </div>
      <div className="p-5 pt-8 space-y-1">
        <h3 className="text-sm font-black text-gray-900 leading-tight truncate">{item.title}</h3>
        <p className="text-[11px] font-bold text-gray-400 truncate">{item.description}</p>
      </div>
    </motion.div>
  );
}

