import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, USER_ROLE } from '@prisma/client';
import * as admin from 'firebase-admin';
import { NotificationEventName, RECIPIENT_TYPE } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

import { SendAllUserDto, SendCallingNotificationDto, SendNotificationDto } from './dto/notification.dto';
import { CallEndPushNotificationDataPayload, CallStartPushNotificationDataPayload } from 'src/types/push-notifications';

@Injectable()
export class NotificationService {
  private firebaseAdmin: admin.app.App;

  constructor(private prisma: PrismaService) {
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

  // notification.service.ts

  // async sendToUsers(sendNotificationDto: SendNotificationDto) {
  //   const { selected_users, title, message } = sendNotificationDto;
  //   const notifications = [];

  //   // Save notifications to DB and collect all device tokens
  //   const allDeviceTokens: { token: string }[] = [];

  //   for (const user_id of selected_users) {
  //     // Save the notification for each user
  //     const notification = await this.prisma.notification.create({
  //       data: {
  //         user_id,
  //         title,
  //         message,
  //       },
  //     });

  //     notifications.push(notification);

  //     // Get device tokens for each user
  //     // const deviceTokens = await this.prisma.deviceToken.findMany({
  //     //   where: { user_id },
  //     //   select: { token: true },
  //     // });

  //     // allDeviceTokens.push(...deviceTokens);
  //   }

  //   // Send FCM notifications if there are any tokens
  //   if (allDeviceTokens.length > 0) {
  //     try {
  //       const messages = allDeviceTokens.map(deviceToken => ({
  //         token: deviceToken.token,
  //         notification: { title, body: message },
  //       }));

  //       const response = await Promise.all(
  //         messages.map(msg => this.firebaseAdmin.messaging().send(msg))
  //       )

  //     } catch (error) {
  //       console.error('Failed to send FCM notification:', error);
  //     }
  //   }

  //   return { success: true, notifications_sent: notifications.length };
  // }

  async sendNotification(sendNotificationDto: SendNotificationDto) {
    const { selected_users = [], title, message, recipient_type, all_user } = sendNotificationDto;

    // console.log("sendNotificationDto", sendNotificationDto)

    let recipients: { token: string | null }[] = [];

    if (recipient_type === RECIPIENT_TYPE.User) {
      recipients = all_user
        ? await this.prisma.user.findMany({
          where: { token: { not: null } },
          select: { token: true },
        })
        : await this.prisma.user.findMany({
          where: {
            id: { in: selected_users },
            token: { not: null },
          },
          select: { token: true },
        });
    } else if (recipient_type === RECIPIENT_TYPE.Consultant) {
      recipients = all_user
        ? await this.prisma.consultant.findMany({
          where: { token: { not: null } },
          select: { token: true },
        })
        : await this.prisma.consultant.findMany({
          where: {
            id: { in: selected_users },
            token: { not: null },
          },
          select: { token: true },
        });
    }

    const deviceTokens = recipients.map(r => r.token).filter(Boolean) as string[];

    if (deviceTokens.length > 0) {
      const messages = deviceTokens.map(token => ({
        token,
        notification: { title, body: message },
      }));

      try {
        await Promise.all(messages.map(msg => this.firebaseAdmin.messaging().send(msg)));
      } catch (error) {
        console.error('❌ Failed to send FCM notifications:', error);
      }
    }

    return {
      success: true,
      total_recipients: deviceTokens.length,
    };
  }



  async sendToAllUsers(sendNotificationDto: SendAllUserDto) {
    const { title, message } = sendNotificationDto;

    // Get all active users with device tokens
    // const usersWithTokens = await this.prisma.user.findMany({
    //   where: {
    //     is_active: true,
    //     DeviceToken: { some: {} }, // Users with at least one device token
    //   },
    //   include: {
    //     DeviceToken: {
    //       select: { token: true },
    //     },
    //   },
    // });

    // console.log("User with tokens", usersWithTokens[0]?.DeviceToken);

    // Save notifications to database
    // const notifications = await Promise.all(
    //   usersWithTokens.map(user =>
    //     this.prisma.notification.create({
    //       data: {
    //         title,
    //         message,
    //         user_id: user.id,
    //       },
    //     }),
    //   ),
    // );

    // // Prepare FCM messages
    // const messages = usersWithTokens.flatMap(user =>
    //   user.DeviceToken.map(deviceToken => ({
    //     token: deviceToken.token,
    //     notification: { title, body: message },
    //   })),
    // );

    // if (messages.length > 0) {
    //   try {
    //     // Send notifications in batches if needed
    //     await this.firebaseAdmin?.messaging()?.sendEach(messages);
    //   } catch (error) {
    //     console.error('Failed to send some FCM notifications:', error);
    //   }
    // }

    // return notifications;
  }

  async getUserNotifications(user_id: number) {
    return this.prisma.notification.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async sendConsultantStartCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true
      }
    });

    if (!appointment || !appointment.User) {
      throw new HttpException("Receiver Not Found", HttpStatus.NOT_FOUND);
    }

    const data: CallStartPushNotificationDataPayload = {
      caller_name: appointment.Consultant?.full_name ?? "Consultant",
      caller_image: appointment.Consultant?.profile_image ?? "test",
      title: "Incoming Call",
      app: "Speaking Mate platform",
      event_type: 'incoming_call',
      user_id: `${appointment.user_id}`,
      consultant_id: `${appointment.consultant_id}`,
      consultant_name: appointment.Consultant.full_name ?? "Consultant",
      consultant_image: appointment.Consultant.profile_image ?? "test",
      appointment_token: `${appointment.token}`
    };

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.User.token,
      data,
      android: { priority: "high" }
    });

    return msg;
  }

  async sendConsultantEndCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true
      }
    });

    if (!appointment || !appointment.User) {
      throw new HttpException("Receiver Not Found", HttpStatus.NOT_FOUND);
    }

    const data: CallEndPushNotificationDataPayload = {
      title: "Call Ended",
      app: "Speaking Mate platform",
      event_type: 'call_ended',
      user_id: `${appointment.user_id}`,
      consultant_id: `${appointment.consultant_id}`,
      consultant_name: appointment.Consultant.full_name ?? "Consultant",
      ended_by: 'consultant',
      appointment_token: `${appointment.token}`
    };

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.User.token,
      data,
      android: { priority: "high" }
    });

    return msg;
  }

  async sendUserStartCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true
      }
    });

    if (!appointment || !appointment.Consultant) {
      throw new HttpException("Receiver Not Found", HttpStatus.NOT_FOUND);
    }

    const data: CallStartPushNotificationDataPayload = {
      caller_name: appointment.User?.full_name ?? "User",
      caller_image: appointment.User?.profile_image ?? "test",
      title: "Incoming Call",
      app: "Speaking Mate platform",
      event_type: 'incoming_call',
      user_id: `${appointment.user_id}`,
      consultant_id: `${appointment.consultant_id}`,
      user_name: appointment.User.full_name ?? "User",
      user_image: appointment.User.profile_image ?? "test",
      appointment_token: `${appointment.token}`
    };

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.Consultant.token,
      data,
      android: { priority: "high" }
    });

    return msg;
  }

  async sendUserEndCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true
      }
    });

    if (!appointment || !appointment.Consultant) {
      throw new HttpException("Receiver Not Found", HttpStatus.NOT_FOUND);
    }

    const data: CallEndPushNotificationDataPayload = {
      title: "Call Ended",
      app: "Speaking Mate platform",
      event_type: 'call_ended',
      user_id: `${appointment.user_id}`,
      consultant_id: `${appointment.consultant_id}`,
      user_name: appointment.User.full_name ?? "User",
      ended_by: 'user',
      appointment_token: `${appointment.token}`
    };

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.Consultant.token,
      data,
      android: { priority: "high" }
    });

    return msg;
  }
}