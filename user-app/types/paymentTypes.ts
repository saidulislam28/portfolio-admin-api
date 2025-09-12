export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  is_active: boolean;
  is_global: boolean;
  start_date: string;
  end_date: string;
  categories: string[];
  max_uses: number;
  used_count: number;
}

export interface CouponValidationResponse {
  isValid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount?: number;
}