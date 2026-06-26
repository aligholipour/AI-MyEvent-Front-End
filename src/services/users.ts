import { AppUsers } from '../types';
import { dataURLtoFile } from '../lib/utils';
import { authenticatedFetch } from './Auth/authenticatedFetch';

export const STATIC_EVENTS: AppUsers[] = [
  {
    id: 1,
    name: 'زهرا سعادتیان',
    jobTitle: 'دکتری ژنتیک پزشکی',
    rating: 5,
    badge: 'زود رزرو کن',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-blue-600',
    registeredDate: "5 اردیبهت"
  },
  {
    id: 2,
    name: 'امیرحسین رضایی',
    jobTitle: 'مشاور کسب و کار',
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
}

export async function getUserDetailForAdmin(userId: number

): Promise<{ data: GetUserDetailForAdminResponse }> {

  const response = await authenticatedFetch(`${process.env.API_BaseURL}/User/UserDetailForAdmin/${userId}`, {
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
  return { data: data };
}
