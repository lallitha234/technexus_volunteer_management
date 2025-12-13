import { useAuthStore } from '../store/authStore.js';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  data?: Record<string, any>;
}

export const apiCall = async (
  method: string,
  path: string,
  options: FetchOptions = {}
): Promise<any> => {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;
  const body = options.data ? JSON.stringify(options.data) : undefined;

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${path}]:`, error);
    throw error;
  }
};

// Volunteer endpoints
export const volunteersApi = {
  list: (filters?: { status?: string; search?: string; skills?: string }) =>
    apiCall('GET', `/volunteers?${new URLSearchParams(filters || {}).toString()}`),
  get: (id: string) => apiCall('GET', `/volunteers/${id}`),
  create: (data: any) => apiCall('POST', '/volunteers', { data }),
  update: (id: string, data: any) => apiCall('PATCH', `/volunteers/${id}`, { data }),
  delete: (id: string) => apiCall('DELETE', `/volunteers/${id}`),
  assignBadge: (id: string, badgeId: string) =>
    apiCall('POST', `/volunteers/${id}/assign-badge`, { data: { badge_id: badgeId } }),
};

// Event endpoints
export const eventsApi = {
  list: (filters?: { status?: string }) =>
    apiCall('GET', `/events?${new URLSearchParams(filters || {}).toString()}`),
  get: (id: string) => apiCall('GET', `/events/${id}`),
  create: (data: any) => apiCall('POST', '/events', { data }),
  update: (id: string, data: any) => apiCall('PATCH', `/events/${id}`, { data }),
  publish: (id: string) => apiCall('POST', `/events/${id}/publish`),
  cancel: (id: string) => apiCall('POST', `/events/${id}/cancel`),
  getShifts: (eventId: string) => apiCall('GET', `/events/${eventId}/shifts`),
  createShift: (data: any) => apiCall('POST', '/events/create-shift', { data }),
  assignVolunteer: (shiftId: string, volunteerId: string) =>
    apiCall('POST', `/events/${shiftId}/assign`, { data: { volunteer_id: volunteerId } }),
  unassignVolunteer: (shiftId: string, volunteerId: string) =>
    apiCall('DELETE', `/events/${shiftId}/assign/${volunteerId}`),
};

// Task endpoints
export const tasksApi = {
  list: (filters?: { status?: string; assigned_to?: string }) =>
    apiCall('GET', `/tasks?${new URLSearchParams(filters || {}).toString()}`),
  create: (data: any) => apiCall('POST', '/tasks', { data }),
  complete: (id: string, data?: any) => apiCall('PATCH', `/tasks/${id}/complete`, { data }),
};

// Message endpoints
export const messagesApi = {
  broadcast: (data: any) => apiCall('POST', '/messages/broadcast', { data }),
  send: (data: any) => apiCall('POST', '/messages/send', { data }),
  getVolunteerMessages: (volunteerId: string) =>
    apiCall('GET', `/messages/volunteer/${volunteerId}`),
};

// Analytics endpoints
export const analyticsApi = {
  summary: () => apiCall('GET', '/analytics/summary'),
};

// Export endpoints
export const exportApi = {
  volunteers: () =>
    apiCall('GET', '/export/volunteers', { method: 'GET' }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'volunteers.csv';
      a.click();
    }),
  attendance: () =>
    apiCall('GET', '/export/attendance', { method: 'GET' }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.csv';
      a.click();
    }),
};
