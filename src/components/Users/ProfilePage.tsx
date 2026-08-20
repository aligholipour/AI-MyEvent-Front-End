// ProfilePage.tsx
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, ChevronLeft, Camera, Mail, Headphones, Settings, CalendarDays,
  LayoutList, Scale, ArrowRight,
  Edit3, Briefcase, Calendar, Crown, Zap, Ticket, Percent, Gift,
  Award, Star, Trophy, Users, ShieldCheck, Info, LogOut,
  UserCog as UserCogIcon, Heart, Image,
  User2,
  Building2,
  BarChart3,

} from "lucide-react";
import ImageCropperDrawer from "../Shared/ImageCropperDrawer";
import { User } from "@/src/services/Auth/Auth";
import { toPersianDigits } from "@/src/lib/utils";

// Sub-component for Menu Items (matching AI design)
function MenuItemRow({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = 'gray',
  variant = 'default',
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'gray' | 'emerald' | 'amber' | 'red';
  variant?: 'default' | 'destructive';
  onClick?: () => void;
}) {
  const isDestructive = variant === 'destructive';

  const badgeColorClasses = {
    gray: 'bg-gray-100 text-gray-600 border-gray-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80',
  }[badgeColor];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 flex items-center justify-between text-right transition-colors cursor-pointer ${isDestructive ? 'hover:bg-rose-50/50' : 'hover:bg-gray-50/80'
        }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isDestructive
            ? 'bg-rose-50 text-rose-600 border-rose-100'
            : 'bg-gray-50 text-gray-700 border-gray-100'
            }`}
        >
          {icon}
        </div>

        <div className="min-w-0 space-y-0.5">
          <h4
            className={`text-xs font-black truncate ${isDestructive ? 'text-rose-600' : 'text-gray-900'
              }`}
          >
            {title}
          </h4>
          {subtitle && (
            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[240px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-lg border ${badgeColorClasses}`}>
            {badge}
          </span>
        )}
        <ChevronLeft className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  );
}

