// Create a set of already booked slot keys for quick lookup
//
export const flattenTimeslots = (arr) => {
  if (!arr) return [];

  const bookedKeys = [];
  arr.forEach((appointment) => {
    // Extract time from start_at (assuming format like "2023-12-01T14:30:00Z" or similar)
    // for return type, we need the slot in this format: 2025-10-08T07:00:00
    // notice how we used hardcoded 00 for seconds, this is to make sure we can check exact date
    // string
    const dateStr = appointment.start_at;
    const result = dateStr.split(".")[0];
    // split at ":" and replace seconds part
    let parts = result.split(":");
    parts[2] = "00"; // overwrite 
    
    let t = parts.join(":"); // now this time is in utc, but we get the slots in local time, so to make compare
    // we need to adjust this time for local timezone

    t = convertUTCToLocal(t);
    bookedKeys.push(t);
  });
  return bookedKeys;
};

/**
 * Converts a UTC date string to the user's local timezone while keeping the same format
 * @param {string} utcDateString - UTC date string in format "YYYY-MM-DDTHH:mm:ss"
 * @returns {string} - Local timezone date string in same format "YYYY-MM-DDTHH:mm:ss"
 */
export const convertUTCToLocal = (utcDateString) => {
  // Create a Date object from the UTC string (automatically parsed as UTC)
  const utcDate = new Date(utcDateString + 'Z');
  
  // Get the local date components
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getDate()).padStart(2, '0');
  const hours = String(utcDate.getHours()).padStart(2, '0');
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  const seconds = String(utcDate.getSeconds()).padStart(2, '0');
  
  // Format back to the original string format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};