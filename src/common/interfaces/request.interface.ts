import { IRequestUser } from '.';

export interface IEnhancedRequest extends Request {
  user: IRequestUser;
}
