import { AppEvent, GetEventsRequest, PaginatedResponse } from '../types';
import { dataURLtoFile } from '../lib/utils'
import { EventDetailsResponse } from '../components/Events/EventDetails';
import { Participant } from '../components/Events/EventDetails';
import axiosInstance from './Auth/AxiosConfigs';
import { EventDetailForAdminResponse } from '../types';

export const STATIC_EVENTS: AppEvent[] = [
  {
    id: 1,
    title: 'کارگاه طراحی تجربه کاربری',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    location: 'تهران، خیابان ولیعصر',
    date: 'دوشنبه، ۲۱ اردیبهشت - ۱۷:۰۰',
    categoryId: 1,
    organizer: 'آکادمی دیزاین',
    price: 'رایگان',
    lat: 35.7152,
    lng: 51.4043,
    isConfirmed: true,
    status: 'approved',
    isDisabled: false,
    description: 'در این کارگاه با اصول اولیه طراحی تجربه کاربری و ابزارهای پرکاربرد این حوزه آشنا خواهید شد.',
    city: 'تهران',
    provinceId: 1,
    startTime: '۱۷:۰۰',
    minAge: '۱۸',
    maxAge: '۴۵',
    maxCapacity: '۳۰',
    isOnline: false
  },
  {
    id: 11,
    title: 'سمینار هوش مصنوعی در پزشکی',
    categoryId: 2,
    date: 'شنبه، ۵ خرداد - ۱۰:۰۰',
    location: 'تهران، دانشگاه علوم پزشکی',
    organizer: 'انجمن علمی هوش مصنوعی',
    image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۲۵۰,۰۰۰ تومان',
    isConfirmed: false,
    status: 'pending',
    isDisabled: true,
    description: 'بررسی آخرین دستاوردهای هوش مصنوعی در تشخیص و درمان بیماری‌ها با حضور اساتید برجسته.',
    city: 'تهران',
    provinceId: 1,
    startTime: '۱۰:۰۰',
    minAge: '۲۰',
    maxAge: '۶۰',
    maxCapacity: '۱۵۰',
    isOnline: false
  },
  {
    id: 12,
    title: 'کارگاه عکاسی غیرحرفه‌ای',
    categoryId: 3,
    date: 'یکشنبه، ۶ خرداد - ۱۶:۰۰',
    location: 'اصفهان، بوستان ملت',
    organizer: 'کانون عکاسان',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800',
    isFree: true,
    price: 'رایگان',
    isConfirmed: false,
    status: 'rejected',
    rejectionReason: 'کیفیت تصاویر بارگذاری شده مناسب نیست و توضیحات رویداد ناقص است.',
    isDisabled: true,
    description: 'آموزش عکاسی با موبایل برای علاقمندان به ثبت لحظات روزمره.',
    city: 'اصفهان',
    provinceId: 3,
    startTime: '۱۶:۰۰',
    minAge: '۱۲',
    maxAge: '۹۹',
    maxCapacity: '۲۰',
    isOnline: false
  },
  {
    id: 2,
    title: 'نشست استارتاپ‌های نوپا',
    categoryId: 4,
    date: 'سه‌شنبه، ۲۲ اردیبهشت - ۱۸:۳۰',
    location: 'اصفهان، شهرک علمی تحقیقاتی',
    organizer: 'شتاب‌دهنده هاب',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    isFree: false,
    price: '۱۵۰,۰۰۰ تومان',
    lat: 32.7214,
    lng: 51.5222,
    isConfirmed: true,
    status: 'approved',
    isDisabled: false
  },
];
export interface UserEventsResponse {
  registeredEvents: AppEvent[];
  hostedEvents: AppEvent[];
  totalRegistered: number;
  totalHosted: number;
}
export interface GetUserEventsRequest {
  pageNumber?: number;
  pageSize?: number;
  status?: 'all' | 'upcoming' | 'past' | 'pending' | 'approved' | 'rejected';
}
export interface GetEventsForAdminPageRequest {
  pageNumber?: number;
  pageSize?: number;
}
export interface RejectEventRequest {
  bahamId: number;
  reason: string;
}

let runtimeEvents: AppEvent[] = STATIC_EVENTS;

export function getEvents(): AppEvent[] {
  return runtimeEvents;
}

