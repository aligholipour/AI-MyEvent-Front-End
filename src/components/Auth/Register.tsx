import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, number, isForcedMotionValue } from 'motion/react';
import { Check, Calendar, PlusCircle, Plus, ArrowRight, User as UserIcon, Camera, X, Search } from 'lucide-react';
import ImageCropperDrawer from '../Shared/ImageCropperDrawer'
import { Favourite, Province, City, RegisterRequest } from '../../types';
import { getAllProvince, getCityWithProvinceId } from '../../services/locations';
import * as LucideIcons from 'lucide-react';
import JobDrawer from '../Shared/JobDrawer';
// import { Register } from '../../services/users';
import InterestsDrawer from '../Shared/InterestsDrawer';
import FormInput from '../Shared/FormInput';
import SelectionDrawer from '../Shared/SelectionDrawer';
import { useAuth } from './AuthContext';

function RegisterPage({ phone, onBack, onComplete }: { phone: string; onBack: () => void; onComplete: (data: any) => void }) {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: 'male' as 'male' | 'female',
        maritalStatus: 'single' as 'single' | 'married',
        occupation: '',
        provinceId: null as number | null,
        city: 0 as number | 0,
        interests: [] as number[],
        profileImageAddress: '',
        jobId: 0 as number | 0,
        jobTitle: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInterestsOpen, setIsInterestsOpen] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [provinces, setProvinces] = useState<Province[]>([])
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [allFavourites, setAllFavourites] = useState<Favourite[]>([]);
    const selectedProvince = provinces.find(p => p.id === formData.provinceId);
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [citiesList, setCitiesList] = useState<any[]>([]); // یا type مناسب خودتون
    const { Register } = useAuth();

    const toggleInterest = (interest: number) => {
        console.log('toggle cityId: ' + interest)
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

    const getInterestTitle = (id: number) => {
        const favourite = allFavourites.find(f => f.id === id);
        return favourite?.title || String(id);
    };


    useEffect(() => {
        getAllProvince()
            .then((data: Province[]) => {
                setProvinces(data)
                console.log(data);
            });
    }, []);

    useEffect(() => {
        if (formData.provinceId) {
            loadCities(formData.provinceId);
        } else {
            setCities([]); // اگر استانی انتخاب نشده، لیست شهرها را خالی کن
        }
    }, [formData.provinceId]);

    const loadCities = async (provinceId: number) => {
        setLoadingCities(true);
        try {
            const data = await getCityWithProvinceId(provinceId);
            setCities(data);
            setCitiesList(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const getCityName = (cityId: number) => {
        const city = citiesList.find(c => c.id === cityId);
        return city?.name || String(cityId);
    };

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

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.name = 'نام و نام خانوادگی الزامی است';
        if (!formData.birthDate) newErrors.birthDate = 'تاریخ تولد الزامی است';
        if (!formData.city) newErrors.city = 'انتخاب شهر الزامی است';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newUser: RegisterRequest = {
            phone: phone,
            fullName: formData.fullName,
            birthDate: formData.birthDate,
            gender: formData.gender,
            maritalStatus: formData.maritalStatus,
            cityId: formData.city,
            jobId: formData.jobId,
            favouriteIds: formData.interests,
            profileImageAddress: formData.profileImageAddress
        };

        setIsSubmitting(true);
        var response = await Register(newUser);
        if (response.success) {
            onComplete(formData);
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-white overflow-hidden relative"
            dir="rtl"
        >
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-black text-gray-900">تکمیل پروفایل</h2>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-6 pt-8 space-y-10">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={onFileChange}
                        />
                        <div className="relative group">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30 cursor-pointer"
                            >
                                {formData.profileImageAddress ? (
                                    <img src={formData.profileImageAddress} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center transition-transform active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">تصویر پروفایل شما</p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-1">نام و نام خانوادگی</label>
                                <div className="relative">
                                    <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="مثال: علی احمدی"
                                        className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-100'} h-12 px-11 rounded-2xl text-[12px] font-black focus:bg-white focus:ring-4 focus:ring-blue-100/50 outline-none transition-all shadow-sm shadow-gray-100/10`} />
                                </div>
                                {errors.name && <p className="text-[10px] font-bold text-red-500 mr-2">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-1">تاریخ تولد</label>
                                <div className="relative">
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        placeholder="۱۳۷۰/۰۱/۰۱"
                                        className={`w-full bg-gray-50 border ${errors.birthDate ? 'border-red-500' : 'border-gray-100'} h-12 px-11 rounded-2xl text-[12px] font-black focus:bg-white focus:ring-4 focus:ring-blue-100/50 outline-none transition-all`} />
                                </div>
                            </div>


                        </div>

                        {/* Occupation */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-xs font-black text-gray-500">انتخاب شغل</label>
                                {errors.category && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[10px] font-bold text-[#ED1C24]">
                                        {errors.category}
                                    </motion.span>
                                )}
                            </div>
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-1">جنسیت</label>
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1.5 border border-gray-100 shadow-sm shadow-gray-100/5">
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${formData.gender === 'male' ? 'bg-white text-blue-600 shadow-md shadow-blue-500/5' : 'text-gray-400'}`}>
                                        آقا
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${formData.gender === 'female' ? 'bg-white text-rose-600 shadow-md shadow-rose-500/5' : 'text-gray-400'}`}>
                                        خانم
                                    </button>
                                </div>
                            </div>

                            {/* Marital Status */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-1">وضعیت تاهل</label>
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1.5 border border-gray-100 shadow-sm shadow-gray-100/5">
                                    <button
                                        onClick={() => setFormData({ ...formData, maritalStatus: 'single' })}
                                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${formData.maritalStatus === 'single' ? 'bg-white text-gray-900 shadow-md shadow-gray-100/10' : 'text-gray-400'}`}>
                                        مجرد
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, maritalStatus: 'married' })}
                                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${formData.maritalStatus === 'married' ? 'bg-white text-gray-900 shadow-md shadow-gray-100/10' : 'text-gray-400'}`}>
                                        متاهل
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Province */}

                            <div className="space-y-2">
                                <FormInput
                                    label="استان"
                                    isSelect
                                    onSelectClick={() => setIsProvinceOpen(true)}
                                    value={selectedProvince?.name || ''}
                                    onChange={() => { }}
                                    error={errors.provinceId}
                                    className="flex-1"
                                />
                            </div>
                            <div className="space-y-2">
                                <FormInput
                                    label="شهر"
                                    isSelect
                                    onSelectClick={() => formData.provinceId ? setIsCityOpen(true) : null}
                                    value={formData.city ? getCityName(formData.city) : ''}
                                    onChange={() => { }}
                                    error={errors.city}
                                    className="flex-1"
                                    disabled={!formData.provinceId}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">

                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-gray-500 mr-2">علاقه‌مندی‌ها (برچسب‌ها)</label>
                                <button
                                    onClick={() => setIsInterestsOpen(true)}
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
                                            <button onClick={() => toggleInterest(interest)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsInterestsOpen(true)}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-200 hover:bg-gray-50 transition-all">
                                    <Plus className="w-5 h-5 text-gray-300" />
                                    <span className="text-[10px] font-bold text-gray-400">موردی انتخاب نشده است</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button - Sticky Bottom of the page view */}
            <div className="px-6 py-4 pb-10 bg-white/80 backdrop-blur-md border-t border-gray-50 sticky bottom-0 z-10 flex-shrink-0">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white h-14 rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95">
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            تکمیل ثبت نام و ورود
                            <Check className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            <SelectionDrawer
                isOpen={isProvinceOpen}
                onClose={() => setIsProvinceOpen(false)}
                title="انتخاب استان"
                subtitle="استان مورد نظر خود را انتخاب کنید"
                showSearch
                options={provinces?.map(p => ({ label: p.name, value: p.id.toString() }))}
                selectedValue={formData.provinceId?.toString() || ''}
                onSelect={(val) => {
                    setFormData({
                        ...formData,
                        provinceId: parseInt(val, 10),  // تبدیل به number
                        city: 0
                    });
                    if (errors.provinceId) setErrors({ ...errors, provinceId: '' });
                }}
            />

            <SelectionDrawer
                isOpen={isCityOpen}
                onClose={() => setIsCityOpen(false)}
                title="انتخاب شهر"
                subtitle="شهر مورد نظر خود را انتخاب کنید"
                showSearch
                options={cities ? cities.map(c => ({ label: c.name, value: c.id.toString() })) : []}
                selectedValue={formData.city.toString()}
                onSelect={(val) => {
                    const cityId = val ? parseInt(val, 10) : null;
                    const selectedCity = cities.find(c => c.id === cityId);

                    setFormData({
                        ...formData,
                        // cityId: cityId,        // ذخیره Id برای ارسال به سرور
                        city: selectedCity?.id || 0  // ذخیره Name برای نمایش
                    });
                    // setFormData({ ...formData, city: val });
                    if (errors.city) setErrors({ ...errors, city: '' });
                }}
            />

            <ImageCropperDrawer
                image={tempImage}
                isOpen={isCropperOpen}
                onClose={() => { setIsCropperOpen(false); setTempImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                onCropComplete={(croppedImage) => setFormData({ ...formData, profileImageAddress: croppedImage })}
                aspectRatio={1}
            />

            <JobDrawer
                isOpen={isJobOpen}
                onClose={() => setIsJobOpen(false)}
                selectedJob={formData.jobId}
                jobTitle={formData.jobTitle || ''}
                onSelect={(jobId, jobTitle) => {
                    console.log('Selected - ID:', jobId, 'Title:', jobTitle);
                    setFormData({ ...formData, jobId: jobId, jobTitle: jobTitle });
                    if (errors.job) setErrors({ ...errors, job: '' });
                }}
            />

            <InterestsDrawer
                isOpen={isInterestsOpen}
                onClose={() => setIsInterestsOpen(false)}
                selectedInterests={formData.interests}
                onToggle={toggleInterest}
                onFavouritesLoaded={handleFavouritesLoaded}
            />
        </motion.div >
    );
}

export default RegisterPage;