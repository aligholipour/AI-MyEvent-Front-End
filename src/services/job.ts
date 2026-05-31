import { Job } from '../types';

export const STATIC_JOBS: Job[] = [
  { id: 1, title: 'برنامه نویس'},
  { id: 1, title: 'معلم'},
];

let runtimeJobs: Job[] = STATIC_JOBS;

export function getJobs(): Job[] {
  return runtimeJobs;
}

export async function GetAllJobs(baseUrl = 'http://localhost:5066'){
    try {
        const res = await fetch(`${baseUrl}/api/Job/GetAll`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.every((c: any) => c && c.id && c.title)) {
          runtimeJobs = data as Job[];
          return runtimeJobs;
        } else {
          console.warn('jobs API returned unexpected shape, using static mock');
        }
      } catch (err) {
        console.warn('Failed to fetch jobs from localhost, using static mock. Error:', err);
      }
      return runtimeJobs;
}