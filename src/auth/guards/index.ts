import { JwtAuthGuard } from '../../jwt/guards/jwt-auth.guard';
import { RolesGuard } from '../../roles/guards/roles.guard';
import { LocalAuthGuard } from './local-auth.guard';

export const GUARDS = [JwtAuthGuard, RolesGuard, LocalAuthGuard];
