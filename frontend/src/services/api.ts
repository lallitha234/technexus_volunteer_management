import { useAuthStore } from '../store/authStore.js';

// Determine API base URL - ensure it always includes /api
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL as string;
  if (envUrl) {
    // If VITE_API_URL is set, ensure it ends with /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  // In development, use relative path to leverage Vite proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Fallback for production
  return 'http://localhost:3000/api';
};

const API_BASE = getApiBase();

interface FetchOptions extends RequestInit {
  data?: Record<string, any>;
}

export const apiCall = async (
  method: string,
  path: string,
  options: FetchOptions = {}
): Promise<any> => {
  const token = useAuthStore.getState().token;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:29',message:'API call started',data:{method,path,hasToken:!!token,tokenLength:token?.length||0,apiBase:API_BASE},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:37',message:'Authorization header added',data:{hasAuthHeader:true},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:40',message:'No token available',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
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

    // Handle non-JSON responses (e.g., CSV exports)
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:54',message:'API error response',data:{status:response.status,statusText:response.statusText,path},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      try {
        if (isJson) {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:59',message:'Error details',data:{errorMessage,errorObject:error},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
      } catch {
        // If we can't parse the error, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Return appropriate format based on content type
    if (isJson) {
      return await response.json();
    } else {
      // For non-JSON responses (like CSV), return as blob
      return await response.blob();
    }
  } catch (error) {
    console.error(`API Error [${method} ${path}]:`, error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${API_BASE}. Please check if the backend server is running.`);
    }
    
    throw error;
  }
};

// Volunteer endpoints
export const volunteersApi = {
  list: (filters?: { status?: string; search?: string; skills?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.skills) params.append('skills', filters.skills);
    const queryString = params.toString();
    return apiCall('GET', `/volunteers${queryString ? `?${queryString}` : ''}`);
  },
  get: (id: string) => apiCall('GET', `/volunteers/${id}`),
  create: (data: any) => apiCall('POST', '/volunteers', { data }),
  update: (id: string, data: any) => apiCall('PATCH', `/volunteers/${id}`, { data }),
  delete: (id: string) => apiCall('DELETE', `/volunteers/${id}`),
  assignBadge: (id: string, badgeId: string) =>
    apiCall('POST', `/volunteers/${id}/assign-badge`, { data: { badge_id: badgeId } }),
};

// Event endpoints
export const eventsApi = {
  list: (filters?: { status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    const queryString = params.toString();
    return apiCall('GET', `/events${queryString ? `?${queryString}` : ''}`);
  },
  get: (id: string) => apiCall('GET', `/events/${id}`),
  create: (data: any) => apiCall('POST', '/events', { data }),
  update: (id: string, data: any) => apiCall('PATCH', `/events/${id}`, { data }),
  publish: (id: string) => apiCall('POST', `/events/${id}/publish`),
  complete: (id: string) => apiCall('POST', `/events/${id}/complete`),
  cancel: (id: string) => apiCall('POST', `/events/${id}/cancel`),
  delete: (id: string) => apiCall('DELETE', `/events/${id}`),
  getShifts: (eventId: string) => apiCall('GET', `/events/${eventId}/shifts`),
  createShift: (data: any) => apiCall('POST', '/events/create-shift', { data }),
  assignVolunteer: (shiftId: string, volunteerId: string) =>
    apiCall('POST', `/events/shifts/${shiftId}/assign`, { data: { volunteer_id: volunteerId } }),
  unassignVolunteer: (shiftId: string, volunteerId: string) =>
    apiCall('DELETE', `/events/shifts/${shiftId}/assign/${volunteerId}`),
};

// Task endpoints
export const tasksApi = {
  list: (filters?: { status?: string; assigned_to?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to);
    const queryString = params.toString();
    return apiCall('GET', `/tasks${queryString ? `?${queryString}` : ''}`);
  },
  create: (data: any) => apiCall('POST', '/tasks', { data }),
  updateStatus: (id: string, status: string) =>
    apiCall('PATCH', `/tasks/${id}/status`, { data: { status } }),
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
  volunteers: async () => {
    const blob = await apiCall('GET', '/export/volunteers');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'volunteers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
  attendance: async () => {
    const blob = await apiCall('GET', '/export/attendance');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
