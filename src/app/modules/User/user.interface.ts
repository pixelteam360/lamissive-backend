import { UserRole } from "@prisma/client";

export type TUser = {
  id?: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  expirationOtp?: Date;
  otp?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserFilterRequest = {
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
