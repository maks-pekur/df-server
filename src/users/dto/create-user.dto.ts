import { UserRole } from 'src/types';

export class CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  isVerified: boolean;
  password?: string;
}
