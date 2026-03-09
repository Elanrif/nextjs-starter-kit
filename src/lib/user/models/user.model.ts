export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}

export type UserUpdate = Partial<User>;

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  [key: string]: any; // Allow additional properties
}
