/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Product } from '@prisma/client';
import { Request } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';

import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  ProductSearchableFields,
  productRelationalFields,
  productRelationalFieldsMapper,
} from './products.constants';
import {
  IProductCreateRequest,
  IProductFilterRequest,
  IUpdateProductRequest,
} from './products.interface';

// modules

const createNewProduct = async (
  profileId: string,
  req: Request
): Promise<Product> => {
  const data = req.body as IProductCreateRequest;

  const result = await prisma.$transaction(async transactionClient => {
    const newProductData = {
      productTitle: data.productTitle,
      productDescription: data.productDescription,
      productPrice: data.productPrice,
      productImage: data.productImage,
      profileId,
      serviceId: data.serviceId,
    };

    const createdProduct = await transactionClient.product.create({
      data: newProductData,
    });

    return createdProduct;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Style creation failed');
  }
  return result;
};

const getAllProducts = async (
  filters: IProductFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, productPrice, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ProductSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (productPrice) {
    andConditions.push({
      productPrice: {
        equals: Number(productPrice),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (productRelationalFields.includes(key)) {
          return {
            [productRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      service: {
        select: {
          serviceId: true,
          serviceName: true,
          serviceImage: true,
        },
      },
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.product.count({
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

const getSingleProduct = async (productId: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      productId,
    },
    include: {
      service: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found !!!');
  }
  return result;
};

// ! update Service ----------------------
const updateProduct = async (
  productId: string,
  payload: Partial<IUpdateProductRequest>
): Promise<Product | null> => {
  const isExistProduct = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!isExistProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found !!!');
  }

  const updateProductData = {
    productTitle: payload?.productTitle,
    productDescription: payload?.productDescription,
    productPrice: payload?.productPrice,
    productImage: payload?.productImage,
    serviceId: payload?.serviceId,
  };

  const result = await prisma.product.update({
    where: {
      productId,
    },
    data: updateProductData,
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product Updating Failed !!!');
  }
  return result;
};

const singleDeleteProduct = async (
  productId: string
): Promise<Product | null> => {
  const isExistProduct = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!isExistProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
  }

  const result = await prisma.product.delete({
    where: {
      productId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Deleted');
  }

  return result;
};

export const ProductsService = {
  createNewProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  singleDeleteProduct,
};
