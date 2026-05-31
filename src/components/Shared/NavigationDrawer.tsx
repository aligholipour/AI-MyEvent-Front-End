import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, X } from "lucide-react";

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
            id: 'google',
            name: 'Google Maps',
            icon: 'http://localhost:5066/medias/maps/googlemap.png',
            getUrl: (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        },
        {
            id: 'neshan',
            name: 'نشان (Neshan)',
            icon: 'http://localhost:5066/medias/maps/neshan.png',
            getUrl: (lat: number, lng: number) => `https://neshan.org/maps/@${lat},${lng},15z`
        },
        {
            id: 'balad',
            name: 'بلد (Balad)',
            icon: 'http://localhost:5066/medias/maps/balad.png',
            getUrl: (lat: number, lng: number) => `https://balad.ir/location?lat=${lat}&lng=${lng}&zoom=15`
        },
    ];

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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[140] backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[150] rounded-t-2xl shadow-2xl flex flex-col pt-2 pb-10"
                        dir="rtl"
                    >
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

                        <div className="px-6 pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black text-gray-900">انتخاب نقشه‌خوان</h2>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">{locationName}</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {apps.map((app) => (
                                    <motion.button
                                        key={app.id}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleOpenApp(app.getUrl)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-bold text-gray-800">{app.name}</span>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default NavigationDrawer;