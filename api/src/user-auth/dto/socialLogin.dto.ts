export class SocialLoginDto {
  social_id: string;
  social_login_provider: string;
  email?: string;
  push_token?: string;
  first_name?: string;
  last_name?: string;
}
