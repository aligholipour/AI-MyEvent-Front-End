import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";

function StepperInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  error,
  className = ''
}: {
  label: string,
  value: string | number,
  onChange: (val: string) => void,
  min?: number,
  max?: number,
  error?: string,
  className?: string
}) {
  const numValue = Number(value) || 0;

  const handleIncrement = () => {
    if (numValue < max) onChange(String(numValue + 1));
  };

  const handleDecrement = () => {
    if (numValue > min) onChange(String(numValue - 1));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between px-2">
        <label className="text-xs font-black text-gray-500">{label}</label>
        {error && (
          <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-[#ED1C24]">
            {error}
          </motion.span>
        )}
      </div>
      <div className={`flex items-center bg-gray-100 rounded-2xl p-1 border transition-all ${error ? 'border-[#ED1C24]' : 'border-gray-100 focus-within:border-gray-200 focus-within:bg-gray-200'}`}>
        <button
          onClick={(e) => { e.preventDefault(); handleDecrement(); }}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 active:scale-95 transition-all outline-none"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-center text-sm font-black text-gray-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={(e) => { e.preventDefault(); handleIncrement(); }}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 active:scale-95 transition-all outline-none"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default StepperInput;