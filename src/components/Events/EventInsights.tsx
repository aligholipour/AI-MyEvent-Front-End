import { motion } from "motion/react";
import { Star, Diamond, Users, Clock } from "lucide-react";

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

export default EventInsights;