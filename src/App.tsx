/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Search, 
  Menu, 
  Bell, 
  Home, 
  Calendar, 
  PlusCircle, 
  Plus,
  X,
  ArrowRight,
  ChevronDown,
  User, 
  ChevronLeft, 
  ChevronRight, 
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
  Cpu,
  Moon,
  Flame,
  Umbrella,
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
  Flag,
  MoreVertical,
  Send,
  Star,
  MessageCircle,
  Check,
  Inbox
} from 'lucide-react';

const NEARBY_EVENTS_DATA = [
  {
    id: 'ne1',
    title: 'تکنولوژی',
    subTitle: 'سمینار هوش مصنوعی',
    capacity: '۱۲ نفر باقی‌مانده',
    price: '۴۵۶,۰۰۰ تومان',
    discount: '🔥 ۵۷%',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ne2',
    title: 'هنر',
    subTitle: 'نمایشگاه نقاشی مدرن',
    capacity: '۵ نفر باقی‌مانده',
    price: '۱۲۰,۰۰۰ تومان',
    discount: '۷۵%',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ne3',
    title: 'آموزش',
    subTitle: 'کارگاه طراحی وب',
    capacity: '۲۰ نفر باقی‌مانده',
    price: '۸۵۰,۰۰۰ تومان',
    discount: '۲۰٪',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'
  }
];

import { type Event, type Category } from './types';

// Mock Data
const EVENTS: Event[] = [
  {
    id: '1',
    title: 'کارگاه طراحی تجربه کاربری',
    date: 'دوشنبه، ۲۱ اردیبهشت - ۱۷:۰۰',
    location: 'تهران، خیابان ولیعصر',
    organizer: 'آکادمی دیزاین',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 35.7152,
    lng: 51.4043
  },
  {
    id: '2',
    title: 'نشست استارتاپ‌های نوپا',
    date: 'سه‌شنبه، ۲۲ اردیبهشت - ۱۸:۳۰',
    location: 'اصفهان، شهرک علمی تحقیقاتی',
    organizer: 'شتاب‌دهنده هاب',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۱۵۰,۰۰۰ تومان',
    lat: 32.7214,
    lng: 51.5222
  },
  {
    id: '3',
    title: 'شب نشینی مافیا',
    date: 'چهارشنبه، ۲۳ اردیبهشت - ۲۰:۰۰',
    location: 'شیراز، کافه هنر',
    organizer: 'گروه بازی‌های دورهمی',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 29.6264,
    lng: 52.5295
  },
  {
    id: '4',
    title: 'نمایشگاه بین‌المللی کتاب',
    date: 'پنج‌شنبه، ۲۴ اردیبهشت - ۱۰:۰۰',
    location: 'تهران، مصلی امام خمینی',
    organizer: 'وزارت فرهنگ',
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 35.7339,
    lng: 51.4243
  },
  {
    id: '5',
    title: 'کنسرت علی یاسینی',
    date: 'جمعه، ۲۵ اردیبهشت - ۲۱:۰۰',
    location: 'تهران، برج میلاد',
    organizer: 'لیما کنسرت',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۴۵۰,۰۰۰ تومان',
    lat: 35.7448,
    lng: 51.3753
  },
  {
    id: '6',
    title: 'تور دوچرخه‌سواری کوهستان',
    date: 'شنبه، ۲۶ اردیبهشت - ۰۷:۰۰',
    location: 'مازندران، نمک‌آبرود',
    organizer: 'باشگاه دوچرخه‌سواران',
    image: 'https://images.unsplash.com/photo-1544191714-3d9adabddf65?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 36.6713,
    lng: 51.3061
  },
  {
    id: '7',
    title: 'کارگاه آموزش پایتون',
    date: 'یکشنبه، ۲۷ اردیبهشت - ۱۶:۰۰',
    location: 'تبریز، دانشگاه سراسری',
    organizer: 'انجمن علمی کامپیوتر',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۲۰۰,۰۰۰ تومان',
    lat: 38.0667,
    lng: 46.3333
  },
  {
    id: '8',
    title: 'همایش بازاریابی دیجیتال',
    date: 'دوشنبه، ۲۸ اردیبهشت - ۰۹:۰۰',
    location: 'تهران، مرکز همایش‌های صدا و سیما',
    organizer: 'دی‌ام بورد',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۹۸۰,۰۰۰ تومان',
    lat: 35.7767,
    lng: 51.4117
  },
  {
    id: '9',
    title: 'جشنواره غذای خیابانی',
    date: 'سه‌شنبه، ۲۹ اردیبهشت - ۱۸:۰۰',
    location: 'مشهد، بوستان ملت',
    organizer: 'شهرداری مشهد',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 36.3150,
    lng: 59.5390
  },
  {
    id: '10',
    title: 'شب شعر معاصر',
    date: 'چهارشنبه، ۳۰ اردیبهشت - ۱۹:۳۰',
    location: 'شیراز، حافظیه',
    organizer: 'انجمن ادبی حافظ',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    lat: 29.6258,
    lng: 52.5586
  }
];

