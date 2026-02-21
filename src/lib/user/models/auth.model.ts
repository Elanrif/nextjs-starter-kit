export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface Registration extends AuthSignIn {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password1: string;
  password2: string;
  general_conditions: boolean;
  privacy_policy: boolean;
}
export interface RegistrationMbango extends AuthSignIn {
  name: string;
  phone_number: string;
  description: string;
  currency: string;
}
export interface Login extends AuthSignIn {
  email: string;
  password: string;
}
