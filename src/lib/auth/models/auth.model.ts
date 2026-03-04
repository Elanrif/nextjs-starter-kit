export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface Registrer extends AuthSignIn {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface Login extends AuthSignIn {
  email: string;
  password: string;
}

export interface SessionPayload {
  userId: string;
  expiresAt: Date;
  [key: string]: any;
}
