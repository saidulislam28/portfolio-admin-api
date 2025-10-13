import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, NotificationChannel, NotificationType, Prisma, USER_ROLE } from '@prisma/client';
import * as admin from 'firebase-admin';
import { RECIPIENT_TYPE } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  SendCallingNotificationDto,
  SendNotificationDto,
} from './dto/notification.dto';
import {
  CallPushNotificationDataPayload,
  CallPushNotificationEventType,
} from 'src/types/push-notifications';
import { ScheduleNotificationService } from 'src/schedule-notification/schedule-notification.service';

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { User: true; Consultant: true };
}>;

@Injectable()
export class NotificationService {
  private firebaseAdmin: admin.app.App;

  constructor(private prisma: PrismaService, private readonly scheduleNotification: ScheduleNotificationService) {
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

  async sendNotification(sendNotificationDto: SendNotificationDto) {
    const {
      selected_users = [],
      title,
      message,
      recipient_type,
      all_user,
      schedule_notification,
      time

    } = sendNotificationDto;


    let recipients: { token: string | null }[] = [];

    if (recipient_type === RECIPIENT_TYPE.User) {
      recipients = all_user
        ? await this.prisma.user.findMany({
          where: { token: { not: null } },
          select: { token: true, id: true },
        })
        : await this.prisma.user.findMany({
          where: {
            id: { in: selected_users },
            token: { not: null },
          },
          select: { token: true, id: true },
        });
    } else if (recipient_type === RECIPIENT_TYPE.Consultant) {
      recipients = all_user
        ? await this.prisma.consultant.findMany({
          where: { token: { not: null } },
          select: { token: true, id: true },
        })
        : await this.prisma.consultant.findMany({
          where: {
            id: { in: selected_users },
            token: { not: null },
          },
          select: { token: true, id: true },
        });
    }

    const deviceTokens = recipients
      .map((r) => r.token)
      .filter(Boolean) as string[];

    if (recipients.length > 0 && schedule_notification) {
      return await Promise.all(
        recipients.map((dev: any) => this.scheduleNotification.createNotification({
          userId: dev.id,
          sendAt: time,
          type: NotificationType.GENERAL,
          channel: NotificationChannel.PUSH,
          payload: { title, message }
        }))
      )
    }


    if (deviceTokens.length > 0) {
      const messages = deviceTokens.map((token) => ({
        token,
        notification: { title, body: message },
      }));

      try {
        await Promise.all(
          messages.map((msg) => this.firebaseAdmin.messaging().send(msg)),
        );
      } catch (error) {
        console.error('❌ Failed to send FCM notifications:', error);
      }
    }

    return {
      success: true,
      total_recipients: deviceTokens.length,
    };
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

  // called from consultant app, when consultant starts call
  async sendConsultantStartCallNotification(
    payload: SendCallingNotificationDto,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true,
      },
    });

    if (!appointment || !appointment.User) {
      throw new HttpException('Receiver Not Found', HttpStatus.NOT_FOUND);
    }

    const data: CallPushNotificationDataPayload = this.getPushDataPayload(
      appointment,
      'incoming_call',
    );

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.User.token,
      data,
      android: { priority: 'high' },
    });

    return msg;
  }

  private getPushDataPayload(
    appointment: AppointmentWithRelations,
    event_type: CallPushNotificationEventType,
  ): CallPushNotificationDataPayload {
    return {
      title: 'Incoming Call',
      event_type: event_type,
      user_id: `${appointment.user_id}`,
      user_name: `${appointment?.User?.full_name ?? 'User'}`,
      user_image: `${appointment.User?.profile_image ?? 'NOT_AVAILABLE'}`,
      consultant_id: `${appointment.consultant_id}`,
      consultant_name: appointment.Consultant.full_name ?? 'Consultant',
      consultant_image: appointment.Consultant.profile_image ?? 'NOT_AVAILABLE',
      appointment_token: `${appointment.token}`,
      appointment_id: `${appointment.id}`,
    };
  }

  // called from consultant app, when consultant ends call
  async sendConsultantEndCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true,
      },
    });

    if (!appointment || !appointment.User) {
      throw new HttpException('Receiver Not Found', HttpStatus.NOT_FOUND);
    }

    const data: CallPushNotificationDataPayload = this.getPushDataPayload(
      appointment,
      'end_call',
    );

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.User.token,
      data,
      android: { priority: 'high' },
    });

    return msg;
  }

  // called from user app, when user joins a call
  async sendUserStartCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true,
      },
    });

    if (!appointment || !appointment.Consultant) {
      throw new HttpException('Receiver Not Found', HttpStatus.NOT_FOUND);
    }

    const data: CallPushNotificationDataPayload = this.getPushDataPayload(
      appointment,
      'incoming_call',
    );

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.Consultant.token,
      data,
      android: { priority: 'high' },
    });

    return msg;
  }

  // called from user app, when user ends/rejects/declines a call 
  async sendUserEndCallNotification(payload: SendCallingNotificationDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: payload.appointment_id },
      include: {
        User: true,
        Consultant: true,
      },
    });

    if (!appointment || !appointment.Consultant) {
      throw new HttpException('Receiver Not Found', HttpStatus.NOT_FOUND);
    }

    const data: CallPushNotificationDataPayload = this.getPushDataPayload(
      appointment,
      'end_call',
    );

    const msg = await this.firebaseAdmin.messaging().send({
      token: appointment.Consultant.token,
      data,
      android: { priority: 'high' },
    });

    return msg;
  }
}
