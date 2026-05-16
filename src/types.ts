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
  interests?: string[];
  occupation?: string;
  invitationLink?: string;
  role?: 'user' | 'admin';
}

export interface AppEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  image: string;
  isFree?: boolean;
  price?: string;
  lat?: number;
  lng?: number;
  category?: string;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isConfirmed?: boolean;
  isDisabled?: boolean;
  description?: string;
  interests?: string[];
  startTime?: string;
  endTime?: string;
  minCapacity?: string;
  maxCapacity?: string;
  minAge?: string;
  maxAge?: string;
  provinceId?: string;
  city?: string;
  isOnline?: boolean;
  onlineLink?: string;
  address?: string;
}

export interface AppCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
}
