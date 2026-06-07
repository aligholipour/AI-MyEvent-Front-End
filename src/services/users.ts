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
  request: GetUsersRequest = {}
): Promise<{ data: AppUsers[]; totalCount: number; hasNextPage: boolean }> {

  const params = new URLSearchParams();
  if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
  if (request.pageSize) params.append('pageSize', request.pageSize.toString());

  const response = await fetch(`${process.env.API_BaseURL}/User/Users?${params.toString()}`,
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

export async function Register(registerData: any) {
  try {
    const formData = new FormData();

    registerData.favouriteIds.forEach((favourite: number, index: number) => {
      formData.append(`FavouriteIds[${index}]`, favourite.toString());
    });

    formData.append('fullName', registerData.fullName || '');
    formData.append('gender', registerData.gender || 0);
    formData.append('maritalStatus', registerData.maritalStatus || 0);
    formData.append('cityId', registerData.cityId || registerData.cityId || 0);
    formData.append('jobId', String(registerData.jobId || registerData.jobId || 0));
    formData.append('phone', registerData.phone);

    if (registerData.birthDate) {
      const fromDateTime = new Date(registerData.birthDate);
      formData.append('birthDate', fromDateTime.toISOString());
    }

    if (registerData.profileImageAddress) {
      const imageFile = dataURLtoFile(registerData.profileImageAddress, 'event-image.jpg');
      formData.append('profileImageAddress', imageFile);
    }

    const response = await fetch(`${process.env.API_BaseURL}/User/Register`, {
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

export async function getUserDetailForAdmin(userId: number

): Promise<{ data: GetUserDetailForAdminResponse }> {

  const token = localStorage.getItem('access_token');

  const response = await fetch(`${process.env.API_BaseURL}/User/UserDetailForAdmin/${userId}`, {
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