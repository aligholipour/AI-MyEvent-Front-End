import * as LucideIcons from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

function LeafletEventMap({
    lat,
    lng,
    title,
    locationName,
    onExpand,
}: {
    lat?: number;
    lng?: number;
    title: string;
    locationName: string;
    onExpand: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [zoom, setZoom] = useState(14);

    const eventLat = lat || 35.6892;
    const eventLng = lng || 51.3890;

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            center: [eventLat, eventLng],
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
        });

        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        const customIcon = L.divIcon({
            html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 bg-[#ED1C24]/20 rounded-full animate-ping"></div>
          <div class="w-9 h-9 bg-[#ED1C24] text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `,
            className: '',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
        });

        const marker = L.marker([eventLat, eventLng], { icon: customIcon }).addTo(map);

        const popupContent = `
      <div style="direction: rtl; font-family: Vazirmatn, sans-serif; text-align: right; padding: 4px;">
        <b style="font-size: 12px; color: #111827; display: block; margin-bottom: 2px;">${title}</b>
        <span style="font-size: 10px; color: #6b7280;">${locationName}</span>
      </div>
    `;
        marker.bindPopup(popupContent);

        map.on('zoomend', () => {
            setZoom(map.getZoom());
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [eventLat, eventLng, title, locationName]);

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mapRef.current) mapRef.current.zoomIn();
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mapRef.current) mapRef.current.zoomOut();
    };

    const handleRecenter = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mapRef.current) mapRef.current.setView([eventLat, eventLng], 15);
    };

    return (
        <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs group">
            {/* Map Container */}
            <div ref={containerRef} className="w-full h-full z-0" />

            {/* Top Bar Overlay Controls */}
            <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
                {/* Persian Zoom Level badge */}
                {/* <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black text-gray-800 shadow-xs border border-gray-100/80 pointer-events-auto">
                    زوم: {toPersianDigits(zoom)}x
                </div> */}

                {/* Fullscreen Expand Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onExpand();
                    }}
                    className="bg-gray-900/90 hover:bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md border border-white/20 pointer-events-auto flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title="نقشه تمام صفحه"
                >
                    <LucideIcons.Maximize2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px]">تمام صفحه</span>
                </button>
            </div>

            {/* Side Zoom Controls */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-10 pointer-events-auto">
                <button
                    onClick={handleZoomIn}
                    className="w-8 h-8 bg-white/90 hover:bg-white text-gray-800 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black transition-all active:scale-90"
                >
                    <LucideIcons.Plus className="w-4 h-4" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-8 h-8 bg-white/90 hover:bg-white text-gray-800 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black transition-all active:scale-90"
                >
                    <LucideIcons.Minus className="w-4 h-4" />
                </button>
                <button
                    onClick={handleRecenter}
                    className="w-8 h-8 bg-white/90 hover:bg-white text-red-500 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center transition-all active:scale-90"
                    title="مرکز نقشه"
                >
                    <LucideIcons.LocateFixed className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default LeafletEventMap;