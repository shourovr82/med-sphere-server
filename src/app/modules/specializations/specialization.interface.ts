import { Doctor } from '@prisma/client';

export type ISpecializationFilterRequest = {
  searchTerm?: string | undefined;
  specializationId?: string | undefined;
  specializationName?: string | undefined;
};
export type ISpecializationRequest = {
  specializationId: string;
  specializationName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  doctors: Doctor[];
};
export type IUpdateSpecializationRequest = {
  specializationName?: string;
  description?: string;
  createdAt: string;
};