const CATEGORIES: Category[] = [
  { id: '1', title: 'علمی', icon: 'Atom', color: 'text-purple-600' },
  { id: '2', title: 'کنسرت', icon: 'Music', color: 'text-rose-600' },
  { id: '3', title: 'هنر', icon: 'Palette', color: 'text-amber-600' },
  { id: '4', title: 'ورزش', icon: 'Trophy', color: 'text-emerald-600' },
  { id: '5', title: 'فنی', icon: 'Cpu', color: 'text-indigo-600' },
  { id: '6', title: 'آموزش', icon: 'GraduationCap', color: 'text-blue-600' },
  { id: '7', title: 'عکس', icon: 'Image', color: 'text-orange-600' },
  { id: '8', title: 'بازی', icon: 'Gamepad2', color: 'text-cyan-600' },
  { id: '9', title: 'مذهبی', icon: 'Moon', color: 'text-teal-600' },
  { id: '10', title: 'تجاری', icon: 'Briefcase', color: 'text-rose-600' },
  { id: '11', title: 'سلامت', icon: 'Heart', color: 'text-pink-600' },
  { id: '12', title: 'سفر', icon: 'Compass', color: 'text-emerald-600' },
];

const FEATURED_OFFERS = [
  {
    id: 'fo1',
    title: 'سمینار تخصصی متاورس',
    description: 'مرکز همایش‌های کیش',
    rating: '۴.۹',
    badge: 'ظرفیت محدود',
    organizerLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1475721027185-404ecc5a4220?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fo2',
    title: 'کنسرت موسیقی نواحی',
    description: 'تالار وحدت تهران',
    rating: '۴.۸',
    badge: 'فروش ویژه',
    organizerLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1514525253361-b83f859b2a55?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fo3',
    title: 'جشنواره هنرهای تجسمی',
    description: 'موزه هنرهای معاصر',
    rating: '۴.۶',
    badge: 'لحظه آخری',
    organizerLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1460666819451-741097806421?auto=format&fit=crop&q=80&w=800',
  }
];

const HERO_BANNERS = [
  {
    id: 'b1',
    title: 'بستنی و فالوده',
    subtitle: 'طعم‌های اصیل و خنک برای روزهای گرم',
    extra: 'تخفیف تا ۱۵٪',
    buttonText: 'خرید کنید >',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'نوشیدنی‌های گرم',
    subtitle: 'انرژی مضاعف با قهوه‌های دست‌چین',
    extra: 'ارسال رایگان',
    buttonText: 'مشاهده منو >',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: 'شیرینی و دسر',
    subtitle: 'لحظات شیرین با دسرهای خانگی متخصصین ما',
    extra: 'پیشنهاد سرآشپز',
    buttonText: 'رزرو کنید >',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800'
  }
];

const EVENT_BANNERS = [
  {
    id: 'eb1',
    title: 'جشنواره بستنی سنتی',
    subtitle: 'گردهمایی بزرگ اساتید بستنی‌ساز',
    extra: 'ورود رایگان',
    buttonText: 'ثبت‌نام',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'eb2',
    title: 'کارگاه آموزش باریستا',
    subtitle: 'فوت و فن‌های قهوه‌سازی حرفه‌ای',
    extra: 'ظرفیت محدود',
    buttonText: 'رزرو بلیط',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'eb3',
    title: 'شب نشینی در بام تهران',
    subtitle: 'موسیقی زنده و پذیرایی در هوای آزاد',
    extra: 'جمعه‌ها',
    buttonText: 'اطلاعات بیشتر',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800'
  }
];

