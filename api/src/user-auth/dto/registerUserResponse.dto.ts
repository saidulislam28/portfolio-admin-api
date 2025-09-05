import { RegisterUserDto } from './registerUser.dto';

export class RegisterUserResponseDto{
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  access_token?: string;
}
