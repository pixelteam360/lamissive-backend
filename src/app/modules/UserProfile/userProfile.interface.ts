import { Gender } from "@prisma/client";

export type TClientProfile = {
  id: string;
  fullName: string;
  location: string;
  gender: Gender;
  age: number;
  image?: string;
  let: number;
  lan: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type TEmployProfile = {
  id: string;
  fullName: string;
  location: string;
  image?: string;
  let: number;
  lan: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type TServiceProviderProfile = {
  id: string;
  fullName: string;
  location: string;
  gender: Gender; 
  age: number;
  exprience: number;
  expertise: string;
  mobile: string;
  image?: string;
  let: number;
  lan: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
