import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { Job } from 'bull';
import { format } from 'date-fns';
import { mockDeep } from 'jest-mock-extended';
import { FcmPushService } from 'src/fcm/fcm.push.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { PushNotificationProcessor } from './push-notification.processor';
import { getPushTemplate, PushTemplateType } from 'src/notifications/templates/push-templates';

// Mock dependencies
jest.mock('../notifications/templates/push-templates', () => ({
  getPushTemplate: jest.fn(),
}));

describe('PushNotificationProcessor', () => {
  let processor: PushNotificationProcessor;
  const prismaMock = mockDeep<PrismaService>();
  const fcmPushMock = mockDeep<FcmPushService>();

  const mockJob = {
    data: {
      user_id: 1,
      consultant_id: 101,
      start_at: new Date(Date.now() + 60 * 1000 * 30), // 30 mins from now
      Consultant: {
        full_name: 'Dr. Smith',
      },
      id: 999,
    },
  } as unknown as Job<any>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PushNotificationProcessor,
        { provide: PrismaService, useValue: prismaMock },
        { provide: FcmPushService, useValue: fcmPushMock },
      ],
    }).compile();

    processor = moduleRef.get<PushNotificationProcessor>(PushNotificationProcessor);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should send FCM push notifications and schedule reminders', async () => {
    const formattedStartAt = format(mockJob.data.start_at, "hh:mm a 'on' MMMM d, yyyy");

    // Mock template responses
    (getPushTemplate as jest.Mock).mockImplementation((type: PushTemplateType) => {
      const templates: Record<PushTemplateType, any> = {
        ASSIGN_USER: {
          title: 'Consultant Assigned',
          body: `Your appointment has been assigned to Consultant Dr. Smith`,
          data: { appointment_id: '999' },
        },
        ASSIGN_CONSULTANT: {
          title: 'New Appointment Assigned',
          body: `You’ve been assigned to a new appointment starting at ${formattedStartAt}. Please review the details and be prepared.`,
          data: { appointment_id: '999' },
        },
        REMINDER_USER: {
          title: 'Upcoming Appointment Reminder',
          body: `Just a reminder — your appointment with Consultant Dr. Smith is scheduled for ${formattedStartAt}. Please be available on time.`,
          data: { appointment_id: '999' },
        },
        REMINDER_CONSULTANT: {
          title: 'Appointment Reminder',
          body: `This is a reminder for your upcoming appointment at ${formattedStartAt}. Please make sure you're ready to assist the client.`,
          data: { appointment_id: '999' },
        },
      };
      return templates[type];
    });

    // Mock DB responses
    prismaMock.user.findFirst.mockResolvedValue({ token: 'user-fcm-token' } as any);
    prismaMock.consultant.findFirst.mockResolvedValue({ token: 'consultant-fcm-token' } as any);

    await processor.sendPushNotificationAfterAssign(mockJob);

    // Check FCM calls
    expect(fcmPushMock.sendFcmPush).toHaveBeenCalledTimes(2);
    expect(fcmPushMock.sendFcmPush).toHaveBeenCalledWith(
      ['user-fcm-token'],
      'Consultant Assigned',
      'Your appointment has been assigned to Consultant Dr. Smith',
      { appointment_id: '999' }
    );
    expect(fcmPushMock.sendFcmPush).toHaveBeenCalledWith(
      ['consultant-fcm-token'],
      'New Appointment Assigned',
      expect.stringContaining('starting at'),
      { appointment_id: '999' }
    );

    // Check scheduled notifications
    expect(prismaMock.scheduleNotification.create).toHaveBeenCalledTimes(2);
    expect(prismaMock.scheduleNotification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: 1,
          payload: expect.objectContaining({
            title: 'Upcoming Appointment Reminder',
          }),
        }),
      })
    );
    expect(prismaMock.scheduleNotification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          consultant_id: 101,
          payload: expect.objectContaining({
            title: 'Appointment Reminder',
          }),
        }),
      })
    );
  });

  it('should handle missing consultant gracefully', async () => {
    const jobWithoutConsultant = { ...mockJob, data: { ...mockJob.data, Consultant: null } };
    const consoleSpy = jest.spyOn(processor['logger'], 'warn');

    await processor.sendPushNotificationAfterAssign(jobWithoutConsultant);

    expect(consoleSpy).toHaveBeenCalledWith('Consultant not found for appointment 999');
    expect(fcmPushMock.sendFcmPush).not.toHaveBeenCalled();
  });
});