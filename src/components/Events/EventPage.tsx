import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { type AppEvent } from '../../types';
import { getEventsWithPagination } from '../../services/events'
import EventCardSkeleton from './EventCardSkeleton'
import EmptyState from './EmptyState'
import { MapPin, Clock } from 'lucide-react';
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
      <section className="px-6 py-4">
        {/* <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">لیست رویدادها</h2>
          <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {selectedCityId ? `شهر: ${selectedCityId}` : 'انتخاب شهر'}
          </div>
        </div> */}

        <div className="flex flex-col gap-6">
          {isInitialLoading ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => onSelectEvent(event.id)}>

                {/* بخش تصویر با ارتفاع کمتر و سایه از پایین */}
                <div className="relative h-44 rounded-t-2xl overflow-hidden">
                  <img
                    src={process.env.File_BaseURL + event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* سایه مشکی کمرنگ از پایین به بالا */}
                  <div className="absolute inset-0 bg-gradient-to-t   to-transparent pointer-events-none" />

                  {event.isFree && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black z-10">
                      رایگان
                    </div>
                  )}
                </div>

                {/* بخش محتوای متنی */}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-black group-hover:text-[#ED1C24] transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState message="رویدادی یافت نشد" />
          )}

          {isLoadingMore && (
            <div className="flex flex-col gap-6 py-4">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}

          {!isLoadingMore && !isInitialLoading && !hasMore && events.length > 0 && (
            <div className="py-10 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-1 bg-gray-100 rounded-full" />
                <p className="text-gray-400 text-sm font-bold">
                  {events.length} رویداد - پایان لیست
                </p>
              </div>
            </div>
          )}

          {hasMore && !isInitialLoading && events.length > 0 && (
            <div ref={loadMoreRef} className="h-10 w-full" />
          )}
        </div>
      </section>
    </motion.main>
  );
}

export default EventsPage;