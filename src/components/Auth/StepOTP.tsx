// StepOTP.tsx
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import { useAuth } from "./AuthContext";
import { User } from '../../services/Auth/Auth';

function StepOTP({ phoneNumber, token, onBack, onSuccess }: {
  phoneNumber: string;
  token?: string;
  onBack: () => void;
  onSuccess: (user: User | undefined) => void;
}) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { confirmLogin, resendOTPCode } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(v => v !== '')) {
      setTimeout(() => handleVerify(newCode.join('')), 150);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (finalCode: string) => {
    if (finalCode.length !== 5) {
      setError('کد باید 5 رقمی باشد');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await confirmLogin(finalCode, phoneNumber);

      if (result.success) {
        onSuccess(result.user);
        return;
      } else {
        setError('کد تایید نادرست است، مجدداً تلاش کنید.');
        // پاک کردن کد
        setCode(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('خطا در تایید کد');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setTimer(60);
    setError('');
    setCode(['', '', '', '', '']);

    try {
      const result = await resendOTPCode(phoneNumber);

      if (result.success) {
        return;
      } else {
        setError(result.message);
        // پاک کردن کد
        setCode(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('مشکلی در ارسال کد بوجود آمد');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col gap-5 w-full"
    >
      {/* Header Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors active:scale-95 border border-gray-100/60 shadow-xs outline-none"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <div className="flex flex-col text-right">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">کد تایید یکبار مصرف</h2>
          <p className="text-[11px] font-bold text-gray-400">کد ارسال شده را وارد نمایید</p>
        </div>
      </div>

      {/* Display target number */}
      <p className="text-gray-500 text-xs font-bold leading-relaxed text-right">
        کد تایید به شماره <span className="text-gray-800 font-extrabold" dir="ltr">{phoneNumber}</span> ارسال شد.
        {token && <span className="text-xs font-black transition-colors text-red-500 hover:text-blue-600"> {token} </span>}
      </p>

      {/* OTP Input Block */}
      <div className="space-y-3">
        <div className="flex justify-between gap-2.5" dir="ltr">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-13 bg-white border border-gray-200 rounded-2xl text-center text-lg font-black text-gray-800 focus:border-[#007AFF] focus:ring-4 focus:ring-blue-50/40 outline-none transition-all duration-200 shadow-xs disabled:opacity-50"
              disabled={isVerifying}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-[10px] font-bold flex items-center justify-center gap-1 mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Action links & Resend trigger */}
      <div className="pt-2 space-y-4">
        <div className="text-center">
          <button
            type="button"
            disabled={timer > 0 || isVerifying}
            onClick={handleResendCode}
            className={`text-xs font-black transition-colors ${
              timer > 0 ? 'text-gray-400' : 'text-[#007AFF] hover:text-[#0062CC]'
            }`}
          >
            {timer > 0 ? `دریافت مجدد تا (${timer} ثانیه)` : 'ارسال مجدد کد تایید'}
          </button>
        </div>

        {/* Primary action confirm button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleVerify(code.join(''))}
          disabled={isVerifying || code.some(d => !d)}
          className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_4px_16px_rgba(0,122,255,0.2)] flex items-center justify-center gap-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>تایید و ورود</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default StepOTP;