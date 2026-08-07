import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { type AppEvent } from '../../types';
import { getEventsWithPagination } from '../../services/events'
import EventCardSkeleton from './EventCardSkeleton'
import EmptyState from './EmptyState'
import { MapPin, Clock, Heart, User } from 'lucide-react';
import { useCity } from '../Shared/CityContext';

interface EventsPageProps {
  onSelectEvent: (id: number) => void;
  searchQuery?: string;
  filters?: {
    categoryId?: number;
    provinceId?: number;
    interestIds?: number[];
    gender?: string;
    eventType?: string,
    isFreeOnly?: boolean
  };
}

function EventsPage({ onSelectEvent, searchQuery = '', filters = {} }: EventsPageProps) {

  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const { selectedCityId } = useCity();

  const lastLoadedCityId = useRef<number | null>(null);
  const isCityChanging = useRef(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getFilters = useCallback(() => {
    let genderValue: number | undefined = 0;
    if (filters?.gender === 'آقا') genderValue = 1;
    else if (filters?.gender === 'خانم') genderValue = 2;

    let eventTypeValue: number | undefined = 0
    if (filters?.eventType === 'حضوری') eventTypeValue = 1
    else if (filters?.eventType === 'آنلاین') eventTypeValue = 2

    return {
      categoryId: filters?.categoryId,
      provinceId: filters?.provinceId,
      searchTerm: debouncedSearchQuery || undefined,
      interestIds: filters.interestIds || [],
      gender: genderValue,
      eventType: eventTypeValue,
      isFreeOnly: filters.isFreeOnly
    };
  }, [filters?.categoryId, filters?.provinceId, debouncedSearchQuery, filters?.interestIds, filters?.gender, filters?.eventType, filters.isFreeOnly]);

  const resetAndLoadEvents = useCallback(async (isCityChange: boolean = false) => {
    if (isCityChanging.current && !isCityChange) {
      return;
    }

    if (isCityChange) {
      isCityChanging.current = true;
    }

    setIsInitialLoading(true);
    setEvents([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);

    try {
      const filtersData = getFilters();

      const response = await getEventsWithPagination({
        pageNumber: 1,
        pageSize: 10,
        cityId: selectedCityId!,
        ...filtersData
      });

      if (isMounted.current) {
        setEvents(response.data);
        setTotalPages(response.totalPages);
        setHasMore(response.hasNextPage);
        setCurrentPage(1);
        lastLoadedCityId.current = selectedCityId!;
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت رویدادها');
      }
    } finally {
      if (isMounted.current) {
        setIsInitialLoading(false);
      }
      if (isCityChange) {
        isCityChanging.current = false;
      }
    }
  }, [selectedCityId, getFilters]);

  useEffect(() => {
    if (!isMounted.current) return;
    resetAndLoadEvents(false);
  }, [debouncedSearchQuery, filters?.categoryId, filters?.provinceId, filters?.interestIds, filters?.gender, filters?.eventType, filters?.isFreeOnly]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (selectedCityId && selectedCityId > 0) {
      if (lastLoadedCityId.current !== selectedCityId) {
        resetAndLoadEvents(true);
      }
    }
  }, [selectedCityId, resetAndLoadEvents]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore || isInitialLoading || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isInitialLoading) {
          loadMoreEvents();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, isInitialLoading, isLoading, events.length]);

  const loadMoreEvents = async () => {
    if (!hasMore || isLoadingMore || isInitialLoading || isLoading) {
      return;
    }

    setIsLoading(true);
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const filtersData = getFilters();

      const response = await getEventsWithPagination({
        pageNumber: nextPage,
        pageSize: 10,
        cityId: selectedCityId!,
        ...filtersData
      });

      if (isMounted.current) {
        setEvents(prev => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setHasMore(response.hasNextPage);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت رویدادها');
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingMore(false);
        setIsLoading(false);
      }
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const bottom = scrollHeight - scrollTop <= clientHeight + 200;

    if (bottom && hasMore && !isLoadingMore && !isInitialLoading) {
      loadMoreEvents();
    }
  }, [hasMore, isLoadingMore, isInitialLoading, events.length]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isSearching = searchQuery !== debouncedSearchQuery;

  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto no-scrollbar pb-10"
    >
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-[#ED1C24] rounded-full inline-block"></span>
            دورهمی ها
          </h2>
          <div className="text-[10px] text-gray-400 font-bold bg-gray-100 px-3 py-1 rounded-full">
            {events.length} رویداد
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isInitialLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="group cursor-pointer bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md border border-slate-100/80 transition-all duration-300"
                onClick={() => onSelectEvent(event.id)}
              >
                {/* ===== بخش تصویر ===== */}
                <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={process.env.File_BaseURL + event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* ===== سایه مشکی از پایین به بالا (گرادیانت) ===== */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                  {/* ===== تگ رایگان (با بک‌گراند قرمز و افکت شیشه‌ای) ===== */}
                  {event.isFree && (
                    <div className="absolute top-2 left-2 bg-[#ffffff]/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[8px] font-black text-black z-10 shadow-sm border border-white/10">
                      رایگان
                    </div>
                  )}
                </div>

                {/* ===== بخش محتوای متنی ===== */}
                <div className="p-2.5 space-y-1.5">
                  {/* عنوان رویداد */}
                  <h3 className="text-xs font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-[#ED1C24] transition-colors">
                    {event.title}
                  </h3>

                  {/* ===== ردیف تاریخ و مکان برگزاری (کنار هم) ===== */}
                  <div className="flex items-center justify-between">
                    {/* تاریخ */}
                    <div className="flex items-center gap-0.5 text-gray-400">
                      <Clock size={9} className="text-teal-500" />
                      <span className="text-[10px] font-bold font-medium">{event.date}</span>
                    </div>

                    {/* مکان برگزاری */}
                    <div className="flex items-center gap-0.5 text-gray-400 max-w-[100px]">
                      <MapPin size={9} className="text-teal-500 flex-shrink-0" />
                      <span className="text-[10px] font-bold truncate">{event.location || 'تهران، تهران'}</span>
                    </div>
                  </div>

                  {/* ===== ردیف برگزارکننده ===== */}
                  <div className="flex items-center gap-0.5 text-gray-400">
                    <User size={9} className="text-teal-500" />
                    <span className="text-[10px] font-bold truncate max-w-[160px]">برگزارکننده: {event.organizer || 'علی قلی پور'}</span>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2">
              <EmptyState message="رویدادی یافت نشد" />
            </div>
          )}
        </div>

        {isLoadingMore && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        )}

        {/* پایان لیست */}
        {!isLoadingMore && !isInitialLoading && !hasMore && events.length > 0 && (
          <div className="py-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-0.5 bg-gray-100 rounded-full" />
              <p className="text-gray-400 text-[10px] font-bold">
                {events.length} رویداد - پایان لیست
              </p>
            </div>
          </div>
        )}

        {hasMore && !isInitialLoading && events.length > 0 && (
          <div ref={loadMoreRef} className="h-6 w-full" />
        )}
      </section>
    </motion.main>
  );
}

export default EventsPage;