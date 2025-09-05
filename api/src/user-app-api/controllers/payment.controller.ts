import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { res } from 'src/common/response.helper';

import { SSLCommerzCallbackDto } from '../dtos/sslcommerz-callback.dto';
import { PaymentService } from '../services/payment.service';

export type SSLSuccessPayloadType = {
  tran_id: string;
  val_id: string;
  amount: string;
  card_type: string;
  store_amount: string;
  card_no: string;
  bank_tran_id: string;
  status: 'VALID' | string;
  tran_date: string;
  error: string;
  currency: string;
  card_issuer: string;
  card_brand: string;
  card_sub_brand: string;
  card_issuer_country: string;
  card_issuer_country_code: string;
  store_id: string;
  verify_sign: string;
  verify_key: string;
  verify_sign_sha2: string;
  currency_type: string;
  currency_amount: string;
  currency_rate: string;
  base_fair: string;
  value_a: string;
  value_b: string;
  value_c: string;
  value_d: string;
  subscription_id: string;
  risk_level: string;
  risk_title: string;
};


@Controller('payment')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // This endpoint will be called by SSLCommerz after payment success
  @Post('redirect')
  async verifyPayment(
    @Body() payload: SSLCommerzCallbackDto,
    @Req() req,
    @Query('status') status: string,
    @Res() res: Response,
  ) {

    if (status === 'success' && payload.status === 'VALID') {
      const response = await this.paymentService.verifyPayment(payload);
      // TODO do the payment verification in a queue job so that we don't keep the user waiting
      return (
        res.redirect(`app://payment-success?paystate=success&order_id=rorder_id&transaction_id=transaction_id`)
      );
    } else if (status === 'canceled') {
      // const paymentCanaled = await this.paymentService.paymentFailed(payload.tran_id, PAYMENT_STATUS.CANCELED);
      res.redirect(`app://payment-success?paystate=cancel&order_id=rorder_id&transaction_id=transaction_id`)
      // return { success: false, payment: "Canceled" }
    } else {
      // const paymentCanaled = await this.paymentService.paymentFailed(payload.tran_id, PAYMENT_STATUS.FAILED);
      // return { success: false, payment: "Failed" }
      res.redirect(`app://payment-success?paystate=fail&order_id=rorder_id&transaction_id=transaction_id`)
    }

  }

  @Post('check-payment')
  async checkPayment(@Body() payload: { tran_id: string },) {
    const checkPayment = await this.paymentService.checkPayment(payload.tran_id);
    return res.success(checkPayment);
  }

}