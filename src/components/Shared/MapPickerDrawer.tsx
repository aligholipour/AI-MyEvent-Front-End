import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, AlertCircle } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

function MapPickerDrawer({
    isOpen,
    onClose,
    onSelect
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: { lat: number, lng: number }, address: string) => void;
}) {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [address, setAddress] = useState('');

    const API_KEY = (typeof process !== 'undefined' ? process.env?.GOOGLE_MAPS_PLATFORM_KEY : (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY) || '';
    const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';


    const handleMapClick = (e: any) => {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;
        setSelectedLocation({ lat, lng });
        // In a real app, you'd use a geocoding service here
        setAddress(`لوکیشن انتخاب شده در (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onSelect(selectedLocation, address);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]" />
                    <motion.div initial={{ y: "100%", x: "-50%" }} animate={{ y: 0, x: "-50%" }} exit={{ y: "100%", x: "-50%" }} className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-white z-[110] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl" dir="rtl">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">انتخاب لوکیشن</h3>
                            <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            {!hasValidKey ? (
                                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-10 text-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900">اتصال به نقشه برقرار نشد</h4>
                                    <p className="text-sm font-bold text-gray-400">لطفا تنظیمات کلید API نقشه گوگل را بررسی کنید.</p>
                                    <button onClick={() => {
                                        setSelectedLocation({ lat: 35.6892, lng: 51.3890 });
                                        setAddress("تهران، میدان آزادی (دمو)");
                                    }} className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black">انتخاب لوکیشن فرضی (دمو)</button>
                                </div>
                            ) : (
                                <APIProvider apiKey={API_KEY} version="weekly">
                                    <Map
                                        defaultCenter={{ lat: 35.6892, lng: 51.3890 }}
                                        defaultZoom={13}
                                        mapId="DEMO_MAP_ID"
                                        onClick={handleMapClick}
                                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        {selectedLocation && (
                                            <AdvancedMarker position={selectedLocation}>
                                                <Pin background="#ED1C24" borderColor="#fff" glyphColor="#fff" />
                                            </AdvancedMarker>
                                        )}
                                    </Map>
                                </APIProvider>
                            )}

                            {address && (
                                <div className="absolute bottom-24 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-8 h-8 bg-[#ED1C24]/10 rounded-lg flex flex-shrink-0 items-center justify-center text-[#ED1C24]">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase block mb-0.5">آدرس انتخاب شده</span>
                                        <p className="text-xs font-bold text-gray-900 leading-relaxed">{address}</p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-6 left-6 right-6">
                                <button
                                    disabled={!selectedLocation}
                                    onClick={handleConfirm}
                                    className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all ${selectedLocation
                                        ? 'bg-[#ED1C24] text-white shadow-[#ED1C24]/20 hover:opacity-90'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    تایید این موقعیت
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default MapPickerDrawer;