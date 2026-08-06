// CustomerEventsPage.tsx
import { useState, useEffect, useRef } from "react";
import { AppEvent, AppUser, CustomerGuestBahamResponse, CustomerHostedBahamResponse } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Ticket, ShieldCheck, AlertCircle, ChevronLeft, Clock, Plus,
  MapPin, X, Loader, User, Timer, Users, Edit3, Mail, Phone,
  PlusCircle, CalendarHeart, ArrowRight, CheckCircle2, XCircle,
  PauseCircle, Compass, RefreshCw, Download, Share2, Sparkles,
  MessageSquare, HelpCircle
} from "lucide-react";
import CancellationConfirmDrawer from "../Shared/CancellationConfirmDrawer";
import { getRegisteredEvents, getHostedEvents, cancelRegistration, getEventParticipants } from "../../services/events";
import { formatEventTime, getEventDurationLabel } from "../../lib/utils";

type EventParticipant = Awaited<ReturnType<typeof getEventParticipants>>["data"][number];

// Helper component for status badges
function EventStatusBadge({ status, isActive }: { status?: number; isActive?: boolean }) {
  // isActive = true means disabled
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
        <PauseCircle className="w-3 h-3 text-slate-500 shrink-0" />
        <span>غیرفعال (Disabled)</span>
      </span>
    );
  }

  if (status === 2) {
    return (
      <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>تایید شده (Approved)</span>
      </span>
    );
  }

  if (status === 3) {
    return (
      <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
        <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
        <span>رد شده (Rejected)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
      <Clock className="w-3 h-3 text-amber-600 shrink-0" />
      <span>در انتظار بررسی (Pending)</span>
    </span>
  );
}

