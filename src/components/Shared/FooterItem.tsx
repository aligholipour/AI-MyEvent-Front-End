import { motion } from "motion/react";

function FooterItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#ED1C24]' : 'text-gray-400 font-medium'}`}
        >
            <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            >
                {icon}
            </motion.div>
            <span className="text-[10px] font-black whitespace-nowrap">{label}</span>
        </button>
    );
}

export default FooterItem;