export interface IRequestUser {
  userId: string;
  companyId: string;
  role: string;
}

export interface ResponseError extends Error {
  statusCode?: number;
}

export interface IEnhancedRequest extends Request {
  user: IRequestUser;
}
