import { AppCategory } from '../types';

export const STATIC_CATEGORIES: AppCategory[] = [
  { id: 1, title: 'قلی پور', icon: 'Atom', color: 'text-purple-600' },
  { id: 2, title: '?????', icon: 'Music', color: 'text-rose-600' },
  { id: 3, title: '???', icon: 'Palette', color: 'text-amber-600' },
  { id: 4, title: '????', icon: 'Trophy', color: 'text-emerald-600' },
  { id: 5, title: '???', icon: 'Cpu', color: 'text-indigo-600' },
  { id: 6, title: '?????', icon: 'GraduationCap', color: 'text-blue-600' },
  { id: 7, title: '???', icon: 'Image', color: 'text-orange-600' },
  { id: 8, title: '????', icon: 'Gamepad2', color: 'text-cyan-600' },
  { id: 9, title: '?????', icon: 'Moon', color: 'text-teal-600' },
  { id: 10, title: '?????', icon: 'Briefcase', color: 'text-rose-600' },
  { id: 11, title: '?????', icon: 'Heart', color: 'text-pink-600' },
  { id: 12, title: '???', icon: 'Compass', color: 'text-emerald-600' },
];

let runtimeCategories: AppCategory[] = STATIC_CATEGORIES;

export function getCategories(): AppCategory[] {
  return runtimeCategories;
}

export async function initCategories(baseUrl = 'http://localhost:5066') {
  try {
    const res = await fetch(`${baseUrl}/api/Category/Test`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((c: any) => c && c.id && c.title)) {
      runtimeCategories = data as AppCategory[];
      return runtimeCategories;
    } else {
      console.warn('categories API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch categories from localhost, using static mock. Error:', err);
  }
  return runtimeCategories;
}
export async function CreateEventCategory(baseUrl = 'http://localhost:5066') {
  try {
    const response = await fetch(`${baseUrl}/api/Category/CreateEventCategory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.every(c => c && c.id && c.title)) {
      return data as AppCategory[];
    } else {
      console.warn('Categories API returned unexpected shape, using empty array');
      return [];
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    throw err;
  }
}