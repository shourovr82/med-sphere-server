import { Service } from '@prisma/client';

export type ICategoryFilterRequest = {
  searchTerm?: string | undefined;
  categoryId?: string | undefined;
  categoryName?: string | undefined;
};
export type ICategoryRequest = {
  categoryId: string;
  categoryName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  services: Service[];
};

export type IUpdateCategoryRequest = {
  categoryName?: string;
  description?: string;
};
