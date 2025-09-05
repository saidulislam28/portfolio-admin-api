/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { chunkArray } from 'src/common/utils';
import * as admin from 'firebase-admin';

const BATCH_SIZE = 500;

@Injectable()
export class FcmPushService {
  private firebaseAdmin: admin.app.App;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      this.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      this.firebaseAdmin = admin.app();
    }
  }

  async sendFcmPush(tokens: string[], title: string, body: string, data = {}) {

    //https://firebase.google.com/docs/cloud-messaging/send-message
    //send to multiple: https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-multiple-devices
    const tokenBatches = chunkArray(tokens, BATCH_SIZE);
    
    for (const batch of tokenBatches) {
        try {
            const response = await this.firebaseAdmin.messaging().sendEachForMulticast({
                notification: { title, body },
                data: data,
                tokens: batch,
                apns: {
                    payload: {
                        aps: {
                            badge: 1
                        }
                    }
                }
            });
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.log('Error sending message:', error);
        }
    }

  }

}
