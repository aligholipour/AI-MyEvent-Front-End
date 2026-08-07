import { useState, useRef, useCallback, useEffect } from "react";
import { AppCategory, AppEvent, HomeSlider } from "../types";
import { useAuth } from "./Auth/AuthContext";
import { getEventsByCity } from "../services/events";
import { initHomeSlider } from "../services/homesliders";
import AuthDrawer from "./Auth/AuthDrawer";
import FilterDrawer from "./Search/Filter";
import { ChevronDown, ChevronLeft, Clock, Filter, Heart, MapPin, Search, Star, User, X } from "lucide-react";
import EventsPage from "./Events/EventPage";
import CustomerEventsPage from "./Events/CustomerEventsPage";
import EmptyState from "./Events/EmptyState";
import EventCardSkeleton from "./Events/EventCardSkeleton";
import { AnimatePresence, motion } from "motion/react";
import CreateEvent from "./Events/CreateEvent";
import EditEvent from "./Events/EditEvent";
import RegisterPage from "./Auth/Register";
import EventDetailsPage from "./Events/EventDetails";
import ProfilePage from "./Users/ProfilePage";
import NewOrganizer from "./Shared/NewOrganizer";
import AdminPage from "./admin/AdminPage";
import CitySelectionDrawer from "./Shared/CitySelectionDrawer";
import { useCity } from "./Shared/CityContext";
import { AUTH_REQUIRED_EVENT } from "../services/Auth/authEvents";
import { CategoriesPage } from "./Categories/CategoryPage";
import { BottomNavigation } from "./Shared/BottomNavigation";
import { HomeHeroSlider } from "./Shared/HomeHeroSlider";
import { ScrollToTop } from "./Shared/ScrollToTopProps";
import { SpecialEventCard } from "./Events/SpecialHomeEvent";
import { SupportTickets } from "./Support/SupportTickets";
import { EditProfilePage } from "./Users/EditProfile";
import { OrganizerProfilePage } from "./Organizer/OrganizerProfilePage";
import { OrganizerAnalyticsPage } from "./Organizer/OrganizerAnalyticsPage";
import { PersonalEventCalendar } from "./Users/PersonalEventCalendar";


const TOP_PICKS_DATA = [
    {
        id: 'tp-1',
        name: 'کافه سنتی تهرون',
        category: 'کافه دنج قدیمی و نوستالژیک',
        image: '/images/event1.jpg',
        rating: 4.9,
        reviewsCount: 480,
        distance: '۳۰۰ متر',
        location: 'خیابان ویلا، تهران'
    },
    {
        id: 'tp-2',
        name: 'رستوران ایتالیایی بونو',
        category: 'پیتزاهای هیزمی و پاستای خانگی',
        image: '/images/event1.jpg',
        rating: 4.8,
        reviewsCount: 920,
        distance: '۱.۲ کیلومتر',
        location: 'نیاوران، تهران'
    },
    {
        id: 'tp-3',
        name: 'آرایشگاه لوکس قیچی',
        category: 'خدمات تخصصی پوست و موی آقایان',
        image: '/images/event1.jpg',
        rating: 4.7,
        reviewsCount: 310,
        distance: '۲.۵ کیلومتر',
        location: 'بلوار جردن، تهران'
    },
    {
        id: 'tp-4',
        name: 'کلوپ ورزشی توچال',
        category: 'تفریحات زمستانی و تله‌کابین',
        image: '/images/event1.jpg',
        rating: 4.9,
        reviewsCount: 2500,
        distance: '۵.۸ کیلومتر',
        location: 'ولنجک، تهران'
    },
    {
        id: 'tp-5',
        name: 'شکلات‌فروشی لوکس مایا',
        category: 'دست‌سازهای شکلاتی فرنگی لوکس',
        image: '/images/event1.jpg',
        rating: 4.8,
        reviewsCount: 290,
        distance: '۸۰۰ متر',
        location: 'خیابان الهیه، تهران'
    },
    {
        id: 'tp-6',
        name: 'مجموعه اسپا و سلامت ریلکس',
        category: 'ماساژ حرفه‌ای و حمام سنتی',
        image: '/images/event1.jpg',
        rating: 4.7,
        reviewsCount: 180,
        distance: '۳.۴ کیلومتر',
        location: 'پاسداران، تهران'
    },
    {
        id: 'tp-7',
        name: 'شیرینی‌فروشی بیبی',
        category: 'کیک‌های شکلاتی نوستالژیک پایتخت',
        image: '/images/event1.jpg',
        rating: 4.9,
        reviewsCount: 3500,
        distance: '۴ کیلومتر',
        location: 'یوسف‌آباد، تهران'
    },
    {
        id: 'tp-8',
        name: 'کتاب‌فروشی خانه فرهنگ',
        category: 'کافه کتاب دنج و نشریات نایاب',
        image: '/images/event1.jpg',
        rating: 4.8,
        reviewsCount: 670,
        distance: '۱.۱ کیلومتر',
        location: 'خیابان انقلاب، تهران'
    }
];

