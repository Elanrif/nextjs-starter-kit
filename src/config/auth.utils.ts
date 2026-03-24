import moment from "moment/moment";

export interface Token {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  token_type?: string;
  scope?: string;
}

/**
 * Vérifie si le token est expiré.
 * Utilise expiresIn (secondes) + issuedAt (optionnel) ou une date d'expiration calculée.
 */
export const isTokenExpired = (token: Token, issuedAt: moment.Moment): boolean => {
  if (!token.expires_in) return false;
  const expiry = issuedAt.clone().add(token.expires_in, "seconds");
  return expiry.isSameOrBefore(moment());
};
