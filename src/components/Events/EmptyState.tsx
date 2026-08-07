import { Inbox } from 'lucide-react';

function EmptyState({ message, illustration, icon }: { message: string; illustration?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-6 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
      {illustration || (
        <div className="w-20 h-20 bg-white rounded-2xl shadow-inner flex items-center justify-center text-gray-200">
          {icon || <Inbox className="w-10 h-10" />}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-black text-gray-900">{message}</p>
        <p className="text-[10px] font-bold text-gray-400">موردی برای نمایش پیدا نشد</p>
      </div>
    </div>
  );
}

export default EmptyState;