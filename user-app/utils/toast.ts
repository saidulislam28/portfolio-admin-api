import Toast, { ToastOptions } from 'react-native-toast-message';

const POSITION = 'bottom';
const BOTTOM_OFFSET = 120;

/**
 * Shows a success toast notification.
 *
 * @param {string} title - The main title of the toast (required).
 * @param {string} [subtitle] - The optional subtitle or description.
 * @param {ToastOptions} [options] - Optional configuration for the toast (e.g., position, duration).
 *
 * @example
 * showSuccessToast('Success!', 'Your action was completed.');
 * showSuccessToast('Saved', 'Data has been synced.', { visibilityTime: 3000, position: 'top' });
 */
export const showSuccessToast = (
  title: string,
  subtitle?: string,
  options?: ToastOptions
): void => {
  Toast.show({
    type: 'success',
    text1: title,
    position: POSITION,
    bottomOffset: BOTTOM_OFFSET,
    ...(subtitle && { text2: subtitle }),
    ...options,
  });
};

/**
 * Shows an error toast notification.
 *
 * @param {string} title - The main title of the toast (required).
 * @param {string} [subtitle] - The optional subtitle or description.
 * @param {ToastOptions} [options] - Optional configuration for the toast (e.g., position, duration).
 *
 * @example
 * showErrorToast('Error', 'Failed to save data.');
 * showErrorToast('Network Issue', undefined, { bottomOffset: 100 });
 */
export const showErrorToast = (
  title: string,
  subtitle?: string,
  options?: ToastOptions
): void => {
  Toast.show({
    type: 'error',
    text1: title,
    position: POSITION,
    bottomOffset: BOTTOM_OFFSET,
    ...(subtitle && { text2: subtitle }),
    ...options,
  });
};

/**
 * Shows an info toast notification.
 *
 * @param {string} title - The main title of the toast (required).
 * @param {string} [subtitle] - The optional subtitle or description.
 * @param {ToastOptions} [options] - Optional configuration for the toast (e.g., position, duration).
 *
 * @example
 * showInfoToast('Heads up', 'This feature is in beta.');
 * showInfoToast('Reminder', 'Don’t forget to log out.', { visibilityTime: 5000 });
 */
export const showInfoToast = (
  title: string,
  subtitle?: string,
  options?: ToastOptions
): void => {
  Toast.show({
    type: 'info',
    text1: title,
    position: POSITION,
    bottomOffset: BOTTOM_OFFSET,
    ...(subtitle && { text2: subtitle }),
    ...options,
  });
};