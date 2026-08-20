import { useEffect, useRef } from "react";
import L from 'leaflet';
import * as LucideIcons from 'lucide-react';
import { toPersianDigits } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

function FullScreenMapModal({
    isOpen,
    onClose,
    lat,
    lng,
    title,
    locationName,
    onOpenNavigation,
}: {
    isOpen: boolean;
    onClose: () => void;
    lat?: number;
    lng?: number;
    title: string;
    locationName: string;
    onOpenNavigation: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    const eventLat = lat || 35.6892;
    const eventLng = lng || 51.3890;

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            if (!containerRef.current || mapRef.current) return;

            const map = L.map(containerRef.current, {
                center: [eventLat, eventLng],
                zoom: 15,
                zoomControl: false,
            });

            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap',
            }).addTo(map);

            const customIcon = L.divIcon({
                html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-16 h-16 bg-[#ED1C24]/30 rounded-full animate-ping"></div>
            <div class="w-10 h-10 bg-[#ED1C24] text-white rounded-full border-3 border-white flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
                className: '',
                iconSize: [48, 48],
                iconAnchor: [24, 24],
            });

            const marker = L.marker([eventLat, eventLng], { icon: customIcon }).addTo(map);

            const popupContent = `
        <div style="direction: rtl; font-family: Vazirmatn, sans-serif; text-align: right; padding: 6px;">
          <b style="font-size: 13px; color: #111827; display: block; margin-bottom: 4px;">${title}</b>
          <span style="font-size: 11px; color: #4b5563;">${locationName}</span>
          <br/>
          <span style="font-size: 10px; color: #9ca3af; margin-top: 4px; display: inline-block;">مختصات: (${toPersianDigits(eventLat.toFixed(4))}، ${toPersianDigits(eventLng.toFixed(4))})</span>
        </div>
      `;
            // marker.bindPopup(popupContent).openPopup();

            map.invalidateSize();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isOpen, eventLat, eventLng, title, locationName]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-white flex flex-col h-full w-full"
                dir="rtl"
            >
                {/* Fullscreen Map Header */}
                <div className="bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-gray-200/80 flex items-center justify-between shadow-xs z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center text-gray-700 transition-colors"
                        >
                            <LucideIcons.ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col text-right">
                            <h2 className="text-sm font-black text-gray-900 leading-tight">نقشه و موقعیت رویداد</h2>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5 truncate max-w-[200px] sm:max-w-[300px]">
                                {locationName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenNavigation}
                            className="bg-[#007AFF] hover:bg-[#0062CC] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
                        >
                            <LucideIcons.Compass className="w-4 h-4" />
                            <span>مسیریابی</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 transition-colors"
                        >
                            <LucideIcons.X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Map Container */}
                <div className="relative flex-1 w-full h-full">
                    <div ref={containerRef} className="w-full h-full" />

                    {/* Floating Persian Coordinate Info Box */}
                    <div className="absolute bottom-6 right-6 left-6 z-[400] bg-white/95 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center gap-3 text-right">
                            <div className="w-10 h-10 bg-red-50 text-[#ED1C24] rounded-2xl flex items-center justify-center shrink-0">
                                <LucideIcons.MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900">{title}</span>
                                <span className="text-[10px] font-bold text-gray-400">
                                    موقعیت مکانی روی نقشه • {toPersianDigits(eventLat.toFixed(4))}° , {toPersianDigits(eventLng.toFixed(4))}°
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (mapRef.current) mapRef.current.setView([eventLat, eventLng], 17);
                            }}
                            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-700 transition-colors"
                            title="تمرکز روی رویداد"
                        >
                            <LucideIcons.LocateFixed className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default FullScreenMapModal;