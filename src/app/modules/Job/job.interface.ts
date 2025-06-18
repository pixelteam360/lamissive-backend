import { Category, Status, UserRole } from "@prisma/client";

export type TJob = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  priceRange: string;
  category: Category; 
  status: Status;     
  userId: string;
};

export type IJobFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
