/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Specialization } from '@prisma/client';
import { Request } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  specializationFields,
  specializationRelationalFieldsMapper,
  specializationSearchableFields
} from './specialization.constants';
import {
  ISpecializationFilterRequest,
  ISpecializationReq,
  IUpdateSpecializationRequest
} from './specialization.interface';

// modules

const createSpecialization = async (req: Request): Promise<Specialization> => {
  const data = req.body as ISpecializationReq;

  const result = await prisma.$transaction(async transactionClient => {
    const isExistSpecializationName =
      await transactionClient.specialization.findUnique({
        where: {
          specializationName: data?.specializationName
        }
      });
    if (isExistSpecializationName)
      throw new ApiError(
        httpStatus.CONFLICT,
        'Specialization Name Already Exist. try new'
      );

    const newSpecializationData: ISpecializationReq = {
      specializationName: data.specializationName,
      description: data.description
    };

    const createdSpecialization = await transactionClient.specialization.create(
      {
        data: newSpecializationData
      }
    );
    return createdSpecialization;
  });

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Specialization creation failed'
    );
  }
  return result;
};

const getAllSpecialization = async (
  filters: ISpecializationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Specialization[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: specializationSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (specializationFields.includes(key)) {
          return {
            [specializationRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.SpecializationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.specialization.findMany({
    include: {
      doctors: true
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
  const total = await prisma.specialization.count({
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

// ! update Service ----------------------
const updateSpecialization = async (
  specializationId: string,
  payload: Partial<IUpdateSpecializationRequest>
): Promise<Specialization | null> => {
  const isExist = await prisma.specialization.findUnique({
    where: {
      specializationId
    }
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'specialization Not Found !!!');
  }
  const isExistSpecializationName = await prisma.specialization.findUnique({
    where: {
      specializationName: payload?.specializationName
    }
  });
  if (isExistSpecializationName)
    throw new ApiError(
      httpStatus.CONFLICT,
      'Specialization Name Already Exist. try new'
    );
  const updateData = {
    specializationName: payload?.specializationName,
    description: payload?.description
  };

  const result = await prisma.specialization.update({
    where: {
      specializationId
    },
    data: updateData
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Updating Failed !!!');
  }
  return result;
};

const deleteSpecialization = async (
  specializationId: string
): Promise<Specialization | null> => {
  const isExist = await prisma.specialization.findUnique({
    where: {
      specializationId
    }
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'specialization Not Found');
  }

  const result = await prisma.specialization.delete({
    where: {
      specializationId
    }
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'specialization Not Deleted');
  }

  return result;
};

export const SpecializationService = {
  createSpecialization,
  getAllSpecialization,
  deleteSpecialization,
  updateSpecialization
};
