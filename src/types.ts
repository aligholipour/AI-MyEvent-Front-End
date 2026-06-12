export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar: string;
  isVerified?: boolean;
  birthDate?: string;
  maritalStatus?: 'single' | 'married';
  about?: string;
  gender?: 'male' | 'female';
  interests?: number[];
  occupation?: string;
  invitationLink?: string;
  role?: 'user' | 'admin';
}

export interface AppEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  image: string;
  isFree?: boolean;
  price?: string;
  lat?: number;
  lng?: number;
  categoryId: number | null;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isConfirmed?: boolean;
  isDisabled?: boolean;
  description?: string;
  interests?: number[];
  startTime?: string;
  endTime?: string;
  minCapacity?: string;
  maxCapacity?: string;
  minAge?: string;
  maxAge?: string;
  provinceId?: number | null;
  city?: string;
  isOnline?: boolean;
  onlineLink?: string;
  address?: string;
  eventTime: string
}

export interface AppCategory {
  id: number;
  title: string;
  icon: string;
  color: string;
}

export interface AppUsers {
  id: number;
  name: string;
  title: string;
  rating: number;
  badge: string;
  image: string;
  color: string;
  registeredDate: string
}
export interface HomeSlider {
  id: string;
  title: string;
  subtitle: string;
  extra: string;
  buttonText: string;
  image: string
}
export interface Favourite {
  id: number;
  title: string
}
export interface Province {
  id: number;
  name: string
}
export interface City {
  id: number;
  name: string
}

export interface GetEventsRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  categoryId?: number;
  provinceId?: number;
  fromDate?: string;
  toDate?: string;
  isOnline?: boolean;
  isFreeOnly?: boolean;
  interestIds?: number[],
  gender?: number,
  eventType?: number
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface Job {
  id: number;
  title: string
}
export interface RegisterRequest {
  phone: string,
  fullName: string,
  birthDate?: string,
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married',
  cityId: number,
  jobId?: number,
  favouriteIds: number[],
  profileImageAddress: string
}
export interface EventDetailForAdminResponse{
  id: number
  title: string,
  description: string,
  organizer: string,
  image: string,
  address: string,
  eventTime: string,
  ageRange: string,
  capacity: string,
  isOnline: boolean,
  city: string,
  isApprove: boolean,
  isFree: boolean,
  isActive: boolean,
  price: string,
  category: string,
  favourites: string[]
}
export interface UserCityResponse{
  cityId: number,
  cityName: string
}