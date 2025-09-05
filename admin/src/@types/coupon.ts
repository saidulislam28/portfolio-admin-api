export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  max_uses?: number;
  used_count: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_global: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCouponData {
  code: string;
  description?: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  max_uses?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  is_global?: boolean;
  categories?: string[];
  user_ids?: number[];
}


export interface ApplyCouponData {
  code: string;
  order_amount: number;
  service_type: string;
  user_id: number;
}

export interface ApplyCouponResponse {
  valid: boolean;
  discount_amount?: number;
  final_amount?: number;
  message?: string;
  coupon?: Coupon;
}