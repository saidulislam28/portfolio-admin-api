import { Inject,Injectable, Logger } from '@nestjs/common';
import { format as formatWithoutTimezone } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  format,
  formatInTimeZone,
  fromZonedTime,
  toZonedTime,
} from 'date-fns-tz';

import { UserCacheService } from '../user-cache/interfaces/user-cache.interface';
import { TimezoneConversionOptions,TimezoneService } from './interfaces/timezone.interface';

@Injectable()
export class TimezoneServiceImpl implements TimezoneService {
  private readonly logger = new Logger(TimezoneServiceImpl.name);
  private readonly DEFAULT_FORMAT = "hh:mm a 'on' MMMM d, yyyy";
  private readonly DEFAULT_TIMEZONE = 'UTC';

  constructor(
    @Inject('UserCacheService') private userCacheService: UserCacheService,
  ) {}

  /**
   * Convert UTC date to user's timezone (as a Date object representing the same instant,
   * but interpreted as local time in their zone)
   */
  async convertToUserTimezone(
    utcDate: Date,
    userId: number,
    userType: 'user' | 'consultant',
    options: TimezoneConversionOptions = {}
  ): Promise<Date> {
    try {
      const userInfo = await this.userCacheService.getUserInfo(userId, userType);
      const timezone = userInfo?.timezone || this.DEFAULT_TIMEZONE;

      if (timezone === 'UTC') {
        return utcDate;
      }

      // toZonedTime returns a Date that represents the same instant,
      // but with the local time in the given timezone
      const zonedDate = toZonedTime(utcDate, timezone);

      this.logger.debug(
        `Converted ${utcDate.toISOString()} from UTC to ${timezone}: ${zonedDate.toISOString()}`
      );

      return zonedDate;
    } catch (error) {
      this.logger.error(
        `Error converting timezone for ${userType} ${userId}:`,
        error
      );
      return utcDate;
    }
  }

  /**
   * Format datetime for user in their timezone
   */
  async formatDateTimeForUser(
    utcDate: Date,
    userId: number,
    userType: 'user' | 'consultant',
    formatString: string = this.DEFAULT_FORMAT,
    locale: string = 'en-US'
  ): Promise<string> {
    try {
      const userInfo = await this.userCacheService.getUserInfo(userId, userType);
      const timezone = userInfo?.timezone || this.DEFAULT_TIMEZONE;

      // Use formatInTimeZone to format UTC date in user's timezone
      const formattedDate = formatInTimeZone(utcDate, timezone, formatString, {
        locale: this.getDateFnsLocale(locale),
      });

      this.logger.debug(
        `Formatted ${utcDate.toISOString()} for ${userType} ${userId} in ${timezone}: ${formattedDate}`
      );

      return formattedDate;
    } catch (error) {
      this.logger.error(
        `Error formatting datetime for ${userType} ${userId}:`,
        error
      );
      // Fallback to UTC formatting
      return formatWithoutTimezone(utcDate, formatString, {
        locale: this.getDateFnsLocale(locale),
      });
    }
  }

  /**
   * Convert a local date (interpreted in user's timezone) to UTC
   */
  async convertToUtc(
    localDate: Date,
    userId: number,
    userType: 'user' | 'consultant'
  ): Promise<Date> {
    try {
      const userInfo = await this.userCacheService.getUserInfo(userId, userType);
      const timezone = userInfo?.timezone || this.DEFAULT_TIMEZONE;

      if (timezone === 'UTC') {
        return localDate;
      }

      // fromZonedTime interprets `localDate` as being in `timezone` and returns a UTC Date
      const utcDate = fromZonedTime(localDate, timezone);

      this.logger.debug(
        `Converted local time ${localDate.toISOString()} in ${timezone} to UTC: ${utcDate.toISOString()}`
      );

      return utcDate;
    } catch (error) {
      this.logger.error(
        `Error converting to UTC for ${userType} ${userId}:`,
        error
      );
      return localDate; // fallback
    }
  }

  /**
   * Bulk format multiple dates for different users
   */
  async bulkFormatDateTimeForUsers(
    conversions: Array<{
      utcDate: Date;
      userId: number;
      userType: 'user' | 'consultant';
      format?: string;
    }>,
    locale: string = 'en-US'
  ): Promise<Array<{ userId: number; userType: 'user' | 'consultant'; formattedDate: string }>> {
    try {
      const promises = conversions.map(async ({ utcDate, userId, userType, format }) => {
        const formattedDate = await this.formatDateTimeForUser(
          utcDate,
          userId,
          userType,
          format,
          locale
        );
        return {
          userId,
          userType,
          formattedDate,
        };
      });

      return await Promise.all(promises);
    } catch (error) {
      this.logger.error('Error in bulk datetime formatting:', error);
      throw error;
    }
  }

  /**
   * Get timezone info for a user
   */
  async getUserTimezone(userId: number, userType: 'user' | 'consultant'): Promise<string> {
    try {
      const userInfo = await this.userCacheService.getUserInfo(userId, userType);
      return userInfo?.timezone || this.DEFAULT_TIMEZONE;
    } catch (error) {
      this.logger.error(`Error getting timezone for ${userType} ${userId}:`, error);
      return this.DEFAULT_TIMEZONE;
    }
  }

  /**
   * Check if timezone is valid
   */
  isValidTimezone(timezone: string): boolean {
    try {
      const now = new Date();
      toZonedTime(now, timezone); // test parsing
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current time in user's timezone (as a UTC Date object representing that instant)
   */
  async getCurrentTimeForUser(userId: number, userType: 'user' | 'consultant'): Promise<Date> {
    const now = new Date();
    return this.convertToUserTimezone(now, userId, userType);
  }

  /**
   * Check if current time is within business hours for user
   */
  async isWithinBusinessHours(
    userId: number,
    userType: 'user' | 'consultant',
    startHour: number = 9,
    endHour: number = 17
  ): Promise<boolean> {
    try {
      const userTime = await this.getCurrentTimeForUser(userId, userType);
      const hour = userTime.getHours();
      return hour >= startHour && hour < endHour;
    } catch (error) {
      this.logger.error(`Error checking business hours for ${userType} ${userId}:`, error);
      return true; // default allow
    }
  }

  /**
   * Get date-fns locale object
   */
  private getDateFnsLocale(locale: string) {
    return enUS; // extend as needed
  }
}