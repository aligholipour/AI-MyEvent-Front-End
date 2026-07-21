import { useState, useEffect, useRef } from "react";
import { AppEvent, AppUser } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, ShieldCheck, AlertCircle, ChevronLeft, Clock, Plus, MapPin, X, Loader, User, Timer, Users, Edit3, Mail, Phone } from "lucide-react";
import CancellationConfirmDrawer from "../Shared/CancellationConfirmDrawer";
import { getRegisteredEvents, getHostedEvents, cancelRegistration } from "../../services/events";

function CustomerEventsPage({
  onSelectEvent,
  onNavigate,
  onCreateEvent,
  onReRequestApproval,
  onEditEvent,
  users = [],
}: {
  onSelectEvent: (id: string) => void;
  onNavigate: (tab: string) => void;
  onCreateEvent: () => void;
  onReRequestApproval?: (id: string) => void;
  onEditEvent?: (event: AppEvent) => void;
  users?: AppUser[];
}) {
  const [activeSubTab, setActiveSubTab] = useState<'registered' | 'hosted'>('registered');
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState<number | null>(null);

  const [registeredEvents, setRegisteredEvents] = useState<AppEvent[]>([]);
  const [totalCountRegisteredEvent, setTotalCountRegisteredEvents] = useState<number>(0);
  const [registeredLoading, setRegisteredLoading] = useState(true);
  const [registeredHasMore, setRegisteredHasMore] = useState(true);
  const [registeredPage, setRegisteredPage] = useState(1);

  const [hostedEvents, setHostedEvents] = useState<AppEvent[]>([]);
  const [totalCountHostedEvent, setTotalCountHostedEvents] = useState<number>(0);
  const [hostedLoading, setHostedLoading] = useState(true);
  const [hostedHasMore, setHostedHasMore] = useState(true);
  const [hostedPage, setHostedPage] = useState(1);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasFetched = useRef(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<AppEvent | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<Record<string, string[]>>({
    '1': ['1', '2', '3'],
    '2': ['2', '4'],
    '3': ['1', '3', '4'],
    '4': ['2', '3'],
    '5': ['1', '4'],
  });

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

        // setRegisteredEvents(prev => [...prev, ...result.data]);
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

        setHostedEvents(prev => [...prev, ...result.data]);
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

  // تابع انصراف از رویداد
  const handleCancelRegistration = async () => {
    if (!eventToCancel) return;

    try {
      const result = await cancelRegistration(eventToCancel);
      if (result.success) {
        // setRegisteredEvents(prev => prev.filter(e => e.id !== eventToCancel));
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

  // بارگذاری بیشتر برای رویدادهای ثبت‌نام شده (اسکرول بی‌نهایت)
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
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 overflow-y-auto no-scrollbar pb-24"
      dir="rtl">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-gray-900 mb-2">رویدادهای من</h1>
        <p className="text-sm font-bold text-gray-400">تاریخچه و مدیریت فعالیت‌های شما</p>
      </header>

      <div className="px-6 mb-8">
        <div className="bg-gray-100 p-1.5 rounded-[2rem] flex items-center shadow-inner">
          <button
            onClick={() => setActiveSubTab('registered')}
            className={`flex-1 py-3.5 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 ${activeSubTab === 'registered'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Ticket className={`w-4 h-4 ${activeSubTab === 'registered' ? 'text-[#ED1C24]' : ''}`} />
            تجارب من ({totalCountRegisteredEvent})
          </button>
          <button
            onClick={() => setActiveSubTab('hosted')}
            className={`flex-1 py-3.5 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 ${activeSubTab === 'hosted'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeSubTab === 'hosted' ? 'text-[#ED1C24]' : ''}`} />
            میزبانی ({totalCountHostedEvent})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'registered' ? (
          <motion.div
            key="registered"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 space-y-4">
            {registeredEvents.length > 0 ? (
              <>
                {registeredEvents.map(event => {
                  const now = new Date();

                  const eventStarted =
                    new Date(event.startTime!) <= now;

                  const eventFinished =
                    new Date(event.endTime!) <= now;

                  return (
                    <div key={event.id} className="group relative">
                      <div
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-gray-100 transition-all cursor-pointer"
                        onClick={() => onSelectEvent(event.id.toString())}>
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={process.env.File_BaseURL + event.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-gray-900 truncate">{event.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 mt-1">{event.date}</p>
                          <div className="flex items-center text-gray-500 gap-1 mt-2 text-[10px] font-black text-[#ED1C24]">
                            <Timer className="w-3 h-3" />
                            <span className="text-gray-500">{event.eventTime}</span>
                          </div>
                          <div className="flex items-center text-gray-500 gap-1 mt-2 text-[10px] font-black text-[#ED1C24]">
                            <MapPin className="w-3 h-3" />
                            <span className="text-gray-500">{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-500 gap-1 mt-2 text-[10px] font-black text-[#ED1C24]">
                            <User className="w-3 h-3" />
                            <span className="text-gray-500">برگزارکننده: {event.organizer}</span>
                          </div>
                        </div>

                        {event.isCanceled ? (
                          <div className="text-[10px] font-black p-1 text-red-400">
                            ثبت‌نام شما لغو شده است
                          </div>
                        ) : eventFinished ? (
                          <div className="text-[10px] font-black p-1 text-gray-500">
                            رویداد به پایان رسیده است
                          </div>
                        ) : eventStarted ? (
                          <div className="text-[10px] font-black p-1 text-amber-500">
                            رویداد در حال برگزاری است
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToCancel(event.id);
                              setIsCancelConfirmOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <div className="text-[10px] font-black p-1 text-red-400 flex items-center gap-1">
                              لغو ثبت‌نام
                              <ChevronLeft className="w-3 h-3" />
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {/* دکمه بارگذاری بیشتر */}
                {registeredHasMore && (
                  <button
                    onClick={loadMoreRegistered}
                    className="w-full py-3 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                    مشاهده بیشتر
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100">
                  <Ticket className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900">هنوز خاطره‌ای نساخته‌اید!</h3>
                  <p className="text-sm font-bold text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    در میان رویدادهای جذاب جستجو کنید و اولین تجربه خود را ثبت کنید.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('events')}
                  className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                >
                  مشاهده رویدادهای پرطرفدار
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hosted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 space-y-4"
          >
            {hostedEvents.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black text-gray-400">رویدادهای ثبت شده توسط شما</span>
                  <div className="bg-gray-100 px-2 py-1 rounded-md text-[9px] font-black text-gray-500">
                    {hostedEvents.length} رویداد
                  </div>
                </div>
                {hostedEvents.map(event => (
                  <div key={event.id} className="group flex flex-col gap-3">
                    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-all cursor-pointer"
                        onClick={() => onSelectEvent(event.id.toString())}>
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative">
                          <img src={process.env.File_BaseURL + event.image} alt="" className="w-full h-full object-cover" />
                          {event.status !== 2 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <span className={`text-[8px] font-black text-white px-1.5 py-0.5 rounded-lg ${event.status === 3 ? 'bg-red-500' : 'bg-amber-500'}`}>
                                {event.status === 3 ? 'رد شده' : 'منتظر تایید'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-gray-900 truncate">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${event.status === 2 ? 'bg-emerald-50 text-emerald-600' : (event.status === 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}`}>
                              {event.status === 2 ? 'تایید شده' : (event.status === 3 ? 'رد شده' : 'در انتظار بررسی')}
                            </span>
                            {event.isActive && (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600">غیرفعال</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{event.eventTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons section */}
                      <div className="flex gap-2.5 px-4 pb-4 border-t border-gray-50/50 pt-3 bg-gray-50/30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent?.(event);
                          }}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ویرایش رویداد</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventForAttendees(event);
                          }}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          <span>شرکت‌کنندگان ({(eventRegistrations[event.id] || []).length})</span>
                        </button>
                      </div>
                    </div>

                    {event.status === 3 && (
                      <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-3">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-[10px] font-black">علت رد شدن توسط ناظر</span>
                        </div>

                        {event.reasons && event.reasons.length > 0 ? (
                          event.reasons.map((reason, index) => (
                            <div key={index} className="space-y-1">
                              <p className="text-xs font-bold text-black-500 leading-relaxed italic pr-2 border-r-2 border-red-200">
                                {reason.reason || 'توضیحات بیشتری ثبت نشده است.'}
                              </p>
                              {reason.createDateTime && (
                                <p className="text-[9px] font-bold text-black-700 pr-2">
                                  تاریخ ثبت: {new Date(reason.createDateTime).toLocaleDateString('fa-IR')}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs font-bold text-black-500 leading-relaxed italic pr-2 border-r-2 border-red-200">
                            توضیحات بیشتری ثبت نشده است.
                          </p>
                        )}
                        <button
                          onClick={() => onReRequestApproval?.(event.id.toString())}
                          className="w-full cursor-pointer bg-white border border-red-200 text-red-600 py-2.5 rounded-xl text-[10px] font-black hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm">
                          درخواست بررسی مجدد رویداد
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* دکمه بارگذاری بیشتر */}
                {hostedHasMore && (
                  <button
                    onClick={loadMoreHosted}
                    className="w-full py-3 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                    مشاهده بیشتر
                  </button>
                )}

                {/* <button
                  onClick={onCreateEvent}
                  className="w-full mt-4 bg-gray-50 border-2 border-dashed border-gray-200 py-6 rounded-3xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all group">
                  <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black">ساخت رویداد جدید</span>
                </button> */}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100">
                  <Plus className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900">هنوز میزبان نبوده‌اید؟</h3>
                  <p className="text-sm font-bold text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    همین حالا رویداد منحصر به فرد خودتان را بسازید و جامعه خود را دور هم جمع کنید.
                  </p>
                </div>
                <button
                  onClick={onCreateEvent}
                  className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                >
                  ساخت اولین رویداد
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[210] rounded-t-[32px] shadow-2xl flex flex-col max-h-[80vh]"
              dir="rtl"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />
              
              <div className="px-6 pb-4 border-b border-gray-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-black text-gray-900">لیست شرکت‌کنندگان</h2>
                    <p className="text-[11px] font-bold text-gray-400 truncate max-w-[340px]">{selectedEventForAttendees.title}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-3 pb-24">
                {(() => {
                  const attendeeIds = eventRegistrations[selectedEventForAttendees.id] || [];
                  const registeredUsers = users.filter(user => attendeeIds.includes(user.id));

                  if (registeredUsers.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                          <Users className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-600">شرکت‌کننده‌ای وجود ندارد</p>
                          <p className="text-xs font-bold text-gray-400">هنوز کسی در این رویداد ثبت‌نام نکرده است.</p>
                        </div>
                      </div>
                    );
                  }

                  return registeredUsers.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center gap-4 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100"
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-white shadow-sm">
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-gray-900">{user.name}</h4>
                          {user.isVerified && (
                            <span className="bg-emerald-50 text-emerald-600 p-0.5 rounded-md text-[8px]">✓</span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-[140px]">{user.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur-md border-t border-gray-50 flex-shrink-0">
                <button 
                  onClick={() => setSelectedEventForAttendees(null)}
                  className="w-full bg-gray-900 text-white h-12 rounded-2xl text-sm font-black shadow-xl border-none cursor-pointer"
                >
                  بستن لیست
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CancellationConfirmDrawer
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelRegistration}
      // onConfirm={() => {
      //   if (eventToCancel) {
      //     onUnregister?.(eventToCancel);
      //     setIsCancelConfirmOpen(false);
      //     setEventToCancel(null);
      //   }
      // }}
      />
    </motion.main>
  );
}

export default CustomerEventsPage;