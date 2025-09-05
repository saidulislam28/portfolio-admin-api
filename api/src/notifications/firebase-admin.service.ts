import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
// import * as serviceAccount from './firebase-service-account.json';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    //   });
    // }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, string>
  ) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      data, // Custom data payload
    });
  }
}