export async function initEventsLates(baseUrl = 'http://localhost:5066') {
  try {
    const res = await fetch(`${baseUrl}/api/Baham/GetLatest`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((e: any) => e && e.id && e.title)) {
      runtimeEvents = data as AppEvent[];
      return runtimeEvents;
    } else {
      console.warn('events API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch events from localhost, using static mock. Error:', err);
  }
  return runtimeEvents;
}

export async function createEvent(eventData: any, baseUrl = 'http://localhost:5066') {

  try {
    const formData = new FormData();

    const interestsArray = Array.isArray(eventData.interests)
      ? eventData.interests
      : eventData.interests?.split(',') || [];

    eventData.interests.forEach((interest: string, index: number) => {
      formData.append(`interests[${index}]`, interest);
    });

    formData.append('title', eventData.title || '');
    formData.append('description', eventData.description || '');
    formData.append('fromAge', String(eventData.minAge || 0));
    formData.append('toAge', String(eventData.maxAge || 0));
    formData.append('minCapacity', String(eventData.minCapacity || 0));
    formData.append('maxCapacity', String(eventData.maxCapacity || 0));
    formData.append('address', !eventData.isOnline ? (eventData.address || '') : '');
    formData.append('latitude', String(eventData.location?.lat || 0));
    formData.append('longitude', String(eventData.location?.lng || 0));
    formData.append('cityId', String(eventData.cityId || eventData.cityId || 0));
    formData.append('organizerId', String(eventData.organizerId || 0));
    formData.append('gender', eventData.gender || 0);
    formData.append('gender', eventData.gender || 0);

    if (eventData.date && eventData.startTime) {
      const fromDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      formData.append('fromEventDateTime', fromDateTime.toISOString());
    }
    if (eventData.date && eventData.endTime) {
      const toDateTime = new Date(`${eventData.date}T${eventData.endTime}`);
      formData.append('toEventDateTime', toDateTime.toISOString());
    }
    if (eventData.image) {
      const imageFile = dataURLtoFile(eventData.image, 'event-image.jpg');
      formData.append('image', imageFile);
    }

    const response = await fetch(`${baseUrl}/api/Baham/Add`, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // توجه: Content-Type را حذف کنید - مرورگر خودکار با boundary تنظیم می‌کند
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json;
    return result;

  } catch (err) {
    console.error('Failed to create event:', err);
    throw err;
  }
}

export async function getEventsWithPagination(request: GetEventsRequest, baseUrl = 'http://localhost:5066')
  : Promise<PaginatedResponse<AppEvent>> {
  try {
    const params = new URLSearchParams();
    params.append('pageNumber', request.pageNumber.toString());
    params.append('pageSize', request.pageSize.toString());
    if (request.searchTerm) params.append('searchTerm', request.searchTerm);
    if (request.categoryId) params.append('categoryId', request.categoryId.toString());
    if (request.gender) params.append('gender', request.gender.toString());
    if (request.eventType) params.append('eventType', request.eventType.toString());
    if (request.isFreeOnly !== undefined) params.append('isFree', request.isFreeOnly.toString());

    if (request.interestIds && request.interestIds.length > 0) {
      request.interestIds.forEach((favourite: number, index: number) => {
        params.append(`interestIds[${index}]`, favourite.toString());
        // params.append('interestIds', interestId.toString()); // هر بار با کلید یکسان اضافه می‌شود
      });
    }

    const response = await fetch(`${baseUrl}/api/Baham/GetAll?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data as PaginatedResponse<AppEvent>;
  } catch (err) {
    console.error('Failed to fetch events:', err);
    throw err;
  }
}

export async function getEventById(id: number, baseUrl = 'http://localhost:5066'): Promise<EventDetailsResponse> {
  try {
    const response = await fetch(`${baseUrl}/api/Baham/Get/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت جزئیات رویداد`);
    }

    const data = await response.json();
    return data as EventDetailsResponse;

  } catch (err) {
    console.error('Failed to fetch event details:', err);
    throw err;
  }
}

export async function getEventParticipants(
  bahamId: number,
  pageNumber = 1,
  pageSize = 20,
  baseUrl = 'http://localhost:5066'
): Promise<{ data: Participant[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(
      `${baseUrl}/api/Baham/Participants/${bahamId}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: خطا در دریافت شرکت‌کنندگان`);
    }

    const data = await response.json();
    return {
      data: data.data,
      totalCount: data.totalCount,
      hasNextPage: data.HasNextPage,
    };
  } catch (err) {
    console.error('Failed to fetch participants:', err);
    throw err;
  }
}

export async function registerForEvent(
  bahamId: number,
  baseUrl = 'http://localhost:5066'
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axiosInstance.post(`${baseUrl}/api/Baham/Register/${bahamId}`);

    return {
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد'
    };
  } catch (err) {
    console.error('Failed to register for event:', err);
    throw err;
  }
}

export async function getRegisteredEvents(
  request: GetUserEventsRequest = {},
  baseUrl = 'http://localhost:5066'
): Promise<{ data: AppEvent[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.status && request.status !== 'all') params.append('status', request.status);

    const response = await fetch(`${baseUrl}/api/Baham/CustomerGuestBaham?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادهای ثبت‌نام شده`);
    }

    const data = await response.json();
    return {
      data: data.data,
      totalCount: data.totalCount,
      hasNextPage: data.hasNextPage
    };
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw err;
  }
}

export async function getHostedEvents(
  request: GetUserEventsRequest = {},
  baseUrl = 'http://localhost:5066'
): Promise<{ data: AppEvent[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.status && request.status !== 'all') params.append('status', request.status);

    const response = await fetch(`${baseUrl}/api/Baham/CustomerHostBaham?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادهای برگزار شده`);
    }

    const data = await response.json();
    return {
      data: data.data,
      totalCount: data.totalCount,
      hasNextPage: data.hasNextPage
    };
  } catch (err) {
    console.error('Failed to fetch hosted events:', err);
    throw err;
  }
}

export async function cancelRegistration(
  bahamId: number,
  baseUrl = 'http://localhost:5066'
): Promise<{ success: boolean; message: string }> {
  try {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${baseUrl}/api/Baham/CancelRegistration/${bahamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    // const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: خطا در انصراف از رویداد`);
    }

    return { success: true, message: 'انصراف با موفقیت انجام شد' };
  } catch (err) {
    console.error('Failed to cancel registration:', err);
    throw err;
  }
}

export async function getEventsFormAdminPage(
  request: GetEventsForAdminPageRequest,
  baseUrl = 'http://localhost:5066'
): Promise<{ data: AppEvent[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const token = localStorage.getItem('access_token');
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());

    const response = await fetch(`${baseUrl}/api/Baham/EventsForAdminPage?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادها`);
    }

    const data = await response.json();
    return {
      data: data.data,
      totalCount: data.totalCount,
      hasNextPage: data.hasNextPage
    };
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw err;
  }
}

