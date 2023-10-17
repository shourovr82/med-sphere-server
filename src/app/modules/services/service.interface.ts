import { serviceStatus } from '@prisma/client';

/* eslint-disable no-unused-vars */
export type IServiceCreateRequest = {
  serviceName: string;
  description: string;
  serviceImage: string;
  location: string;
  categoryId: string;
  servicePrice: number;
  serviceStatus: serviceStatus;
};

export type IServiceFilterRequest = {
  searchTerm?: string | undefined;
  categoryId?: string | undefined;
  servicePrice?: string | undefined;
};

export type IUpdateServiceRequest = {
  serviceName?: string;
  description?: string;
  serviceImage?: string;
  location?: string;
  categoryId?: string;
  servicePrice?: number;
  serviceStatus?: serviceStatus;
};

export type ICreateNewServiceResponse = {
  serviceName: string;
  description: string;
  serviceImage: string;
  location: string;
  categoryId: string;
  servicePrice: number;
};
