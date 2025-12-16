// Test time conversion logic
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const convertToIST = (date) => {
  const utcTime = date.getTime();
  const istTime = utcTime + IST_OFFSET_MS;
  return new Date(istTime);
};

const convertFromIST = (date) => {
  const istTime = date.getTime();
  const utcTime = istTime - IST_OFFSET_MS;
  return new Date(utcTime);
};

const datetimeLocalToUTCISO = (datetimeLocal) => {
  if (!datetimeLocal) return new Date().toISOString();
  
  const [datePart, timePart] = datetimeLocal.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  
  const utcDate = new Date(Date.UTC(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    0
  ));
  
  const actualUtcDate = convertFromIST(utcDate);
  
  return actualUtcDate.toISOString();
};

const utcISOToDatetimeLocal = (isoString) => {
  const utcDate = new Date(isoString);
  const istDate = convertToIST(utcDate);
  
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const hours = String(istDate.getUTCHours()).padStart(2, '0');
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Test case: User enters "2024-12-17T15:30" (3:30 PM IST)
console.log('=== TEST: User enters 2024-12-17T15:30 (3:30 PM IST) ===');
const userInput = "2024-12-17T15:30";
const convertedToUTC = datetimeLocalToUTCISO(userInput);
console.log('User enters:', userInput);
console.log('Converted to UTC:', convertedToUTC);

// Now convert it back to verify
const convertedBack = utcISOToDatetimeLocal(convertedToUTC);
console.log('Converted back to datetime-local:', convertedBack);
console.log('Match:', userInput === convertedBack ? '✓ YES' : '✗ NO');

// Test with a real UTC date
console.log('\n=== TEST: Backend stores 2024-12-17T10:00:00Z (10:00 AM UTC = 3:30 PM IST) ===');
const backendUTC = "2024-12-17T10:00:00Z";
const displayTime = utcISOToDatetimeLocal(backendUTC);
console.log('Backend UTC:', backendUTC);
console.log('Display as datetime-local (IST):', displayTime);

// Convert it back
const convertedBackAgain = datetimeLocalToUTCISO(displayTime);
console.log('If we edit and save:', convertedBackAgain);
console.log('Match original:', backendUTC === convertedBackAgain ? '✓ YES' : '✗ NO');
