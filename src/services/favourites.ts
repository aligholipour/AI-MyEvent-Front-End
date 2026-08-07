import { Favourite } from '../types';

export const STATIC_Favourites: Favourite[] = [
  { id: 1, title: 'چای' },
  { id: 2, title: 'پیاده روی' },
  { id: 3, title: 'کتابخوانی' },
  { id: 4, title: 'موسیقی' },
  { id: 5, title: 'سینما' },
  { id: 6, title: 'بازی' },
  { id: 7, title: 'کوهنوردی' },
  { id: 8, title: 'برنامه‌نویسی' },
  { id: 9, title: 'آشپزی' },
];

let runtimeFavourites: Favourite[] = STATIC_Favourites;

export function getFavourites(): Favourite[] {
  return runtimeFavourites;
}

export async function getAllFavourite() {
  try {
    console.log('get all favourites ' + process.env.API_BaseURL);
    const res = await fetch(`${process.env.API_BaseURL}/Favourite/GetAllFavourite`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((c: any) => c && c.id && c.title)) {
      runtimeFavourites = data as Favourite[];
      return runtimeFavourites;
    } else {
      console.warn('categories API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch categories from localhost, using static mock. Error:', err);
  }
  return runtimeFavourites;
}