/* eslint-disable */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SslcommerzService {
  private readonly baseUrl: string;
  private readonly storeId: string;
  private readonly storePassword: string;

  constructor() {
    this.baseUrl = process.env.SSLCOMMERZ_BASE_URL || 'https://sandbox.sslcommerz.com';
    this.storeId = process.env.SSLCOMMERZ_STORE_ID;
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  }

  async createPaymentSession(orderData: {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    cus_name: string;
    cus_email: string;
    cus_phone: string;
    cus_add1?: string;
  }) {
    const payload = {
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: orderData.total_amount,
      currency: orderData.currency || 'BDT',
      tran_id: orderData.tran_id,
      success_url: orderData.success_url,
      fail_url: orderData.fail_url,
      cancel_url: orderData.cancel_url,
      cus_name: orderData.cus_name,
      cus_email: orderData.cus_email,
      cus_phone: orderData.cus_phone,
      cus_add1: orderData.cus_add1 || '',
      shipping_method: 'NO',
      product_name: 'Service',
      product_category: 'Service',
      product_profile: 'general',
    };

    try {
      const response = await axios.post(`${this.baseUrl}/gwprocess/v4/api.php`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('SSLCommerz error:', error.response?.data || error.message);
      throw new Error('Failed to create payment session');
    }
  }
}