function ProfilePage({
  onBack,
  onLogout,
  onUpdateUser,
  user,
  navigateToTab,
  onOpenSupportTickets,
  onOpenEditProfile,
  onOpenOrganizerProfile,
  onOpenOrganizerAnalytics,
  onOpenPersonalCalendar
}: {
  user: User | null;
  onBack: () => void;
  onLogout?: () => void;
  onUpdateUser?: (user: User) => void;
  key?: React.Key;
  navigateToTab?: (tab: string) => void;
  onOpenSupportTickets: () => void;
  onOpenEditProfile: () => void;
  onOpenOrganizerProfile?: () => void;
  onOpenOrganizerAnalytics?: () => void;
  onOpenPersonalCalendar?: () => void
}) {
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
      className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F9FC]"
      dir="rtl"
    >
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      {/* Header Bar - AI Design */}
      <header className="sticky top-0 z-30 px-5 pt-8 pb-3 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center font-black">
            <User2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-gray-900 leading-none">پروفایل کاربری</h1>
            <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">مدیریت حساب، امتیازات و تنظیمات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100"
            title="ویرایش حساب"
          >
            <UserCogIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
            title="بازگشت"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* User Main Card - AI Design */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            {/* بخش چپ: آواتار + اطلاعات */}
            <div className="flex items-center gap-4">
              {/* Avatar with Camera Overlay */}
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-[#ED1C24] via-amber-400 to-rose-500 shadow-md">
                  <img
                    src={process.env.File_BaseURL + user.profileAddress}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-[14px] bg-gray-100"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[1px]">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* اطلاعات کاربر */}
              <div className="space-y-1.5">
                {/* نام کاربر */}
                <h2 className="text-base font-black text-gray-900 leading-tight">
                  {user.username}
                </h2>

                {/* شغل - در یک خط جداگانه */}
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-gray-500">
                  <Briefcase className="w-3 h-3 text-gray-400" />
                  <span>{user.jobTitle || 'فعال حوزه تکنولوژی'}</span>
                </div>

                {/* تاریخ تولد - در یک خط جداگانه زیر شغل */}
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-gray-500">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>تاریخ تولد: {toPersianDigits(user.birthDate) || '۱۴۰۲/۰۳/۱۰'}</span>
                </div>
              </div>
            </div>

            {/* بخش راست: شماره موبایل */}
            <div className="flex items-center pt-1">
              <p className="text-sm font-bold text-gray-400" dir="ltr">
                {toPersianDigits(user.phone)}
              </p>
            </div>
          </div>

          {/* Quick Edit Action Button */}
          {/* <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-400 truncate max-w-[220px]">
              {user.bio ? `«${user.bio}»` : 'توضیحات بیوگرافی ثبت نشده است'}
            </p>
            <button
              type="button"
              onClick={onOpenEditProfile}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98 shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>ویرایش پروفایل</span>
            </button>
          </div> */}
        </div>

        {/* VIP Event Club Card - AI Design */}
        {/* <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-5 border border-amber-500/30 shadow-xl overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-700" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#ED1C24]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <Crown className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-wide">باشگاه مخاطبان هم‌مسیر</h3>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                    VIP GOLD
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">سطح طلایی · عضویت ویژه دورهمی‌ها</p>
              </div>
            </div>

            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>اشتراک فعال</span>
            </span>
          </div>

          <div className="py-4 space-y-2.5 relative z-10">
            <div className="flex items-center justify-between text-xs font-black">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-black text-white">۲,۴۵۰ XP</span>
                <span className="text-[10px] text-amber-300/80 font-bold">(امتیاز تجربه رویدادی)</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">۷۵۰ XP تا سطح الماس</span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-[#ED1C24] rounded-full w-[78%] transition-all duration-1000 shadow-xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10">
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-all flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block">بلیط رایگان ماهانه</span>
                <span className="text-xs font-black text-white truncate block">۲ از ۳ بلیت باقی‌مانده</span>
              </div>
            </div>

            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-all flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block">تخفیف ویژه دورهمی‌ها</span>
                <span className="text-xs font-black text-white truncate block">۲۰٪ تخفیف تمام بلیط‌ها</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
            <button
              type="button"
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 h-9 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
            >
              <Gift className="w-3.5 h-3.5 fill-slate-950" />
              <span>دعوت از دوستان (+۵۰ سکه)</span>
            </button>

            <button
              type="button"
              className="px-3.5 bg-white/10 hover:bg-white/20 text-white h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10 flex items-center gap-1"
            >
              <span>مزایا</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div> */}

        {/* Quick Activity Stats Grid - AI Design */}
        {/* <div className="grid grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (navigateToTab) {
                navigateToTab('my-events');
              } else {
                onBack();
              }
            }}
            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-red-200 transition-all text-center space-y-1.5 cursor-pointer active:scale-95 group"
          >
            <div className="w-9 h-9 mx-auto bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 block">۱۲</span>
              <span className="text-[9.5px] font-bold text-gray-400 block">تجارب من</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigateToTab) {
                navigateToTab('admin');
              } else {
                onBack();
              }
            }}
            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs hover:border-blue-200 transition-all text-center space-y-1.5 cursor-pointer active:scale-95 group"
          >
            <div className="w-9 h-9 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <LayoutList className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 block">۴</span>
              <span className="text-[9.5px] font-bold text-gray-400 block">میزبانی‌ها</span>
            </div>
          </button>

          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs text-center space-y-1.5">
            <div className="w-9 h-9 mx-auto bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 block">۶</span>
              <span className="text-[9.5px] font-bold text-gray-400 block">مدال‌ها</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs text-center space-y-1.5">
            <div className="w-9 h-9 mx-auto bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Star className="w-4 h-4 fill-emerald-500" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 block">۴.۹</span>
              <span className="text-[9.5px] font-bold text-gray-400 block">امتیاز میزبانی</span>
            </div>
          </div>
        </div> */}

        {/* Badges & Achievements Section - AI Design */}
        {/* <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black text-gray-900">نشان‌ها و دستاوردهای رویدادی</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400">۶ از ۱۰ باز شده</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-1">
            <div className="flex-shrink-0 bg-gradient-to-b from-amber-50 to-orange-50/50 p-3 rounded-2xl border border-amber-200/60 w-28 text-center space-y-1">
              <div className="w-9 h-9 bg-amber-500 text-white rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-gray-800 block truncate">شبکه‌ساز برتر</span>
              <span className="text-[8.5px] font-bold text-amber-700 block">+۱۰ دورهمی</span>
            </div>

            <div className="flex-shrink-0 bg-gradient-to-b from-blue-50 to-indigo-50/50 p-3 rounded-2xl border border-blue-200/60 w-28 text-center space-y-1">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-gray-800 block truncate">میزبان طلایی</span>
              <span className="text-[8.5px] font-bold text-blue-700 block">رضایت ۹۹٪</span>
            </div>

            <div className="flex-shrink-0 bg-gradient-to-b from-rose-50 to-red-50/50 p-3 rounded-2xl border border-rose-200/60 w-28 text-center space-y-1">
              <div className="w-9 h-9 bg-rose-500 text-white rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-gray-800 block truncate">عکاس خاطرات</span>
              <span className="text-[8.5px] font-bold text-rose-700 block">+۵ آلبوم عکس</span>
            </div>

            <div className="flex-shrink-0 bg-gradient-to-b from-emerald-50 to-teal-50/50 p-3 rounded-2xl border border-emerald-200/60 w-28 text-center space-y-1">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-gray-800 block truncate">حاضربکف</span>
              <span className="text-[8.5px] font-bold text-emerald-700 block">ثبت‌نام سریع</span>
            </div>
          </div>
        </div> */}

        {/* Categorized Menu Section 1: Events & Activity */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black text-gray-400 px-1">رویدادها و فعالیت‌های من</h4>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden divide-y divide-gray-50">

            {/* <MenuItemRow
              icon={<Building2 className="w-4 h-4 text-amber-500" />}
              title="پروفایل برگزارکننده من"
              subtitle="صفحه عمومی برند، لوگو، معرفی، خاطرات (Shorts) و لیست میزبانی‌ها"
              badge="صفحه میزبانی"
              badgeColor="amber"
              onClick={onOpenOrganizerProfile}
            />

            <MenuItemRow
              icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
              title="تحلیل و گزارش عملکرد رویدادها"
              subtitle="گزارش شرکت‌کنندگان، رده سنی، درصد علاقه‌مندی‌ها، مشاغل و نرخ حضور مجدد"
              badge="گزارش تحلیلی"
              badgeColor="emerald"
              onClick={onOpenOrganizerAnalytics}
            />

            <MenuItemRow
              icon={<CalendarDays className="w-4 h-4 text-[#ED1C24]" />}
              title="تقویم شخصی و یادآوری رویدادها"
              subtitle="نمایش گرافیکی برنامه‌ها، هشدارها و زمان‌بندی رویدادهای ثبت‌نام شده"
              badge="تقویم تصویری"
              badgeColor="amber"
              onClick={onOpenPersonalCalendar}
            /> */}

            <MenuItemRow
              icon={<Ticket className="w-4 h-4 text-[#ED1C24]" />}
              title="رویدادهای من"
              subtitle="مدیریت تجارب ثبت‌نام شده و میزبانی‌های شما"
              badge="۱۲ رویداد"
              onClick={() => {
                if (navigateToTab) {
                  navigateToTab('my-events');
                } else {
                  onBack();
                }
              }}
            />

            <MenuItemRow
              icon={<UserCogIcon className="w-4 h-4 text-blue-600" />}
              title="ویرایش حساب کاربری"
              subtitle="تغییر نام، تصویر، شماره تماس و اطلاعات فردی"
              onClick={onOpenEditProfile}
            />

            {/* <MenuItemRow
              icon={<Heart className="w-4 h-4 text-rose-500" />}
              title="علاقه‌مندی‌ها و موضوعات"
              subtitle="مدیریت دسته‌بندی‌های موردعلاقه برای پیشنهاد رویداد"
              onClick={() => alert('علاقه‌مندی‌ها به‌زودی فعال می‌شود.')}
            />

            <MenuItemRow
              icon={<Image className="w-4 h-4 text-purple-600" />}
              title="آلبوم خاطرات من"
              subtitle="مشاهده تصاویر و لحظات ثبت شده در رویدادها"
              onClick={() => alert('آلبوم خاطرات به‌زودی فعال می‌شود.')}
            /> */}
          </div>
        </div>

        {/* Categorized Menu Section 2: Support & Invite */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black text-gray-400 px-1">پشتیبانی و ارتباطات</h4>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden divide-y divide-gray-50">
            <MenuItemRow
              icon={<Mail className="w-4 h-4 text-[#ED1C24]" />}
              title="تیکت‌های پشتیبانی"
              subtitle="ثبت و پیگیری تیکت‌ها و درخواست‌های شما"
              badge="پاسخ داده شده"
              badgeColor="emerald"
              onClick={onOpenSupportTickets}
            />

            {/* <MenuItemRow
              icon={<Headphones className="w-4 h-4 text-emerald-600" />}
              title="ارتباط با پشتیبانی تلفنی"
              subtitle="پاسخگویی ۲۴ ساعته در تمام روزهای هفته"
              onClick={() => alert('شماره پشتیبانی: ۰۲۱-۹۱۰۰۲۴۲۴')}
            /> */}

            {/* <MenuItemRow
              icon={<Gift className="w-4 h-4 text-amber-500" />}
              title="دعوت از دوستان"
              subtitle="دریافت ۵۰ سکه هدیه به ازای هر دعوت موفق"
              badge="+۵۰ سکه"
              badgeColor="amber"
              onClick={() => alert('لینک دعوت کپی شد!')}
            /> */}
          </div>
        </div>

        {/* Categorized Menu Section 3: App Settings & System */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-black text-gray-400 px-1">تنظیمات و امنیت</h4>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden divide-y divide-gray-50">
            {/* <MenuItemRow
              icon={<Settings className="w-4 h-4 text-gray-600" />}
              title="تنظیمات اعلانات"
              subtitle="مدیریت پیامک‌ها و اعلانات رویدادها"
              onClick={() => alert('تنظیمات اعلانات با موفقیت ذخیره شد.')}
            /> */}

            <MenuItemRow
              icon={<ShieldCheck className="w-4 h-4 text-indigo-600" />}
              title="حریم خصوصی و امنیت"
              subtitle="مدیریت دسترسی‌ها و ورود به حساب"
              onClick={() => alert('امنیت حساب شما در حالت ایمن قرار دارد.')}
            />

            <MenuItemRow
              icon={<Scale className="w-4 h-4 text-slate-500" />}
              title="قوانین و مقررات"
              subtitle="مشاهده قوانین استفاده از پلتفرم"
              onClick={() => alert('قوانین و مقررات به‌زودی نمایش داده می‌شود.')}
            />

            <MenuItemRow
              icon={<LogOut className="w-4 h-4 text-rose-500" />}
              title="خروج از حساب کاربری"
              subtitle="خروج ایمن از این دستگاه"
              variant="destructive"
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>

        {/* App Version Info */}
        <div className="text-center pt-2 pb-6 space-y-1">
          <p className="text-[10px] font-bold text-gray-400">هم‌مسیر · پلتفرم تجربه و دورهمی‌های صمیمی</p>
          <p className="text-[9px] font-mono text-gray-300">Version 2.4.0 (Build 2026)</p>
        </div>
      </div>

      {/* Image Cropper */}
      <ImageCropperDrawer
        image={tempImage}
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setTempImage(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        onCropComplete={(croppedImage) => onUpdateUser?.({ ...user, profileAddress: croppedImage })}
        aspectRatio={1}
      />

      {/* Logout Confirmation Modal - AI Design */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-2xl z-[230] text-gray-900 border border-gray-100 my-auto text-center space-y-4"
              dir="rtl"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900">خروج از حساب کاربری</h3>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">
                  آیا اطمینان دارید که می‌خواهید از حساب خود خارج شوید؟
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    onLogout?.();
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  بله، خروج
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default ProfilePage;