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
  Info
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
    isFree: true
  },
  {
    id: '2',
    title: 'نشست استارتاپ‌های نوپا',
    date: 'سه‌شنبه، ۲۲ اردیبهشت - ۱۸:۳۰',
    location: 'اصفهان، شهرک علمی تحقیقاتی',
    organizer: 'شتاب‌دهنده هاب',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    isFree: false
  },
  {
    id: '3',
    title: 'شب نشینی مافیا',
    date: 'چهارشنبه، ۲۳ اردیبهشت - ۲۰:۰۰',
    location: 'شیراز، کافه هنر',
    organizer: 'گروه بازی‌های دورهمی',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    isFree: true
  },
  {
    id: '4',
    title: 'نمایشگاه بین‌المللی کتاب',
    date: 'پنج‌شنبه، ۲۴ اردیبهشت - ۱۰:۰۰',
    location: 'تهران، مصلی امام خمینی',
    organizer: 'وزارت فرهنگ',
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=800',
    isFree: true
  },
  {
    id: '5',
    title: 'کنسرت علی یاسینی',
    date: 'جمعه، ۲۵ اردیبهشت - ۲۱:۰۰',
    location: 'تهران، برج میلاد',
    organizer: 'لیما کنسرت',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    isFree: false
  },
  {
    id: '6',
    title: 'تور دوچرخه‌سواری کوهستان',
    date: 'شنبه، ۲۶ اردیبهشت - ۰۷:۰۰',
    location: 'مازندران، نمک‌آبرود',
    organizer: 'باشگاه دوچرخه‌سواران',
    image: 'https://images.unsplash.com/photo-1544191714-3d9adabddf65?auto=format&fit=crop&q=80&w=800',
    isFree: true
  },
  {
    id: '7',
    title: 'کارگاه آموزش پایتون',
    date: 'یکشنبه، ۲۷ اردیبهشت - ۱۶:۰۰',
    location: 'تبریز، دانشگاه سراسری',
    organizer: 'انجمن علمی کامپیوتر',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    isFree: false
  },
  {
    id: '8',
    title: 'همایش بازاریابی دیجیتال',
    date: 'دوشنبه، ۲۸ اردیبهشت - ۰۹:۰۰',
    location: 'تهران، مرکز همایش‌های صدا و سیما',
    organizer: 'دی‌ام بورد',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    isFree: false
  },
  {
    id: '9',
    title: 'جشنواره غذای خیابانی',
    date: 'سه‌شنبه، ۲۹ اردیبهشت - ۱۸:۰۰',
    location: 'مشهد، بوستان ملت',
    organizer: 'شهرداری مشهد',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    isFree: true
  },
  {
    id: '10',
    title: 'شب شعر معاصر',
    date: 'چهارشنبه، ۳۰ اردیبهشت - ۱۹:۳۰',
    location: 'شیراز، حافظیه',
    organizer: 'انجمن ادبی حافظ',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
    isFree: true
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
  const [visibleEventsCount, setVisibleEventsCount] = useState(4);
  const [isFetching, setIsFetching] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
          {activeTab === 'profile' ? (
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
                    <EnhancedHeroSlider banners={HERO_BANNERS} />
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
                      {EVENTS.slice(0, visibleEventsCount).map((event) => (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative aspect-video rounded-3xl overflow-hidden mb-3">
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
                      ))}
                      
                      {isFetching && (
                        <div className="flex flex-col gap-6">
                          <EventCardSkeleton />
                          <EventCardSkeleton />
                        </div>
                      )}
                      
                      {!isFetching && visibleEventsCount >= 10 && (
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
                    </div>
                  </section>

                  {/* Consultant Slider Section */}
                  <ConsultantSlider />
                </motion.main>
              ) : (
                <EventsPage key="eventsPage" />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/80 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center justify-around z-50 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
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
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[70vh] bg-white z-[90] rounded-t-[2.5rem] shadow-2xl flex flex-col"
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
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[70] rounded-t-[2.5rem] shadow-2xl overflow-y-auto no-scrollbar pt-2"
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
      className="flex-shrink-0 w-[42vw] max-w-[180px] bg-white rounded-xl border border-[#eaeaea] shadow-sm p-4 flex flex-col gap-3 relative group overflow-hidden"
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

function ConsultantSlider() {
  return (
    <section className="py-8 bg-gray-50/30 overflow-hidden" dir="rtl">
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">مشاوران برتر</h2>
        <button className="text-[#ED1C24] font-black text-xs">مشاهده همه</button>
      </div>
      
      <div className="relative">
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
              className="flex-shrink-0 w-[210px] h-[240px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#ED1C24] transition-colors"
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
      </div>
    </section>
  );
}

function ConsultantCard({ consultant }: { consultant: any; key?: React.Key }) {
  return (
    <motion.div 
      className="flex-shrink-0 w-[210px] h-[240px] bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between relative group"
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
        <div className="relative p-6 bg-gradient-to-br from-[#E2F9F5] via-[#FDFCE8] to-[#E2F9F5] rounded-[2.5rem] overflow-hidden">
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
      <div className="relative aspect-video rounded-3xl bg-gray-100 animate-pulse" />
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

function EventsPage() {
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
      <section className="py-2">
        <EnhancedHeroSlider banners={EVENT_BANNERS} />
      </section>

                        {/* Event Organizers Section */}
                  <section className="px-6 bg-white border-t border-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-gray-900">برگزار کننده‌های رویداد</h2>
                      <button className="text-[#ED1C24] font-black text-xs underline decoration-dotted offset-4">مشاهده همه</button>
                    </div>
                    
                    <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
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
                          className="flex-shrink-0 w-[42vw] max-w-[180px] bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#ED1C24] transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                            <ChevronLeft className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-gray-900 font-bold text-sm">مشاهده همه</span>
                        </motion.div>
                      </motion.div>
                    </div>
                  </section>

      {/* Latest Events Page List */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-black mb-6">لیست رویدادها</h2>
        <div className="flex flex-col gap-6">
          {EVENTS.slice(0, visibleEventsCount).map((event) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-3">
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
          ))}
          
          {isFetching && (
            <div className="flex flex-col gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}
          
          {!isFetching && visibleEventsCount >= 10 && (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm font-bold">بیش از این رویدادی وجود ندارد</p>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}

function EnhancedHeroSlider({ banners }: { banners: any[] }) {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = banners.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total]);

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
      className="flex-shrink-0 w-52 bg-white rounded-[2.5rem] overflow-hidden shadow-md snap-center relative border border-gray-100 group/card"
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
