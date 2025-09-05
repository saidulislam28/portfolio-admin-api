
export class UpdateUserInfoDto {
  id: number;
  timezone?: string;
  pushToken?: string;
  type: 'user' | 'consultant';
}
