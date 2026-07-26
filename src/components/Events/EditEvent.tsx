import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, X, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';
import { Province, City, Favourite } from '../../types';
import { getAllProvince, getCityWithProvinceId } from '../../services/locations';
import { getEventForUpdateById, updateEvent } from '../../services/events';
import { EventDetailsForUpdateResponse } from '../../services/events';
import FormInput from '../Shared/FormInput';
import RichTextEditor from '../Shared/RichTextEditor';
import StepperInput from '../Shared/StepperInput';
import MapPickerDrawer from '../Shared/MapPickerDrawer';
import InterestsDrawer from '../Shared/InterestsDrawer';
import ImageCropperDrawer from '../Shared/ImageCropperDrawer';
import SelectionDrawer from '../Shared/SelectionDrawer';
import CategoryDrawer from '../Shared/CategoryDrawer';
import { getAllFavourite } from '@/src/services/favourites';
import { PersianDatePickerDrawer, PersianTimePickerDrawer } from '../Shared/PersianDatePickerDrawerProps.';

interface EditEventProps {
  eventId: number;
  onBack: () => void;
}

interface EditEventFormData {
  title: string;
  description: string;
  categoryId: number | null;
  categoryTitle: string;
  favouriteIds: number[];
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
  gender: number | null;
  price: string;
  minCapacity: string;
  maxCapacity: string;
  hasWaitlist: boolean;
  minAge: string;
  maxAge: string;
  provinceId: number | null;
  city: string;
  cityId: number | null;
  isOnline: boolean;
  coverAddress: string | null,
  onlineLink: string;
  // image: string | null;
  location: { lat: number; lng: number } | null;
}

