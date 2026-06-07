import { useRef, useState } from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, Camera, Coins, Heart, Diamond, ShoppingCart, Mail, Headphones, Settings, Gift, Info } from "lucide-react";
import MenuItem from "../Shared/MenuItem";
import InterestsDrawer from "../Shared/InterestsDrawer";
import ImageCropperDrawer from "../Shared/ImageCropperDrawer";
// import { AppUser } from "../../types";
// import { useAuth } from "../Auth/AuthContext";
import { User } from "@/src/services/Auth/Auth";

function ProfilePage({ onBack, onLogout, onUpdateUser, user }
    : {
        user: User | null;
        onBack: () => void;
        onLogout?: () => void;
        onUpdateUser?: (user: User) => void;
        key?: React.Key
    }) {
    const [isInterestsDrawerOpen, setIsInterestsDrawerOpen] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const { user, logout } = useAuth();

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
                                src={user.profileAddress}
                                alt="profile"
                                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        {/* {user.isVerified && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                                Verif
                            </div>
                        )} */}
                    </div>
                    <div className="flex flex-col items-start text-right">
                        <h1 className="text-lg font-black text-gray-900 leading-none">{user.username}</h1>
                        <p className="text-xs font-bold text-gray-400 mt-1" dir="ltr">{user.username}</p>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm active:scale-90 transition-transform">
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
                    onClick={() => {
                        if (onLogout) onLogout();
                    }}
                />
            </section>
            {/* 
            <InterestsDrawer
                isOpen={isInterestsDrawerOpen}
                onClose={() => setIsInterestsDrawerOpen(false)}
                selectedInterests={user.interests || []}
                onToggle={() => { }} // Read-only in profile for now or could implement it
            /> */}

            <ImageCropperDrawer
                image={tempImage}
                isOpen={isCropperOpen}
                onClose={() => { setIsCropperOpen(false); setTempImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                onCropComplete={(croppedImage) => onUpdateUser?.({ ...user, profileAddress: croppedImage })}
                aspectRatio={1}
            />
        </motion.main>
    );
}

export default ProfilePage;