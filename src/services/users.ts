import { AppUsers } from '../types';
import { dataURLtoFile } from '../lib/utils';

export const STATIC_EVENTS: AppUsers[] = [
  {
    id: 1,
    name: 'زهرا سعادتیان',
    title: 'دکتری ژنتیک پزشکی',
    rating: 5,
    badge: 'زود رزرو کن',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-blue-600',
    registeredDate: "5 اردیبهت"
  },
  {
    id: 2,
    name: 'امیرحسین رضایی',
    title: 'مشاور کسب و کار',
    rating: 4.8,
    badge: 'تخفیف ویژه',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-emerald-600',
    registeredDate: "5 اردیبهت"
  },
];

export interface GetUsersRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetUserDetailForAdminResponse {
  id: number,
  fullName: string,
  phone: string,
  birthDate: string,
  maritalStatus: string,
  referralCode: string,
  aboutMe: string,
  gender: string,
  profileImage: string,
  job: string,
  favourites: string
}

let runtimeEvents: AppUsers[] = STATIC_EVENTS;

export function getEvents(): AppUsers[] {
  return runtimeEvents;
}

export async function getUsers(
  request: GetUsersRequest = {},
  baseUrl = 'http://localhost:5066'
): Promise<{ data: AppUsers[]; totalCount: number; hasNextPage: boolean }> {

  const params = new URLSearchParams();
  if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
  if (request.pageSize) params.append('pageSize', request.pageSize.toString());

  const response = await fetch(`${baseUrl}/api/User/Users?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: خطا در دریافت کاربران`);
  }

  const data = await response.json();
  return {
    data: data.data,
    totalCount: data.totalCount,
    hasNextPage: data.HasNextPage,
  };

  // try {
  //   const res = await fetch(`${baseUrl}/api/User/Users`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //   const data = await res.json();
  //   if (Array.isArray(data) && data.every((e: any) => e && e.id && e.title)) {
  //     runtimeEvents = data as AppUsers[];
  //     return runtimeEvents;
  //   } else {
  //     console.warn('events API returned unexpected shape, using static mock');
  //   }
  // } catch (err) {
  //   console.warn('Failed to fetch events from localhost, using static mock. Error:', err);
  // }
  // return runtimeEvents;
}

export async function Register(eventData: any, baseUrl = 'http://localhost:5066') {
  try {
    const formData = new FormData();

    eventData.favouriteIds.forEach((favourite: number, index: number) => {
      formData.append(`FavouriteIds[${index}]`, favourite.toString());
    });

    formData.append('fullName', eventData.fullName || '');
    formData.append('gender', eventData.gender || 0);
    formData.append('maritalStatus', eventData.maritalStatus || 0);
    formData.append('cityId', eventData.cityId || eventData.cityId || 0);
    formData.append('jobId', String(eventData.jobId || eventData.jobId || 0));

    if (eventData.birthDate) {
      const fromDateTime = new Date(eventData.birthDate);
      formData.append('birthDate', fromDateTime.toISOString());
    }

    if (eventData.profileImageAddress) {
      const imageFile = dataURLtoFile(eventData.profileImageAddress, 'event-image.jpg');
      formData.append('profileImageAddress', imageFile);
    }

    const response = await fetch(`${baseUrl}/api/User/Register`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json;
    return result;
  }
  catch (err) {
    console.error('Failed to create event:', err);
    throw err;
  }
}

export async function getUserDetailForAdmin(userId: number, baseUrl = 'http://localhost:5066'

): Promise<{ data: GetUserDetailForAdminResponse }> {

  const token = localStorage.getItem('access_token');

  const response = await fetch(`${baseUrl}/api/User/UserDetailForAdmin/${userId}`, {
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
  return { data: data };
}