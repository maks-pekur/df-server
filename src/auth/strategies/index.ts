import { JwtStrategy } from '../../jwt/strategies/jwt.strategy';
import { LocalStrategy } from './local.strategy';

export const STRATEGIES = [JwtStrategy, LocalStrategy];
