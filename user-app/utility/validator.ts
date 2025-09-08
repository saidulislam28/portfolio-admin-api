export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bangladeshi phone number validation regex pattern
export const bdPhoneRegex = /^(013|014|015|016|017|018|019)\d{8}$/;

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns Object containing isValid boolean and error message
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email?.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validates a Bangladeshi phone number
 * @param phone - The phone number to validate
 * @param isRequired - Whether the field is required (default: true)
 * @returns Object containing isValid boolean and error message
 */
export const validatePhone = (
  phone: string, 
  isRequired: boolean = true
): { isValid: boolean; error?: string } => {
  if (!phone?.trim()) {
    return isRequired 
      ? { isValid: false, error: 'Phone number is required' }
      : { isValid: true };
  }
  
  if (!bdPhoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid Bangladeshi phone number' };
  }
  
  return { isValid: true };
};