import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppUser, Favourite } from '../../types';
import { ImageCropperDrawer } from '../Shared/ImageCropperDrawer';
import InterestsDrawer from '../../components/Shared/InterestsDrawer'
import { User } from '@/src/services/Auth/Auth';
import { getUserForEdit, updateUserProfile } from '../../services/users';
import { getAllFavourite } from '../../services/favourites';
import { PersianDatePickerDrawer } from '../Shared/PersianDatePickerDrawerProps.';
import JobDrawer from '../Shared/JobDrawer';

interface EditProfilePageProps {
    user: User | null;
    onBack: () => void;
    onSave: (updatedUser: User) => void;
}

export function EditProfilePage({ user, onBack, onSave }: EditProfilePageProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        birthDate: new Date(),
        gender: 'male' as 'male' | 'female',
        maritalStatus: 'single' as 'single' | 'married',
        occupation: '',
        about: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        interests: [] as number[],
        jobId: 0 as number | 0,
        jobTitle: '',
    });

    const [allFavourites, setAllFavourites] = useState<Favourite[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isInterestsDrawerOpen, setIsInterestsDrawerOpen] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isJobOpen, setIsJobOpen] = useState(false);

    // Image cropping state
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const normalizeImagePath = (value?: string | null) => {
        if (!value) return '';

        const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.File_BaseURL || '').trim();
        const normalizedValue = value.trim();

        // اگر آدرس کامل HTTP/HTTPS بود، همان را برگردان
        if (/^https?:\/\//i.test(normalizedValue)) {
            return normalizedValue;
        }

        // اگر baseUrl وجود داشت و normalizedValue با baseUrl شروع می‌شد، حذف کن
        if (baseUrl && normalizedValue.startsWith(baseUrl)) {
            return normalizedValue.slice(baseUrl.length).replace(/^\/+/, '');
        }

        // در غیر این صورت خود normalizedValue را برگردان
        return normalizedValue;
    };

    const getImageSrc = (coverAddress?: string | null) => {
        if (!coverAddress) return null;

        if (coverAddress.startsWith('data:image'))
            return coverAddress;

        return process.env.File_BaseURL + coverAddress;
    };

    const normalizeGenderValue = (value?: string | null) => {
        if (!value) return null;

        const normalizedValue = String(value).trim().toLowerCase();
        if (['male', 'مرد', '1'].includes(normalizedValue)) return 'male';
        if (['female', 'زن', '2'].includes(normalizedValue)) return 'female';
        return null;
    };

    const normalizeMaritalStatusValue = (value?: string | null) => {
        if (!value) return null;

        const normalizedValue = String(value).trim().toLowerCase();
        if (['single', 'مجرد', '1'].includes(normalizedValue)) return 'single';
        if (['married', 'متاهل', 'متأهل', '2'].includes(normalizedValue)) return 'married';
        return null;
    };

    useEffect(() => {
        let isMounted = true;

        const loadFavouriteOptions = async () => {
            try {
                const favourites = await getAllFavourite();
                if (isMounted) {
                    setAllFavourites(favourites);
                }
            } catch (error) {
                console.error('Failed to load favourite options:', error);
            }
        };

        void loadFavouriteOptions();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            if (!user?.id) {
                setIsLoadingProfile(false);
                return;
            }

            try {
                setIsLoadingProfile(true);
                const profileData = await getUserForEdit();

                if (!isMounted) return;

                setFormData(prev => ({
                    ...prev,
                    name: profileData.fullName || profileData.name || user.fullName || user.name || user.username || prev.name,
                    phone: profileData.phone || user.phone || prev.phone,
                    email: profileData.email || prev.email,
                    birthDate: profileData.birthDate ? new Date(profileData.birthDate) : prev.birthDate,
                    gender: normalizeGenderValue(profileData.gender as string | undefined) || prev.gender,
                    maritalStatus: normalizeMaritalStatusValue(profileData.maritalStatus as string | undefined) || prev.maritalStatus,
                    occupation: profileData.occupation || prev.occupation,
                    about: profileData.about || prev.about,
                    avatar: normalizeImagePath(profileData.avatar || profileData.profileAddress || profileData.profileImage || prev.avatar),
                    interests: profileData.interests || profileData.favouriteIds || prev.interests,
                    jobId: profileData.jobId ?? prev.jobId,
                    jobTitle: profileData.jobTitle || prev.jobTitle,
                }));
                setProfileError(null);
            } catch (error) {
                console.error('Failed to load profile:', error);
                if (isMounted) {
                    setProfileError('امکان بارگذاری اطلاعات پروفایل وجود ندارد.');
                }
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    // نظارت روی تغییرات تاریخ تولد
    useEffect(() => {
        console.log('formData.birthDate تغییر کرد:', formData.birthDate);
        console.log('تاریخ فارسی:', toPersian(formData.birthDate));
    }, [formData.birthDate]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        setIsSaving(true);

        try {
            const payload = {
                fullName: formData.name.trim(),
                phone: formData.phone.trim(),
                birthDate: formData.birthDate,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                about: formData.about.trim(),
                profileImageAddress: normalizeImagePath(formData.avatar),
                favouriteIds: formData.interests,
                jobId: formData.jobId
            };

            var result = await updateUserProfile(payload);

            const updatedUser: User = {
                ...user,
                fullName: result.fullName,
                username: result.fullName!,
                birthDate: result.birthDate,
                jobId: result.jobId,
                jobTitle: result.jobTitle,
                about: result.about,
                interests: result.favouriteIds,
                profileAddress: result.profileAddress!,
                maritalStatus: result.maritalStatus,
                gender: result.gender,
                name: result.fullName
                // ...user,
                // id: user.id,
                // username: result.username || user.username,
                // roles: user.roles,
                // fullName: result.fullName,
                // name: result.fullName,
                // phone: result.phone || user.phone,
                // email: result.email,
                // birthDate: result.birthDate,
                // gender: result.gender,
                // maritalStatus: result.maritalStatus,
                // occupation: result.occupation,
                // about: result.about,
                // profileAddress: result.profileAddress || result.profileImage || user.profileAddress,
                // avatar: result.avatar,
                // interests: result.favouriteIds || result.interests,
                // jobId: result.jobId,
                // jobTitle: result.jobTitle
            };

            setShowSuccessToast(true);
            onSave(updatedUser);

            setTimeout(() => {
                onBack();
            }, 900);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const parsePersianDateString = (value: string) => {
        const cleanVal = value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
        const parts = cleanVal.split('/').map((x) => x.trim());
        if (parts.length !== 3) return { jy: NaN, jm: NaN, jd: NaN };
        return {
            jy: parseInt(parts[0], 10),
            jm: parseInt(parts[1], 10),
            jd: parseInt(parts[2], 10),
        };
    };

    const toGregorian = (persianDate: string): Date => {
        const { jy, jm, jd } = parsePersianDateString(persianDate);
        if ([jy, jm, jd].some((n) => Number.isNaN(n))) return new Date();

        const { gy, gm, gd } = jalaaliToGregorian(jy, jm, jd);
        const gregorianDate = new Date(gy, gm - 1, gd);
        gregorianDate.setHours(12, 0, 0, 0);
        return gregorianDate;
    };

    const toPersian = (date: Date | string | null | undefined): string => {
        if (!date) return '';

        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '';

        const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(d);

        const year = parts.find((part) => part.type === 'year')?.value ?? '';
        const month = parts.find((part) => part.type === 'month')?.value ?? '';
        const day = parts.find((part) => part.type === 'day')?.value ?? '';

        return `${year}/${month}/${day}`;
    };

    const toPersianDisplay = (date: Date | string | null | undefined): string => {
        const persianDate = toPersian(date);
        if (!persianDate) return '';

        return persianDate.replace(/\d/g, (x) => {
            const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            return farsiDigits[parseInt(x, 10)];
        });
    };

    const div = (a: number, b: number) => Math.floor(a / b);

    const jalaaliToGregorian = (jy: number, jm: number, jd: number) => {
        const jy2 = jy > 979 ? jy - 979 : jy;
        const gy = jy > 979 ? 1600 : 621;
        const days = 365 * jy2 + div(jy2, 33) * 8 + div((jy2 % 33) + 3, 4) + (jm <= 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186) + (jd - 1);
        let gy2 = gy + 400 * div(days, 146097);
        let d = days % 146097;

        if (d > 36524) {
            gy2 += 100 * div(--d, 36524);
            d %= 36524;
            if (d >= 365) d++;
        }

        gy2 += 4 * div(d, 1461);
        d %= 1461;

        if (d > 365) {
            gy2 += div(d - 1, 365);
            d = (d - 1) % 365;
        }

        const march = d + 1;
        const sal_a = [0, 31, (gy2 % 4 === 0 && (gy2 % 100 !== 0 || gy2 % 400 === 0)) ? 60 : 59, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
        let gm = 0;
        for (let i = 1; i < sal_a.length; i++) {
            if (march <= sal_a[i]) {
                gm = i;
                break;
            }
        }

        const gd = march - sal_a[gm - 1];
        return { gy: gy2, gm, gd };
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
                {profileError && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">
                        {profileError}
                    </div>
                )}

                {isLoadingProfile && (
                    <div className="rounded-xl border border-gray-100 bg-white px-3 py-3 text-center text-[10px] font-bold text-gray-500">
                        در حال بارگذاری اطلاعات پروفایل...
                    </div>
                )}

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
                        className="relative group cursor-pointer">
                        <div className="w-18 h-18 rounded-full border-2 border-blue-500/80 p-0.5 overflow-hidden transition-all group-hover:border-blue-600 shadow-xs">
                            <img
                                src={getImageSrc(formData.avatar) || ''}
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
                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 mt-1 cursor-pointer">
                            تغییر تصویر پروفایل
                        </button>
                        {/* <span className="text-[8px] font-bold text-gray-400">فرمت‌های مجاز: JPG, PNG</span> */}
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
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">شماره همراه</label>
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
                        <div className="relative">
                            <LucideIcons.Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                            <input
                                type="text"
                                readOnly
                                onClick={() => setIsDatePickerOpen(true)}
                                value={toPersianDisplay(formData.birthDate)}
                                placeholder="۱۳۷۰/۰۱/۰۱"
                                className={`w-full bg-gray-50 border ${errors.birthDate ? 'border-red-500' : 'border-gray-100'} h-12 px-11 rounded-2xl text-[12px] font-black focus:bg-white focus:ring-4 focus:ring-blue-100/50 outline-none transition-all cursor-pointer`}
                            />
                        </div>
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
                        <label className="text-[9px] font-black text-gray-400 mr-0.5">شغل</label>
                        {errors.category && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[10px] font-bold text-[#ED1C24]">
                                {errors.category}
                            </motion.span>
                        )}

                        <button
                            onClick={(e) => { e.preventDefault(); setIsJobOpen(true); }}
                            className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center justify-between group ${formData.jobId
                                ? 'bg-gray-900/5 border-gray-900 shadow-sm'
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center bg-white ${formData.jobId ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {formData.jobId ? (
                                        <LucideIcons.Check className="w-6 h-6" />
                                    ) : (
                                        <LucideIcons.LayoutGrid className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className={`text-[10px] font-black ${formData.jobId ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {formData.jobTitle || 'یک شغل انتخاب کنید'}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400">برای اطلاع رسانی رویدادها بر اساس شغل ها</span>
                                </div>
                            </div>
                            <LucideIcons.ChevronLeft className={`w-5 h-5 transition-transform ${formData.jobId ? 'text-gray-900' : 'text-gray-300 group-hover:-translate-x-1'}`} />
                        </button>
                        {/* <input
                            type="text"
                            placeholder="مثال: طراح رابط کاربری"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 h-9 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right"
                        /> */}
                    </div>
                </div>

                {/* Interests Group */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-50">
                        <label className="text-xs font-black text-gray-500 mr-2">علاقه‌مندی‌ها (برچسب‌ها)</label>
                        <button
                            type="button"
                            onClick={() => setIsInterestsDrawerOpen(true)}
                            className="text-xs font-black text-[#ED1C24] hover:opacity-80 transition-opacity">
                            {formData.interests.length > 0 ? 'ویرایش لیست' : 'انتخاب از لیست'}
                        </button>
                    </div>

                    {formData.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                            {formData.interests.map(interest => (
                                <div
                                    key={interest}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 flex items-center gap-2">
                                    {getInterestTitle(interest)}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleInterest(interest);
                                        }}
                                    >
                                        <LucideIcons.X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsInterestsDrawerOpen(true);
                            }}
                            className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-200 hover:bg-gray-50 transition-all">
                            <LucideIcons.Plus className="w-5 h-5 text-gray-300" />
                            <span className="text-[10px] font-bold text-gray-400">موردی انتخاب نشده است</span>
                        </button>
                    )}
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
                <div className="fixed bottom-0 pb-32 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-gray-100 p-3.5 px-5 flex gap-2 z-30 shadow-lg">
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
                isOpen={isInterestsDrawerOpen}
                onClose={() => setIsInterestsDrawerOpen(false)}
                selectedInterests={formData.interests}
                onToggle={toggleInterest}
                onFavouritesLoaded={handleFavouritesLoaded}
            />

            <PersianDatePickerDrawer
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                value={toPersian(formData.birthDate)} // ارسال به صورت شمسی با اعداد انگلیسی
                onSelect={(val) => {
                    // val به صورت "۱۴۰۲/۰۱/۰۱" یا "1402/01/01" میاد
                    // باید به Date میلادی تبدیل بشه
                    console.log('تاریخ انتخاب شده:', val);
                    const gregorianDate = toGregorian(val);
                    console.log('تاریخ میلادی:', gregorianDate);
                    setFormData(prev => ({ ...prev, birthDate: gregorianDate }));
                    if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                    setIsDatePickerOpen(false);
                }}
                title="انتخاب تاریخ تولد"
                minYear={1340}
                maxYear={1406}
            />

            {/* <PersianDatePickerDrawer
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                value={formData.birthDate?.toString()}
                onSelect={(val) => {
                    // تبدیل string به Date
                    const dateParts = val.split('/');
                    const date = new Date(
                        parseInt(dateParts[0]),
                        parseInt(dateParts[1]) - 1,
                        parseInt(dateParts[2])
                    );
                    setFormData({ ...formData, birthDate: date });
                    if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
                }}
                title="انتخاب تاریخ تولد"
                minYear={1340}
                maxYear={1406}
            /> */}

            <JobDrawer
                isOpen={isJobOpen}
                onClose={() => setIsJobOpen(false)}
                selectedJob={formData.jobId}
                jobTitle={formData.jobTitle || ''}
                onSelect={(jobId, jobTitle) => {
                    console.log('Selected - ID:', jobId, 'Title:', jobTitle);
                    setFormData(prev => ({ ...prev, jobId: jobId, jobTitle: jobTitle }));
                    if (errors.job) setErrors(prev => ({ ...prev, job: '' }));
                }}
            />
        </motion.div>
    );
}
