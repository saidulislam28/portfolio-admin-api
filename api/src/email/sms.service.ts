import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


@Injectable()
export default class SmsService {
  constructor(private readonly configService: ConfigService) {

  }

  sendSMS(phone, text) {
      phone = '+8801717247384'; //TODO for test
     client.messages
        .create({
          body: text,
          from: '+447893948252',
          to: phone,
        })
        .then(message => console.log(`sms sent: ${message.sid}, to: ${phone}`))
        .catch(err => console.log('Error sending sms', err))
  }






}
