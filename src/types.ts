export interface Event {
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
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
}
