/* eslint-disable */
// src/notifications/templates/push-templates.ts

import { Appointment } from '@prisma/client';
import { format } from 'date-fns';

export type PushTemplateType =
  | 'ASSIGN_USER'
  | 'ASSIGN_CONSULTANT'
  | 'REMINDER_USER'
  | 'REMINDER_CONSULTANT';

export interface PushTemplate {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface TemplateContext {
  consultantName: string;
  formattedStartAt: string;
  appointmentId: string;
}

export const getPushTemplate = (
  type: PushTemplateType,
  context: TemplateContext
): PushTemplate => {
  const { consultantName, formattedStartAt, appointmentId } = context;

  switch (type) {
    case 'ASSIGN_USER':
      return {
        title: 'Consultant Assigned',
        body: `Your appointment has been assigned to Consultant ${consultantName}`,
        data: { appointment_id: appointmentId },
      };

    case 'ASSIGN_CONSULTANT':
      return {
        title: 'New Appointment Assigned',
        body: `You’ve been assigned to a new appointment starting at ${formattedStartAt}. Please review the details and be prepared.`,
        data: { appointment_id: appointmentId },
      };

    case 'REMINDER_USER':
      return {
        title: 'Upcoming Appointment Reminder',
        body: `Just a reminder — your appointment with Consultant ${consultantName} is scheduled for ${formattedStartAt}. Please be available on time.`,
        data: { appointment_id: appointmentId },
      };

    case 'REMINDER_CONSULTANT':
      return {
        title: 'Appointment Reminder',
        body: `This is a reminder for your upcoming appointment at ${formattedStartAt}. Please make sure you're ready to assist the client.`,
        data: { appointment_id: appointmentId },
      };

    default:
      throw new Error(`Unknown template type: ${type}`);
  }
};