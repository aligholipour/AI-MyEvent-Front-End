import { useState, useRef, useCallback, useEffect } from "react";
import { AppEvent, HomeSlider } from "../types";
import { useAuth } from "./Auth/AuthContext";
import { getEventsByCity, initEventsLates } from "../services/events";
import { initHomeSlider } from "../services/homesliders";
import AuthDrawer from "./Auth/AuthDrawer";
import FilterDrawer from "./Search/Filter";
import { Calendar, ChevronDown, ChevronLeft, Clock, Filter, Home, MapPin, Plus, Search, Ticket, UserIcon, X } from "lucide-react";
import EventsPage from "./Events/EventPage";
import CustomerEventsPage from "./Events/CustomerEventsPage";
import EmptyState from "./Events/EmptyState";
import EventCardSkeleton from "./Events/EventCardSkeleton";
import CategoryForHomePage from "./Shared/CategoriesHomePage";
import { AnimatePresence, motion } from "motion/react";
import CreateEvent from "./Events/CreateEvent";
import RegisterPage from "./Auth/Register";
import EventDetailsPage from "./Events/EventDetails";
import ProfilePage from "./Users/ProfilePage";
import NewOrganizer from "./Shared/NewOrganizer";
import AdminPage from "./admin/AdminPage";
import CitySelectionDrawer from "./Shared/CitySelectionDrawer";
import FooterItem from "./Shared/FooterItem";
import EnhancedHeroSlider from "./Shared/EnhancedHeroSlider";
import { useCity } from "./Shared/CityContext";
import { AUTH_REQUIRED_EVENT } from "../services/Auth/authEvents";

