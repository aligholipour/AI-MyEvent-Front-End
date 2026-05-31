import { HomeSlider } from '../types';

export const STATIC_EVENTS: HomeSlider[] = [
  {
    id: 'b1',
    title: 'بستنی و فالوده',
    subtitle: 'طعم‌های اصیل و خنک برای روزهای گرم',
    extra: 'تخفیف تا ۱۵٪',
    buttonText: 'خرید کنید >',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'نوشیدنی‌های گرم',
    subtitle: 'انرژی مضاعف با قهوه‌های دست‌چین',
    extra: 'ارسال رایگان',
    buttonText: 'مشاهده منو >',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: 'شیرینی و دسر',
    subtitle: 'لحظات شیرین با دسرهای خانگی متخصصین ما',
    extra: 'پیشنهاد سرآشپز',
    buttonText: 'رزرو کنید >',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800'
  }
];

let runtimeEvents: HomeSlider[] = STATIC_EVENTS;

export function getEvents(): HomeSlider[] {
  return runtimeEvents;
  
}

export async function initHomeSlider(baseUrl = 'http://localhost:5066') {
  try {
    const res = await fetch(`${baseUrl}/api/Media/HomeSliders`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((e: any) => e && e.id && e.title)) {
      runtimeEvents = data as HomeSlider[];
      return runtimeEvents;
    } else {
      console.warn('events API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch events from localhost, using static mock. Error:', err);
  }
  return runtimeEvents;
}
