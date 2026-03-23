import moment from "moment/moment";

export interface Token {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // secondes (ex: 300)
  refreshExpiresIn?: number;
  tokenType?: string;
  scope?: string;
}

/**
 * Vérifie si le token est expiré.
 * Utilise expiresIn (secondes) + issuedAt (optionnel) ou une date d'expiration calculée.
 */
export const isTokenExpired = (token: Token, issuedAt: moment.Moment): boolean => {
  const expiry = issuedAt.clone().add(token.expiresIn, "seconds");
  return expiry.isSameOrBefore(moment());
};
