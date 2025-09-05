export interface TimezoneConversionOptions {
  format?: string;
  locale?: string;
}

export interface TimezoneService {
  convertToUserTimezone(
    utcDate: Date,
    userId: number,
    userType: 'user' | 'consultant',
    options?: TimezoneConversionOptions
  ): Promise<Date>;
  
  formatDateTimeForUser(
    utcDate: Date,
    userId: number,
    userType: 'user' | 'consultant',
    format?: string,
    locale?: string
  ): Promise<string>;
  
  convertToUtc(
    localDate: Date,
    userId: number,
    userType: 'user' | 'consultant'
  ): Promise<Date>;
}