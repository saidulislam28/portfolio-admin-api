import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';


@Injectable()
export default class SmsService {
  constructor(private readonly configService: ConfigService) {

  }

  sendSMS(phone, text) {
  }
}
