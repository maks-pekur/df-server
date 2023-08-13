export interface JwtPayload {
  userId: string;
  companyId: string;
  role: string;
}

export interface DecodedToken {
  userId: string;
  companyId: string;
}
