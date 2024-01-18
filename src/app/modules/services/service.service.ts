/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import {
  IServiceFilterRequest,
  IServiceCreateRequest,
  IUpdateServiceRequest,
  ICreateNewServiceResponse
} from './service.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { Prisma, Service } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  serviceRelationalFields,
  serviceRelationalFieldsMapper,
  serviceSearchableFields
} from './service.constants';

// modules

const createNewService = async (
  data: IServiceCreateRequest
): Promise<ICreateNewServiceResponse> => {
  const serviceData = {
    serviceName: data.serviceName,
    description: data.description,
    serviceImage: data.serviceImage,
    location: data.location,
    categoryId: data.categoryId,
    servicePrice: data.servicePrice,
    serviceStatus: data.serviceStatus
  };

  console.log(serviceData);

  const result = await prisma.$transaction(async transactionClient => {
    const isExistCategory = await transactionClient.category.findUnique({
      where: {
        categoryId: serviceData.categoryId
      },
      select: {
        categoryId: true
      }
    });
    if (!isExistCategory) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not exist');
    }
    const isExistServiceName = await transactionClient.service.findFirst({
      where: {
        serviceName: serviceData.serviceName
      },
      select: {
        serviceName: true
      }
    });

    if (isExistServiceName) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Service Name Already  exist, try different Name'
      );
    }

    const createdService = await transactionClient.service.create({
      data: serviceData
    });
    return createdService;
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service creation failed');
  }
  return result;
};

const getAllServices = async (
  filters: IServiceFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, servicePrice, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (servicePrice) {
    andConditions.push({
      servicePrice: {
        equals: Number(servicePrice)
      }
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (serviceRelationalFields.includes(key)) {
          return {
            [serviceRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key]
            }
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key]
            }
          };
        }
      })
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    include: {
      category: true,
      products: true,
      reviewAndRatings: true,
      appointmentBooked: true
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc'
          }
  });
  const total = await prisma.service.count({
    where: whereConditions
  });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage
    },
    data: result
  };
};

const getSingleService = async (serviceId: string): Promise<Service | null> => {
  //

  const result = await prisma.service.findUnique({
    where: {
      serviceId
    },
    include: {
      products: true,
      _count: {
        select: {
          reviewAndRatings: true,
          appointmentBooked: true
        }
      },
      reviewAndRatings: {
        include: {
          profile: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      appointmentBooked: true,
      category: true
    }
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found !!!');
  }
  return result;
};

// ! update Service ----------------------
const updateService = async (
  serviceId: string,
  payload: Partial<IUpdateServiceRequest>
): Promise<Service | null> => {
  const isExistService = await prisma.service.findUnique({
    where: {
      serviceId
    }
  });

  if (!isExistService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found !!!');
  }

  const updateServiceData = {
    serviceName: payload?.serviceName,
    description: payload?.description,
    serviceImage: payload?.serviceImage,
    location: payload?.location,
    categoryId: payload?.categoryId,
    servicePrice: payload?.servicePrice,
    serviceStatus: payload?.serviceStatus
  };

  const result = await prisma.service.update({
    where: {
      serviceId
    },
    data: updateServiceData
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service Updating Failed !!!');
  }
  return result;
};

// ! delete Service ----------------------

const SingleServiceDelete = async (
  serviceId: string
): Promise<Service | null> => {
  //

  const isExistService = await prisma.service.findUnique({
    where: {
      serviceId
    }
  });

  if (!isExistService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found !!!');
  }

  const result = await prisma.service.delete({
    where: {
      serviceId
    }
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not deleted !!!');
  }

  return result;
};

export const MedService = {
  createNewService,
  getAllServices,
  getSingleService,
  SingleServiceDelete,
  updateService
};
