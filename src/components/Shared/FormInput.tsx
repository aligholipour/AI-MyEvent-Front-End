import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

function FormInput({
  label,
  placeholder,
  isTextarea,
  type = 'text',
  value,
  onChange,
  className = '',
  isSelect,
  onSelectClick,
  disabled = false,
  error
}: {
  label: string;
  placeholder?: string;
  isTextarea?: boolean;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isSelect?: boolean;
  onSelectClick?: () => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between px-2">
        <label className="text-xs font-black text-gray-500">{label}</label>
        {error && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold text-[#ED1C24]"
          >
            {error}
          </motion.span>
        )}
      </div>
      <div className={`relative transition-all ${disabled ? 'opacity-50' : ''}`}>
        {isSelect ? (
          <button
            onClick={(e) => { e.preventDefault(); if (!disabled) onSelectClick?.(); }}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold flex items-center justify-between transition-all outline-none text-right ${error ? 'border-[#ED1C24]' : 'border-gray-100'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
          >
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder || 'انتخاب کنید'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        ) : isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none min-h-[120px] resize-none ${error ? 'border-[#ED1C24]' : 'border-gray-100'}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-100 border rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none ${error ? 'border-[#ED1C24]' : 'border-gray-100'}`}
          />
        )}
      </div>
    </div>
  );
}

export default FormInput;