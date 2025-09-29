/* eslint-disable  */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Role } from './dto/role.enum';

@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  signJwt(user: any, role: string = Role.User): string {

    console.log("role guard from role", role);
    console.log("role guard from user>>>", user);

    const secret = process.env.JWT_SECRET

    return this.jwtService.sign({
      ...user,
      sub: user.id,
      role: user?.role ?? role,
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
