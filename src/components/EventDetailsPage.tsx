import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { type AppEvent } from '../types';

interface EventDetailsPageProps {
  eventId: string;
  events?: AppEvent[];
  onBack: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  registeredEventIds?: string[];
  onRegister?: (id: string) => void;
  onUnregister?: (id: string) => void;
  onDrawerStateChange?: (isOpen: boolean) => void;
}

export function EventDetailsPage({
  eventId,
  events = [],
  onBack,
  isLoggedIn,
  onOpenAuth,
  registeredEventIds = [],
  onRegister,
  onUnregister,
  onDrawerStateChange,
}: EventDetailsPageProps) {
  // Find event
  const event = events.find((e) => e.id === eventId) || events[0];
  if (!event) return null;

  const isRegistered = registeredEventIds.includes(event.id);

  // States
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  const [isSharing, setIsSharing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  // Default participants list
  const participants = [
    { id: 1, name: 'علی اکبری', role: 'طراح محصول', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'نیلوفر کریمی', role: 'برنامه‌نویس', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'رضا امینی', role: 'مدیر پروژه', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'مریم نوری', role: 'تحلیل‌گر', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { id: 5, name: 'حسین محسنی', role: 'دیزاینر', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { id: 6, name: 'سارا رضایی', role: 'استراتژیست', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
  ];

  // Default comments list
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'سارا احمدی',
      date: '۲ روز پیش',
      text: 'واقعا کارگاه عالی بود، خیلی مطالب مفیدی یاد گرفتم. خسته نباشید به برگزارکننده محترم.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      rating: 5,
    },
    {
      id: 2,
      name: 'محمد رضایی',
      date: '۵ روز پیش',
      text: 'محیط برگزاری و لوکیشن خیلی خوب بود. سپاس از برگزارکننده خوش‌ذوق.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      rating: 4,
    },
  ]);

  // Handle Share
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Manage Bottom navigation hidden state when any drawer is active
  const isAnyDrawerOpen =
    isReportDrawerOpen ||
    isConfirmDrawerOpen ||
    isNavigationDrawerOpen ||
    isParticipantsDrawerOpen ||
    isAddReviewOpen;

  useEffect(() => {
    if (onDrawerStateChange) {
      onDrawerStateChange(isAnyDrawerOpen);
    }
    return () => {
      if (onDrawerStateChange) {
        onDrawerStateChange(false);
      }
    };
  }, [isAnyDrawerOpen, onDrawerStateChange]);

  const handleAddComment = (rating: number, text: string) => {
    const newComment = {
      id: Date.now(),
      name: 'کاربر مهمان',
      date: 'هم‌اکنون',
      text: text || 'امتیاز ثبت شد',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      rating: rating,
    };
    setComments([newComment, ...comments]);
    setIsAddReviewOpen(false);
  };

  // Calculate average rating
  const avgRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : '۵.۰';

  return (
    <div className="relative flex-1 flex flex-col min-h-0 bg-white overflow-hidden w-full">
      {/* Scrollable Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1 overflow-y-auto no-scrollbar pb-52"
        dir="rtl"
      >
        {/* Top Sticky/Float Header */}
        <div className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-9 h-9 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-800 pointer-events-auto border border-gray-100"
          >
            <LucideIcons.ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Share action button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleShare}
              className={`w-9 h-9 ${isSharing ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white/90 text-gray-800 border-gray-100'} backdrop-blur shadow-md rounded-full flex items-center justify-center transition-all border`}
            >
              {isSharing ? (
                <span className="text-[10px] font-black">کپی شد!</span>
              ) : (
                <LucideIcons.Share2 className="w-4.5 h-4.5" />
              )}
            </motion.button>

            {/* Options button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsReportDrawerOpen(true)}
              className="w-9 h-9 bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-gray-800 border border-gray-100"
            >
              <LucideIcons.Flag className="w-4.5 h-4.5" />
            </motion.button>
          </div>
        </div>

        {/* Hero Image Header with beautiful overlay */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <img
            src={event.image}
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

        {/* Main Details Body */}
        <div className="px-6 -mt-3 relative z-10 bg-white rounded-t-[24px] pt-5 space-y-5">
          {/* Title & Host info */}
          <div className="space-y-1.5 text-right">
            <h1 className="text-xl font-black text-gray-900 leading-tight tracking-tight">
              {event.title}
            </h1>

            {/* Small Host Badge */}
            <div className="flex items-center justify-between bg-gray-50/70 p-2.5 rounded-2xl border border-gray-100/50">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100"
                  alt="Host Avatar"
                  className="w-8 h-8 rounded-full border border-white shadow-xs object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-black text-gray-900">{event.organizer}</span>
                  <span className="text-[9px] font-bold text-gray-400">میزبان تایید شده رویداد</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-2xs">
                <LucideIcons.Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-[10px] font-black text-gray-700">۴.۹</span>
              </div>
            </div>
          </div>

          {/* Metadata Cards Container with tight, compact spacing */}
          <div className="flex flex-col gap-2.5">
            {/* Date Container */}
            <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-50/70 text-[#007AFF] rounded-xl flex items-center justify-center shrink-0">
                <LucideIcons.Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-right min-w-0 flex-1">
                <span className="text-[9px] font-bold text-gray-400 leading-none">تاریخ برگزاری</span>
                <span className="text-xs font-black text-gray-800 mt-1 leading-normal break-words">{event.date}</span>
              </div>
            </div>

            {/* Location Container */}
            <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-50/70 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <LucideIcons.MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-right min-w-0 flex-1">
                <span className="text-[9px] font-bold text-gray-400 leading-none">مکان رویداد</span>
                <span className="text-xs font-black text-gray-800 mt-1 leading-normal break-words">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Minimal Map Preview Widget */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsNavigationDrawerOpen(true)}
            className="relative w-full h-24 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer shadow-3xs"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <div className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[#ED1C24]">
                <LucideIcons.MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-gray-700 bg-white/90 border border-gray-100 px-3 py-1 rounded-full shadow-2xs">
                مسیریابی و آدرس دقیق رویداد
              </span>
            </div>
          </motion.div>

          {/* Participants - Redesigned to horizontal layout with tight avatars */}
          <div
            onClick={() => setIsParticipantsDrawerOpen(true)}
            className="bg-gray-50/40 border border-gray-100 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 space-x-reverse">
                {participants.slice(0, 4).map((person) => (
                  <img
                    key={person.id}
                    src={person.avatar}
                    alt={person.name}
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
            <LucideIcons.ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>

          {/* Description Section with beautiful typography */}
          <div className="space-y-1.5 text-right">
            <h2 className="text-sm font-black text-gray-900">توضیحات رویداد</h2>
            <div className="relative">
              <p
                className={`text-gray-500 text-xs font-bold leading-relaxed text-justify transition-all duration-300 ${
                  !isDescriptionExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {event.description ||
                  'این رویداد با هدف ایجاد بستری صمیمی جهت تبادل اطلاعات، توسعه شبکه ارتباطی و بهره‌مندی از تجربیات جمعی در زمینه‌های مورد علاقه برگزار می‌شود. میزبان گرامی تلاش نموده بهترین امکانات را برای یک گردهمایی دلنشین هماهنگ سازد.'}
              </p>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-1 text-[#007AFF] text-[10px] font-black flex items-center gap-0.5"
              >
                <span>{isDescriptionExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}</span>
                <LucideIcons.ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isDescriptionExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Smart Member Analysis Section (تحلیل هوشمند اعضا) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-3xs border border-indigo-100/30">
                  <LucideIcons.Sparkles className="w-3.5 h-3.5 fill-indigo-500/10" />
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="text-xs font-black text-gray-900">تحلیل هوشمند اعضا</h3>
                  <p className="text-[9px] font-bold text-gray-400">آنالیز هوش مصنوعی شرکت‌کنندگان</p>
                </div>
              </div>
              {!isLoggedIn && (
                <div className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded-lg border border-amber-100/40 flex items-center gap-1">
                  <LucideIcons.Diamond className="w-2.5 h-2.5" />
                  ویژه
                </div>
              )}
            </div>

            {/* Description Text */}
            <p className="text-[10px] font-bold text-gray-500 leading-relaxed text-right">
              تحلیل آماری و رفتاری حاضرین بر اساس رده سنی، جنسیت و علاقه‌مندی‌های ثبت‌شده در پروفایل کاربری.
            </p>

            {/* Gender Distribution */}
            <div className="space-y-1.5 bg-gray-50/50 border border-gray-100/40 p-2.5 rounded-xl">
              <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                <span>توزیع جنسیتی</span>
                {isLoggedIn && <span className="text-[8px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">پرمیوم</span>}
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-gray-200/60 rounded-full overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '45%' : '0%' }} className="h-full bg-[#007AFF]" />
                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '50%' : '0%' }} className="h-full bg-orange-400" />
                <motion.div initial={{ width: 0 }} animate={{ width: isLoggedIn ? '5%' : '0%' }} className="h-full bg-gray-300" />
              </div>

              {/* Labels with tight layout */}
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

            {/* Login Prompt for Non-Logged-In Users */}
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
                  <LucideIcons.Lock className="w-3 h-3" />
                  <span>ورود و فعال‌سازی تحلیل هوشمند</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Reviews List & Collapse Redesign */}
          <div className="border-t border-gray-100 pt-4 space-y-3 text-right">
            {/* Header with collapsed statistics */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-gray-900">نظرات شرکت‌کنندگان</h3>
                <div className="flex items-center gap-1 bg-yellow-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black border border-yellow-100/50">
                  <LucideIcons.Star className="w-3 h-3 fill-current" />
                  <span>{avgRating}</span>
                  <span className="text-gray-400 font-bold">({comments.length})</span>
                </div>
              </div>

              {/* Add comment button */}
              <button
                onClick={() => setIsAddReviewOpen(true)}
                className="text-[10px] font-black text-[#007AFF] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
              >
                <LucideIcons.Plus className="w-3.5 h-3.5" />
                <span>نوشتن نظر</span>
              </button>
            </div>

            {/* Individual Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.avatar}
                        alt={comment.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-black text-gray-800">{comment.name}</span>
                        <span className="text-[9px] font-bold text-gray-400">{comment.date}</span>
                      </div>
                    </div>
                    {/* Stars indicator */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <LucideIcons.Star
                          key={i}
                          className={`w-2.5 h-2.5 ${
                            i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
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
          </div>
        </div>
      </motion.div>

      {/* Modern Fixed Bottom Action Panel */}
      <div className="fixed bottom-[102px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[440px] z-[100] bg-white/95 backdrop-blur-md border border-gray-100 px-5 py-3 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between">
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase">هزینه نهایی شرکت</span>
          <span className={`text-sm font-black mt-0.5 ${event.isFree ? 'text-emerald-500' : 'text-gray-900'}`}>
            {event.isFree ? 'رایگان' : event.price}
          </span>
        </div>

        {/* Action Button - Prominent Red */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => (isRegistered ? null : setIsConfirmDrawerOpen(true))}
          disabled={isRegistered}
          className={`px-8 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition-all ${
            isRegistered
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-[#ED1C24] hover:bg-[#D0171E] text-white shadow-[0_4px_16px_rgba(237,28,36,0.25)]'
          }`}
        >
          <span>{isRegistered ? 'ثبت‌نام شده‌اید' : 'شرکت در دورهمی'}</span>
          {!isRegistered ? (
            <LucideIcons.ArrowLeft className="w-4 h-4" />
          ) : (
            <LucideIcons.Check className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Drawers Overlays */}
      <AnimatePresence>
        {/* Registration Success Notification */}
        {isRegistrationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-32 left-1/2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl z-[200] font-black flex items-center gap-2 whitespace-nowrap text-xs"
          >
            <LucideIcons.Check className="w-4 h-4" />
            <span>ثبت‌نام شما با موفقیت انجام شد</span>
          </motion.div>
        )}

        {/* 1. Report Abuse Drawer */}
        {isReportDrawerOpen && (
          <ReportDrawer
            isOpen={isReportDrawerOpen}
            onClose={() => setIsReportDrawerOpen(false)}
          />
        )}

        {/* 2. Confirmation Drawer */}
        {isConfirmDrawerOpen && (
          <ConfirmationDrawer
            isOpen={isConfirmDrawerOpen}
            onClose={() => setIsConfirmDrawerOpen(false)}
            event={event}
            onConfirm={() => {
              if (onRegister) onRegister(event.id);
              setIsConfirmDrawerOpen(false);
              setIsRegistrationSuccess(true);
              setTimeout(() => setIsRegistrationSuccess(false), 3000);
            }}
          />
        )}

        {/* 3. Write Review Drawer */}
        {isAddReviewOpen && (
          <WriteReviewDrawer
            isOpen={isAddReviewOpen}
            onClose={() => setIsAddReviewOpen(false)}
            onSubmit={handleAddComment}
          />
        )}

        {/* 4. Participants List Drawer */}
        {isParticipantsDrawerOpen && (
          <ParticipantsDrawer
            isOpen={isParticipantsDrawerOpen}
            onClose={() => setIsParticipantsDrawerOpen(false)}
            participants={participants}
          />
        )}

        {/* 5. Navigation/Map Drawer */}
        {isNavigationDrawerOpen && (
          <NavigationDrawer
            isOpen={isNavigationDrawerOpen}
            onClose={() => setIsNavigationDrawerOpen(false)}
            locationName={event.location}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT DRAWERS WITH PREMIUM UNIFIED LOOK & THIN HANDLES
   ========================================================================= */

// 1. Report Abuse Drawer
function ReportDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const options = [
    { id: 1, text: 'محتوای نامناسب یا غیراخلاقی' },
    { id: 2, text: 'رفتار نادرست برگزارکننده' },
    { id: 3, text: 'محل برگزاری نامناسب' },
    { id: 4, text: 'قیمت یا اطلاعات نادرست' },
    { id: 5, text: 'سایر موارد فنی یا امنیتی' },
  ];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleOption = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendReport = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setSelectedIds([]);
    }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3" />

        <div className="px-6 pb-8 flex flex-col gap-4 text-right">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                  <LucideIcons.Check className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-gray-900">گزارش شما ثبت شد</h3>
                <p className="text-xs font-bold text-gray-400">تیم پشتیبانی ما موضوع را سریعاً بررسی خواهد کرد.</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-black text-gray-900">گزارش تخلف رویداد</h2>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">علت گزارش خود را مشخص نمایید</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
                  >
                    <LucideIcons.X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {options.map((opt) => {
                    const isSelected = selectedIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`w-full text-right px-4 py-3 rounded-2xl flex items-center justify-between transition-all border text-xs font-bold ${
                          isSelected
                            ? 'border-[#ED1C24] bg-red-50/5 text-[#ED1C24]'
                            : 'border-gray-200/80 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#ED1C24] bg-[#ED1C24] text-white' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <LucideIcons.Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedIds.length === 0}
                  onClick={handleSendReport}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 outline-none transition-all ${
                    selectedIds.length > 0
                      ? 'bg-[#ED1C24] hover:bg-[#D0171E] text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>ارسال گزارش</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// Interactive Swipe to Confirm button component
function SwipeButton({ onConfirm }: { onConfirm: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const handleWidth = 48; // Width of w-12 is 48px
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Measure width of the container on mount
    if (containerRef.current) {
      setTrackWidth(containerRef.current.offsetWidth);
    }

    // Recalculate width on window resize
    const handleResize = () => {
      if (containerRef.current) {
        setTrackWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const measureWidth = () => {
    if (containerRef.current) {
      setTrackWidth(containerRef.current.offsetWidth);
    }
  };

  // Safe maximum drag distance (container width minus handle width and padding)
  const maxDrag = trackWidth > 0 ? trackWidth - handleWidth - 8 : 280;
  const x = useMotionValue(0);

  // Success pale green track overlay width that dynamically fits behind the handle
  const progressWidth = useTransform(x, (value) => {
    return `${value + handleWidth}px`;
  });

  // Dynamic opacity for hint text as swipe progresses
  const textOpacity = useTransform(x, [0, maxDrag * 0.7], [1, 0]);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= maxDrag * 0.9) {
      // Trigger success confirmation
      setIsSuccess(true);
      animate(x, maxDrag, { type: 'spring', stiffness: 350, damping: 25 });
      
      // Try to trigger modern mobile haptic vibration
      if (navigator.vibrate) {
        try {
          navigator.vibrate(80);
        } catch (e) {
          console.log('Vibration not supported or blocked:', e);
        }
      }

      setTimeout(() => {
        onConfirm();
      }, 350);
    } else {
      // Return handle to start with a spring animation
      animate(x, 0, { type: 'spring', stiffness: 250, damping: 22 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={measureWidth}
      onTouchStart={measureWidth}
      className="relative w-full h-14 bg-gray-100 rounded-full p-1 flex items-center overflow-hidden select-none border border-gray-200/50"
      dir="ltr" // Drag is strictly left-to-right (0 to maxDrag)
    >
      {/* Dynamic pale green progress bar (placed strictly behind handle) */}
      <motion.div
        style={{ width: progressWidth }}
        className="absolute left-1 top-1 bottom-1 bg-emerald-500/10 rounded-full z-0 pointer-events-none"
      />

      {/* Persian Slide to confirm guide text */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 font-black text-xs select-none z-0"
        dir="rtl"
      >
        <span>⟫ بکشید برای تایید حضور</span>
      </motion.div>

      {/* Draggable slider handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.03}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="w-12 h-12 bg-[#ED1C24] rounded-full flex items-center justify-center text-white shadow-md cursor-grab active:cursor-grabbing z-10 border border-red-600/10 shrink-0"
      >
        {isSuccess ? (
          <LucideIcons.Check className="w-5 h-5 text-white animate-bounce" />
        ) : (
          <LucideIcons.ArrowRight className="w-5 h-5 text-white" />
        )}
      </motion.div>
    </div>
  );
}

// 2. Confirmation Join Event Drawer
function ConfirmationDrawer({
  isOpen,
  onClose,
  event,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: AppEvent;
  onConfirm: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3" />

        <div className="px-6 pb-8 space-y-5 text-right">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-gray-900">تایید نهایی ثبت نام</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">اطلاعات حضور خود را نهایی کنید</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-50/70 p-4.5 rounded-2xl border border-gray-100/50 space-y-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400">نام رویداد</span>
              <span className="text-sm font-black text-gray-900 leading-tight">{event.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-gray-400">تاریخ برگزاری</span>
                <span className="text-xs font-black text-gray-800">{event.date}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-gray-400">برگزارکننده</span>
                <span className="text-xs font-black text-gray-800">{event.organizer}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-[11px] font-bold text-center leading-relaxed">
            کاربر گرامی، حضور شما در رویداد با کشیدن دکمه زیر به سمت راست قطعی خواهد شد.
          </p>

          <div className="flex flex-col gap-3 pt-1">
            <SwipeButton onConfirm={onConfirm} />
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-500 hover:bg-gray-200/80 py-3 rounded-2xl font-black text-xs transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// 3. Write Review Drawer (Redesigned sheet)
function WriteReviewDrawer({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    onSubmit(rating, commentText);
    setCommentText('');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3" />

        <div className="px-6 pb-8 space-y-5 text-right flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-gray-900">ثبت نظر و امتیاز جدید</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">تجربه ارزشمندتان را با ما به اشتراک بگذارید</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Stars interactive control */}
          <div className="flex flex-col items-center gap-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/40">
            <span className="text-[10px] font-black text-gray-400">به این رویداد چند ستاره می‌دهید؟</span>
            <div className="flex items-center gap-1.5" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 outline-none"
                >
                  <LucideIcons.Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Text area */}
          <div className="space-y-1 text-right">
            <label className="text-[10px] font-black text-gray-500 mr-1">متن نظر شما</label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="نکات مثبت، محیط برگزاری یا پیشنهاداتی که برای برگزارکننده دارید بنویسید..."
              className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#007AFF] focus:bg-white focus:ring-4 focus:ring-blue-50/20 transition-all min-h-[100px] resize-none"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all outline-none"
          >
            <LucideIcons.Send className="w-4 h-4" />
            <span>ثبت نهایی نظر</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// 4. Participants List Drawer
function ParticipantsDrawer({
  isOpen,
  onClose,
  participants,
}: {
  isOpen: boolean;
  onClose: () => void;
  participants: any[];
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[75vh] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

        <div className="px-6 pb-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col text-right">
            <h2 className="text-lg font-black text-gray-900">لیست شرکت‌کنندگان</h2>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">
              {participants.length} نفر ثبت‌نام شده فعال
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
          >
            <LucideIcons.X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar">
          <div className="space-y-3.5 mt-2">
            {participants.map((person) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={person.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100/30"
              >
                <div className="flex items-center gap-3 text-right">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-xs object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">{person.name}</span>
                    <span className="text-[9px] font-bold text-gray-400">{person.role}</span>
                  </div>
                </div>
                <button className="text-[9px] font-black text-[#007AFF] bg-blue-50/75 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                  مشاهده پروفایل
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// 5. Navigation/Map Directions Drawer
function NavigationDrawer({
  isOpen,
  onClose,
  locationName,
}: {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
}) {
  const [selectedApp, setSelectedApp] = useState<string>('neshan');

  const handleOpenApp = () => {
    // Open standard map applications in Iran
    const query = encodeURIComponent(locationName);
    if (selectedApp === 'google') {
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else if (selectedApp === 'neshan') {
      window.open(`https://nshn.ir/?q=${query}`, '_blank');
    } else {
      window.open(`https://balad.ir/search?q=${query}`, '_blank');
    }
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3" />

        <div className="px-6 pb-8 space-y-5 text-right">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-gray-900">مسیریابی رویداد</h2>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">اپلیکیشن موردنظر خود را انتخاب کنید</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Map Apps List */}
          <div className="space-y-2">
            {[
              { id: 'neshan', name: 'نشان (پیشنهادی)', desc: 'مسیریاب ایرانی نشان' },
              { id: 'balad', name: 'بلد', desc: 'نقشه و مسیریاب بلد' },
              { id: 'google', name: 'گوگل مپس', desc: 'Google Maps' },
            ].map((app) => {
              const isSelected = selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`w-full text-right p-4 rounded-2xl flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'border-[#007AFF] bg-blue-50/5'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-black text-gray-800">{app.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">{app.desc}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#007AFF]' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#007AFF]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Directions button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenApp}
            className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 outline-none transition-all"
          >
            <LucideIcons.Compass className="w-4.5 h-4.5" />
            <span>باز کردن و مسیریابی</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
