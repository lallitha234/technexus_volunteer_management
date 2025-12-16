/**
 * Utility functions for handling Indian Standard Time (IST - UTC+5:30)
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

/**
 * Convert UTC date to IST
 */
export const convertToIST = (date: Date): Date => {
  const utcTime = date.getTime();
  const istTime = utcTime + IST_OFFSET_MS;
  return new Date(istTime);
};

/**
 * Convert IST date to UTC
 */
export const convertFromIST = (date: Date): Date => {
  const istTime = date.getTime();
  const utcTime = istTime - IST_OFFSET_MS;
  return new Date(utcTime);
};

/**
 * Format date in IST timezone for display
 */
export const formatDateIST = (dateString: string): string => {
  const utcDate = new Date(dateString);
  const istDate = convertToIST(utcDate);
  
  // Format as: Dec 17, 3:30:45 PM (IST)
  return istDate.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Format time only in IST timezone
 */
export const formatTimeIST = (dateString: string | Date): string => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const istDate = convertToIST(date);
  
  return istDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Convert datetime-local input value to UTC ISO string
 * 
 * IMPORTANT: HTML datetime-local input returns a string in format YYYY-MM-DDTHH:mm
 * which represents LOCAL TIME (user's IST in our case).
 * We need to interpret this as IST and convert to UTC for storage.
 * 
 * Example: User enters "2024-12-17T15:30" (3:30 PM IST)
 * We parse it, treat it as IST, and convert to UTC
 */
export const datetimeLocalToUTCISO = (datetimeLocal: string): string => {
  if (!datetimeLocal) return new Date().toISOString();
  
  // Parse the datetime-local string (YYYY-MM-DDTHH:mm)
  const [datePart, timePart] = datetimeLocal.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  // Create a UTC date object with the parsed components
  // This creates: UTC midnight on the given date
  const utcDate = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    0
  ));
  
  // Now we have a UTC date, but it represents IST time
  // Convert from IST to UTC by subtracting the offset
  const actualUtcDate = convertFromIST(utcDate);
  
  const result = actualUtcDate.toISOString();
  console.log('[timeUtils] datetimeLocalToUTCISO:', {
    input: datetimeLocal,
    interpretedAsIST: utcDate.toISOString(),
    convertedToUTC: result,
  });
  return result;
};

/**
 * Convert UTC ISO string to datetime-local format (IST)
 * 
 * Takes a UTC ISO string from database and converts to IST for display in datetime-local input
 * 
 * Example: UTC "2024-12-17T10:00:00Z" is actually 3:30 PM IST
 * We convert to IST and format as "2024-12-17T15:30"
 */
export const utcISOToDatetimeLocal = (isoString: string): string => {
  const utcDate = new Date(isoString);
  const istDate = convertToIST(utcDate);
  
  // Format as datetime-local: YYYY-MM-DDTHH:mm
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const hours = String(istDate.getUTCHours()).padStart(2, '0');
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

