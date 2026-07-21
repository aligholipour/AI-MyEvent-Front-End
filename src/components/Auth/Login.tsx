// Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { motion } from "motion/react";
import { X, Phone, AlertCircle, ArrowLeft } from 'lucide-react';

function Login({ onClose, onContinue }: {
  onClose: () => void;
  onContinue: (num: string, isExist: boolean, token?: string) => void;
}) {
  const [phoneNumber, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // اعتبارسنجی شماره تلفن
    if (!/^09\d{9}$/.test(phoneNumber)) {
      setError('شماره موبایل معتبر نیست (مثال: 09123456789)');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(phoneNumber);
      
      if (result.success) {
        if (result.needRegister) {
          onContinue(phoneNumber, false, result.token);
        } else  {
          onContinue(phoneNumber, true, result.token);
        }
      } else {
        setError('خطا در ارتباط با سرور');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ورود به سیستم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col gap-5 w-full"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5 text-right">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">ورود / ثبت نام</h2>
          <p className="text-[11px] font-black text-gray-400">
            جشن‌ها و دورهمی‌های موردعلاقه‌تان در انتظار شماست
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60 shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Input section with clean, minimalist visual style from reference */}
      <div className="space-y-4">
        <div className="space-y-1.5 text-right">
          <label className="text-[11px] font-black text-gray-500 mr-1">
            شماره تلفن همراه
          </label>
          
          <div
            className={`flex items-center bg-white border rounded-2xl px-4 py-3 transition-all duration-200 ${
              isFocused
                ? 'border-[#007AFF] shadow-[0_0_0_3px_rgba(0,122,255,0.08)]'
                : error
                ? 'border-red-500/80 bg-red-50/10'
                : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            {/* Phone Icon */}
            <Phone className={`w-4.5 h-4.5 ml-3 transition-colors duration-200 ${isFocused ? 'text-[#007AFF]' : 'text-gray-400'}`} />

            {/* Input Element */}
            <input
              type="tel"
              value={phoneNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d]/g, '');
                setPhone(val);
                setError('');
              }}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className="w-full bg-transparent text-gray-800 text-sm font-black tracking-widest outline-none border-none placeholder-gray-300 p-0 text-left dir-ltr"
              maxLength={11}
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 mr-1"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Compact Description info */}
      <p className="text-gray-400 text-[10px] font-bold leading-normal text-right">
        کد فعال‌سازی برای شماره بالا ارسال خواهد شد. ورود شما به منزله پذیرش قوانین و مقررات است.
      </p>

      {/* Tight Primary Action Button */}
      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_4px_16px_rgba(0,122,255,0.2)] flex items-center justify-center gap-2 transition-all outline-none disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>ادامه</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

export default Login;