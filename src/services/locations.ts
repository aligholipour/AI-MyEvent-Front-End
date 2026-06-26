import { Province, City, UserCityResponse } from '../types';
import { authenticatedFetch } from './Auth/authenticatedFetch';

export const STATIC_Provinces: Province[] = [
  { id: 1, name: 'تهران' },
  { id: 2, name: 'گلستان' },
  { id: 3, name: 'اصفهان' },
  { id: 4, name: 'شیراز' },
];

export const STATIC_Cities: Province[] = [
  { id: 1, name: 'بومهن' },
  { id: 2, name: 'ساری' },
  { id: 3, name: 'گرگان' },
  { id: 4, name: 'خلیل شهر' },
];

let runtimeProvinces: Province[] = STATIC_Provinces;

export function getProvinces(): Province[] {
  return runtimeProvinces;
}

let runtimeCties: City[] = STATIC_Cities;

export function getCities(): City[] {
  return runtimeCties;
}

export async function getAllProvince() {
  try {
    const res = await fetch(`${process.env.API_BaseURL}/Location/GetProvinces`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((c: any) => c && c.id && c.name)) {
      runtimeProvinces = data as Province[];
      return runtimeProvinces;
    } else {
      console.warn('categories API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch categories from localhost, using static mock. Error:', err);
  }
  return runtimeProvinces;
}

export async function getCityWithProvinceId(provinceId: number) {
  try {
    const res = await fetch(`${process.env.API_BaseURL}/Location/GetCities/${provinceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.every((c: any) => c && c.id && c.name)) {
      runtimeCties = data as City[];
      return runtimeCties;
    } else {
      console.warn('categories API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch categories from localhost, using static mock. Error:', err);
  }
  return runtimeCties;
}

export async function getCityForHomePage() {

  let cities: City[];

  try {
    const res = await fetch(`${process.env.API_BaseURL}/Location/GetCitiesForHomePage`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (Array.isArray(data) && data.every((c: any) => c && c.id && c.name)) {
      cities = data as City[];
      return cities;
    } else {
      console.warn('categories API returned unexpected shape, using static mock');
    }
  } catch (err) {
    console.warn('Failed to fetch categories from localhost, using static mock. Error:', err);
    return;
  }
}

export const getUserCity = async (): Promise<UserCityResponse> => {
  try {
    const res = await authenticatedFetch(`${process.env.API_BaseURL}/User/GetUserCity`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;

  } catch (err) {
    throw new Error(`HTTP ${err}`);
  }

  // const response = await fetch(`${process.env.API_BaseURL}/user/profile`, {
  //     method: 'GET',
  //     headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //     },
  // });

  // if (!response.ok) {
  //     throw new Error('خطا در دریافت اطلاعات کاربر');
  // }

  // return response.json();
};