export async function getEventDetailForAdmin(bahamId: number, baseUrl = 'http://localhost:5066')
  : Promise<{ data: EventDetailForAdminResponse; }> {
  try {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${baseUrl}/api/Baham/EventDetailForAdminPage/${bahamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادها`);
    }

    const data = await response.json();
    return {
      data: data
    };
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw err;
  }
}

export async function approveEvent(bahamId: number, baseUrl = 'http://localhost:5066')
  : Promise<{ success: boolean; message: string }> {

  const response = await axiosInstance.post(`${baseUrl}/api/Baham/ApproveEvent/${bahamId}`);

  return {
    success: true,
    message: 'ثبت‌نام با موفقیت انجام شد'
  };
}

export async function rejectEvent(request: RejectEventRequest, baseUrl = 'http://localhost:5066')
  : Promise<{ success: boolean; message: string }> {

  const token = localStorage.getItem('access_token');

  const response = await fetch(`${baseUrl}/api/Baham/RejectEvent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: خطا در رد کردن رویداد`);
  }

  return {
    success: true,
    message: 'رویداد با موفقیت رد شد'
  };

}

export async function changeStatusEvent(bahamId: number, baseUrl = 'http://localhost:5066')
  : Promise<{ success: boolean; message: string }> {

  const response = await axiosInstance.post(`${baseUrl}/api/Baham/ApproveEvent/${bahamId}`);

  return {
    success: true,
    message: 'رویداد با موفقیت رد شد'
  };
}