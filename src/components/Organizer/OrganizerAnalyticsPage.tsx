import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface OrganizerAnalyticsPageProps {
  onBack: () => void;
  organizerName?: string;
  onOpenEvent?: (eventId: string) => void;
}

// Data structures for Analytics
interface InterestStat {
  label: string;
  percent: number;
  count: number;
  color: string;
}

interface AgeStat {
  range: string;
  percent: number;
  label: string;
  color: string;
}

interface JobStat {
  title: string;
  percent: number;
  icon: string;
  color: string;
}

interface EventPerformance {
  id: string;
  title: string;
  views: string;
  registrations: number;
  conversionRate: string;
  rating: number;
  date: string;
}

export function OrganizerAnalyticsPage({
  onBack,
  organizerName = 'خانه و کانون نوآوری برنا',
  onOpenEvent,
}: OrganizerAnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<'all' | '6m' | '3m' | '30d'>('all');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // 1. Interests Breakdown
  const interestsData: InterestStat[] = [
    { label: 'هوش مصنوعی و داده', percent: 38, count: 3230, color: '#ED1C24' },
    { label: 'طراحی محصول و UX', percent: 26, count: 2210, color: '#F59E0B' },
    { label: 'شبکه‌سازی و استارتاپ', percent: 21, count: 1785, color: '#3B82F6' },
    { label: 'کارگاه‌های عملی کدنویسی', percent: 15, count: 1275, color: '#10B981' },
  ];

  // 2. Age Range Breakdown
  const ageData: AgeStat[] = [
    { range: '۱۸ تا ۲۴ سال', percent: 28, label: 'دانشجویان و تازه‌واردان', color: '#6366F1' },
    { range: '۲۵ تا ۳۴ سال', percent: 48, label: 'متخصصین و بدنه اصلی', color: '#ED1C24' },
    { range: '۳۵ تا ۴۴ سال', percent: 16, label: 'مدیران و رهبران تیم', color: '#F59E0B' },
    { range: 'بالای ۴۵ سال', percent: 8, label: 'مشاوران و پیشکسوتان', color: '#10B981' },
  ];

  // 3. Occupation / Job Breakdown
  const jobData: JobStat[] = [
    { title: 'برنامه‌نویس و توسعه‌دهنده', percent: 32, icon: 'Code', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'طراح تجربه و رابط کاربری (UX/UI)', percent: 24, icon: 'Palette', color: 'text-[#ED1C24] bg-red-50 border-red-100' },
    { title: 'مدیر محصول و کارآفرین', percent: 18, icon: 'Briefcase', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'دانشجو و پژوهشگر', percent: 15, icon: 'GraduationCap', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'دیجیتال مارکتینگ و سایر', percent: 11, icon: 'Megaphone', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  // 4. Repeat Attendance / Loyalty Data
  const loyaltyData = {
    overallRepeatRate: 68.4,
    totalRepeatAttendees: 5814,
    segments: [
      { label: '۱ بار شرکت کرده‌اند (جدید)', percent: 31.6, count: 2686, color: '#9CA3AF', description: 'ورودی‌های تازه و مخاطبان جدید' },
      { label: '۲ تا ۳ بار شرکت کرده‌اند (وفادار)', percent: 45.2, count: 3842, color: '#F59E0B', description: 'مخاطبان همیشگی رویدادها' },
      { label: 'بیش از ۴ بار شرکت کرده‌اند (حامی)', percent: 23.2, count: 1972, color: '#ED1C24', description: 'حامیان اصلی و اعضای فعال' },
    ]
  };

  // 5. Event Views & Performance Traffic
  const topEventsPerformance: EventPerformance[] = [
    {
      id: 'org-evt-1',
      title: 'همایش سراسری معماران نرم‌افزار',
      views: '۴۲,۸۰۰',
      registrations: 520,
      conversionRate: '۱.۲٪',
      rating: 4.9,
      date: 'آبان ۱۴۰۲',
    },
    {
      id: 'org-evt-2',
      title: 'بوت‌کمپ هوش مصنوعی و کدنویسی',
      views: '۳۵,۱۰۰',
      registrations: 410,
      conversionRate: '۱.۱٪',
      rating: 4.8,
      date: 'مهر ۱۴۰۲',
    },
    {
      id: 'org-evt-3',
      title: 'تور شبکه‌سازی و رصد ستارگان مرنجاب',
      views: '۲۸,۶۰۰',
      registrations: 280,
      conversionRate: '۰.۹٪',
      rating: 5.0,
      date: 'شهریور ۱۴۰۲',
    },
    {
      id: 'org-evt-4',
      title: 'کارگاه عملی طراحی تجربه کاربری UX',
      views: '۱۸,۴۰۰',
      registrations: 350,
      conversionRate: '۱.۹٪',
      rating: 4.9,
      date: 'مرداد ۱۴۰۲',
    },
  ];

  // SVG Donut Slices Helper
  const renderDonutSlices = () => {
    let cumulativePercent = 0;
    const slices = interestsData.map((item) => {
      const startAngle = (cumulativePercent / 100) * 360;
      cumulativePercent += item.percent;
      const endAngle = (cumulativePercent / 100) * 360;

      const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const largeArcFlag = item.percent > 50 ? 1 : 0;
      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return {
        ...item,
        pathData,
      };
    });

    return slices;
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
      className="flex-1 overflow-y-auto no-scrollbar pb-12 bg-[#F8F9FC]"
      dir="rtl"
    >
      {/* Header Bar */}
      <header className="sticky top-0 z-30 px-5 pt-8 pb-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center font-black">
            <LucideIcons.BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-gray-900 leading-none">تحلیل و گزارش عملکرد</h1>
            <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">{organizerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              alert('گزارش جامع آماری به صورت PDF در حال دریافت است...');
            }}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors cursor-pointer border border-gray-100 active:scale-95"
            title="دانلود گزارش"
          >
            <LucideIcons.Download className="w-4 h-4" />
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
        {/* Time Filter Bar */}
        <div className="flex items-center justify-between gap-1 p-1 bg-white rounded-2xl border border-gray-100 shadow-2xs">
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`flex-1 py-1.5 text-[10.5px] font-black rounded-xl transition-all cursor-pointer text-center ${
              timeRange === 'all' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            همه زمان‌ها
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('6m')}
            className={`flex-1 py-1.5 text-[10.5px] font-black rounded-xl transition-all cursor-pointer text-center ${
              timeRange === '6m' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ۶ ماه اخیر
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('3m')}
            className={`flex-1 py-1.5 text-[10.5px] font-black rounded-xl transition-all cursor-pointer text-center ${
              timeRange === '3m' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ۳ ماه اخیر
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`flex-1 py-1.5 text-[10.5px] font-black rounded-xl transition-all cursor-pointer text-center ${
              timeRange === '30d' ? 'bg-gray-900 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ۳۰ روز اخیر
          </button>
        </div>

        {/* Executive Overview Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Total Attendees */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-bold">کل شرکت‌کنندگان</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <LucideIcons.Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">۸,۵۰۰+</span>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <LucideIcons.TrendingUp className="w-2.5 h-2.5" />
                ۱۲٪+
              </span>
            </div>
            <p className="text-[9px] font-bold text-gray-400">تعداد افراد ثبت‌نامی</p>
          </div>

          {/* Card 2: Total Views */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-bold">میزان بازدید رویدادها</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <LucideIcons.Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">۱۴۲,۵۰۰</span>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <LucideIcons.TrendingUp className="w-2.5 h-2.5" />
                ۲۴٪+
              </span>
            </div>
            <p className="text-[9px] font-bold text-gray-400">بازدید کل صفحات</p>
          </div>

          {/* Card 3: Repeat / Loyalty Rate */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-bold">نرخ حضور مجدد</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <LucideIcons.Repeat className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">۶۸.۴٪</span>
              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                مخاطب وفادار
              </span>
            </div>
            <p className="text-[9px] font-bold text-gray-400">شرکت در +۲ رویداد</p>
          </div>

          {/* Card 4: Satisfaction Rating */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-bold">میانگین رضایت‌مندی</span>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#ED1C24] flex items-center justify-center">
                <LucideIcons.Star className="w-3.5 h-3.5 fill-[#ED1C24]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">۴.۹</span>
              <span className="text-[9px] font-bold text-gray-400">از ۵ امتیاز</span>
            </div>
            <p className="text-[9px] font-bold text-gray-400">از ۳۲۰ نظرسنجی</p>
          </div>
        </div>

        {/* SECTION 1: REPEAT ATTENDANCE & LOYALTY RATE (FEATURED) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <LucideIcons.RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900">تحلیل نرخ حضور مجدد و وفاداری مخاطبان</h3>
                <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">میزان بازگشت شرکت‌کنندگان در رویدادهای بعدی</p>
              </div>
            </div>

            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-xl">
              ۶۸.۴٪ وفاداری
            </span>
          </div>

          {/* Progress Stack Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex p-0.5">
              {loyaltyData.segments.map((seg, idx) => (
                <div
                  key={idx}
                  style={{ width: `${seg.percent}%`, backgroundColor: seg.color }}
                  className="h-full first:rounded-r-full last:rounded-l-full transition-all duration-500"
                  title={`${seg.label}: ${seg.percent}%`}
                />
              ))}
            </div>

            <div className="space-y-2 pt-2">
              {loyaltyData.segments.map((seg, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <div>
                      <span className="font-black text-gray-800 text-[11px] block">{seg.label}</span>
                      <span className="text-[9.5px] font-bold text-gray-400 block">{seg.description}</span>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-black text-gray-900 text-xs block">{seg.percent}٪</span>
                    <span className="text-[9.5px] font-bold text-gray-400 block">{seg.count.toLocaleString()} نفر</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insight Note */}
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 p-3 rounded-2xl border border-amber-200/60 flex items-start gap-2.5">
            <LucideIcons.Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10.5px] font-bold text-amber-900 leading-relaxed">
              <strong className="font-black">تحلیل هوشمند:</strong> ۶۸.۴٪ مخاطبان شما حداقل در ۲ رویداد شرکت داشته‌اند. این آمار نشان‌دهنده کیفیت بالای محتوا و برنامه‌ریزی صمیمی در برگزاری است.
            </p>
          </div>
        </div>

        {/* SECTION 2: INTERESTS BREAKDOWN (WITH PIE / DONUT CHART) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center font-black">
              <LucideIcons.PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900">درصد شرکت‌کنندگان به تفکیک علاقه‌مندی</h3>
              <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">موضوعات محبوب و مورد توجه مخاطبان شما</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            {/* SVG Donut Chart Visualizer */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xs">
                {renderDonutSlices().map((slice, idx) => (
                  <path
                    key={idx}
                    d={slice.pathData}
                    fill={slice.color}
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => setSelectedSegment(slice.label)}
                  />
                ))}
                {/* Inner cutout for Donut */}
                <circle cx="50" cy="50" r="26" fill="white" />
              </svg>

              {/* Center Donut Badge Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[9px] font-bold text-gray-400">کل موضوعات</span>
                <span className="text-xs font-black text-gray-900">۴ حوزه</span>
              </div>
            </div>

            {/* Interests Progress List */}
            <div className="space-y-2.5">
              {interestsData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-800 font-black">{item.label}</span>
                    </div>
                    <span className="text-gray-900 font-black">{item.percent}٪</span>
                  </div>

                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: AGE RANGE BREAKDOWN */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <LucideIcons.Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900">بازه سنی شرکت‌کنندگان</h3>
              <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">توزیع سنی مخاطبان حاضر در رویدادها</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {ageData.map((age, idx) => (
              <div key={idx} className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-gray-900 block">{age.range}</span>
                    <span className="text-[9.5px] font-bold text-gray-400 block">{age.label}</span>
                  </div>
                  <span className="font-black text-indigo-600 text-sm">{age.percent}٪</span>
                </div>

                <div className="h-2 w-full bg-gray-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${age.percent}%`, backgroundColor: age.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: OCCUPATION & JOB BREAKDOWN */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <LucideIcons.Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900">شغل و تخصص شرکت‌کنندگان (به درصد)</h3>
              <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">حوزه شغلی و نقش‌های حرفه‌ای مخاطبان</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {jobData.map((job, idx) => {
              const IconComp = (LucideIcons as any)[job.icon] || LucideIcons.Briefcase;

              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${job.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block">{job.title}</span>
                      <span className="text-[9.5px] font-bold text-gray-400 block">سهم از کل مخاطبان</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs font-black text-gray-900 block">{job.percent}٪</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: EVENT VIEWS & PERFORMANCE TRAFFIC */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                <LucideIcons.TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900">میزان بازدید و نرخ تبدیل به ثبت‌نام</h3>
                <p className="text-[9.5px] font-bold text-gray-400 mt-0.5">پربازدیدترین رویدادها و نرخ بازدهی</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {topEventsPerformance.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onOpenEvent?.(evt.id)}
                className="bg-gray-50/80 hover:bg-gray-100/80 transition-colors p-3.5 rounded-2xl border border-gray-100 cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-black text-gray-900 truncate">{evt.title}</h4>
                  <span className="text-[9.5px] font-bold text-gray-400 shrink-0">{evt.date}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-gray-200/60">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block">بازدید</span>
                    <span className="text-xs font-black text-gray-900 block">{evt.views}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block">ثبت‌نامی</span>
                    <span className="text-xs font-black text-emerald-600 block">{evt.registrations} نفر</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block">نرخ تبدیل</span>
                    <span className="text-xs font-black text-purple-600 block">{evt.conversionRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Full Report CTA */}
        {/* <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl text-center space-y-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <LucideIcons.FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black">دانلود فایل کامل خروجی تحلیل‌ها</h3>
            <p className="text-[10.5px] font-bold text-slate-300 leading-relaxed max-w-xs mx-auto">
              امکان دریافت فایل اکسل (XLSX) یا PDF لیست شرکت‌کنندگان و گزارش‌های آماری تفکیکی
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('فایل اکسل گزارش تحلیلی رویدادها ایجاد و آماده دریافت شد.')}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md hover:from-amber-400 hover:to-amber-300 active:scale-98 flex items-center justify-center gap-2"
          >
            <LucideIcons.Download className="w-4 h-4" />
            <span>دانلود خروجی کامل اکسل / PDF</span>
          </button>
        </div> */}
      </div>
    </motion.main>
  );
}
