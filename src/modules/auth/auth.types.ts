export interface DecodedPayload {
  sub: number; // userId
  iat?: number;
  exp?: number;
  type: TokenType;
  permissions?: number;
}

export enum TokenType {
  ACCESS,
  REFRESH,
}
