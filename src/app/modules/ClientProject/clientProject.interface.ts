import { Category, Status, UserRole } from "@prisma/client";

export type TClientProject = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  priceRange: string;
  category: Category; 
  status: Status;     
  userId: string;
  serviceProviderId?: string
  bidPrice: number
};

export type IClientProjectFilterRequest = {
  status?: string | undefined;
  category?: string | undefined;
  searchTerm?: string | undefined;
};