const CATEGORIES: AppCategory[] = [
    { id: 1, title: 'علمی', icon: 'Atom', color: 'text-purple-600' },
    { id: 2, title: 'کنسرت', icon: 'Music', color: 'text-rose-600' },
    { id: 3, title: 'هنر', icon: 'Palette', color: 'text-amber-600' },
    { id: 4, title: 'ورزش', icon: 'Trophy', color: 'text-emerald-600' },
    { id: 5, title: 'فنی', icon: 'Cpu', color: 'text-indigo-600' },
    { id: 6, title: 'آموزش', icon: 'GraduationCap', color: 'text-blue-600' },
    { id: 7, title: 'عکس', icon: 'Image', color: 'text-orange-600' },
    { id: 8, title: 'بازی', icon: 'Gamepad2', color: 'text-cyan-600' },
    { id: 9, title: 'مذهبی', icon: 'Moon', color: 'text-teal-600' },
    { id: 10, title: 'تجاری', icon: 'Briefcase', color: 'text-rose-600' },
    { id: 11, title: 'سلامت', icon: 'Heart', color: 'text-pink-600' },
    { id: 12, title: 'سفر', icon: 'Compass', color: 'text-emerald-600' },
];

function AppContent() {

    const { selectedCity, selectedCityId, isLoading: cityLoading } = useCity();
    const [activeTab, setActiveTab] = useState('home');
    const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
    const [isRegisterPageOpen, setIsRegisterPageOpen] = useState(false);
    const [pendingPhone, setPendingPhone] = useState('');
    const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
    const [isCustomerEventOpen, setIsCustomerEventOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [customerEventsSubTab, setCustomerEventsSubTab] = useState<'registered' | 'hosted'>('registered');
    const [visibleEventsCount, setVisibleEventsCount] = useState(4);
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['1', '5']);
    const [eventsLates, setEventLates] = useState<AppEvent[]>([])
    const [homeSliders, setHomeSliders] = useState<HomeSlider[]>([])
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoggedIn, user: currentUser, logout: authLogout, updateUser } = useAuth();
    const [isEventsLoading, setIsEventsLoading] = useState(false);
    const [selectedCategoryTab, setSelectedCategoryTab] = useState<string | null>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isOrganizerProfileOpen, setIsOrganizerProfileOpen] = useState(false);
    const [isAnyDetailDrawerOpen, setIsAnyDetailDrawerOpen] = useState(false);
    const [isOrganizerAnalyticsOpen, setIsOrganizerAnalyticsOpen] = useState(false);
    const [isPersonalCalendarOpen, setIsPersonalCalendarOpen] = useState(false);

    const isRequesting = useRef(false);
    const previousTab = useRef<string>('home');

    const [likedPicks, setLikedPicks] = useState<string[]>([]);
    const [isSupportTicketsOpen, setIsSupportTicketsOpen] = useState(false);


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
            setIsCustomerEventOpen(false);
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
        setEditingEventId(null);
        setIsCreateEventOpen(true);
        setIsCustomerEventOpen(false);
    };

    const openCustomerEvent = () => {
        setSelectedEventId(null);
        setEditingEventId(null);
        setIsCreateEventOpen(false);
        setIsCustomerEventOpen(true);
        setActiveTab('my-events');
    };

    const openEditEvent = (eventId: number) => {
        setSelectedEventId(null);
        setIsCreateEventOpen(false);
        setEditingEventId(eventId);
        setIsCustomerEventOpen(false);
    };

    const navigateToTab = (tab: string) => {
        setActiveTab(tab);
        setSelectedEventId(null);
        setIsCreateEventOpen(false);
        setIsCustomerEventOpen(false);
        // Clear filters and selected category when leaving the Events page
        if (tab !== 'events') {
            setActiveFilters({
                categoryId: undefined,
                interestIds: [],
                gender: undefined,
                ageRange: undefined,
                isFreeOnly: false,
                eventType: undefined
            });
            setSelectedCategoryTab(null);
        }
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

    // When an event is opened (we navigate into EventDetails), consider this as leaving the Events list
    useEffect(() => {
        if (selectedEventId !== null) {
            handleClearFilters();
            setSelectedCategoryTab(null);
        }
    }, [selectedEventId, handleClearFilters]);

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

                <ScrollToTop watch={[activeTab, selectedEventId, isCreateEventOpen, selectedCategoryTab, isRegisterPageOpen, isSupportTicketsOpen, isEditProfileOpen, isCustomerEventOpen, isOrganizerProfileOpen, isPersonalCalendarOpen]} />

                <AnimatePresence mode="wait">
                    {selectedEventId ? (
                        <EventDetailsPage
                            key="event-details"
                            eventId={selectedEventId}
                            onBack={() => setSelectedEventId(null)}
                            isLoggedIn={isLoggedIn}
                            onOpenAuth={() => setIsAuthDrawerOpen(true)}
                            onOverlayStateChange={setIsBottomNavHidden}
                            onRegister={(id) => setRegisteredEventIds(prev => [...prev, id])}
                        />
                    ) : isCustomerEventOpen ? (
                        <CustomerEventsPage
                            key="my-events"
                            onSelectEvent={(id) => setSelectedEventId(Number(id))}
                            onNavigate={navigateToTab}
                            onCreateEvent={openCustomerEvent}
                            onEditEvent={(event) => openEditEvent(event.id)}
                            activeSubTab={customerEventsSubTab}
                            onSubTabChange={setCustomerEventsSubTab}
                        />
                    ) : isCreateEventOpen ? (
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
                    ) : isEditProfileOpen && currentUser ? (
                        <EditProfilePage
                            key="edit-profile"
                            user={currentUser}
                            onBack={() => setIsEditProfileOpen(false)}
                            onSave={(updatedUser) => {
                                updateUser(updatedUser);
                                setIsEditProfileOpen(false);
                                navigateToTab('profile');
                            }}
                        />
                    ) : isSupportTicketsOpen ? (
                        <SupportTickets
                            key="support-tickets"
                            onBack={() => setIsSupportTicketsOpen(false)}
                        />
                    ) : editingEventId ? (
                        <EditEvent
                            key={`edit-event-${editingEventId}`}
                            eventId={editingEventId}
                            onBack={() => setEditingEventId(null)}
                        />
                    ) : isOrganizerAnalyticsOpen ? (
                        <OrganizerAnalyticsPage
                            key="organizer-analytics"
                            onBack={() => setIsOrganizerAnalyticsOpen(false)}
                            onOpenEvent={(id) => {
                                setIsOrganizerAnalyticsOpen(false);
                                // setSelectedEventId(id);
                            }}
                        />
                    ) : isOrganizerProfileOpen ? (
                        <OrganizerProfilePage
                            key="organizer-profile"
                            onBack={() => {
                                setIsOrganizerProfileOpen(false);
                                setIsAnyDetailDrawerOpen(false);
                            }}
                            onSelectEvent={(id) => {
                                setIsOrganizerProfileOpen(false);
                                setIsAnyDetailDrawerOpen(false);
                                setSelectedEventId(Number(id));
                            }}
                            onOpenSupportTickets={() => {
                                setIsOrganizerProfileOpen(false);
                                setIsAnyDetailDrawerOpen(false);
                                setIsSupportTicketsOpen(true);
                            }}
                            onDrawerStateChange={setIsAnyDetailDrawerOpen}
                        />
                    ) : isPersonalCalendarOpen ? (
                        <PersonalEventCalendar
                            key="personal-calendar"
                            onBack={() => setIsPersonalCalendarOpen(false)}
                            registeredEventIds={registeredEventIds}
                            onSelectEvent={(id) => {
                                setIsPersonalCalendarOpen(false);
                                // setSelectedEventId(id);
                            }}
                        // user={currentUser}
                        />
                    ) : selectedEventId ? (
                        <EventDetailsPage
                            key="event-details"
                            eventId={selectedEventId}
                            onBack={() => setSelectedEventId(null)}
                            isLoggedIn={isLoggedIn}
                            onOpenAuth={() => setIsAuthDrawerOpen(true)}
                            onOverlayStateChange={setIsBottomNavHidden}
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
                            navigateToTab={navigateToTab}
                            onOpenSupportTickets={() => setIsSupportTicketsOpen(true)}
                            onOpenEditProfile={() => setIsEditProfileOpen(true)}
                            onOpenOrganizerProfile={() => setIsOrganizerProfileOpen(true)}
                            onOpenOrganizerAnalytics={() => setIsOrganizerAnalyticsOpen(true)}
                            onOpenPersonalCalendar={() => setIsPersonalCalendarOpen(true)}
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
                                    className="flex-1 overflow-y-auto pb-4 no-scrollbar"
                                >
                                    <section>
                                        <HomeHeroSlider />
                                    </section>

                                    {/* <CategoryForHomePage /> */}

                                    <section className="px-4 py-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-sm font-extrabold font-black">دورهمی های اخیر</h2>
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
                                                                        {event.isFree && (
                                                                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">رایگان</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm">
                                                                            <Clock className="w-3 h-3 text-[#ED1C24]" />
                                                                            <span>زمان برگزاری: {event.date}</span>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center mt-2 gap-3">
                                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span className="truncate max-w-[120px]">{event.location}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                                        <User className="w-3 h-3" />
                                                                        <span className="text-gray-500">برگزارکننده: {event.organizer}</span>
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

                                    <SpecialEventCard />

                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative" dir="rtl">
                                        <div className="flex items-center justify-between mb-3 mt-5 px-5">
                                            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 animate-fade-in">
                                                <span className="w-1.5 h-3.5 bg-teal-500 rounded-full inline-block"></span>
                                                دورهمی های ورزشی
                                            </h2>
                                            <span
                                                // onClick={() => onScreenChange?.('businesses')}
                                                className="text-[10px] text-teal-650 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer">
                                                مشاهده همه <ChevronLeft size={10} />
                                            </span>
                                        </div>

                                        {/* Horizontal Scrolling Carousel */}
                                        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-5 scroll-smooth select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
                                            {TOP_PICKS_DATA.map((item) => {
                                                const isLiked = likedPicks.includes(item.id);
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{ y: -4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-48 bg-white rounded-[20px] shadow-sm hover:shadow-md border border-slate-100/80 overflow-hidden flex-shrink-0 snap-align-start transition-all duration-200">
                                                        <div className="h-28 w-full relative bg-slate-100">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                referrerPolicy="no-referrer"
                                                                className="w-full h-full object-cover pointer-events-none"
                                                            />
                                                            {/* Interactive Heart Icon */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // toggleLikePick(item.id);
                                                                }}
                                                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center transition-all duration-150 hover:bg-white active:scale-90 cursor-pointer">
                                                                <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-650'} />
                                                            </button>
                                                        </div>

                                                        <div className="p-3 text-right">
                                                            <h3 className="text-xs font-black text-slate-850 leading-tight truncate">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-[9px] text-slate-400 mt-1 truncate">
                                                                {item.category}
                                                            </p>

                                                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50">
                                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                                    <Star size={10} className="fill-current text-amber-500" />
                                                                    <span className="text-[9px] font-black">{item.rating}</span>
                                                                </div>
                                                                <p className="text-[8px] text-slate-400 flex items-center gap-0.5 justify-start max-w-[80px] truncate">
                                                                    <MapPin size={9} className="text-teal-500" />
                                                                    {item.location.split('،')[0]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative" dir="rtl">
                                        <div className="flex items-center justify-between mb-3 mt-5 px-5">
                                            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 animate-fade-in">
                                                <span className="w-1.5 h-3.5 bg-teal-500 rounded-full inline-block"></span>
                                                دورهمی های کتابخوانی
                                            </h2>
                                            <span
                                                // onClick={() => onScreenChange?.('businesses')}
                                                className="text-[10px] text-teal-650 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer">
                                                مشاهده همه <ChevronLeft size={10} />
                                            </span>
                                        </div>

                                        {/* Horizontal Scrolling Carousel */}
                                        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-5 scroll-smooth select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
                                            {TOP_PICKS_DATA.map((item) => {
                                                const isLiked = likedPicks.includes(item.id);
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{ y: -4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-48 bg-white rounded-[20px] shadow-sm hover:shadow-md border border-slate-100/80 overflow-hidden flex-shrink-0 snap-align-start transition-all duration-200">
                                                        <div className="h-28 w-full relative bg-slate-100">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                referrerPolicy="no-referrer"
                                                                className="w-full h-full object-cover pointer-events-none"
                                                            />
                                                            {/* Interactive Heart Icon */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // toggleLikePick(item.id);
                                                                }}
                                                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center transition-all duration-150 hover:bg-white active:scale-90 cursor-pointer">
                                                                <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-650'} />
                                                            </button>
                                                        </div>

                                                        <div className="p-3 text-right">
                                                            <h3 className="text-xs font-black text-slate-850 leading-tight truncate">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-[9px] text-slate-400 mt-1 truncate">
                                                                {item.category}
                                                            </p>

                                                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50">
                                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                                    <Star size={10} className="fill-current text-amber-500" />
                                                                    <span className="text-[9px] font-black">{item.rating}</span>
                                                                </div>
                                                                <p className="text-[8px] text-slate-400 flex items-center gap-0.5 justify-start max-w-[80px] truncate">
                                                                    <MapPin size={9} className="text-teal-500" />
                                                                    {item.location.split('،')[0]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                    </motion.div>

                                    <NewOrganizer isLoading={isInitialLoading} />
                                </motion.main>
                            ) : activeTab === 'categories' ? (
                                <CategoriesPage
                                    key="categories"
                                    onSelectCategory={(categoryId) => {
                                        setActiveFilters(prev => ({ ...prev, categoryId }));
                                        const cat = CATEGORIES.find(c => c.id === categoryId);
                                        setSelectedCategoryTab(cat?.title || null);
                                        navigateToTab('events');
                                    }}
                                />
                            ) : activeTab === 'my-events' ? (
                                <CustomerEventsPage
                                    key="my-events"
                                    onSelectEvent={(id) => setSelectedEventId(Number(id))}
                                    onNavigate={navigateToTab}
                                    onCreateEvent={openCustomerEvent}
                                    onEditEvent={(event) => openEditEvent(event.id)}
                                    activeSubTab={customerEventsSubTab}
                                    onSubTabChange={setCustomerEventsSubTab}
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

                {!isAuthDrawerOpen && !isBottomNavHidden && (
                    <BottomNavigation
                        activeTab={activeTab}
                        isLoggedIn={isLoggedIn}
                        onNavigate={navigateToTab}
                        onOpenAuth={() => setIsAuthDrawerOpen(true)}
                        onOpenCreateEvent={openCreateEvent}
                        onOpenCustomerEvent={openCustomerEvent}
                    />
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