function AppContent() {

    const { selectedCity, selectedCityId, isLoading: cityLoading } = useCity();
    const [activeTab, setActiveTab] = useState('home');
    const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
    const [isRegisterPageOpen, setIsRegisterPageOpen] = useState(false);
    const [pendingPhone, setPendingPhone] = useState('');
    const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [visibleEventsCount, setVisibleEventsCount] = useState(4);
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['1', '5']);
    const [eventsLates, setEventLates] = useState<AppEvent[]>([])
    const [homeSliders, setHomeSliders] = useState<HomeSlider[]>([])
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoggedIn, user: currentUser, logout: authLogout, updateUser } = useAuth();
    const [isEventsLoading, setIsEventsLoading] = useState(false);

    const isRequesting = useRef(false);
    const previousTab = useRef<string>('home');

    const loadEventsByCity = useCallback(async (cityId: number) => {
        if (!cityId || cityId === 0) return;

        if (isRequesting.current) return;

        isRequesting.current = true;
        setIsEventsLoading(true);

        try {
            const data = await getEventsByCity(cityId);
            setEventLates(data);
        } catch (error) {
            console.error('Error loading events:', error);
            setEventLates([]);
        } finally {
            setIsEventsLoading(false);
            isRequesting.current = false;
        }
    }, []);

    useEffect(() => {
        if (selectedCityId && selectedCityId > 0 && activeTab === 'home') {
            loadEventsByCity(selectedCityId);
        }
    }, [selectedCityId, loadEventsByCity]);

    useEffect(() => {
        if (activeTab === 'home' && previousTab.current !== 'home' && selectedCityId) {
            loadEventsByCity(selectedCityId);
        }
        previousTab.current = activeTab;
    }, [activeTab, selectedCityId, loadEventsByCity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleAuthRequired = () => {
            setIsRegisterPageOpen(false);
            setIsCreateEventOpen(false);
            setIsAuthDrawerOpen(true);
        };

        window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
        return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    }, []);

    const [activeFilters, setActiveFilters] = useState({
        categoryId: undefined as number | undefined,
        interestIds: [] as number[],
        gender: undefined as string | undefined,
        ageRange: undefined as string | undefined,
        isFreeOnly: false,
        eventType: undefined as string | undefined
    });

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleSelectEvent = useCallback((eventId: number) => {
        setSelectedEventId(eventId);
    }, []);

    const openCreateEvent = () => {
        setSelectedEventId(null);
        setIsCreateEventOpen(true);
    };

    const navigateToTab = (tab: string) => {
        setActiveTab(tab);
        setSelectedEventId(null);
        setIsCreateEventOpen(false);
    };

    useEffect(() => {
        initHomeSlider()
            .then((data: HomeSlider[]) => {
                setHomeSliders(data)
            });
    }, []);

    // useEffect(() => {
    //     initEventsLates()
    //         .then((data: AppEvent[]) => {
    //             setEventLates(data)
    //             console.log(data);
    //         });
    // }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleHomeScroll = (e: React.UIEvent<HTMLElement>) => {
        const target = e.currentTarget;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
            if (visibleEventsCount < 10 && !isFetching) {
                setIsFetching(true);
                setTimeout(() => {
                    setVisibleEventsCount(prev => Math.min(prev + 2, 10));
                    setIsFetching(false);
                }, 1200);
            }
        }
    };

    const handleApplyFilters = useCallback((filters: {
        categoryId?: string;
        interestIds: string[];
        gender: string;
        ageRange: string | null;
        isFreeOnly: boolean;
        eventType: string
    }) => {
        setActiveFilters({
            categoryId: filters.categoryId ? parseInt(filters.categoryId, 10) : undefined,
            interestIds: filters.interestIds?.map(Number) || [],
            gender: filters.gender === 'مختلط' ? undefined : filters.gender,
            ageRange: filters.ageRange || undefined,
            isFreeOnly: filters.isFreeOnly,
            eventType: filters.eventType === 'همه' ? undefined : filters.eventType
        });
        setIsFilterDrawerOpen(false);
    }, []);

    const handleClearFilters = useCallback(() => {
        setActiveFilters({
            categoryId: undefined,
            interestIds: [],
            gender: undefined,
            ageRange: undefined,
            isFreeOnly: false,
            eventType: undefined
        });
    }, []);

    if (cityLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        );
    }

    return (

        <div className="flex justify-center bg-gray-200 min-h-screen font-vazir" dir="rtl">
            {/* Mobile Container Wraps */}
            <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col pb-20 overflow-x-hidden">

                <AnimatePresence mode="wait">
                    {isCreateEventOpen ? (
                        <CreateEvent
                            key="create-event"
                            onBack={() => setIsCreateEventOpen(false)}
                        />
                    ) : isRegisterPageOpen ? (
                        <RegisterPage
                            phone={pendingPhone}
                            onBack={() => setIsRegisterPageOpen(false)}
                            onComplete={(userData) => {
                                setIsRegisterPageOpen(false);
                                navigateToTab('profile');
                            }}
                        />
                    ) : selectedEventId ? (
                        <EventDetailsPage
                            key="event-details"
                            eventId={selectedEventId}
                            onBack={() => setSelectedEventId(null)}
                            isLoggedIn={isLoggedIn}
                            onOpenAuth={() => setIsAuthDrawerOpen(true)}
                            // registeredEventIds={registeredEventIds}
                            onRegister={(id) => setRegisteredEventIds(prev => [...prev, id])}
                        // onUnregister={(id) => setRegisteredEventIds(prev => prev.filter(eid => eid !== id))} 
                        />
                    ) : activeTab === 'profile' ? (
                        <ProfilePage
                            key="profile"
                            user={currentUser}
                            onBack={() => navigateToTab('home')}
                            onLogout={() => {
                                authLogout();
                                navigateToTab('home');
                            }}
                            onUpdateUser={(updatedUser) => {
                                updateUser(updatedUser);
                            }}
                        />
                    ) : (
                        <>
                            <header className="px-6 pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div onClick={() => navigateToTab('home')} className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-[#ED1C24] rounded-full flex items-center justify-center">
                                            <span className="text-white font-black text-xl">H</span>
                                        </div>
                                        <span className="text-2xl font-black text-[#ED1C24]">همایش</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => navigateToTab('admin')}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'admin'
                                                ? 'bg-gray-800 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                        >
                                            مدیر سایت
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-gray-400">استان/شهر</span>
                                            <button
                                                onClick={() => setIsCityDrawerOpen(true)}
                                                className="flex items-center gap-1 group">
                                                <span className="text-sm font-black text-gray-800 group-hover:text-[#ED1C24] transition-colors">
                                                    {selectedCity === '---' ? 'انتخاب شهر' : selectedCity}
                                                </span>
                                                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#ED1C24] transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {(activeTab === 'events') && (
                                    <div className="space-y-4">

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 relative group">
                                                <input
                                                    type="text"
                                                    placeholder="جستجو در رویدادها..."
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearchChange(e.target.value)}
                                                    className="w-full bg-gray-100 border-none rounded-xl py-4 pr-14 pl-6 focus:ring-2 focus:ring-gray-900/5 transition-all outline-none text-base" />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#ED1C24] rounded-full">
                                                    <Search className="w-5 h-5 text-white" />
                                                </div>

                                                {/* نمایش وضعیت جستجو */}
                                                {searchQuery && (
                                                    <button onClick={() => handleSearchChange('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                        ✕
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setIsFilterDrawerOpen(true)} className="flex items-center gap-2 group active:scale-95 transition-all flex-shrink-0 h-[60px]">
                                                <Filter className="w-5 h-5 text-gray-500 group-hover:text-[#ED1C24] transition-colors" />
                                                <span className="text-xs font-black text-gray-500 group-hover:text-[#ED1C24]">فیلتر</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </header>

                            {activeTab === 'home' ? (
                                <motion.main
                                    key="home"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onScroll={handleHomeScroll}
                                    className="flex-1 overflow-y-auto no-scrollbar"
                                >
                                    <section>
                                        <EnhancedHeroSlider banners={homeSliders} isLoading={isInitialLoading} />
                                    </section>

                                    <CategoryForHomePage />

                                    <section className="px-6 py-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-black">دورهمی های اخیر</h2>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {(isInitialLoading || isEventsLoading) ? (
                                                <>
                                                    <EventCardSkeleton />
                                                    <EventCardSkeleton />
                                                </>
                                            ) : eventsLates.length > 0 ? (
                                                eventsLates.slice(0, visibleEventsCount).map((event) => (
                                                    <motion.div
                                                        key={event.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="group cursor-pointer"
                                                        onClick={() => setSelectedEventId(event.id)}>
                                                        <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-[0.98] border border-transparent hover:border-gray-100">
                                                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                                                <img
                                                                    src={process.env.File_BaseURL + event.image}
                                                                    alt={event.title}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                    referrerPolicy="no-referrer" />
                                                            </div>
                                                            <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="text-sm font-black text-gray-900 group-hover:text-[#ED1C24] transition-colors line-clamp-1">{event.title}</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">
                                                                            <Clock className="w-3 h-3 text-[#ED1C24]" />
                                                                            <span>{event.date}</span>
                                                                        </div>
                                                                        {event.isFree && (
                                                                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">رایگان</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span className="truncate max-w-[120px]">{event.location}</span>
                                                                    </div>
                                                                    <div className="text-[10px] font-black text-gray-400 group-hover:text-gray-900 transition-colors flex items-center gap-1 uppercase tracking-tighter">
                                                                        مشاهده جزییات
                                                                        <ChevronLeft className="w-3 h-3" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <EmptyState message="رویدادی یافت نشد" />
                                            )}

                                            {isFetching && (
                                                <div className="flex flex-col gap-6">
                                                    <EventCardSkeleton />
                                                    <EventCardSkeleton />
                                                </div>
                                            )}

                                            {!isFetching && !isInitialLoading && visibleEventsCount >= 10 && (
                                                <div className="py-10 text-center">
                                                    <p className="text-gray-400 text-sm font-bold">بیش از این رویدادی وجود ندارد</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <NewOrganizer isLoading={isInitialLoading} />
                                </motion.main>
                            ) : activeTab === 'my-events' ? (
                                <CustomerEventsPage
                                    key="my-events"
                                    onSelectEvent={(id) => setSelectedEventId(Number(id))}
                                    onNavigate={navigateToTab}
                                    onCreateEvent={openCreateEvent}
                                />
                            ) : activeTab === 'admin' ? (
                                <AdminPage
                                    key="admin"
                                    onBack={() => navigateToTab('home')} />
                            ) : (
                                <EventsPage
                                    onSelectEvent={handleSelectEvent}
                                    searchQuery={searchQuery}
                                    filters={{
                                        categoryId: activeFilters.categoryId,
                                        interestIds: activeFilters.interestIds,
                                        gender: activeFilters.gender,
                                        eventType: activeFilters.eventType,
                                        isFreeOnly: activeFilters.isFreeOnly
                                    }} />
                            )}
                        </>
                    )}
                </AnimatePresence>

                {!selectedEventId && (
                    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-lg border-t border-gray-100 py-1 flex items-center justify-between px-8 z-[100] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
                        <FooterItem
                            icon={<Home className="w-9 h-9" />}
                            label="خانه"
                            isActive={activeTab === 'home'}
                            onClick={() => navigateToTab('home')} />
                        <FooterItem
                            icon={<Calendar className="w-9 h-9" />}
                            label="رویدادها"
                            isActive={activeTab === 'events'}
                            onClick={() => navigateToTab('events')} />
                        <div className="relative -top-7 flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={openCreateEvent}
                                className="w-16 h-16 bg-gradient-to-br from-[#ED1C24] to-[#c4151b] rounded-full shadow-2xl shadow-[#ED1C24]/40 flex items-center justify-center text-white border-[6px] border-white active:shadow-inner transition-shadow"
                            >
                                <Plus className="w-9 h-9" />
                            </motion.button>
                        </div>
                        <FooterItem
                            icon={<Ticket className="w-9 h-9" />}
                            label="رویدادهای من"
                            isActive={activeTab === 'my-events'}
                            onClick={() => navigateToTab('my-events')} />

                        <FooterItem
                            icon={<UserIcon className="w-9 h-9" />}
                            label={isLoggedIn ? "پروفایل" : "ورود/ثبت نام"}
                            isActive={activeTab === 'profile'}
                            onClick={() => {
                                if (isLoggedIn) {
                                    navigateToTab('profile');
                                } else {
                                    setIsAuthDrawerOpen(true);
                                }
                            }} />
                    </footer>
                )}
            </div>

            <FilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={{
                    categoryId: activeFilters.categoryId?.toString(),
                    interestIds: activeFilters.interestIds.map(String),
                    gender: activeFilters.gender || 'مختلط',
                    ageRange: activeFilters.ageRange,
                    isFreeOnly: activeFilters.isFreeOnly,
                }} />

            <CitySelectionDrawer
                isOpen={isCityDrawerOpen}
                onClose={() => setIsCityDrawerOpen(false)}
            />

            <AuthDrawer
                isOpen={isAuthDrawerOpen}
                onClose={() => setIsAuthDrawerOpen(false)}
                onLoginSuccess={() => {
                    setIsAuthDrawerOpen(false);
                    // navigateToTab('profile');
                }}
                onRegisterNeeded={(phone) => {
                    setIsAuthDrawerOpen(false);
                    setPendingPhone(phone);
                    setIsRegisterPageOpen(true);
                }}
            />


        </div>


    );
}

export default AppContent;
