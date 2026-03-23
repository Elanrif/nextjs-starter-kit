import moment from "moment/moment";

export interface Token {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  tokenType?: string;
  scope?: string;
}

export const isTokenExpired = (token: Token, issuedAt: moment.Moment): boolean => {
  if (!token.expiresIn) return false;
  const expiry = issuedAt.clone().add(token.expiresIn, "seconds");
  return expiry.isSameOrBefore(moment());
};
