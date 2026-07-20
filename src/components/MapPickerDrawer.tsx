import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { lat: number; lng: number }, address: string) => void;
}

export function MapPickerDrawer({
  isOpen,
  onClose,
  onSelect,
}: MapPickerDrawerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      setIsLocating(false);
      setLocatingError(null);
      return;
    }

    const timer = setTimeout(() => {
      if (!containerRef.current || mapRef.current) return;

      const initialLat = selectedLocation?.lat || 35.6892;
      const initialLng = selectedLocation?.lng || 51.3890;

      const map = L.map(containerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const customMarkerIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-10 h-10 bg-slate-500/30 rounded-full animate-ping"></div>
                 <div class="w-8 h-8 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                   <div class="w-3.5 h-3.5 bg-white rounded-full"></div>
                 </div>
               </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (selectedLocation) {
        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: customMarkerIcon }).addTo(map);
      }

      const reverseGeocode = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`لوکیشن انتخاب شده در (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          }
        } catch (err) {
          setAddress(`لوکیشن انتخاب شده در (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      };

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        setLocatingError(null);

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(map);
        }

        reverseGeocode(lat, lng);
      });

      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setLocatingError('مرورگر شما از قابلیت موقعیت‌یابی پشتیبانی نمی‌کند.');
      return;
    }

    setIsLocating(true);
    setLocatingError(null);
    setAddress('');

    const successCallback = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 15);
      }
      setSelectedLocation({ lat, lng });

      const customMarkerIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-10 h-10 bg-slate-500/30 rounded-full animate-ping"></div>
                 <div class="w-8 h-8 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                   <div class="w-3.5 h-3.5 bg-white rounded-full"></div>
                 </div>
               </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else if (mapRef.current) {
        markerRef.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(mapRef.current);
      }

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`)
        .then((res) => res.json())
        .then((data) => {
          setIsLocating(false);
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`موقعیت شما در (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          }
        })
        .catch(() => {
          setIsLocating(false);
          setAddress(`موقعیت شما در (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      // If we failed with high accuracy or timeout, retry with standard parameters
      if (error.code !== error.PERMISSION_DENIED) {
        navigator.geolocation.getCurrentPosition(
          successCallback,
          (finalError) => {
            setIsLocating(false);
            let msg = 'امکان دریافت موقعیت شما وجود ندارد.';
            if (finalError.code === finalError.PERMISSION_DENIED) {
              msg = 'دسترسی به موقعیت مکانی رد شد. لطفاً دسترسی GPS مرورگر را فعال کنید.';
            } else if (finalError.code === finalError.POSITION_UNAVAILABLE) {
              msg = 'سیگنال GPS یافت نشد یا موقعیت مکانی در دسترس نیست.';
            } else if (finalError.code === finalError.TIMEOUT) {
              msg = 'زمان دریافت موقعیت تمام شد. لطفا دوباره تلاش کنید.';
            }
            setLocatingError(msg);
          },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      } else {
        setIsLocating(false);
        setLocatingError('دسترسی به موقعیت مکانی رد شد. لطفاً دسترسی GPS را در تنظیمات مرورگر یا گوشی خود فعال کنید.');
      }
    };

    // First attempt with high accuracy
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
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
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[300] backdrop-blur-[4px]"
          />

          {/* Bottom Sheet - matching other premium drawers */}
          <motion.div
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-[#F8F9FC] z-[310] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Elegant drag/visual handle bar */}
            <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

            {/* Header section matching other premium drawers */}
            <div className="px-6 pt-3 pb-4 border-b border-gray-100 bg-white shrink-0 flex items-center justify-between">
              <div className="flex flex-col text-right">
                <h3 className="text-base font-black text-gray-900 tracking-tight">انتخاب لوکیشن</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">روی نقشه کلیک کنید تا موقعیت مشخص شود</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors active:scale-95 border border-gray-100/60"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Map Container Viewport */}
            <div className="flex-1 relative bg-gray-100 overflow-hidden mx-5 mt-5 rounded-2xl border border-gray-200/60 shadow-inner">
              <div ref={containerRef} className="w-full h-full z-0" />

              {/* Custom Map Controls (Sleek minimalist style) */}
              <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
                <button
                  onClick={() => mapRef.current?.zoomIn()}
                  className="w-10 h-10 bg-white hover:bg-gray-50 text-slate-800 rounded-xl shadow-lg border border-gray-100/80 flex items-center justify-center font-black text-lg transition-all active:scale-95 cursor-pointer"
                >
                  ＋
                </button>
                <button
                  onClick={() => mapRef.current?.zoomOut()}
                  className="w-10 h-10 bg-white hover:bg-gray-50 text-slate-800 rounded-xl shadow-lg border border-gray-100/80 flex items-center justify-center font-black text-lg transition-all active:scale-95 cursor-pointer"
                >
                  －
                </button>
                <button
                  onClick={handleMyLocation}
                  disabled={isLocating}
                  className={`w-10 h-10 bg-white hover:bg-gray-50 text-slate-800 rounded-xl shadow-lg border border-gray-100/80 flex items-center justify-center transition-all active:scale-95 cursor-pointer ${isLocating ? 'opacity-80' : ''}`}
                  title="موقعیت من"
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LucideIcons.Compass className="w-5 h-5 text-slate-700" />
                  )}
                </button>
              </div>

              {/* Float Address display if exists or status changed */}
              {(address || locatingError || isLocating) && (
                <div className={`absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 z-[999] ${locatingError ? 'border-red-100/85' : 'border-gray-100/80'}`}>
                  {locatingError ? (
                    <>
                      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex flex-shrink-0 items-center justify-center text-red-600">
                        <LucideIcons.AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <span className="text-[9px] font-black text-red-500 uppercase block mb-0.5">خطای موقعیت‌یابی</span>
                        <p className="text-xs font-black text-red-700 leading-relaxed">{locatingError}</p>
                      </div>
                    </>
                  ) : isLocating ? (
                    <>
                      <div className="w-8 h-8 bg-slate-900/10 rounded-lg flex flex-shrink-0 items-center justify-center text-slate-800">
                        <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">در حال دریافت موقعیت</span>
                        <p className="text-xs font-black text-slate-800 leading-relaxed animate-pulse">در حال جستجوی موقعیت دقیق شما توسط GPS...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-slate-900/10 rounded-lg flex flex-shrink-0 items-center justify-center text-slate-800">
                        <LucideIcons.MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">آدرس موقعیت انتخابی</span>
                        <p className="text-xs font-black text-slate-800 leading-relaxed truncate">{address}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Floating Bottom confirmation bar */}
              <div className="absolute bottom-4 left-4 right-4 z-[999]">
                <button
                  disabled={!selectedLocation}
                  onClick={handleConfirm}
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all cursor-pointer ${
                    selectedLocation
                      ? 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  تایید این موقعیت
                </button>
              </div>
            </div>
            {/* Added margin to push content slightly up nicely */}
            <div className="h-5 shrink-0" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
