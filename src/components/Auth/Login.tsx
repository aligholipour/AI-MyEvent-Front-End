import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { X } from 'lucide-react';
import { User } from '../../services/Auth/Auth';

function Login({ onClose, onContinue }: {
  onClose: () => void;
  onContinue: (num: string, isExist: boolean) => void;
}) {
  const [phoneNumber, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // اعتبارسنجی شماره تلفن
    if (!/^09\d{9}$/.test(phoneNumber)) {
      setError('شماره موبایل اشتباه است (مثال: 09123456789)');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(phoneNumber);
      
      if (result.success) {
        if (result.needRegister) {
          onContinue(phoneNumber, false);
        } else  {
          onContinue(phoneNumber, true);
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
    <div className="flex flex-col flex-1">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">ورود / ثبت نام</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-500 text-sm font-bold leading-relaxed">
          برای ورود یا ثبت‌نام شماره تلفن همراه خود را وارد کنید.
        </p>

        <div className="relative mt-2">
          <label className="absolute -top-2.5 right-4 bg-white px-2 text-[10px] font-black text-blue-500 z-10">
            شماره موبایل
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            placeholder="0912 123 4567"
            className={`w-full border ${error ? 'border-red-500' : 'border-blue-200'} rounded-xl py-3 px-6 text-lg font-black tracking-[0.1em] focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
          />
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 mr-2">{error}</p>}
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-4 bg-[#00A1F1] hover:bg-blue-600 text-white py-3 rounded-xl font-black text-sm shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'ادامه'}
        </button>
      </div>
    </div>
  );
}

export default Login;