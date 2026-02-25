import { Token } from "@config/auth.utils";

export interface User {
  id: number;
  url: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: string | null;
  is_staff: boolean;
  date_joined: string;
  phone_number?: string;
  general_conditions: boolean;
  privacy_policy: boolean;
}

export type UserUpdate = Partial<User>;

export interface UserStats {
  count_beneficiaries: number;
  count_billing_addresses: number;
  count_orders: number;
  count_shipping_addresses: number;
}

export interface UserWithToken extends User {
  token: Token;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
interface Session {
  user: UserWithToken;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
type JWT = UserWithToken;
