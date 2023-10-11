/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Styles } from '@prisma/client';
import { Request } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  stylesRelationalFields,
  stylesRelationalFieldsMapper,
  stylesSearchableFields,
} from './styles.constants';
import {
  IAssignedStyleResponse,
  IFactoryAssignToStyleResponse,
  IGetAllStyleNo,
  IStyleCreateRequest,
  IStylesFilterRequest,
  IUpdateStyleRequest,
} from './styles.interface';

// modules

const createNewStyle = async (
  profileId: string,
  req: Request
): Promise<Styles> => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadStyleImageToCloudinary(
    file
  );

  if (uploadedImage) {
    req.body.image = uploadedImage.secure_url;
  }
  const data = req.body as IStyleCreateRequest;

  const result = await prisma.$transaction(async transactionClient => {
    const isExistStyleNo = await prisma.styles.findUnique({
      where: {
        styleNo: data.styleNo,
      },
    });
    if (isExistStyleNo) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Style No is already added');
    }

    const isExistItem = await prisma.item.findUnique({
      where: {
        itemId: data?.itemId,
      },
    });
    if (!isExistItem) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Item Not Found');
    }

    const newStyleData = {
      styleNo: data.styleNo,
      itemId: data.itemId,
      image: data?.image,
      fabric: data.fabric,
      profileId,
    };
    const createdStyle = await transactionClient.styles.create({
      data: newStyleData,
      include: {
        profile: true,
      },
    });
    return createdStyle;
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Style creation failed');
  }
  return result;
};

const getAllStyles = async (
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

const getAllStyleNumbers = async (
  filters: IStylesFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<IGetAllStyleNo[]>> => {
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
    select: {
      styleNo: true,
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

const getSingleStyle = async (styleNo: string): Promise<Styles | null> => {
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
const updateStyleInformation = async (
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

// ! factory style assign
const factoryStyleAssign = async (
  data: IFactoryAssignToStyleResponse
): Promise<IAssignedStyleResponse> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isExistStyleNo = await prisma.styles.findUnique({
      where: {
        styleNo: data?.styleNo,
      },
    });
    if (!isExistStyleNo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Style not Found');
    }
    const isExistFactory = await prisma.factory.findUnique({
      where: {
        factoryId: data?.factoryId,
      },
    });
    if (!isExistFactory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Factory Not Found');
    }

    const factoryData = {
      factoryId: data.factoryId,
    };
    const assignedStyle = await transactionClient.styles.update({
      where: {
        styleNo: data.styleNo,
      },
      data: factoryData,
      select: {
        styleNo: true,
        factory: true,
      },
    });
    return assignedStyle;
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Style creation failed');
  }
  return result;
};

export const StylesService = {
  createNewStyle,
  getAllStyles,
  getSingleStyle,
  updateStyleInformation,
  getAllStyleNumbers,
  factoryStyleAssign,
};
