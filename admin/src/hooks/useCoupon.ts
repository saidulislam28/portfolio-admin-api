// src/hooks/useCoupons.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CreateCouponData } from '~/@types/coupon';
import { deleteApi, get, patch, post } from '~/services/api/api';
import { COUPON, COUPON_API_WITH_ID } from '~/services/api/endpoints';

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

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons-all'],
    queryFn: () => get(COUPON),
    select: (data) => {
      return data?.data ?? []
    }
  });
};

export const useCoupon = (id: number) => {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => get(COUPON_API_WITH_ID(id)),
    select: (data) => data?.data,
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponData) => post(COUPON, data),
    onSuccess: () => {
      message.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCouponData> }) =>
      patch(COUPON_API_WITH_ID(id), data),
    onSuccess: () => {
      message.success('Coupon updated successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteApi(COUPON_API_WITH_ID(id)),
    onSuccess: () => {
      message.success('Coupon deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
};