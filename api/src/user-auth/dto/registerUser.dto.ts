export class RegisterUserDto {
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  push_token?: string;
  package_id?: number;
  origin_id?: number;
  feeling_id?: number;
  improvement_id?: number;
}
