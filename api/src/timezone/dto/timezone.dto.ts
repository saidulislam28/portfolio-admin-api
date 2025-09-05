export class ConvertTimezoneDto {
  utcDate: Date;
  userId: number;
  userType: 'user' | 'consultant';
  format?: string;
  locale?: string;
}

export class BulkConvertTimezoneDto {
  conversions: Array<{
    utcDate: Date;
    userId: number;
    userType: 'user' | 'consultant';
    format?: string;
  }>;
  locale?: string;
}
