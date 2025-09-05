import { SetMetadata } from '@nestjs/common';
import { Role } from '../dto/role.enum';

export const HasRoles = (role: Role) => SetMetadata('role', role);
