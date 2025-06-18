import { UserRole } from "@prisma/client";

export type TServiceProvider = {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  expirationOtp?: Date;
  otp?: number;
  createdAt?: Date;
  updatedAt?: Date;
};


export type IServiceProviderFilterRequest = {
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
