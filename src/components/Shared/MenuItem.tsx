function MenuItem({
  icon,
  title,
  subtitle,
  showBadge,
  badgeText,
  secondaryBadge,
  variant = 'default',
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  secondaryBadge?: string;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
}) {
  const isDestructive = variant === 'destructive';

  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50/50"
      dir="rtl"
    >
      <div className="flex items-center gap-4 text-right">
        <div className={`${isDestructive ? 'text-red-400' : 'text-gray-400'} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className={`text-sm font-black ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{title}</span>
          {subtitle && <span className="text-[10px] font-bold text-gray-400">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {badgeText && <span className="text-[10px] font-bold text-gray-400">{badgeText}</span>}
        {secondaryBadge && <div className="bg-[#ED1C24] text-white text-[8px] font-black px-2 py-0.5 rounded-full">{secondaryBadge}</div>}
        {showBadge && <div className="w-2.5 h-2.5 bg-[#ED1C24] rounded-full shadow-sm" />}
      </div>
    </button>
  );
}

export default MenuItem;