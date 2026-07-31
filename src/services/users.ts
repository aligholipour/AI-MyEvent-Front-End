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
    registeredDate: "5 اردیبهت",
    email: '',
    phone: ''
  },
  {
    id: 2,
    name: 'امیرحسین رضایی',
    jobTitle: 'مشاور کسب و کار',
    rating: 4.8,
    badge: 'تخفیف ویژه',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    color: 'bg-emerald-600',
    registeredDate: "5 اردیبهت",
    email: '',
    phone: ''
  },
];

export interface GetUsersRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface UserProfileResponse {
  id: number;
  username?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
  birthDate: string;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married';
  occupation?: string;
  about?: string;
  profileAddress?: string;
  profileImage?: string;
  avatar?: string;
  interests?: number[];
  favouriteIds?: number[];
  jobId?: number | null;
  jobTitle?: string;
}

export interface GetUserForEditResponse extends UserProfileResponse { }

export interface UpdateUserProfilePayload {
  fullName?: string;
  phone?: string;
  birthDate: Date | null;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married';
  about?: string;
  profileImageAddress?: string;
  favouriteIds?: number[];
  jobId: number;
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
  email: string,
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

function mapUserProfile(data: any): UserProfileResponse {
  const payload = data?.data ?? data;

  return {
    id: payload?.id ?? payload?.userId ?? 0,
    username: payload?.username ?? payload?.userName ?? payload?.fullName ?? payload?.name ?? '',
    fullName: payload?.fullName ?? payload?.name ?? payload?.username ?? '',
    name: payload?.name ?? payload?.fullName ?? payload?.username ?? '',
    phone: payload?.phone ?? payload?.phoneNumber ?? '',
    email: payload?.email ?? payload?.mail ?? '',
    birthDate: payload?.birthDate ?? payload?.birth_date ?? '',
    gender: payload?.gender ?? undefined,
    maritalStatus: payload?.maritalStatus ?? payload?.marital_status ?? undefined,
    occupation: payload?.occupation ?? payload?.job ?? payload?.jobTitle ?? '',
    about: payload?.about ?? payload?.aboutMe ?? '',
    profileAddress: payload?.profileAddress ?? payload?.profileImage ?? payload?.profileImageAddress ?? '',
    profileImage: payload?.profileImage ?? payload?.profileImageAddress ?? payload?.profileAddress ?? '',
    avatar: payload?.avatar ?? payload?.profileImageAddress ?? payload?.profileAddress ?? '',
    interests: payload?.interests ?? payload?.favouriteIds ?? [],
    favouriteIds: payload?.favouriteIds ?? payload?.interests ?? [],
    jobId: payload?.jobId ?? payload?.job?.id ?? payload?.occupationId ?? null,
    jobTitle: payload?.jobTitle ?? payload?.job?.title ?? payload?.occupation ?? '',
  };
}

export async function getUserForEdit(): Promise<GetUserForEditResponse> {

  let lastError: unknown;

  try {
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/User/GetUserForEdit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return mapUserProfile(data);
  } catch (error) {
    lastError = error;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('خطا در دریافت اطلاعات برای ویرایش کاربر');
}

export async function getCurrentUserProfile(): Promise<UserProfileResponse> {
  const endpoints = [
    '/User/GetUserProfile',
    '/User/Profile',
    '/User/GetProfile',
    '/User/UserDetail',
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await authenticatedFetch(`${process.env.API_BaseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      return mapUserProfile(data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('خطا در دریافت اطلاعات کاربر');
}

export async function updateUserProfile(payload: UpdateUserProfilePayload): Promise<UserProfileResponse> {

  const formData = new FormData();

  if (payload.fullName) formData.append('fullName', payload.fullName);
  if (payload.phone) formData.append('phoneNumber', payload.phone);
  // if (payload.birthDate) formData.append('birthDate', payload.birthDate.toString());
  if (payload.gender) formData.append('gender', payload.gender);
  if (payload.maritalStatus) formData.append('maritalStatus', payload.maritalStatus);
  if (payload.about) formData.append('about', payload.about);
  if (payload.jobId) formData.append('jobId', String(payload.jobId));
  if (payload.favouriteIds?.length) {
    payload.favouriteIds.forEach((item, index) => formData.append(`favouriteIds[${index}]`, String(item)));
  }

  if (payload.birthDate) {
    const fromDateTime = new Date(payload.birthDate);
    formData.append('birthDate', fromDateTime.toISOString());
  }

  if (payload.profileImageAddress) {
    const isBase64 = payload.profileImageAddress.startsWith('data:image');

    if (isBase64) {
      // اگر Base64 بود، به فایل تبدیل کن
      try {
        const imageFile = dataURLtoFile(payload.profileImageAddress, 'profile-image.jpg');
        formData.append('profileImageAddress', imageFile);
      } catch (error) {
        console.error('Error converting base64 to file:', error);
        throw new Error('فرمت تصویر نامعتبر است');
      }
    } else {
      // اگر آدرس معمولی بود، به عنوان رشته ارسال کن
      formData.append('profileImageAddress', payload.profileImageAddress);
    }
  }

  // if (payload.profileImageAddress) {
  //   const imageFile = dataURLtoFile(payload.profileImageAddress, 'event-image.jpg');
  //   formData.append('profileImageAddress', imageFile);
  // }

  let lastError: unknown;

  try {
    const response = await authenticatedFetch(`${process.env.API_BaseURL}/User/Update`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();
    return data;
    // return mapUserProfile(data);

  } catch (error) {
    lastError = error;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('خطا در به‌روزرسانی اطلاعات کاربر');
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

export async function getUsereForAdmin(
  request: GetUsersRequest = {}
): Promise<{ data: AppUsers[]; totalCount: number; hasNextPage: boolean }> {

  const params = new URLSearchParams();
  if (request.pageNumber) params.append('pageNumber', request.pageNumber.toString());
  if (request.pageSize) params.append('pageSize', request.pageSize.toString());

  const response = await fetch(`${process.env.API_BaseURL}/User/UsersForAdmin?${params.toString()}`,
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