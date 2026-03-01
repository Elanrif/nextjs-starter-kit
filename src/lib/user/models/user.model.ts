export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}

export type UserUpdate = Partial<User>;

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
}
