import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

function EnhancedHeroSlider({ banners, isLoading }: { banners: any[]; isLoading?: boolean }) {
    const [index, setIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const total = banners?.length;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isAutoPlaying || isLoading) return;

        timerRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % total);
        }, 4000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isAutoPlaying, total, isLoading]);

    const handleManualInteraction = () => {
        setIsAutoPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

        pauseTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 6000);
    };

    const handleDragEnd = (event: any, info: any) => {
        const threshold = 50;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        if (offset > threshold || velocity > 500) {
            setIndex((prev) => (prev - 1 + total) % total);
        } else if (offset < -threshold || velocity < -500) {
            setIndex((prev) => (prev + 1) % total);
        }
        handleManualInteraction();
    };

    if (isLoading) {
        return (
            <div className="w-full px-4 py-4">
                <div className="w-full h-[200px] sm:h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div
            className="relative w-full overflow-hidden py-4 select-none touch-pan-y"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => {
                if (!pauseTimeoutRef.current) setIsAutoPlaying(true);
            }}
        >
            <div className="relative h-[200px] sm:h-[240px] px-2.5 overflow-visible">
                <motion.div
                    className="flex h-full"
                    style={{ width: `${total * 100}%` }}
                    animate={{ x: `${index * (100 / total)}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    onDragStart={() => setIsAutoPlaying(false)}
                >
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="px-1 h-full"
                            style={{ width: `calc(100% / ${total})` }}
                        >
                            <div className="relative h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center p-8 text-right">
                                <img
                                    src={process.env.File_BaseURL + banner.image}
                                    alt={banner.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
                                <div className="z-10 relative flex-1 space-y-2">
                                    <h3 className="text-white text-3xl font-black leading-tight drop-shadow-lg">
                                        {banner.title}
                                    </h3>
                                    <p className="text-white/90 text-sm font-bold leading-relaxed max-w-[85%]">
                                        {banner.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="flex justify-center items-center gap-2 mt-5">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setIndex(i); handleManualInteraction(); }}
                        className={`transition-all duration-300 rounded-full h-1.5 ${i === index ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default EnhancedHeroSlider;