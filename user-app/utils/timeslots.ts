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
    parts[2] = "00"; // overwrite seconds
    bookedKeys.push(parts.join(":"));
  });
  return bookedKeys;
};
