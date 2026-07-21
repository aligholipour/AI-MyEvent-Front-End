import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppUser, Favourite } from '../../types';
import { ImageCropperDrawer } from '../Shared/ImageCropperDrawer';
import InterestsDrawer from '../../components/Shared/InterestsDrawer'
import { User } from '@/src/services/Auth/Auth';

interface EditProfilePageProps {
    user: User;
    onBack: () => void;
    onSave: (updatedUser: AppUser) => void;
}

export function EditProfilePage({ user, onBack, onSave }: EditProfilePageProps) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        birthDate: user.birthDate || '',
        gender: (user.gender || 'male') as 'male' | 'female',
        maritalStatus: (user.maritalStatus || 'single') as 'single' | 'married',
        occupation: user.occupation || '',
        about: user.about || '',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        interests: user.interests || []
    });

    const [isInterestsOpen, setIsInterestsOpen] = useState(false);
    const [allFavourites, setAllFavourites] = useState<Favourite[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isInterestsDrawerOpen, setIsInterestsDrawerOpen] = useState(false);

    // Image cropping state
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImage(reader.result as string);
                setIsCropperOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const getInterestTitle = (id: number) => {
        const favourite = allFavourites.find(f => f.id === id);
        return favourite?.title || String(id);
    };

    const toggleInterest = (interest: number) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleFavouritesLoaded = (favourites: Favourite[]) => {
        setAllFavourites(favourites);
    };

    // const handleToggleInterest = (interest: string) => {
    //     setFormData(prev => {
    //         const exists = prev.interests.includes(interest);
    //         if (exists) {
    //             return { ...prev, interests: prev.interests.filter(i => i !== interest) };
    //         } else {
    //             return { ...prev, interests: [...prev.interests, interest] };
    //         }
    //     });
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        setTimeout(() => {
            const updatedUser: AppUser = {
                ...user,
                name: formData.name.trim() || user.name,
                phone: formData.phone.trim() || user.phone,
                email: formData.email.trim(),
                birthDate: formData.birthDate.trim(),
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                occupation: formData.occupation.trim(),
                about: formData.about.trim(),
                avatar: formData.avatar,
                interests: formData.interests
            };

            setIsSaving(false);
            setShowSuccessToast(true);
            onSave(updatedUser);

            setTimeout(() => {
                onBack();
            }, 900);
        }, 600);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
            className="flex-1 flex flex-col w-full overflow-hidden bg-[#F8F9FC]"
            dir="rtl"
        >
            {/* Header - Compact and Minimal */}
            <header className="px-5 pt-8 pb-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <LucideIcons.UserCog className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start text-right">
                        <h1 className="text-xs font-black text-gray-900 leading-none">
                            ویرایش حساب کاربری
                        </h1>
                        <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                            به‌روزرسانی مشخصات و اطلاعات فردی
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                    <LucideIcons.ArrowRight className="w-4 h-4 text-gray-700" />
                </button>
            </header>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mx-5 mt-3 p-3 bg-emerald-500 text-white text-[10px] font-black rounded-xl flex items-center justify-between shadow-md z-20"
                    >
                        <div className="flex items-center gap-2">
                            <LucideIcons.CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>اطلاعات کاربری با موفقیت به روز شد</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 pb-24">

                {/* Avatar Section */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2.5 shadow-xs">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group cursor-pointer"
                    >
                        <div className="w-18 h-18 rounded-full border-2 border-blue-500/80 p-0.5 overflow-hidden transition-all group-hover:border-blue-600 shadow-xs">
                            <img
                                src={formData.avatar}
                                alt="Profile Avatar"
                                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                <LucideIcons.Camera className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm">
                            <LucideIcons.Pencil className="w-2.5 h-2.5" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 mt-1 cursor-pointer"
                        >
                            تغییر تصویر پروفایل
                        </button>
                        <span className="text-[8px] font-bold text-gray-400">فرمت‌های مجاز: JPG, PNG</span>
                    </div>
                </div>

                {/* Basic Info Group */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-3 shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-800 font-black text-[11px] pb-1 border-b border-gray-50">
                        <LucideIcons.User className="w-3.5 h-3.5 text-blue-600" />
                        <span>اطلاعات اصلی</span>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">نام و نام خانوادگی</label>
                        <input
                            type="text"
                            placeholder="مثال: علی محمدی"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 h-9 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right"
                        />
                    </div>

                    {/* Phone (Readonly / Disabled indicator) */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">شماره همراه (شناسه حساب)</label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                dir="ltr"
                                value={formData.phone}
                                className="w-full bg-gray-100/70 border border-gray-100 h-9 px-3 pl-8 rounded-xl text-[11px] font-bold text-gray-500 cursor-not-allowed text-left"
                            />
                            <LucideIcons.Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">پست الکترونیکی (ایمیل)</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            dir="ltr"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 h-9 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-left"
                        />
                    </div>
                </div>

                {/* Personal Details Group */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-3 shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-800 font-black text-[11px] pb-1 border-b border-gray-50">
                        <LucideIcons.Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>مشخصات فردی</span>
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">تاریخ تولد</label>
                        <input
                            type="text"
                            placeholder="۱۳۷۵/۰۶/۱۵"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 h-9 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right"
                        />
                    </div>

                    {/* Gender & Marital status Grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {/* Gender */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 mr-0.5">جنسیت</label>
                            <div className="grid grid-cols-2 gap-1 bg-gray-50 p-1 border border-gray-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={`h-7 rounded-lg text-[9px] font-black transition-all cursor-pointer ${formData.gender === 'male'
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    مرد
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={`h-7 rounded-lg text-[9px] font-black transition-all cursor-pointer ${formData.gender === 'female'
                                        ? 'bg-white text-rose-600 shadow-xs'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    زن
                                </button>
                            </div>
                        </div>

                        {/* Marital status */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 mr-0.5">وضعیت تأهل</label>
                            <div className="grid grid-cols-2 gap-1 bg-gray-50 p-1 border border-gray-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, maritalStatus: 'single' })}
                                    className={`h-7 rounded-lg text-[9px] font-black transition-all cursor-pointer ${formData.maritalStatus === 'single'
                                        ? 'bg-white text-slate-800 shadow-xs'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    مجرد
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, maritalStatus: 'married' })}
                                    className={`h-7 rounded-lg text-[9px] font-black transition-all cursor-pointer ${formData.maritalStatus === 'married'
                                        ? 'bg-white text-slate-800 shadow-xs'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    متأهل
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Occupation */}
                    <div className="space-y-1 pt-1">
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">شغل / حوزه فعالیت</label>
                        <input
                            type="text"
                            placeholder="مثال: طراح رابط کاربری"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 h-9 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right"
                        />
                    </div>
                </div>

                {/* Interests Group */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-50">
                        <div className="flex items-center gap-1.5 text-gray-800 font-black text-[11px]">
                            <LucideIcons.Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span>علاقه‌مندی‌ها</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsInterestsDrawerOpen(true)}
                            className="text-[9px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                            <LucideIcons.Plus className="w-3 h-3" />
                            <span>مدیریت</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">

                        {formData.interests.map(interest => (
                            <div
                                key={interest}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 flex items-center gap-2">
                                {getInterestTitle(interest)}
                                <button onClick={() => toggleInterest(interest)}>
                                    <LucideIcons.X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        {/* {formData.interests.length > 0 ? (
                            formData.interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="bg-gray-50 border border-gray-100 text-gray-700 text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                                >
                                    <span>{interest}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleInterest(interest)}
                                        className="hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <LucideIcons.X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <p className="text-[9px] font-bold text-gray-400 py-1">علاقه‌مندی ثبت نشده است</p>
                        )} */}
                    </div>
                </div>

                {/* Bio / About */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-800 font-black text-[11px] pb-1 border-b border-gray-50">
                        <LucideIcons.FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>درباره من</span>
                    </div>
                    <textarea
                        placeholder="توضیحات کوتاه درباره خودتان..."
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right resize-none leading-relaxed"
                    />
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-gray-100 p-3.5 px-5 flex gap-2 z-30 shadow-lg">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LucideIcons.Save className="w-3.5 h-3.5" />
                                ذخیره تغییرات
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="h-10 px-5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-[11px] rounded-xl transition-all active:scale-98 border border-gray-100 cursor-pointer"
                    >
                        انصراف
                    </button>
                </div>
            </form>

            {/* Image Cropper Modal */}
            <ImageCropperDrawer
                isOpen={isCropperOpen}
                image={tempImage}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={(croppedImg) => {
                    setFormData(prev => ({ ...prev, avatar: croppedImg }));
                    setIsCropperOpen(false);
                }}
                aspectRatio={1}
            />

            {/* Interests Selector Drawer */}
            <InterestsDrawer
                isOpen={isInterestsOpen}
                onClose={() => setIsInterestsOpen(false)}
                selectedInterests={formData.interests}
                onToggle={toggleInterest}
                onFavouritesLoaded={handleFavouritesLoaded}
            />
        </motion.div>
    );
}