function EditEvent({ eventId, onBack }: EditEventProps) {
  const [event, setEvent] = useState<EventDetailsForUpdateResponse | null>(null);
  const [formData, setFormData] = useState<EditEventFormData>({
    title: '',
    description: '',
    categoryId: null,
    categoryTitle: '',
    favouriteIds: [] as number[],
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    isPaid: false,
    gender: null,
    price: '',
    minCapacity: '',
    maxCapacity: '',
    hasWaitlist: false,
    minAge: '',
    maxAge: '',
    provinceId: null,
    city: '',
    cityId: null,
    isOnline: false,
    coverAddress: '',
    onlineLink: '',
    // image: null,
    location: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [allFavourites, setAllFavourites] = useState<Favourite[]>([]);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [provincesData, eventData, favouritesData] = await Promise.all([
          getAllProvince(),
          getEventForUpdateById(eventId),
          getAllFavourite()
        ]);

        setProvinces(provincesData);
        setEvent(eventData);
        setAllFavourites(favouritesData);
        setFormData(mapEventToForm(eventData));

        if (eventData.provinceId) {
          const citiesData = await getCityWithProvinceId(eventData.provinceId);
          setCities(citiesData);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات رویداد';
        setFetchError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [eventId]);

  useEffect(() => {
    if (formData.provinceId) {
      loadCities(formData.provinceId);
    } else {
      setCities([]);
    }
  }, [formData.provinceId]);

  const loadCities = async (provinceId: number) => {
    setLoadingCities(true);
    try {
      const data = await getCityWithProvinceId(provinceId);
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const parseDateFromDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    const datePart = dateTime.split('T')[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : '';
  };

  const getImageSrc = (coverAddress: string | null) => {
    if (!coverAddress) return null;

    if (coverAddress.startsWith('data:image'))
      return coverAddress;

    return process.env.File_BaseURL + coverAddress;
  };

  const mapEventToForm = (eventData: EventDetailsForUpdateResponse): EditEventFormData => {
    return {
      title: eventData.title || '',
      description: eventData.description || '',
      categoryId: eventData.categoryId || null,
      categoryTitle: eventData.categoryTitle || '',
      favouriteIds: eventData.favouriteIds || [],
      address: eventData.address || '',
      // date: parseDateFromDateTime(eventData.startTime || ''),
      date: eventData.startTime || '',
      startTime: eventData.startTime || '',
      endTime: eventData.endTime || '',
      isPaid: eventData.isFree === false,
      gender: null,
      price: eventData.price != null ? String(eventData.price) : '',
      minCapacity: eventData.minCapacity != null ? String(eventData.minCapacity) : '',
      maxCapacity: eventData.maxCapacity != null ? String(eventData.maxCapacity) : '',
      hasWaitlist: eventData.hasWaitlist || false,
      minAge: eventData.minAge != null ? String(eventData.minAge) : '',
      maxAge: eventData.maxAge != null ? String(eventData.maxAge) : '',
      provinceId: eventData.provinceId || null,
      city: eventData.cityName || '',
      cityId: eventData.cityId || null,
      isOnline: eventData.isOnline || false,
      coverAddress: eventData.coverAddress,
      onlineLink: eventData.onlineLink || '',
      // image: eventData.image || null,
      location: eventData.lat != null && eventData.lng != null ? { lat: eventData.lat, lng: eventData.lng } : null,
    };
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = 'عنوان الزامی است';
    if (!formData.description) newErrors.description = 'توضیحات الزامی است';
    if (!formData.categoryId) newErrors.category = 'دسته‌بندی الزامی است';

    if (!formData.date) newErrors.date = 'تاریخ الزامی است';
    if (!formData.startTime) newErrors.startTime = 'زمان شروع الزامی است';
    if (!formData.endTime) newErrors.endTime = 'زمان پایان الزامی است';
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'زمان پایان باید بعد از زمان شروع باشد';
    }
    if (formData.isPaid) {
      if (!formData.price) newErrors.price = 'مبلغ الزامی است';
      else if (Number(formData.price) <= 0) newErrors.price = 'مبلغ باید معتبر باشد';
    }
    if (!formData.minCapacity) newErrors.minCapacity = 'حداقل ظرفیت الزامی است';
    if (!formData.maxCapacity) newErrors.maxCapacity = 'حداکثر ظرفیت الزامی است';
    if (formData.minCapacity && formData.maxCapacity && Number(formData.maxCapacity) < Number(formData.minCapacity)) {
      newErrors.maxCapacity = 'حداکثر ظرفیت نباید کمتر از حداقل باشد';
    }
    if (!formData.minAge) newErrors.minAge = 'حداقل سن الزامی است';
    if (!formData.maxAge) newErrors.maxAge = 'حداکثر سن الزامی است';
    if (formData.minAge && formData.maxAge && Number(formData.maxAge) < Number(formData.minAge)) {
      newErrors.maxAge = 'حداکثر سن نباید کمتر از حداقل باشد';
    }
    if (!formData.provinceId) newErrors.provinceId = 'استان الزامی است';
    if (!formData.city) newErrors.city = 'شهر الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const toggleInterest = (interest: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     interests: prev.favouriteIds.includes(interest)
  //       ? prev.favouriteIds.filter(i => i !== interest)
  //       : [...prev.favouriteIds, interest],
  //   }));
  // };

  const toggleInterest = (interestId: number) => {
    setFormData(prev => ({
      ...prev,
      favouriteIds: prev.favouriteIds.includes(interestId)
        ? prev.favouriteIds.filter(id => id !== interestId)
        : [...prev.favouriteIds, interestId],
    }));
  };

  // const toggleInterest = (interest: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     interests: prev.interests.includes(interest)
  //       ? prev.interests.filter(i => i !== interest)
  //       : [...prev.interests, interest]
  //   }));
  // };

  // const getInterestTitle = (id: number) => {
  //   const favourite = allFavourites.find(f => f.id === id);
  //   return favourite?.title || String(id);
  // };

  const getInterestTitle = (id: number) => {
    const favourite = allFavourites.find(f => f.id === id);
    return favourite?.title || id;
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

  const isFormValid = () => {
    if (!formData.title) return false;
    if (!formData.description) return false;
    if (!formData.categoryId) return false;
    // if (formData.isOnline) {
    //   if (!formData.onlineLink) return false;
    // } else {
    //   if (!formData.address) return false;
    // }
    if (!formData.date) return false;
    if (!formData.startTime || !formData.endTime) return false;
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) return false;
    if (formData.isPaid && (!formData.price || Number(formData.price) <= 0)) return false;
    if (!formData.minCapacity) return false;
    if (!formData.maxCapacity) return false;
    if (formData.minCapacity && formData.maxCapacity && Number(formData.maxCapacity) < Number(formData.minCapacity)) return false;
    if (!formData.minAge) return false;
    if (!formData.maxAge) return false;
    if (formData.minAge && formData.maxAge && Number(formData.maxAge) < Number(formData.minAge)) return false;
    if (!formData.provinceId) return false;
    if (!formData.city) return false;
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      setIsConfirmDrawerOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsConfirmDrawerOpen(false);
    setIsSaving(true);

    try {
      const result = await updateEvent(eventId, formData);
      setIsSuccess(true);
      if (result) {
        setEvent(event ? { ...event, ...result } as EventDetailsForUpdateResponse : event);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#ED1C24]" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-4" dir="rtl">
        <div className="text-red-600 font-black">{fetchError}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black"
        >
          تلاش مجدد
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black"
        >
          بازگشت
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6 bg-white overflow-hidden" dir="rtl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner"
        >
          <Check className="w-12 h-12" />
        </motion.div>
        <h2 className="text-2xl font-black text-gray-900">تغییرات با موفقیت ذخیره شد!</h2>
        <p className="text-gray-500 font-bold leading-relaxed">رویداد شما به‌روزرسانی شد و پس از تایید نمایش داده خواهد شد.</p>
        <button
          onClick={onBack}
          className="mt-4 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
        >
          بازگشت به لیست رویدادها
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative" dir="rtl">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.button>
          <h1 className="text-xl font-black text-gray-900">ویرایش رویداد</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 mr-2">تصویر رویداد</label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full aspect-[2.2/1] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden group ${formData.coverAddress ? 'border-transparent bg-gray-900 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[#ED1C24]/30'}`}>
              {formData.coverAddress ? (
                <>
                  <img
                    src={getImageSrc(formData.coverAddress) || ''}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  {/* 
                  <img
                    src={formData.coverAddress} // مستقیماً از base64 استفاده کنید
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800';
                    }}
                  /> */}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white px-5 py-2.5 rounded-2xl text-[10px] font-black text-gray-900 shadow-2xl flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#ED1C24]" />
                      تغییر تصویر
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, coverAddress: null }); }}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-[#ED1C24] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 group-hover:text-[#ED1C24] transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-sm font-black text-gray-900 block">افزودن پوستر رویداد</span>
                    <span className="text-[10px] font-bold text-gray-400 block px-10">یک تصویر جذاب با نسبت ۱۶:۹ انتخاب کنید</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <FormInput
            label="عنوان رویداد"
            placeholder="مثلا: شب نشینی مهندسین"
            value={formData.title}
            onChange={(val) => { setFormData({ ...formData, title: val }); if (errors.title) setErrors({ ...errors, title: '' }); }}
            error={errors.title}
          />

          <RichTextEditor
            placeholder="درباره رویداد بنویسید..."
            value={formData.description}
            onChange={(val) => { setFormData({ ...formData, description: val }); if (errors.description) setErrors({ ...errors, description: '' }); }}
            error={errors.description}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-xs font-black text-gray-500">انتخاب دسته‌بندی</label>
              {errors.category && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-[#ED1C24]"
                >
                  {errors.category}
                </motion.span>
              )}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); setIsCategoryOpen(true); }}
              className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center justify-between group ${formData.categoryId ? 'bg-gray-900/5 border-gray-900 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center bg-white ${formData.categoryId ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formData.categoryId ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div className="flex flex-col text-right">
                  <span className={`text-[10px] font-black ${formData.categoryId ? 'text-gray-900' : 'text-gray-500'}`}>
                    {formData.categoryTitle || 'یک دسته‌بندی انتخاب کنید'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400">برای فیلتر بهتر رویداد</span>
                </div>
              </div>
              <ChevronLeft className={`w-5 h-5 transition-transform ${formData.categoryId ? 'text-gray-900' : 'text-gray-300 group-hover:-translate-x-1'}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-500">علاقه‌مندی‌ها (برچسب‌ها)</label>
              <button
                onClick={() => setIsInterestsOpen(true)}
                className="text-xs font-black text-[#ED1C24] hover:opacity-80 transition-opacity"
              >
                {formData.favouriteIds.length > 0 ? 'ویرایش لیست' : 'انتخاب از لیست'}
              </button>
            </div>
            {formData.favouriteIds.length > 0 ? (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                {formData.favouriteIds.map((favouriteId) => (
                  <div
                    key={favouriteId}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 flex items-center gap-2"
                  >
                    {getInterestTitle(favouriteId)}
                    <button onClick={() => toggleInterest(favouriteId)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => setIsInterestsOpen(true)}
                className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Plus className="w-5 h-5 text-gray-300" />
                <span className="text-[10px] font-bold text-gray-400">موردی انتخاب نشده است</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <FormInput
                label="استان"
                isSelect
                onSelectClick={() => setIsProvinceOpen(true)}
                value={provinces.find((p) => p.id === formData.provinceId)?.name || ''}
                onChange={() => { }}
                error={errors.provinceId}
                className="flex-1"
              />
              <FormInput
                label="شهر"
                isSelect
                onSelectClick={() => (formData.provinceId ? setIsCityOpen(true) : null)}
                value={formData.city}
                onChange={() => { }}
                error={errors.city}
                className="flex-1"
                disabled={!formData.provinceId}
              />
            </div>
          </div>

          <div className="space-y-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-500">نحوه برگزاری</label>
              <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setFormData({ ...formData, isOnline: false })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!formData.isOnline ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400'}`}
                >
                  حضوری
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isOnline: true })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.isOnline ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  آنلاین
                </button>
              </div>
            </div>
            {formData.isOnline && (
              <FormInput
                label="لینک رویداد آنلاین"
                placeholder="https://..."
                value={formData.onlineLink}
                onChange={(val) => { setFormData({ ...formData, onlineLink: val }); if (errors.onlineLink) setErrors({ ...errors, onlineLink: '' }); }}
                error={errors.onlineLink}
                dir="ltr"
              />
            )}
          </div>

          {!formData.isOnline && (
            <>
              <FormInput
                label="آدرس دقیق"
                placeholder="نام خیابان، کوچه، پلاک..."
                value={formData.address}
                onChange={(val) => { setFormData({ ...formData, address: val }); if (errors.address) setErrors({ ...errors, address: '' }); }}
                error={errors.address}
              />
              <button
                onClick={() => setIsMapOpen(true)}
                className={`w-full border rounded-2xl p-4 flex items-center justify-between group transition-all ${formData.location ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-colors ${formData.location ? 'bg-white text-emerald-500' : 'bg-white text-blue-500'}`}>
                    {formData.location ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-black text-gray-900 leading-none mb-1">
                      {formData.location ? 'لوکیشن ثبت شد' : 'انتخاب لوکیشن از روی نقشه'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {formData.location ? 'موقعیت دقیق روی نقشه مشخص گردید' : 'برای دقت بیشتر، لوکیشن خود را مشخص کنید'}
                    </span>
                  </div>
                </div>
                <ChevronLeft className={`w-5 h-5 transition-colors ${formData.location ? 'text-emerald-300' : 'text-gray-300 group-hover:text-blue-500'}`} />
              </button>
            </>
          )}

          <div className="space-y-4">
            <div className="flex gap-4">
              <FormInput
                label="تاریخ رویداد"
                isSelect
                onSelectClick={() => setIsDatePickerOpen(true)}
                placeholder="انتخاب تاریخ رویداد"
                value={formData.date}
                onChange={() => { }}
                error={errors.date}
                className="flex-1"
              />
            </div>
            <div className="flex gap-4">
              <FormInput
                label="از ساعت"
                isSelect
                onSelectClick={() => setIsStartTimePickerOpen(true)}
                placeholder="ساعت شروع"
                value={formData.startTime}
                onChange={() => { }}
                error={errors.startTime}
                className="flex-1"
              />
              <FormInput
                label="تا ساعت"
                isSelect
                onSelectClick={() => setIsEndTimePickerOpen(true)}
                placeholder="ساعت پایان"
                value={formData.endTime}
                onChange={() => { }}
                error={errors.endTime}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-500">نوع رویداد</label>
              <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setFormData({ ...formData, isPaid: false })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!formData.isPaid ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  رایگان
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isPaid: true })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.isPaid ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  هزینه‌دار
                </button>
              </div>
            </div>
            {formData.isPaid && (
              <FormInput
                label="مبلغ به ازای هر نفر (تومان)"
                type="number"
                placeholder="مثلا: ۵۰,۰۰۰"
                value={formData.price}
                onChange={(val) => { setFormData({ ...formData, price: val }); if (errors.price) setErrors({ ...errors, price: '' }); }}
                error={errors.price}
              />
            )}
          </div>

          <div className="space-y-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-500">جنسیت</label>
              <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setFormData({ ...formData, gender: null })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.gender === null ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  مهم نیست
                </button>
                <button
                  onClick={() => setFormData({ ...formData, gender: 1 })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.gender === 1 ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  آقا
                </button>
                <button
                  onClick={() => setFormData({ ...formData, gender: 2 })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.gender === 2 ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                >
                  خانم
                </button>
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
              اگر رویداد شما برای یک جنسیت خاصی است، آن را انتخاب کنید.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-500 mr-2">ظرفیت رویداد (نفر)</label>
            <div className="flex gap-4">
              <StepperInput
                label="حداقل"
                value={formData.minCapacity}
                onChange={(val) => { setFormData({ ...formData, minCapacity: val }); if (errors.minCapacity) setErrors({ ...errors, minCapacity: '' }); }}
                error={errors.minCapacity}
                className="flex-1"
                min={1}
              />
              <StepperInput
                label="حداکثر"
                value={formData.maxCapacity}
                onChange={(val) => { setFormData({ ...formData, maxCapacity: val }); if (errors.maxCapacity) setErrors({ ...errors, maxCapacity: '' }); }}
                error={errors.maxCapacity}
                className="flex-1"
                min={Number(formData.minCapacity) || 1}
              />
            </div>
            <div className="space-y-3 px-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-700">فعال کردن لیست انتظار</span>
                <button
                  onClick={() => setFormData({ ...formData, hasWaitlist: !formData.hasWaitlist })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.hasWaitlist ? 'bg-gray-800 shadow-inner' : 'bg-gray-200'}`}
                >
                  <motion.div
                    animate={{ x: formData.hasWaitlist ? -24 : 0 }}
                    className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                با فعال‌سازی این گزینه، در صورت تکمیل ظرفیت رویداد، ثبت‌نام‌های جدید وارد لیست انتظار خواهند شد.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-500 mr-2">بازه سنی</label>
            <div className="flex gap-4">
              <StepperInput
                label="از سن"
                value={formData.minAge}
                onChange={(val) => { setFormData({ ...formData, minAge: val }); if (errors.minAge) setErrors({ ...errors, minAge: '' }); }}
                error={errors.minAge}
                className="flex-1"
                min={1}
                max={120}
              />
              <StepperInput
                label="تا سن"
                value={formData.maxAge}
                onChange={(val) => { setFormData({ ...formData, maxAge: val }); if (errors.maxAge) setErrors({ ...errors, maxAge: '' }); }}
                error={errors.maxAge}
                className="flex-1"
                min={Number(formData.minAge) || 1}
                max={120}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full px-6 py-6 bg-gradient-to-t from-white via-white to-transparent pt-10 pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full h-12 rounded-2xl font-black text-sm shadow-xl bg-gray-900 text-white shadow-gray-900/20 transition-all flex items-center justify-center gap-3 pointer-events-auto"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>ذخیره تغییرات</span>
          )}
        </motion.button>
      </div>

      <PersianDatePickerDrawer
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        value={formData.date}
        onSelect={(val) => {
          setFormData({ ...formData, date: val });
          if (errors.date) setErrors({ ...errors, date: '' });
        }}
        title="انتخاب تاریخ رویداد"
        minYear={1405}
        maxYear={1406}
      />

      <PersianTimePickerDrawer
        isOpen={isStartTimePickerOpen}
        onClose={() => setIsStartTimePickerOpen(false)}
        value={formData.startTime}
        onSelect={(val) => {
          setFormData({ ...formData, startTime: val });
          if (errors.startTime) setErrors({ ...errors, startTime: '' });
        }}
        title="ساعت شروع"
      />

      <PersianTimePickerDrawer
        isOpen={isEndTimePickerOpen}
        onClose={() => setIsEndTimePickerOpen(false)}
        value={formData.endTime}
        onSelect={(val) => {
          setFormData({ ...formData, endTime: val });
          if (errors.endTime) setErrors({ ...errors, endTime: '' });
        }}
        title="ساعت پایان"
      />

      <InterestsDrawer
        isOpen={isInterestsOpen}
        onClose={() => setIsInterestsOpen(false)}
        selectedInterests={formData.favouriteIds}
        onToggle={toggleInterest}
        onFavouritesLoaded={setAllFavourites}
      />

      <MapPickerDrawer
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={(location, address) => {
          setFormData({ ...formData, location, address });
          if (errors.address) setErrors({ ...errors, address: '' });
        }}
      />

      <CategoryDrawer
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        categoryTitle={formData.categoryTitle || ''}
        onSelect={(categoryId, categoryTitle) => {
          setFormData({ ...formData, categoryId, categoryTitle });
          if (errors.category) setErrors({ ...errors, category: '' });
        }}
      />

      <SelectionDrawer
        isOpen={isProvinceOpen}
        onClose={() => setIsProvinceOpen(false)}
        title="انتخاب استان"
        subtitle="استان مورد نظر خود را انتخاب کنید"
        showSearch
        options={provinces.map((p) => ({ label: p.name, value: p.id.toString() }))}
        selectedValue={formData.provinceId?.toString() || ''}
        onSelect={(val) => {
          setFormData({ ...formData, provinceId: parseInt(val, 10), city: '' });
          if (errors.provinceId) setErrors({ ...errors, provinceId: '' });
        }}
      />

      <SelectionDrawer
        isOpen={isCityOpen}
        onClose={() => setIsCityOpen(false)}
        title="انتخاب شهر"
        subtitle="شهر مورد نظر خود را انتخاب کنید"
        showSearch
        options={cities.map((c) => ({ label: c.name, value: c.id.toString() }))}
        selectedValue={formData.cityId?.toString() || ''}
        onSelect={(val) => {
          const cityId = val ? parseInt(val, 10) : null;
          const selectedCity = cities.find((c) => c.id === cityId);
          setFormData({
            ...formData,
            city: selectedCity?.name || '',
            cityId,
          });
          if (errors.city) setErrors({ ...errors, city: '' });
        }}
      />

      <ImageCropperDrawer
        image={tempImage}
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setTempImage(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        onCropComplete={(croppedImage) => setFormData({ ...formData, coverAddress: croppedImage })}
      />

      {/* <ImageCropperDrawer
        image={tempImage}
        isOpen={isCropperOpen}
        onClose={() => { setIsCropperOpen(false); setTempImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        onCropComplete={(croppedImage) => setFormData({ ...formData, coverAddress: croppedImage })}
      /> */}

      {!isFormValid() && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold z-30 shadow-xl border border-white/10 opacity-70">
          لطفا تمامی فیلدهای الزامی را پر کنید
        </div>
      )}

      <AnimatePresence>
        {isConfirmDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConfirmDrawerOpen(false)} className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]" />
            <motion.div initial={{ y: '100%', x: '-50%' }} animate={{ y: 0, x: '-50%' }} exit={{ y: '100%', x: '-50%' }} className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[110] rounded-t-[2.5rem] p-8 space-y-6 shadow-2xl" dir="rtl">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-gray-900">آیا از ثبت تغییرات مطمئن هستید؟</h3>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">پس از ذخیره، تغییرات شما ارسال و در صورت موفقیت ثبت می‌شوند.</p>
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setIsConfirmDrawerOpen(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black transition-all">انصراف</button>
                <button onClick={handleConfirm} className="flex-1 bg-[#ED1C24] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#ED1C24]/20 transition-all">ذخیره تغییرات</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditEvent;
