/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

import prisma from '../../../shared/prisma';

import {
  ICreateProductRequest,
  IProductCreateRequest,
} from './products.interface';

// modules

const createNewProduct = async (
  profileId: string,
  data: IProductCreateRequest
): Promise<ICreateProductRequest> => {
  const result = await prisma.$transaction(async transactionClient => {
    const newProductData = {
      productTitle: data.productTitle,
      productDescription: data.productDescription,
      productPrice: data.productPrice,
      productImage: data.productImage,
      serviceId: data.serviceId,
      profileId,
    };

    const createdProduct = await transactionClient.product.create({
      data: newProductData,
      select: {
        createdAt: true,
        productTitle: true,
      },
    });

    return createdProduct;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product creation failed');
  }
  return result;
};

const getAllProducts = async (
  filters: IStylesFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Styles[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: stylesSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  // Add date range condition if both startDate and endDate are provided
  if (startDate && endDate) {
    andConditions.push({
      createdAt: {
        gte: startDate, // Greater than or equal to startDate
        lte: endDate, // Less than or equal to endDate
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (stylesRelationalFields.includes(key)) {
          return {
            [stylesRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.StylesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.styles.findMany({
    include: {
      profile: true,
      orders: true,
      factory: true,
      BulkProductionStatus: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          profile: true,
        },
      },
      PPStrikeOffStatus: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profileId: true,
              profileImage: true,
              role: true,
            },
          },
        },
      },
      ldCpAopStatus: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      PPSubmission: true,
      tackPack: true,
      couriers: true,
      item: true,
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
  const total = await prisma.styles.count({
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

const getSingleProduct = async (styleNo: string): Promise<Styles | null> => {
  //

  const result = await prisma.styles.findUnique({
    where: {
      styleNo,
    },
    include: {
      profile: true,
      orders: true,
      BulkProductionStatus: {
        include: {
          profile: true,
        },
      },
      PPStrikeOffStatus: {
        include: {
          profile: true,
        },
      },
      couriers: true,
      factory: true,
      item: true,
      ldCpAopStatus: true,
      PPSubmission: true,
      tackPack: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Style Not Found !!!');
  }
  return result;
};

// ! update style ----------------------
const updateProduct = async (
  styleNo: string,
  payload: Partial<IUpdateStyleRequest>
): Promise<Styles | null> => {
  const isExistStyle = await prisma.styles.findUnique({
    where: {
      styleNo,
    },
  });
  if (!isExistStyle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Style Not Found !!!');
  }

  if (payload?.factoryId) {
    const isFactoryExist = await prisma.factory.findUnique({
      where: {
        factoryId: payload?.factoryId,
      },
    });
    if (!isFactoryExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Factory Not Found !!!');
    }
  }
  if (payload?.itemId) {
    const isExistItem = await prisma.item.findUnique({
      where: {
        itemId: payload?.itemId,
      },
    });

    if (!isExistItem) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Item Not Found');
    }
    if (isExistItem) {
      payload.itemId = isExistItem.itemId;
    }
  }

  const updateStyleData = {
    itemId: payload?.itemId,
    image: payload?.image,
    fabric: payload?.fabric,
    isActiveStyle: payload?.isActiveStyle,
    factoryId: payload?.factoryId,
  };

  const result = await prisma.styles.update({
    where: {
      styleNo,
    },
    data: updateStyleData,
    include: {
      factory: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Style Updating Failed !!!');
  }
  return result;
};

export const StylesService = {
  createNewProduct,
};
