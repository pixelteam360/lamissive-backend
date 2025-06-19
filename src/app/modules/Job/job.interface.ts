import { Category, Status } from "@prisma/client";

export type TJob = {
  id: string;
  title: string;
  description: string;
  date: Date;
  priceRange: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
  userId: string;
};

export type IJobFilterRequest = {
  title?: string | undefined;
  category?: string | undefined;
  searchTerm?: string | undefined;
};
