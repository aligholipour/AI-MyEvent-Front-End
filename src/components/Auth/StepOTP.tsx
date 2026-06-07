import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";
import { User } from '../../services/Auth/Auth';

function StepOTP({ phoneNumber, onBack, onSuccess }: {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: (user: User) => void;
}) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { confirmLogin } = useAuth();

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
      setTimeout(() => handleVerify(newCode.join('')), 100);
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
      
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setError('کد اشتباه است، دوباره تلاش کنید');
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
    // درخواست ارسال مجدد کد
    // می‌توانید این قسمت را به API اضافه کنید
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black text-gray-900">کد تایید</h2>
        </div>

        <p className="text-gray-500 text-sm font-bold leading-relaxed">
          کد ۵ رقمی ارسال شده به شماره <span className="text-gray-900" dir="ltr">{phoneNumber}</span> را وارد کنید.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between gap-2" dir="ltr">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 border border-gray-200 rounded-2xl text-center text-xl font-black focus:border-[#007AFF] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2">{error}</p>}
        </div>
      </div>

      <div className="mt-auto py-4 flex flex-col gap-4">
        <button
          disabled={timer > 0 || isVerifying}
          onClick={handleResendCode}
          className={`text-xs font-black transition-colors ${timer > 0 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600'}`}
        >
          {timer > 0 ? `ارسال مجدد کد تا (${timer} ثانیه)` : 'ارسال مجدد کد'}
        </button>

        <button
          onClick={() => handleVerify(code.join(''))}
          disabled={isVerifying || code.some(d => !d)}
          className="w-full bg-[#00A1F1] hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'تایید'}
        </button>
      </div>
    </div>
  );
}

export default StepOTP;