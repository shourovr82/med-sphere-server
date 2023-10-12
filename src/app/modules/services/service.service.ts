/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';
import {
  IServiceFilterRequest,
  ICreateNewBlogResponse,
  IServiceCreateRequest,
} from './service.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { Prisma, Service } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  serviceRelationalFields,
  serviceRelationalFieldsMapper,
  serviceSearchableFields,
} from './service.constants';

// modules

const createNewService = async (
  req: Request
): Promise<ICreateNewBlogResponse> => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadImageToCloudinary(file);

  if (uploadedImage) {
    req.body.serviceImage = uploadedImage.secure_url;
  }
  const data = req.body as IServiceCreateRequest;

  const serviceData = {
    serviceName: data.serviceName,
    description: data.description,
    serviceImage: data.serviceImage,
    location: data.location,
    categoryId: data.categoryId,
    servicePrice: data.servicePrice,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const isExistCategory = await transactionClient.category.findUnique({
      where: {
        categoryId: serviceData.categoryId,
      },
      select: {
        categoryId: true,
      },
    });

    if (!isExistCategory) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not exist');
    }

    const createdService = await transactionClient.service.create({
      data: serviceData,
      select: {
        serviceId: true,
        categoryId: true,
        createdAt: true,
      },
    });
    return createdService;
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog creation failed');
  }
  return result;
};

const getAllServices = async (
  filters: IServiceFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (serviceRelationalFields.includes(key)) {
          return {
            [serviceRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    include: {
      category: true,
      products: true,
      reviewAndRatings: {
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileId: true,
              profileImage: true,
            },
          },
        },
      },
      feedBackForms: {
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileId: true,
              profileImage: true,
            },
          },
        },
      },
      appointmentBooked: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.service.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getSingleService = async (serviceId: string): Promise<Service | null> => {
  //

  const result = await prisma.service.findUnique({
    where: {
      serviceId,
    },
    include: {
      category: true,
      products: true,
      reviewAndRatings: {
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileId: true,
              profileImage: true,
            },
          },
        },
      },
      feedBackForms: {
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileId: true,
              profileImage: true,
            },
          },
        },
      },
      appointmentBooked: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found !!!');
  }
  return result;
};

export const MedService = {
  createNewService,
  getAllServices,
  getSingleService,
};
