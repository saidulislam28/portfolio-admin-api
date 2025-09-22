import { GenericOrderResponse } from '@/types/orders';

/**
 * Generate default order data when API call fails
 * @returns Default order response
 */
export const getDefaultOrderData = (): GenericOrderResponse => {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    title: "Payment Successful!",
    subtitle: "✅ Your transaction was completed successfully",
    cardTitle: "Transaction Details",
    icon: "check-circle",
    orderId: "OFFLINE-" + Date.now(),
    date: date,
    createdAt: new Date().toISOString()
  };
};