import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Role } from './dto/role.enum';

@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  signJwt(user: any, role: string = Role.User): string {

    const secret = process.env.JWT_SECRET

    return this.jwtService.sign({
      ...user,
      sub: user.id,
      role,
    },
      {
        secret
      });
  }


  async verifyAsync(token) {
    const user = await this.jwtService.verifyAsync(token);
    return user;
  }

}