function CustomerEventsPage({
  onSelectEvent,
  onNavigate,
  onCreateEvent,
  onReRequestApproval,
  onEditEvent,
  activeSubTab: activeSubTabProp,
  onSubTabChange,
  users = [],
}: {
  onSelectEvent: (id: string) => void;
  onNavigate: (tab: string) => void;
  onCreateEvent: () => void;
  onReRequestApproval?: (id: string) => void;
  onEditEvent?: (event: CustomerHostedBahamResponse) => void;
  activeSubTab?: 'registered' | 'hosted';
  onSubTabChange?: (tab: 'registered' | 'hosted') => void;
  users?: AppUser[];
  key?: React.Key
}) {
  const [activeSubTab, setActiveSubTab] = useState<'registered' | 'hosted'>(activeSubTabProp ?? 'registered');
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState<number | null>(null);

  const [registeredEvents, setRegisteredEvents] = useState<CustomerGuestBahamResponse[]>([]);
  const [totalCountRegisteredEvent, setTotalCountRegisteredEvents] = useState<number>(0);
  const [registeredLoading, setRegisteredLoading] = useState(true);
  const [registeredHasMore, setRegisteredHasMore] = useState(true);
  const [registeredPage, setRegisteredPage] = useState(1);

  const [hostedEvents, setHostedEvents] = useState<CustomerHostedBahamResponse[]>([]);
  const [totalCountHostedEvent, setTotalCountHostedEvents] = useState<number>(0);
  const [hostedLoading, setHostedLoading] = useState(true);
  const [hostedHasMore, setHostedHasMore] = useState(true);
  const [hostedPage, setHostedPage] = useState(1);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<CustomerGuestBahamResponse | null>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasFetched = useRef(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<CustomerHostedBahamResponse | null>(null);
  const [participantsByEventId, setParticipantsByEventId] = useState<Record<number, EventParticipant[]>>({});
  const [participantsLoadingByEventId, setParticipantsLoadingByEventId] = useState<Record<number, boolean>>({});
  const [participantsErrorByEventId, setParticipantsErrorByEventId] = useState<Record<number, string>>({});
  useEffect(() => {
    if (activeSubTabProp) {
      setActiveSubTab(activeSubTabProp);
    }
  }, [activeSubTabProp]);

  // const [eventRegistrations, setEventRegistrations] = useState<Record<string, string[]>>({
  //   '1': ['1', '2', '3'],
  //   '2': ['2', '4'],
  //   '3': ['1', '3', '4'],
  //   '4': ['2', '3'],
  //   '5': ['1', '4'],
  // });

  // State for re-request modal
  const [selectedEventForRejection, setSelectedEventForRejection] = useState<CustomerHostedBahamResponse | null>(null);
  const [reRequestNote, setReRequestNote] = useState('');
  const [reRequestSubmitted, setReRequestSubmitted] = useState(false);

  // دریافت رویدادهای ثبت‌نام شده
  const fetchRegisteredEvents = async (page: number, isRefresh = false) => {
    try {
      const result = await getRegisteredEvents({ pageNumber: page, pageSize: 10 });
      setTotalCountRegisteredEvents(result.totalCount);

      if (isRefresh) {
        setRegisteredEvents(result.data);
      } else {
        setRegisteredEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const newEvents = result.data.filter(e => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
      setRegisteredHasMore(result.hasNextPage);
    } catch (error) {
      console.error('Error fetching registered events:', error);
    } finally {
      setRegisteredLoading(false);
    }
  };

  // دریافت رویدادهای برگزار شده
  const fetchHostedEvents = async (page: number, isRefresh = false) => {
    try {
      const result = await getHostedEvents({ pageNumber: page, pageSize: 10 });
      setTotalCountHostedEvents(result.totalCount);

      if (isRefresh) {
        setHostedEvents(result.data);
      } else {
        setHostedEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const newEvents = result.data.filter(e => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
      setHostedHasMore(result.hasNextPage);
    } catch (error) {
      console.error('Error fetching hosted events:', error);
    } finally {
      setHostedLoading(false);
    }
  };

  // بارگذاری اولیه
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchRegisteredEvents(1, true);
    fetchHostedEvents(1, true);
  }, []);

  const fetchEventParticipants = async (eventId: number) => {
    if (participantsLoadingByEventId[eventId]) return;

    setParticipantsLoadingByEventId(prev => ({ ...prev, [eventId]: true }));
    setParticipantsErrorByEventId(prev => ({ ...prev, [eventId]: '' }));

    try {
      const result = await getEventParticipants(eventId, 1, 50);
      setParticipantsByEventId(prev => ({ ...prev, [eventId]: result.data }));
    } catch (error) {
      console.error('Error fetching event participants:', error);
      setParticipantsErrorByEventId(prev => ({
        ...prev,
        [eventId]: error instanceof Error ? error.message : 'خطا در دریافت شرکت‌کنندگان',
      }));
    } finally {
      setParticipantsLoadingByEventId(prev => ({ ...prev, [eventId]: false }));
    }
  };

  useEffect(() => {
    if (selectedEventForAttendees) {
      void fetchEventParticipants(selectedEventForAttendees.id);
    }
  }, [selectedEventForAttendees]);

  // تابع انصراف از رویداد
  const handleCancelRegistration = async () => {
    if (!eventToCancel) return;

    try {
      const result = await cancelRegistration(eventToCancel);
      if (result.success) {
        setRegisteredEvents(prev => prev.map(event =>
          event.id === eventToCancel
            ? { ...event, isCanceled: true }
            : event
        ));
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
    } finally {
      setIsCancelConfirmOpen(false);
      setEventToCancel(null);
    }
  };

  // بارگذاری بیشتر برای رویدادهای ثبت‌نام شده
  const loadMoreRegistered = async () => {
    if (registeredHasMore && !registeredLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = registeredPage + 1;
      await fetchRegisteredEvents(nextPage, false);
      setRegisteredPage(nextPage);
      setIsLoadingMore(false);
    }
  };

  // بارگذاری بیشتر برای رویدادهای برگزار شده
  const loadMoreHosted = async () => {
    if (hostedHasMore && !hostedLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = hostedPage + 1;
      await fetchHostedEvents(nextPage, false);
      setHostedPage(nextPage);
      setIsLoadingMore(false);
    }
  };

  // نمایش لودینگ
  if (registeredLoading || hostedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-[#ED1C24]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
      className="flex-1 flex flex-col w-full overflow-hidden bg-[#F8F9FC] pb-20"
      dir="rtl"
    >
      {/* Header - Compact & Minimal */}
      <header className="px-5 pt-8 pb-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center">
            <CalendarHeart className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start text-right">
            <h1 className="text-xs font-black text-gray-900 leading-none">
              رویدادهای من
            </h1>
            <p className="text-[9px] font-bold text-gray-400 mt-0.5">
              مدیریت تجارب ثبت‌نام شده و میزبانی‌های شما
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 shadow-sm active:scale-95 transition-all cursor-pointer"
          title="بازگشت"
        >
          <ArrowRight className="w-4 h-4 text-gray-700" />
        </button>
      </header>

      {/* Sub-Tab Selector */}
      <div className="px-5 pt-4 pb-2 bg-white/60 backdrop-blur-xs border-b border-gray-100/60 shrink-0">
        <div className="bg-gray-100/80 p-1 rounded-2xl flex items-center shadow-inner border border-gray-100">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('registered');
              onSubTabChange?.('registered');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${activeSubTab === 'registered'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            <Ticket className={`w-3.5 h-3.5 ${activeSubTab === 'registered' ? 'text-[#ED1C24]' : ''}`} />
            <span>تجارب من</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${activeSubTab === 'registered' ? 'bg-red-50 text-[#ED1C24]' : 'bg-gray-200 text-gray-600'
              }`}>
              {registeredEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('hosted');
              onSubTabChange?.('hosted');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${activeSubTab === 'hosted'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200/50'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${activeSubTab === 'hosted' ? 'text-blue-600' : ''}`} />
            <span>میزبانی‌های من</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${activeSubTab === 'hosted' ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-600'
              }`}>
              {hostedEvents.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <AnimatePresence mode="wait">
          {activeSubTab === 'registered' ? (
            <motion.div
              key="registered-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {registeredEvents.length > 0 ? (
                registeredEvents.map((event) => {
                  const isCancelled = event.iscanceled;
                  const now = new Date();
                  const eventStarted = event.startTime <= now; //new Date(event.startTime!) <= now;
                  const eventFinished = event.endTime <= now; //new Date(event.endTime!) <= now;

                  return (
                    <div key={event.id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden text-right">
                      <div
                        className="flex items-center gap-3.5 p-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => onSelectEvent(event.id.toString())}
                      >
                        <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                          <img
                            src={process.env.File_BaseURL + event.image}
                            alt={event.title}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isCancelled ? 'grayscale brightness-90' : 'group-hover:scale-105'}`}
                          />
                          {/* {isCancelled && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className="text-[8.5px] font-black text-white bg-rose-600/90 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                <XCircle className="w-2.5 h-2.5" />
                                <span>لغو شده</span>
                              </span>
                            </div>
                          )}
                          {!isCancelled && eventFinished && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className="text-[8.5px] font-black text-white bg-gray-600/90 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                <Clock className="w-2.5 h-2.5" />
                                <span>به پایان رسیده</span>
                              </span>
                            </div>
                          )}
                          {!isCancelled && eventStarted && !eventFinished && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className="text-[8.5px] font-black text-white bg-amber-600/90 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                <Clock className="w-2.5 h-2.5" />
                                <span>در حال برگزاری</span>
                              </span>
                            </div>
                          )} */}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className={`text-xs font-black truncate ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isCancelled ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
                                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>ثبت‌نام لغو شده</span>
                              </span>
                            ) : eventFinished ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/80 shadow-2xs">
                                <CheckCircle2 className="w-3 h-3 text-gray-500 shrink-0" />
                                <span>رویداد به پایان رسیده</span>
                              </span>
                            ) : eventStarted ? (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>در حال برگزاری</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>ثبت‌نام نهایی</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            <Clock className={`w-3 h-3 ${isCancelled ? 'text-gray-400' : 'text-[#ED1C24]'}`} />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black text-gray-500">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action / Status Bar */}
                      {isCancelled ? (
                        <div className="px-3.5 py-2.5 bg-rose-50/60 border-t border-rose-100/80 flex items-center justify-between text-right">
                          <div className="flex items-center gap-1.5 text-rose-600 text-[10.5px] font-black">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                            <span>ثبت‌نام این رویداد توسط شما لغو شده است</span>
                          </div>
                          <span className="text-[9px] font-bold text-rose-500 bg-white px-2 py-0.5 rounded-md border border-rose-200/60 shadow-2xs shrink-0">
                            غیرفعال
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2.5 p-2.5 bg-gradient-to-r from-red-50/40 via-white to-gray-50/80 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventForTicket(event);
                            }}
                            className="flex-1 flex items-center justify-between from-[#ED1C24] bg-slate-900 text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98 group"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                                <Ticket className="w-3.5 h-3.5 text-amber-300" />
                              </div>
                              <span className="text-[11px] font-black tracking-tight">مشاهده بلیط دیجیتال</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9.5px] font-bold bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-md text-red-50 transition-colors">
                              <span>کد اختصاصی</span>
                              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToCancel(event.id);
                              setIsCancelConfirmOpen(true);
                            }}
                            className="px-3 py-2 bg-white hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-xl text-[10px] font-black transition-all cursor-pointer border border-gray-200/80 hover:border-rose-200 shadow-2xs flex items-center gap-1 shrink-0"
                            title="لغو ثبت‌نام"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">لغو</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 shadow-xs my-4">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-900">هنوز خاطره‌ای نساخته‌اید!</h3>
                    <p className="text-[11px] font-bold text-gray-400 max-w-[260px] leading-relaxed mx-auto">
                      در میان رویدادهای مختلف جستجو کنید و اولین تجربه خود را ثبت کنید.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-sm active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>مشاهده رویدادها</span>
                  </button>
                </div>
              )}

              {/* Load more button */}
              {registeredHasMore && registeredEvents.length > 0 && (
                <button
                  onClick={loadMoreRegistered}
                  className="w-full py-3 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  مشاهده بیشتر
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hosted-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {hostedEvents.length > 0 ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black text-gray-500">رویدادهای ثبت شده توسط شما</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                      {hostedEvents.length} رویداد
                    </span>
                  </div>

                  {hostedEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden text-right">
                      <div
                        className="p-3.5 flex items-center gap-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => onSelectEvent(event.id.toString())}
                      >
                        <div className="w-18 h-18 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                          <img src={process.env.File_BaseURL + event.image} alt={event.title} className="w-full h-full object-cover" />
                          {event.status !== 2 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className={`text-[8px] font-black text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${event.status === 3 ? 'bg-rose-500' : 'bg-amber-500'
                                }`}>
                                {event.status === 3 ? (
                                  <>
                                    <XCircle className="w-2.5 h-2.5" />
                                    <span>رد شده</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>در انتظار</span>
                                  </>
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-xs font-black text-gray-900 truncate">{event.title}</h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <EventStatusBadge status={event.status} isActive={event.isActive} />
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{event.date}</span>
                          </div>
                        </div>

                        <ChevronLeft className="w-4 h-4 text-gray-300 shrink-0" />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 p-3 bg-gray-50/50 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent?.(event);
                          }}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer border border-blue-100/60"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventForAttendees(event);
                          }}
                          className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer border border-gray-200/80 shadow-2xs"
                        >
                          <Users className="w-3 h-3 text-gray-500" />
                          {/* <span>شرکت‌کنندگان ({(participantsByEventId[event.id] || []).length})</span> */}
                          <span>شرکت‌کنندگان</span>
                        </button>
                      </div>

                      {/* Rejection Alert Button */}
                      {event.status === 3 && (
                        <div className="p-2.5 bg-rose-50/80 border-t border-rose-100 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventForRejection(event);
                              setReRequestSubmitted(false);
                              setReRequestNote('');
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white py-2 px-3 rounded-xl text-[10.5px] font-black flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-white shrink-0 animate-pulse" />
                              <span>مشاهده علت عدم تایید و پیگیری</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9.5px] bg-white/20 px-2 py-0.5 rounded-md font-bold">
                              <span>جزئیات</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Load more button */}
                  {hostedHasMore && (
                    <button
                      onClick={loadMoreHosted}
                      className="w-full py-3 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      مشاهده بیشتر
                    </button>
                  )}

                  {/* <button
                    type="button"
                    onClick={onCreateEvent}
                    className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-slate-800 py-4 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-all cursor-pointer mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-black">ایجاد رویداد جدید</span>
                  </button> */}
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 shadow-xs my-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-900">هنوز میزبان نبوده‌اید؟</h3>
                    <p className="text-[11px] font-bold text-gray-400 max-w-[260px] leading-relaxed mx-auto">
                      همین حالا رویداد منحصر به فرد خودتان را بسازید و جامعه خود را دور هم جمع کنید.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onCreateEvent}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-sm active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>ساخت اولین رویداد</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancellation Confirmation Drawer */}
      <CancellationConfirmDrawer
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelRegistration}
      />

      {/* Hosted Event Attendees Drawer */}
      <AnimatePresence>
        {selectedEventForAttendees && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventForAttendees(null)}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ y: "100%", x: "-50%" }}
              animate={{ y: 0, x: "-50%" }}
              exit={{ y: "100%", x: "-50%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh]"
              dir="rtl"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-3 shrink-0" />

              <div className="px-5 pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-right">
                    <h2 className="text-xs font-black text-gray-900">لیست شرکت‌کنندگان</h2>
                    <p className="text-[10px] font-bold text-gray-400 truncate max-w-[300px]">
                      {selectedEventForAttendees.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-2.5 pb-20">
                {(() => {
                  const attendees = participantsByEventId[selectedEventForAttendees.id] || [];
                  const isLoading = participantsLoadingByEventId[selectedEventForAttendees.id];
                  const errorMessage = participantsErrorByEventId[selectedEventForAttendees.id];

                  if (isLoading) {
                    return (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <Loader className="w-7 h-7 animate-spin text-[#ED1C24]" />
                        <p className="text-xs font-black text-gray-700">در حال دریافت شرکت‌کنندگان...</p>
                      </div>
                    );
                  }

                  if (errorMessage) {
                    return (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <AlertCircle className="w-7 h-7 text-rose-500" />
                        <p className="text-xs font-black text-gray-700">خطا در دریافت اطلاعات</p>
                        <p className="text-[10px] font-bold text-gray-400">{errorMessage}</p>
                      </div>
                    );
                  }

                  if (attendees.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-gray-100">
                          <Users className="w-7 h-7" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-gray-700">شرکت‌کننده‌ای وجود ندارد</p>
                          <p className="text-[10px] font-bold text-gray-400">
                            هنوز کسی در این رویداد ثبت‌نام نکرده است.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return attendees.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100 text-right"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white shadow-2xs bg-gray-200">
                        <img
                          src={process.env.File_BaseURL + participant.profileAddress!}
                          alt={participant.fullname}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-[13px] font-black text-gray-900">{participant.fullname}</h4>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {participant.registeredAt && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                              <Clock className="w-2.5 h-2.5 text-gray-400" />
                              <span>تاریخ ثبت نام: {participant.registeredAt}</span>
                            </div>
                          )}
                          {participant.phone && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                              <Phone className="w-2.5 h-2.5 text-gray-400" />
                              <span>{participant.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedEventForAttendees(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  بستن لیست
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal: Rejection Reason & Re-approval Request */}
      <AnimatePresence>
        {selectedEventForRejection && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventForRejection(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[420px] bg-white rounded-[28px] p-5 shadow-2xl z-[230] text-gray-900 overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] my-auto"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">علت عدم تایید رویداد</h3>
                    <p className="text-[10px] font-bold text-gray-400 truncate max-w-[220px]">
                      {selectedEventForRejection.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventForRejection(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-3.5 space-y-3.5 text-right">
                {/* Status Badge */}
                <div className="bg-rose-50/80 border border-rose-200/80 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span className="text-xs font-black text-rose-700">وضعیت: عدم تایید توسط ناظر</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-rose-100">
                    نیازمند بازبینی
                  </span>
                </div>

                {/* Moderator Message Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-800">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    <span>پیام ناظر رویداد:</span>
                  </div>
                  <div className="bg-slate-50 border-r-4 border-rose-500 p-3.5 rounded-2xl space-y-2 border border-slate-100">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 pb-1 border-b border-gray-200/60">
                      <span className="text-gray-700 font-black flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        تیم نظارت و محتوا
                      </span>
                      <span>امروز - ۱۴:۲۰</span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedEventForRejection.reasons && selectedEventForRejection.reasons.length > 0
                        ? selectedEventForRejection.reasons[0].reason || 'توضیحات بیشتری ثبت نشده است.'
                        : 'با سلام؛ جهت تایید رویداد، لطفاً آدرس دقیق محل برگزاری را اصلاح کرده و تصویر شاخص باکیفیت‌تر و بدون واترمارک بارگذاری نمایید.'}
                    </p>
                  </div>
                </div>

                {/* Helpful Guidance */}
                <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-black">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>راهنمای اصلاح و تایید سریع:</span>
                  </div>
                  <p className="text-[10.5px] font-bold text-amber-900/80 leading-relaxed">
                    با کلیک روی دکمه «ویرایش رویداد» موارد فوق را ویرایش کرده، سپس دکمه «درخواست بررسی مجدد» را فشار دهید.
                  </p>
                </div>

                {/* Optional Note for Moderator */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-800 block">
                    توضیحات شما برای ناظر (اختیاری):
                  </label>
                  <textarea
                    value={reRequestNote}
                    onChange={(e) => setReRequestNote(e.target.value)}
                    placeholder="توضیحات مربوط به اصلاحات انجام شده..."
                    rows={2}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {reRequestSubmitted && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>درخواست بررسی مجدد شما با موفقیت ثبت شد.</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-100 flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const ev = selectedEventForRejection;
                    setSelectedEventForRejection(null);
                    onEditEvent?.(ev);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 h-10 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ویرایش رویداد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = selectedEventForRejection.id;
                    onReRequestApproval?.(id.toString());
                    setReRequestSubmitted(true);
                    setTimeout(() => {
                      setSelectedEventForRejection(null);
                      setReRequestSubmitted(false);
                    }, 1200);
                  }}
                  className="flex-[1.4] bg-rose-600 hover:bg-rose-700 text-white h-10 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>درخواست بررسی مجدد</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Center Modal: Realistic Digital Event Ticket (styled after train ticket reference) */}
      <AnimatePresence>
        {selectedEventForTicket && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventForTicket(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Ticket Card Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] p-6 shadow-2xl z-[230] text-gray-900 overflow-hidden border border-gray-100/80 my-auto"
              dir="rtl"
            >
              {/* Left and Right Notches (Authentic ticket punch cutouts) */}
              <div className="absolute -left-3.5 bottom-[116px] w-7 h-7 bg-slate-950 rounded-full z-20 border border-white/10" />
              <div className="absolute -right-3.5 bottom-[116px] w-7 h-7 bg-slate-950 rounded-full z-20 border border-white/10" />

              {/* Ticket Top Header: Participant Name */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">
                    شرکت‌کننده (Participant)
                  </span>
                  <h3 className="text-sm font-black text-gray-900 mt-0.5">
                    {selectedEventForTicket?.organizerName || ''}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventForTicket(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Event Time & Duration Row */}
              <div className="flex items-center justify-between pt-3 text-xs font-black text-gray-900">
                <span className="text-gray-500 text-[11px] font-bold">
                  {formatEventTime(selectedEventForTicket?.startTime)}
                </span>
                <span className="bg-red-50 text-[#ED1C24] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border border-red-100">
                  <Clock className="w-3 h-3" />
                  {getEventDurationLabel(selectedEventForTicket?.startTime, selectedEventForTicket?.endTime)}
                </span>
                <span className="text-gray-500 text-[11px] font-bold">
                  {formatEventTime(selectedEventForTicket?.endTime)}
                </span>
              </div>

              {/* Timeline Route Graphic */}
              <div className="relative my-3 flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full shrink-0" />
                <div className="flex-1 h-[2px] bg-gray-900 mx-1.5 relative flex items-center justify-center">
                  <div className="bg-white px-2 text-[#ED1C24] flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-2.5 h-2.5 border-2 border-gray-900 bg-white rounded-full shrink-0" />
              </div>

              {/* Location Route labels */}
              <div className="flex items-center justify-between text-[11px] font-black text-gray-800 px-1">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-gray-400 block mt-0.5">شهر مبدأ</span>
                  <div>{selectedEventForTicket.location || 'تهران'}</div>

                  <span className="text-[9px] font-bold text-gray-400 block mt-0.5">محل برگزاری</span>
                  <div className="truncate max-w-[130px]">{selectedEventForTicket.location.split('،')[0]}</div>
                </div>
                {/* <div className="text-left">
                  <div className="truncate max-w-[130px]">{selectedEventForTicket.location.split('،')[0]}</div>
                  <span className="text-[9px] font-bold text-gray-400 block mt-0.5">محل برگزاری</span>
                </div> */}
              </div>

              {/* Event Title */}
              {/* <div className="mt-4 pt-3 border-t border-gray-100 text-right space-y-0.5">
                <span className="text-[9px] font-bold text-gray-400 block">عنوان رویداد</span>
                <h2 className="text-xs font-black text-gray-900 leading-snug">
                  {selectedEventForTicket.title}
                </h2>
              </div> */}

              {/* Event Date */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-right space-y-0.5">
                <span className="text-[9px] font-bold text-gray-400 block">عنوان رویداد</span>
                <h2 className="text-xs font-black text-gray-900 leading-snug">
                  {selectedEventForTicket.title}
                </h2>
                
                <span className="text-[9px] mt-3 font-bold text-gray-400 block">تاریخ دورهمی</span>
                <h2 className="text-xs font-black text-gray-900 leading-snug">
                  {selectedEventForTicket.date}
                </h2>
              </div>

              {/* Booking Reference Code */}
              <div className="mt-3 text-right space-y-0.5">
                <span className="text-[9px] font-bold text-gray-400 block">
                  کد پیگیری رزرو (Booking Reference)
                </span>
                <div className="text-xs font-black text-gray-900 tracking-widest font-mono">
                  EVT-2026-{(selectedEventForTicket.id || '101').toString().padStart(6, '0')}
                </div>
              </div>

              {/* Details Grid (3 columns: Date, Category, Guests) */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-center">
                {/* <div>
                  <span className="text-[9px] font-bold text-gray-400 block">تاریخ</span>
                  <span className="text-[10px] font-black text-gray-900 block mt-0.5 truncate">{selectedEventForTicket.date}</span>
                </div> */}
                <div>
                  <span className="text-[9px] font-bold text-gray-400 block">نوع برنامه</span>
                  <span className="text-[10px] font-black text-gray-900 block mt-0.5 truncate">{selectedEventForTicket.categoryName || 'دورهمی'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 block">وضعیت / بخش</span>
                  <span className="text-[10px] font-black text-emerald-600 block mt-0.5">۱ نفر (ویژه)</span>
                </div>
              </div>

              {/* Dotted Tear Line aligned with side notches */}
              <div className="relative my-4">
                <div className="border-b-2 border-dashed border-gray-200 w-full" />
              </div>

              {/* Bottom Barcode / QR Section */}
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-full flex justify-center items-center h-10 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <svg className="w-full h-7" viewBox="0 0 200 35" preserveAspectRatio="none">
                    {[4, 10, 14, 18, 24, 28, 36, 40, 48, 52, 58, 64, 70, 74, 82, 88, 92, 100, 106, 110, 118, 124, 130, 136, 142, 148, 154, 160, 168, 174, 180, 188, 194].map((x, i) => (
                      <rect key={i} x={x} y="0" width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1} height="35" fill="#111827" />
                    ))}
                  </svg>
                </div>
                <span className="text-[9px] font-mono font-bold text-gray-400 tracking-widest">
                  * 2 0 2 6 - 9 8 4 7 2 1 *
                </span>
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-black border border-emerald-100/80">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>بلیط معتبر جهت ورود به دورهمی</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert('بلیط دیجیتال با موفقیت ذخیره شد.');
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-9 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ذخیره بلیط</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: selectedEventForTicket.title, text: `بلیط ورود من به ${selectedEventForTicket.title}` });
                    } else {
                      alert('لینک بلیط کپی شد.');
                    }
                  }}
                  className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                  title="اشتراک‌گذاری"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default CustomerEventsPage;