const MOST_VISITED = [
  { id: 'mv1', title: 'تکنولوژی دیجیتال', tag: 'مشاوره فنی', date: '۲۵ اردیبهشت', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300' },
  { id: 'mv2', title: 'طبیعت گردی', tag: 'سفر تفریحی', date: '۲۸ اردیبهشت', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300' },
  { id: 'mv3', title: 'آموزش برنامه‌نویسی', tag: 'یادگیری آنلاین', date: '۳۰ اردیبهشت', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300' },
  { id: 'mv4', title: 'سلامت و ذهن', tag: 'روانشناسی', date: '۵ خرداد', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300' },
];

const PREVIOUS_ORDERS = [
  {
    id: 'o1',
    storeName: 'سوپرمارکت غفاری (محلاتی)',
    date: 'یکشنبه ۱۳ اردیبهشت ۱۴۰۵، ۱۸:۱۳',
    summary: '۶ کالا | ۱۰,۵۰۰ تومان | تحویل داده شد',
    status: 'تحویل داده شد',
    items: [
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=100'
    ]
  },
  {
    id: 'o2',
    storeName: 'نانوایی برکت',
    date: 'شنبه ۱۲ اردیبهشت ۱۴۰۵، ۰۹:۴۵',
    summary: '۳ کالا | ۵,۲۰۰ تومان | تحویل داده شد',
    status: 'تحویل داده شد',
    items: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=100'
    ]
  },
  {
    id: 'o3',
    storeName: 'میوه فروشی مرکز',
    date: 'جمعه ۱۱ اردیبهشت ۱۴۰۵، ۱۷:۲۰',
    summary: '۱۰ کالا | ۲۵,۰۰۰ تومان | تحویل داده شد',
    status: 'تحویل داده شد',
    items: [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=100'
    ]
  }
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

const CONSULTANTS_DATA = [
  {
    id: 'c1',
    name: 'زهرا سعادتیان',
    title: 'دکتری ژنتیک پزشکی',
    rating: 5,
    badge: 'زود رزرو کن',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-blue-600'
  },
  {
    id: 'c2',
    name: 'امیرحسین رضایی',
    title: 'مشاور کسب و کار',
    rating: 4.8,
    badge: 'تخفیف ویژه',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-emerald-600'
  },
  {
    id: 'c3',
    name: 'مریم نبوی',
    title: 'طراح تجربه کاربری',
    rating: 5,
    badge: 'منتور ارشد',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
    color: 'bg-purple-600'
  },
  {
    id: 'c4',
    name: 'سهراب سپهری',
    title: 'کارشناس هوش مصنوعی',
    rating: 4.9,
    badge: 'پیشنهاد اسنپ',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    color: 'bg-amber-600'
  }
];

const IconMap: Record<string, any> = {
  Compass, Users, Heart, Dumbbell, Laptop, Palette, Gamepad2, Briefcase, Atom, Music, GraduationCap, Image, Cpu, Moon, Trophy
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('تهران');
  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [visibleEventsCount, setVisibleEventsCount] = useState(4);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  
  return (
    <div className="flex justify-center bg-gray-200 min-h-screen font-vazir" dir="rtl">
      {/* Mobile Container Wraps */}
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col pb-20 overflow-x-hidden">
        
        <AnimatePresence mode="wait">
          {selectedEventId ? (
            <EventDetailsPage 
              key="event-details"
              eventId={selectedEventId}
              onBack={() => setSelectedEventId(null)}
              isLoggedIn={isLoggedIn}
              onOpenAuth={() => setIsAuthDrawerOpen(true)}
            />
          ) : activeTab === 'profile' ? (
            <ProfilePage 
              key="profile" 
              onBack={() => setActiveTab('home')} 
              onLogout={() => {
                setIsLoggedIn(false);
                setActiveTab('home');
              }}
            />
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
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400">استان/شهر</span>
                    <button 
                      onClick={() => setIsCityDrawerOpen(true)}
                      className="flex items-center gap-1 group"
                    >
                      <span className="text-sm font-black text-gray-800 group-hover:text-[#ED1C24] transition-colors">{selectedCity}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#ED1C24] transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="جستجو در رویدادها..." 
                    className="w-full bg-gray-100 border-none rounded-full py-4 pr-14 pl-6 focus:ring-2 focus:ring-[#ED1C24] transition-all outline-none text-base"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#1a1a1a] rounded-full">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
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
                    <EnhancedHeroSlider banners={HERO_BANNERS} isLoading={isInitialLoading} />
                  </section>

                  {/* Nearby Events Section */}
                  <section className="py-8 bg-white" dir="rtl">
                    <div className="px-6 flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-gray-900 font-vazir">رویدادهای اطراف شما</h2>
                      <button className="text-[#ED1C24] font-black text-xs">مشاهده همه</button>
                    </div>
                    
                    <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                      {isInitialLoading ? (
                        <div className="flex gap-4 px-6">
                          <div className="w-52 h-64 bg-gray-100 rounded-2xl animate-pulse" />
                          <div className="w-52 h-64 bg-gray-100 rounded-2xl animate-pulse" />
                        </div>
                      ) : NEARBY_EVENTS_DATA.length > 0 ? (
                        <motion.div 
                          className="flex gap-4 px-6 pb-4"
                          drag="x"
                          dragConstraints={{ left: 0, right: 650 }}
                          dragElastic={0.1}
                        >
                          {NEARBY_EVENTS_DATA.map((item) => (
                            <NearbyEventCard key={item.id} item={item} />
                          ))}
                        </motion.div>
                      ) : (
                        <div className="px-6">
                          <EmptyState message="رویدادی در نزدیکی شما یافت نشد" />
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Category Grid Section */}
                  <section className="px-6 py-6 bg-gray-50">
                    <h2 className="text-lg font-black mb-6 text-center">دسته‌بندی رویدادها</h2>
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = IconMap[cat.icon] || Compass;
                        return (
                          <motion.div 
                            key={cat.id}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center gap-2 cursor-pointer group"
                          >
                            <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-[#ED1C24] transition-all">
                              <Icon className={`w-10 h-10 ${cat.color}`} />
                            </div>
                            <span className="text-[12px] font-bold text-gray-500 text-center tracking-tight leading-tight px-1">
                              {cat.title}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Latest Events Page List */}
                  <section className="px-6 py-4">
                    <h2 className="text-xl font-black mb-6">لیست رویدادها</h2>
                    <div className="flex flex-col gap-6">
                      {isInitialLoading ? (
                        <>
                          <EventCardSkeleton />
                          <EventCardSkeleton />
                        </>
                      ) : EVENTS.length > 0 ? (
                        EVENTS.slice(0, visibleEventsCount).map((event) => (
                          <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              {event.isFree && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black">
                                  رایگان
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-lg font-black group-hover:text-[#ED1C24] transition-colors">{event.title}</h3>
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
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
                      
                      {!isFetching && !isInitialLoading && visibleEventsCount >= 10 && EVENTS.length > 0 && (
                        <div className="py-10 text-center">
                          <p className="text-gray-400 text-sm font-bold">بیش از این رویدادی وجود ندارد</p>
                        </div>
                      )}
                    </div>
                  </section>
                  

                  {/* Event Organizers Section */}
                  <section className="px-6 bg-white border-t border-gray-50">
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
                          {/* Event Organizers View All Card */}
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
                  </section>

                  {/* Consultant Slider Section */}
                  <ConsultantSlider isLoading={isInitialLoading} />
                </motion.main>
              ) : (
                <EventsPage key="eventsPage" onSelectEvent={(id) => setSelectedEventId(id)} isInitialLoading={isInitialLoading} />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/80 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center justify-around z-50 rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <FooterItem 
            icon={<Home className="w-7 h-7" />} 
            label="خانه" 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <FooterItem 
            icon={<Calendar className="w-7 h-7" />} 
            label="رویدادها" 
            isActive={activeTab === 'events'} 
            onClick={() => setActiveTab('events')} 
          />
          <div className="relative -top-8 px-1">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-gradient-to-br from-[#ED1C24] to-[#c4151b] rounded-full shadow-lg shadow-[#ED1C24]/40 flex items-center justify-center text-white border-4 border-white"
            >
              <Plus className="w-9 h-9" />
            </motion.button>
          </div>
          <FooterItem 
            icon={<Bell className="w-7 h-7" />} 
            label="پیام‌ها" 
            isActive={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')} 
          />
          <FooterItem 
            icon={<User className="w-7 h-7" />} 
            label="پروفایل" 
            isActive={activeTab === 'profile'} 
            onClick={() => {
              if (isLoggedIn) {
                setActiveTab('profile');
              } else {
                setIsAuthDrawerOpen(true);
              }
            }} 
          />
        </footer>
      </div>

      <CitySelectionDrawer 
        isOpen={isCityDrawerOpen} 
        onClose={() => setIsCityDrawerOpen(false)} 
        onSelect={(city) => {
          setSelectedCity(city);
          setIsCityDrawerOpen(false);
        }}
        currentCity={selectedCity}
      />

      <AuthDrawer 
        isOpen={isAuthDrawerOpen} 
        onClose={() => setIsAuthDrawerOpen(false)} 
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setActiveTab('profile');
          setIsAuthDrawerOpen(false);
        }}
      />
    </div>
  );
}

function EventDetailsPage({ 
  eventId, 
  onBack, 
  isLoggedIn, 
  onOpenAuth 
}: { 
  eventId: string; 
  onBack: () => void; 
  isLoggedIn: boolean; 
  onOpenAuth: () => void;
  key?: React.Key 
}) {
  const event = EVENTS.find(e => e.id === eventId) || EVENTS[0];
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `در این رویداد شرکت کنید: ${event.title}`,
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
  
  const [activeParticipantId, setActiveParticipantId] = useState<number | null>(null);
  const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState(false);

  const participants = [
    { id: 1, name: 'علی اکبری', role: 'طراح محصول', avatar: 'https://i.pravatar.cc/100?u=1' },
    { id: 2, name: 'نیلوفر کریمی', role: 'برنامه‌نویس', avatar: 'https://i.pravatar.cc/100?u=2' },
    { id: 3, name: 'رضا امینی', role: 'مدیر پروژه', avatar: 'https://i.pravatar.cc/100?u=3' },
    { id: 4, name: 'مریم نوری', role: 'تحلیل‌گر', avatar: 'https://i.pravatar.cc/100?u=4' },
    { id: 5, name: 'حسین محسنی', role: 'دیزاینر', avatar: 'https://i.pravatar.cc/100?u=5' },
    { id: 6, name: 'سارا رضایی', role: 'استراتژیست', avatar: 'https://i.pravatar.cc/100?u=6' },
    { id: 7, name: 'کامران بختیاری', role: 'توسعه‌دهنده', avatar: 'https://i.pravatar.cc/100?u=7' },
    { id: 8, name: 'لادن طباطبایی', role: 'طراح UI', avatar: 'https://i.pravatar.cc/100?u=8' },
    { id: 9, name: 'پیمان معادی', role: 'منتور', avatar: 'https://i.pravatar.cc/100?u=9' },
    { id: 10, name: 'مهتاب کرامتی', role: 'سخنران', avatar: 'https://i.pravatar.cc/100?u=10' },
  ];

  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'سارا احمدی',
      date: '۲ روز پیش',
      text: 'واقعا کارگاه عالی بود، خیلی مطالب مفیدی یاد گرفتم. خسته نباشید به تیم برگزار کننده.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      rating: 5
    },
    {
      id: 2,
      name: 'محمد رضایی',
      date: '۵ روز پیش',
      text: 'محیط برگزاری خیلی خوب بود ولی ای کاش زمان بیشتری برای پرسش و پاسخ اختصاص داده میشد.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      rating: 4
    }
  ]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: 'کاربر مهمان',
      date: 'هم‌اکنون',
      text: commentText,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      rating: 5
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="flex-1 overflow-y-auto no-scrollbar pb-10"
        dir="rtl"
      >
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
                  <span className="text-[10px] font-black text-gray-900 leading-none">{event.organizer}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                     <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                     <span className="text-[9px] font-black text-gray-500">۴.۹</span>
                     <div className="w-1 h-1 bg-gray-300 rounded-full mx-0.5" />
                     <span className="text-[9px] font-bold text-gray-400">۱۵۰+ امتیاز</span>
                  </div>
               </div>
               <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" 
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
            src={event.image} 
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
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" 
                    alt="" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900">{event.organizer}</span>
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
                <span className="text-sm font-black text-gray-800">{event.date}</span>
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">مکان رویداد</span>
                <span className="text-sm font-black text-gray-800">{event.location}</span>
              </div>
            </div>
            
            {/* Map Preview Box */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsNavigationDrawerOpen(true)}
              className="relative w-full h-32 rounded-2xl overflow-hidden shadow-inner border border-gray-100 cursor-pointer group"
            >
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
            onClick={() => setIsParticipantsDrawerOpen(true)}
          >
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
                      onMouseEnter={() => setActiveParticipantId(person.id)}
                      onMouseLeave={() => setActiveParticipantId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveParticipantId(activeParticipantId === person.id ? null : person.id);
                      }}
                    >
                      <img 
                        src={person.avatar}
                        alt={person.name}
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
                            <div className="font-black mb-0.5">{person.name}</div>
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
              <p className={`text-gray-600 text-sm font-bold leading-loose text-justify transition-all duration-500 overflow-hidden ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                این رویداد با هدف آشنایی با جدیدترین متدهای طراحی تجربه کاربری و ابزارهای نوین دیزاین برگزار می‌شود. در این جلسه به بررسی مطالعات موردی واقعی خواهیم پرداخت و نحوه پیاده‌سازی تفکر طراحی در پروژه‌های استارتاپی را بررسی می‌کنیم. تجربه‌ای متفاوت برای علاقه‌مندان به دنیای دیزاین و تکنولوژی.
              </p>
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 text-[#ED1C24] text-xs font-black flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <span>{isDescriptionExpanded ? 'بستن' : 'مشاهده بیشتر'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Event Insights (Premium Section) */}
          <EventInsights 
            isLoggedIn={isLoggedIn} 
            onOpenAuth={onOpenAuth} 
          />

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
              onClick={() => setIsConfirmDrawerOpen(true)}
              className="w-full h-14 bg-gradient-to-r from-[#ED1C24] to-[#c4151b] text-white rounded-2xl font-black text-lg shadow-[#ED1C24]/20 transition-all flex items-center justify-center gap-3"
            >
              <span>شرکت در دورهمی</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </motion.button>
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-4 pb-10">
            <h2 className="text-lg font-black text-gray-900">آخرین نظرات</h2>
            
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={comment.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800">{comment.name}</span>
                          <span className="text-[10px] font-bold text-gray-400">{comment.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
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
            <div className="mt-8">
               <RatingSection onSubmit={(rating, text) => {
                 const newComment = {
                   id: Date.now(),
                   name: 'کاربر مهمان',
                   date: 'هم‌اکنون',
                   text: text || "امتیاز داده شد",
                   avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
                   rating: rating
                 };
                 setComments([newComment, ...comments]);
               }} />
            </div>

            {/* Add Comment */}
            {/* ... Old comment section removed as RatingSection handles it now ... */}
          </div>
        </div>

        <ReportDrawer 
          isOpen={isReportDrawerOpen} 
          onClose={() => setIsReportDrawerOpen(false)} 
        />

        <ConfirmationDrawer 
          isOpen={isConfirmDrawerOpen}
          onClose={() => setIsConfirmDrawerOpen(false)}
          event={event}
        />

        <ParticipantsDrawer 
          isOpen={isParticipantsDrawerOpen}
          onClose={() => setIsParticipantsDrawerOpen(false)}
          participants={participants}
        />

        <NavigationDrawer 
          isOpen={isNavigationDrawerOpen}
          onClose={() => setIsNavigationDrawerOpen(false)}
          lat={event.lat}
          lng={event.lng}
          locationName={event.location}
        />
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

function EventInsights({ 
  isLoggedIn, 
  onOpenAuth
}: { 
  isLoggedIn: boolean; 
  onOpenAuth: () => void;
}) {
  const insights = {
    firstTimers: 2,
    gender: { female: 45, male: 50, other: 5 },
    age: "۱۸–۴۵",
    interests: ["موسیقی", "تکنولوژی", "ورزش", "هنر"]
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100/50 relative overflow-hidden group">
      {/* Golden Premium Touch */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-yellow-400/5 blur-[60px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100">
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-base md:text-lg font-black text-gray-900">شرکت‌کنندگان</h2>
            <p className="text-[10px] font-bold text-gray-400">تحلیل هوشمند اعضا</p>
          </div>
        </div>
        {!isLoggedIn && (
           <div className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[8px] font-black rounded-lg border border-yellow-100 flex items-center gap-1">
             <Diamond className="w-2.5 h-2.5" />
             ویژه
           </div>
        )}
      </div>

      <div className="space-y-6">
        {/* First Timers - Always Visible */}
        <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-50">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-600 leading-relaxed">
            <span className="text-yellow-600 font-black ml-1">{insights.firstTimers} نفر</span>
            برای اولین بار در این رویداد شرکت می‌کنند
          </p>
        </div>

        {/* Gender Distribution */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 px-1">
            <span>توزیع جنسیتی</span>
            {isLoggedIn && <span className="text-[9px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">پرمیوم</span>}
          </div>
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50 space-y-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: `${insights.gender.female}%` }} className="h-full bg-blue-500" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${insights.gender.male}%` }} className="h-full bg-orange-500" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${insights.gender.other}%` }} className="h-full bg-gray-400" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-gray-700">
                  بانوان: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? `${insights.gender.female}٪` : '●●'}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[10px] font-black text-gray-700">
                  آقایان: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? `${insights.gender.male}٪` : '●●'}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-[10px] font-black text-gray-700">
                  سایر: <span className={!isLoggedIn ? 'text-gray-300 blur-[2px]' : ''}>{isLoggedIn ? `${insights.gender.other}٪` : '●'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 px-1">
            <span>بازه سنی میانگین</span>
          </div>
           <div className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
               {isLoggedIn ? (
                 <div className="flex flex-col gap-1.5 pt-1">
                   <span className="text-xs font-black text-gray-800">{insights.age} سال</span>
                   <div className="h-1 w-full bg-gray-200 rounded-full relative">
                     <motion.div 
                       initial={{ left: "0%", right: "100%" }}
                       animate={{ left: "20%", right: "30%" }}
                       className="absolute h-full bg-yellow-400 rounded-full" 
                     />
                   </div>
                 </div>
               ) : (
                 <span className="text-xs font-black text-gray-300 blur-[3px]">●●–●● سال</span>
               )}
            </div>
          </div>
        </div>

        {/* Shared Interests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 px-1">
            <span>علایق مشترک</span>
          </div>
          <div className="flex flex-wrap gap-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
            {isLoggedIn ? (
              insights.interests.map((interest, idx) => (
                <span key={idx} className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-600 shadow-sm border border-gray-100">
                  {interest}
                </span>
              ))
            ) : (
              ['●●●●', '●●●●', '●●●●'].map((p, idx) => (
                <span key={idx} className="bg-white/50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-200 blur-[2px] shadow-sm border border-gray-50">
                  {p}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="pt-6 border-t border-yellow-100 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 text-center leading-relaxed">
            برای مشاهده جزئیات کامل و تحلیل دقیق شرکت‌کنندگان، وارد حساب کاربری خود شوید.
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAuth}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-yellow-400/20 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Diamond className="w-4 h-4" />
            <span>بازکردن جزئیات کامل</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}



function ParticipantsDrawer({ 
  isOpen, 
  onClose, 
  participants 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  participants: any[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[120] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-white z-[130] rounded-t-2xl shadow-2xl flex flex-col pt-2"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />
            
            <div className="px-6 pb-4 flex items-center justify-between flex-shrink-0">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-gray-900">لیست شرکت کنندگان</h2>
                <p className="text-[10px] font-bold text-gray-400 mt-1">{participants.length} نفر ثبت نام کرده‌اند</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
              <div className="space-y-4 mt-4">
                {participants.map((person) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={person.id} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
                  >
                    <div className="flex items-center gap-4">
                      <img src={person.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800">{person.name}</span>
                        <span className="text-[10px] font-bold text-gray-400">{person.role}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
                      مشاهده پروفایل
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ConfirmationDrawer({ 
  isOpen, 
  onClose, 
  event 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  event: any;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-2xl shadow-2xl flex flex-col pt-2"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />
            
            <div className="px-6 pb-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">تایید نهایی</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400">نام رویداد</span>
                  <span className="text-lg font-black text-gray-900 leading-tight">{event.title}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400">تاریخ و ساعت</span>
                    <span className="text-sm font-black text-gray-800">{event.date}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400">برگزارکننده</span>
                    <span className="text-sm font-black text-gray-800">{event.organizer}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm font-bold text-center leading-relaxed">
                آیا از شرکت در این رویداد اطمینان دارید؟ با تایید نهایی حضور شما ثبت خواهد شد.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full bg-[#ED1C24] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#ED1C24]/20 transition-all"
                >
                  تایید و ثبت نام
                </motion.button>
                <button 
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-lg transition-all"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ReportDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const options = [
    { id: 1, text: 'محتوای غیراخلاقی' },
    { id: 2, text: 'رفتار میزبان خوب نبود' },
    { id: 3, text: 'اطلاعات نادرست' },
    { id: 4, text: 'هرزنامه' },
    { id: 5, text: 'گزینه دیگر' }
  ];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleOption = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSendReport = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset state after the animation would have completed
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedIds([]);
        setDescription('');
      }, 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-2xl shadow-2xl flex flex-col pt-2 max-h-[90vh] overflow-y-auto no-scrollbar"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />
            
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">گزارش شما ثبت شد</h3>
                  <p className="text-sm font-bold text-gray-400">از اینکه ما را در بهبود جامعه کمک می‌کنید سپاسگزاریم.</p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                  <div className="px-6 pb-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <h2 className="text-xl font-black text-gray-900">گزارش تخلف</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">تیم پشتیبانی در اسرع وقت بررسی خواهد کرد</p>
                      </div>
                      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <span className="text-xs font-bold text-gray-400 block mb-2 px-1">علت گزارش را انتخاب کنید:</span>
                      <div className="grid grid-cols-1 gap-2">
                        {options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => toggleOption(opt.id)}
                            className={`w-full text-right px-5 py-4 rounded-2xl flex items-center justify-between transition-all border ${
                              selectedIds.includes(opt.id) 
                              ? 'bg-red-50 border-red-100 text-[#ED1C24]' 
                              : 'bg-gray-50/50 border-transparent text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-bold text-sm">{opt.text}</span>
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                              selectedIds.includes(opt.id) ? 'border-[#ED1C24] bg-[#ED1C24]' : 'border-gray-200'
                            }`}>
                              {selectedIds.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mb-2">
                      <span className="text-xs font-bold text-gray-400 block mb-2 px-1">توضیحات تکمیلی (اختیاری):</span>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="اگر جزئیات بیشتری دارید، اینجا بنویسید..."
                        className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-all min-h-[120px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="px-6 py-6 border-t border-gray-50 flex flex-col gap-3">
                    <motion.button 
                      whileTap={selectedIds.length > 0 ? { scale: 0.98 } : {}}
                      onClick={handleSendReport}
                      disabled={selectedIds.length === 0}
                      className={`w-full py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
                        selectedIds.length > 0 
                        ? 'bg-[#ED1C24] text-white shadow-[#ED1C24]/20' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      ارسال گزارش
                    </motion.button>
                    <button 
                      onClick={onClose}
                      className="w-full bg-gray-50 text-gray-500 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Components for UX Improvements ---

function RatingSection({ onSubmit }: { onSubmit: (rating: number, text: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, commentText);
    setRating(0);
    setCommentText('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-black text-gray-400">به این رویداد امتیاز دهید</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileTap={{ scale: 0.8 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star 
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-100'
                }`} 
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="تجربه خود را با دیگران به اشتراک بگذارید..."
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all min-h-[100px] resize-none"
        />
        <button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
            rating > 0 
            ? 'bg-[#1a1a1a] text-white shadow-gray-200' 
            : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>ثبت امتیاز و نظر</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({ message, illustration, icon }: { message: string; illustration?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-6 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
      {illustration || (
        <div className="w-20 h-20 bg-white rounded-2xl shadow-inner flex items-center justify-center text-gray-200">
          {icon || <Inbox className="w-10 h-10" />}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-black text-gray-900">{message}</p>
        <p className="text-[10px] font-bold text-gray-400">موردی برای نمایش پیدا نشد</p>
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

function NavigationDrawer({ 
  isOpen, 
  onClose, 
  lat, 
  lng, 
  locationName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  lat?: number; 
  lng?: number;
  locationName: string;
}) {
  const apps = [
    { 
      id: 'google', 
      name: 'Google Maps', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282020%29.svg',
      getUrl: (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    },
    { 
      id: 'neshan', 
      name: 'نشان (Neshan)', 
      icon: 'https://static.neshan.org/sdk/leaflet/1.4.0/images/neshan-logo.png',
      getUrl: (lat: number, lng: number) => `https://neshan.org/maps/@${lat},${lng},15z`
    },
    { 
      id: 'balad', 
      name: 'بلد (Balad)', 
      icon: 'https://balad.ir/static/images/balad-logo.png',
      getUrl: (lat: number, lng: number) => `https://balad.ir/location?lat=${lat}&lng=${lng}&zoom=15`
    },
  ];

  const handleOpenApp = (getUrl: (lat: number, lng: number) => string) => {
    if (lat && lng) {
      window.open(getUrl(lat, lng), '_blank');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[140] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[150] rounded-t-2xl shadow-2xl flex flex-col pt-2 pb-10"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />
            
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-gray-900">انتخاب نقشه‌خوان</h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">{locationName}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {apps.map((app) => (
                  <motion.button
                    key={app.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenApp(app.getUrl)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-bold text-gray-800">{app.name}</span>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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

            <div className="flex-1 overflow-y-auto px-4 pb-12 bg-gray-50/50 no-scrollbar">
              <div className="space-y-1 mt-2">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => onSelect(city)}
                      className={`w-full text-right px-6 py-4 rounded-2xl flex items-center justify-between transition-all ${
                        city === currentCity 
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

function AuthDrawer({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess: () => void }) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Reset step when opening
  useEffect(() => {
    if (isOpen) setStep('phone');
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
            <div className="w-12 bg-gray-100 rounded-full mx-auto" />
            
            <div className="flex flex-col min-h-[45vh] px-6 pt-4 pb-10">
               {step === 'phone' ? (
                 <StepPhoneNumber 
                   onClose={onClose} 
                   onContinue={(num) => {
                     setPhoneNumber(num);
                     setStep('otp');
                   }} 
                 />
               ) : (
                 <StepOTP 
                   phoneNumber={phoneNumber}
                   onBack={() => setStep('phone')}
                   onSuccess={onLoginSuccess}
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
            className={`w-full border ${error ? 'border-red-500' : 'border-blue-200'} rounded-2xl py-4 px-6 text-lg font-black tracking-[0.1em] focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
          />
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 mr-2">{error}</p>}
        </div>
      </div>
        
      <div className="mt-auto">
        <button 
          onClick={handleContinue}
          className="w-full bg-[#00A1F1] hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-blue-200 active:scale-[0.98] transition-all"
        >
          ادامه
        </button>
      </div>
    </div>
  );
}

function StepOTP({ phoneNumber, onBack, onSuccess }: { phoneNumber: string; onBack: () => void; onSuccess: () => void }) {
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
      <div className="space-y-6">
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
                ref={el => inputRefs.current[idx] = el}
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
          className="w-full bg-[#00A1F1] hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
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
      <span className="text-[10px] whitespace-nowrap">{label}</span>
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
  return (
    <section className="py-8 bg-gray-50/30 overflow-hidden" dir="rtl">
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">مشاوران برتر</h2>
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
              {CONSULTANTS_DATA.map((consultant) => (
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
              src={consultant.image} 
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
        رزرو مشاوره
      </motion.button>
    </motion.div>
  );
}

function ProfilePage({ onBack, onLogout }: { onBack: () => void; onLogout?: () => void; key?: React.Key }) {
  return (
    <motion.main 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-white"
      dir="rtl"
    >
      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-right">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-teal-500 p-0.5">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                alt="profile" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute top-0 right-0 bg-[#00A091] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
              Pro
            </div>
          </div>
          <div className="flex flex-col items-start text-right">
            <h1 className="text-lg font-black text-gray-900 leading-none">علی قلی پور</h1>
            <p className="text-xs font-bold text-gray-400 mt-1">۰۹۱۱۹۶۵۸۲۲۴</p>
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

function EventsPage({ onSelectEvent, isInitialLoading }: { onSelectEvent: (id: string) => void; isInitialLoading: boolean; key?: React.Key }) {
  const [visibleEventsCount, setVisibleEventsCount] = useState(4);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (visibleEventsCount < 10 && !isFetching) {
        setIsFetching(true);
        setTimeout(() => {
          setVisibleEventsCount(prev => Math.min(prev + 2, 10));
          setIsFetching(false);
        }, 1200); // Simulate network lag with visual feedback
      }
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto no-scrollbar pb-10"
    >
      {/* Events Slider Section */}
      <section>
        <EnhancedHeroSlider banners={EVENT_BANNERS} isLoading={isInitialLoading} />
      </section>

                        {/* Event Organizers Section */}
                  <section className="px-6 bg-white border-t border-gray-50">
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
                          {/* Event Organizers View All Card */}
                          {ORGANIZERS_DATA.map((org) => (
                            <OrganizerCard key={org.id} org={org} />
                          ))}
                          
                          <motion.div 
                            className="flex-shrink-0 w-[42vw] max-w-[180px] bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#ED1C24] transition-colors"
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
                  </section>

      {/* Latest Events Page List */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-black mb-6">لیست رویدادها</h2>
        <div className="flex flex-col gap-6">
          {isInitialLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : EVENTS.length > 0 ? (
            EVENTS.slice(0, visibleEventsCount).map((event) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer"
                onClick={() => onSelectEvent(event.id)}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {event.isFree && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black">
                      رایگان
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black group-hover:text-[#ED1C24] transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
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
          
          {!isFetching && !isInitialLoading && visibleEventsCount >= 10 && EVENTS.length > 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm font-bold">بیش از این رویدادی وجود ندارد</p>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}

function EnhancedHeroSlider({ banners, isLoading }: { banners: any[]; isLoading?: boolean }) {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = banners.length;
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIndex((prev) => (prev - 1 + total) % total);
        handleManualInteraction();
      } else if (e.key === 'ArrowLeft') {
        setIndex((prev) => (prev + 1) % total);
        handleManualInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

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
      <div className="relative h-[200px] sm:h-[240px] px-2.5 overflow-visible"> {/* Peeking container refined */}
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
          {banners.map((banner, i) => (
            <div 
              key={banner.id} 
              className="px-1 h-full"
              style={{ width: `calc(100% / ${total})` }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center p-8">
                {/* Background Image */}
                <img 
                  src={banner.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/10" />

                {/* Content */}
                <div className="z-10 relative flex-1 space-y-2 h-full flex flex-col items-start text-right">
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

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); handleManualInteraction(); }}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              i === index ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function OfferCard({ item }: { item: any; key?: React.Key }) {
  const cardRef = useRef(null);
  const { scrollXProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollXProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-md snap-center relative border border-gray-100 group/card"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <motion.img 
          src={item.image} 
          alt={item.title} 
          style={{ x: imgY, scale: 1.2 }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        
        {/* Ribbon Badge */}
        <div className="absolute top-3 right-0 z-10">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#ED1C24] text-white text-[9px] font-black px-3 py-1 rounded-l-lg shadow-sm"
          >
            {item.badge}
          </motion.div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm z-10">
          <span>{item.rating}</span>
          <span className="text-yellow-500">★</span>
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-5 left-4 p-0.5 bg-white rounded-xl shadow-lg border border-gray-50 z-20">
           <img 
             src={item.organizerLogo} 
             alt="logo" 
             className="w-10 h-10 rounded-lg object-contain bg-gray-50"
             referrerPolicy="no-referrer"
           />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-8 space-y-1">
        <h3 className="text-sm font-black text-gray-900 leading-tight truncate group-hover/card:text-[#ED1C24] transition-colors">{item.title}</h3>
        <p className="text-[11px] font-bold text-gray-400 truncate">{item.description}</p>
      </div>
    </motion.div>
  );
}
