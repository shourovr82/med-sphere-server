/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, Prisma } from '@prisma/client';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  categoryFields,
  categoryRelationalFieldsMapper,
  categorySearchableFields
} from './category.constants';
import {
  ICategoryFilterRequest,
  ICategoryRequest,
  IUpdateCategoryRequest
} from './category.interface';

// modules

const createCategory = async (data: ICategoryRequest): Promise<Category> => {
  const result = await prisma.$transaction(async transactionClient => {
    const newCategoryData = {
      categoryName: data.categoryName,
      description: data.description
    };

    const createdSpecialization = await transactionClient.category.create({
      data: newCategoryData
    });
    return createdSpecialization;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category creation failed');
  }
  return result;
};

const getAllCategory = async (
  filters: ICategoryFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Category[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map((field: any) => ({
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
        if (categoryFields.includes(key)) {
          return {
            [categoryRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    include: {
      _count: true,
      services: true
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
  const total = await prisma.category.count({
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

// ! update Category ----------------------
const updateCategory = async (
  categoryId: string,
  payload: Partial<IUpdateCategoryRequest>
): Promise<Category | null> => {
  const isExistCategory = await prisma.category.findUnique({
    where: {
      categoryId
    }
  });

  if (!isExistCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found !!!');
  }

  const updateCategoryData = {
    categoryName: payload?.categoryName,
    description: payload?.description
  };

  const result = await prisma.category.update({
    where: {
      categoryId
    },
    data: updateCategoryData
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category Updating Failed !!!');
  }
  return result;
};

const singleDeleteCategory = async (
  categoryId: string
): Promise<Category | null> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isExistCategory = await transactionClient.category.findUnique({
      where: {
        categoryId
      }
    });

    if (!isExistCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found');
    }

    const categoryDeleted = await transactionClient.category.delete({
      where: {
        categoryId
      }
    });

    return categoryDeleted;
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Deleted');
  }
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  updateCategory,
  singleDeleteCategory
};
