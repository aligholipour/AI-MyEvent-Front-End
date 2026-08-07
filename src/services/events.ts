import { AppEvent, CustomerGuestBahamResponse, CustomerHostedBahamResponse, GetEventsRequest, PaginatedResponse } from '../types';
import { dataURLtoFile } from '../lib/utils'
import { EventDetailsResponse } from '../components/Events/EventDetails';
import { Participant } from '../components/Events/EventDetails';
import axiosInstance from './Auth/AxiosConfigs';
import { EventDetailForAdminResponse } from '../types';
import { User } from './Auth/Auth';
import { authenticatedFetch } from './Auth/authenticatedFetch';

export interface UserEventsResponse {
  registeredEvents: AppEvent[];
  hostedEvents: AppEvent[];
  totalRegistered: number;
  totalHosted: number;
}
export interface EventDetailsForUpdateResponse {
  title: string;
  description: string;
  categoryId: number | null;
  categoryTitle: string;
  favouriteIds: number[];
  address: string;
  eventTime: Date;
  startTime: string;
  endTime: string;
  isFree: boolean;
  price: number | null;
  minCapacity: number | null;
  maxCapacity: number | null;
  hasWaitlist: boolean;
  minAge: number | null;
  maxAge: number | null;
  provinceId: number | null;
  cityName: string;
  cityId: number | null;
  isOnline: boolean;
  coverAddress: string;
  onlineLink: string;
  lat: number | null;
  lng: number | null;
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
let runtimeEvents: AppEvent[]

export async function initEventsLates() {
  try {
    const res = await fetch(`${process.env.API_BaseURL}/Baham/GetLatest`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
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

export const getEventsByCity = async (cityId: number): Promise<AppEvent[]> => {
  const response = await fetch(`${process.env.API_BaseURL}/Baham/GetLatest/${cityId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return response.json();
};

export async function createEvent(eventData: any) {

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
    formData.append('categoryId', eventData.categoryId || 0);

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

    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/Add`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (err) {
    console.error('Failed to create event:', err);
    throw err;
  }
}

export async function updateEvent(bahamId: number, eventData: any) {
  try {
    const formData = new FormData();

    const interestsArray = Array.isArray(eventData.interests)
      ? eventData.interests
      : eventData.interests?.split(',') || [];

    interestsArray.forEach((interest: string | number, index: number) => {
      formData.append(`interests[${index}]`, String(interest));
    });

    formData.append('id', bahamId.toString() || '');
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
    formData.append('categoryId', eventData.categoryId || 0);
    formData.append('image', eventData.coverAddress || 0);

    if (eventData.date && eventData.startTime) {
      const fromDateTime = new Date(`${eventData.date}T${eventData.startTime}`);
      formData.append('fromEventDateTime', fromDateTime.toISOString());
    }
    if (eventData.date && eventData.endTime) {
      const toDateTime = new Date(`${eventData.date}T${eventData.endTime}`);
      formData.append('toEventDateTime', toDateTime.toISOString());
    }
    if (eventData.coverAddress && eventData.coverAddress.startsWith && eventData.coverAddress.startsWith('data:')) {
      const imageFile = dataURLtoFile(eventData.coverAddress, 'event-image.jpg');
      formData.append('image', imageFile);
    }

    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/Update`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Failed to update event:', err);
    throw err;
  }
}

export async function getEventsWithPagination(request: GetEventsRequest)
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
      });
    }

    if (request.cityId) {
      params.append('cityId', request.cityId.toString());
    }

    const response = await fetch(`${process.env.API_BaseURL}/Baham/GetAll?${params.toString()}`, {
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

export async function getEventById(id: number): Promise<EventDetailsResponse> {
  try {

    const userData = localStorage.getItem('user');
    let userId: number | null = null;

    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        userId = user.id;
      } catch (parseError) {
        throw new Error('خطا در دریافت جزئیات رویداد');
      }
    }

    let url = `${process.env.API_BaseURL}/Baham/Get/${id}`;
    if (userId !== null) {
      url += `/${userId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // const response = await fetch(`${process.env.API_BaseURL}/Baham/Get/${id}/${userId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    // });

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

export async function getEventForUpdateById(id: number): Promise<EventDetailsForUpdateResponse> {
  try {
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/GetEventForUpdate/${id}`, {
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
    return data as EventDetailsForUpdateResponse;

  } catch (err) {
    console.error('Failed to fetch event details:', err);
    throw err;
  }
}

export async function getEventParticipants(
  bahamId: number,
  pageNumber = 1,
  pageSize = 20,
): Promise<{ data: Participant[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const params = new URLSearchParams();
    params.append('bahamId', bahamId.toString());
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(
      `${process.env.API_BaseURL}/Baham/Participants?${params.toString()}`,
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

// New: fetch participants for admin modal with phone and joinedAt
export async function getEventParticipantsForAdmin(
  bahamId: number,
  pageNumber = 1,
  pageSize = 100,
): Promise<Array<{ fullname: string; profileAddress?: string; joinedAt: string; phone?: string }>> {
  try {
    const params = new URLSearchParams();
    params.append('bahamId', bahamId.toString());
    // params.append('pageNumber', pageNumber.toString());
    // params.append('pageSize', pageSize.toString());

    // Assuming server provides an endpoint for admin participants with phone
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/GetEventParticipantsForAdmin/${bahamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت شرکت‌کنندگان (Admin)`);
    }

    const data = await response.json();

    const participants = Array.isArray(data)
      ? data.map((p: any) => ({
        fullname: p.fullname ?? ''.trim(),
        profileAddress: p.profileAddress ?? undefined,
        joinedAt: p.joinedAt ?? '',
        phone: p.phone ?? p.mobile ?? undefined,
      }))
      : [];

    return Array.isArray(data)
      ? data.map((p: any) => ({
        fullname: p.fullname ?? ''.trim(),
        profileAddress: p.profileAddress ?? undefined,
        joinedAt: p.joinedAt ?? '',
        phone: p.phone ?? p.mobile ?? undefined,
      }))
      : [];

  } catch (err) {
    console.error('Failed to fetch admin participants:', err);
    throw err;
  }
}

export async function registerForEvent(
  bahamId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    // const response = await axiosInstance.post(`${process.env.API_BaseURL}/Baham/Register/${bahamId}`);
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/Register/${bahamId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.status != 200) {
      const responseData = await response.json().catch(() => null);
      return { success: false, message: responseData };
    }

    return { success: true, message: 'ثبت‌نام با موفقیت انجام شد' }

  } catch (err) {
    console.error('Failed to register for event:', err);
    throw err;
  }
}

export async function getRegisteredEvents(
  request: GetUserEventsRequest = {}
): Promise<{ data: CustomerGuestBahamResponse[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.status && request.status !== 'all') params.append('status', request.status);

    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/CustomerGuestBaham?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
  request: GetUserEventsRequest = {}
): Promise<{ data: CustomerHostedBahamResponse[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());
    if (request.status && request.status !== 'all') params.append('status', request.status);

    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/CustomerHostBaham?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
  bahamId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/CancelRegistration/${bahamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

function normalizeAdminEvent(rawEvent: any): AppEvent {
  const rawReasons = rawEvent.reasons ?? rawEvent.rejectionReasons ?? rawEvent.rejectReasons ?? rawEvent.reasonsHistory ?? rawEvent.reasonHistory;
  const reasons = Array.isArray(rawReasons)
    ? [...rawReasons].sort((a, b) => {
      const aDate = Date.parse(a.createDateTime ?? a.createdAt ?? a.date ?? '');
      const bDate = Date.parse(b.createDateTime ?? b.createdAt ?? b.date ?? '');
      return bDate - aDate;
    })
    : undefined;

  const normalizedAttendeesCount = (() => {
    const rawCount = rawEvent.attendeesCount ?? rawEvent.participantsCount ?? rawEvent.participantCount ?? rawEvent.registeredCount ?? rawEvent.registrationCount ?? rawEvent.totalParticipants ?? rawEvent.totalAttendees;
    if (typeof rawCount === 'number') return rawCount;
    if (typeof rawCount === 'string') {
      const parsed = parseInt(rawCount, 10);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  })();

  const rejectionReason = rawEvent.rejectionReason
    ?? reasons?.[0]?.reason
    ?? rawEvent.reason
    ?? undefined;

  return {
    ...rawEvent,
    reasons,
    rejectionReason,
    attendeesCount: normalizedAttendeesCount,
  } as AppEvent;
}

export async function getEventsFormAdminPage(
  request: GetEventsForAdminPageRequest
): Promise<{ data: AppEvent[]; totalCount: number; hasNextPage: boolean }> {
  try {
    const params = new URLSearchParams();
    if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
    if (request.pageSize) params.append('pageSize', request.pageSize.toString());

    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/EventsForAdminPage?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادها`);
    }

    const data = await response.json();
    const events = Array.isArray(data.data) ? data.data.map(normalizeAdminEvent) : [];
    return {
      data: events,
      totalCount: data.totalCount,
      hasNextPage: data.hasNextPage
    };
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw err;
  }
}

function normalizeAdminEventDetail(rawData: any): EventDetailForAdminResponse {
  const rawReasons = rawData.reasons ?? rawData.rejectionReasons ?? rawData.rejectReasons ?? rawData.reasonsHistory ?? rawData.reasonHistory;
  const reasons = Array.isArray(rawReasons)
    ? [...rawReasons].sort((a, b) => {
      const aDate = Date.parse(a.createDateTime ?? a.createdAt ?? a.date ?? '');
      const bDate = Date.parse(b.createDateTime ?? b.createdAt ?? b.date ?? '');
      return bDate - aDate;
    })
    : undefined;

  const rejectionReason = rawData.rejectionReason
    ?? reasons?.[0]?.reason
    ?? rawData.reason
    ?? undefined;

  return {
    ...rawData,
    reasons,
    rejectionReason,
  } as EventDetailForAdminResponse;
}

export async function getEventDetailForAdmin(bahamId: number)
  : Promise<{ data: EventDetailForAdminResponse; }> {
  try {
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/EventDetailForAdminPage/${bahamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: خطا در دریافت رویدادها`);
    }

    const data = await response.json();
    return {
      data: normalizeAdminEventDetail(data)
    };
  } catch (err) {
    console.error('Failed to fetch registered events:', err);
    throw err;
  }
}

export async function approveEvent(bahamId: number)
  : Promise<{ success: boolean; message: string }> {

  const response = await axiosInstance.post(`${process.env.API_BaseURL}/Baham/ApproveEvent/${bahamId}`);

  if (response.status != 200)
    return { success: false, message: response.data.Message }

  return {
    success: true,
    message: 'ثبت‌نام با موفقیت انجام شد'
  };
}

export async function rejectEvent(request: RejectEventRequest)
  : Promise<{ success: boolean; message: string }> {

  const response = await authenticatedFetch(`${process.env.API_BaseURL}/Baham/RejectEvent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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

export async function changeStatusEvent(bahamId: number)
  : Promise<{ success: boolean; message: string }> {

  const response = await axiosInstance.post(`${process.env.API_BaseURL}/Baham/ChangeStatus/${bahamId}`);

  return {
    success: true,
    message: 'وضعیت رویداد تغییر یافت'
  };
}
