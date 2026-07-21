// NavigationDrawer.tsx
import { AnimatePresence, motion } from "motion/react";
import { X, Compass, ChevronLeft } from "lucide-react";
import { useState } from "react";

function NavigationDrawer({
    isOpen,
    onClose,
    lat,
    lng,
    locationName
}: {
    isOpen: boolean;
    onClose: () => void;
    lat?: number;
    lng?: number;
    locationName: string;
}) {
    const apps = [
        {
            id: 'neshan',
            name: 'نشان (پیشنهادی)',
            icon: `${process.env.File_BaseURL}/medias/maps/neshan.png`,
            getUrl: (lat: number, lng: number) => `https://nshn.ir/?q=${lat},${lng}`
        },
        {
            id: 'balad',
            name: 'بلد (Balad)',
            icon: `${process.env.File_BaseURL}/medias/maps/balad.png`,
            getUrl: (lat: number, lng: number) => `https://balad.ir/search?q=${lat},${lng}`
        },
        {
            id: 'google',
            name: 'Google Maps',
            icon: `${process.env.File_BaseURL}/medias/maps/googlemap.png`,
            getUrl: (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        },
    ];

    const [selectedApp, setSelectedApp] = useState<string>('neshan');

    const handleOpenApp = (getUrl: (lat: number, lng: number) => string) => {
        if (lat && lng) {
            window.open(getUrl(lat, lng), '_blank');
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
                    />
                    
                    {/* Bottom Sheet - Premium design */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 220 }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
                        dir="rtl"
                    >
                        {/* Elegant handle bar */}
                        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

                        <div className="px-6 pb-8 space-y-5 text-right">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-black text-gray-900">مسیریابی رویداد</h2>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">اپلیکیشن موردنظر خود را انتخاب کنید</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Map Apps List - Redesigned */}
                            <div className="space-y-2">
                                {apps.map((app) => {
                                    const isSelected = selectedApp === app.id;
                                    return (
                                        <button
                                            key={app.id}
                                            onClick={() => setSelectedApp(app.id)}
                                            className={`w-full text-right p-4 rounded-2xl flex items-center justify-between border transition-all ${
                                                isSelected
                                                    ? 'border-[#007AFF] bg-blue-50/5'
                                                    : 'border-gray-200/80 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 border border-gray-100">
                                                    <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-xs font-black text-gray-800">{app.name}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">
                                                        {app.id === 'neshan' ? 'مسیریاب ایرانی نشان' : 
                                                         app.id === 'balad' ? 'نقشه و مسیریاب بلد' : 
                                                         'Google Maps'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    isSelected ? 'border-[#007AFF]' : 'border-gray-300'
                                                }`}
                                            >
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-[#007AFF]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Directions button - Redesigned */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const selectedAppObj = apps.find(app => app.id === selectedApp);
                                    if (selectedAppObj) {
                                        handleOpenApp(selectedAppObj.getUrl);
                                    }
                                }}
                                className="w-full bg-[#007AFF] hover:bg-[#0062CC] text-white py-3.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 outline-none transition-all"
                            >
                                <Compass className="w-4.5 h-4.5" />
                                <span>باز کردن و مسیریابی</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default NavigationDrawer;