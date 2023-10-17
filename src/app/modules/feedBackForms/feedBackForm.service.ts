/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICreateFeedBackFormReq,
  ICreateFeedBackFormResponse,
  IFeedBackFilterRequest,
  IUpdateFeedBackRequest,
} from './feedBackForm.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';

import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  FeedBackSearchableFields,
  feedBackRelationalFields,
  feedBackRelationalFieldsMapper,
} from './feedBackForm.constants';
import { FeedBack, Prisma } from '@prisma/client';

// !feedBackForm
const createNewFeedBackForm = async (
  profileId: string,
  payload: ICreateFeedBackFormReq
): Promise<ICreateFeedBackFormResponse> => {
  //

  const createdNewFeedBack = await prisma.feedBack.create({
    data: {
      feedbackSubject: payload.feedbackSubject,
      feedbackDescription: payload.feedbackDescription,
      profileId,
    },
    select: {
      feedbackId: true,
      feedbackSubject: true,
      feedbackDescription: true,
      createdAt: true,
    },
  });
  if (!createdNewFeedBack) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Feedback failed to add');
  }

  return createdNewFeedBack;
};

const getAllFeedBack = async (
  filters: IFeedBackFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<FeedBack[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: FeedBackSearchableFields.map((field: any) => ({
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
        if (feedBackRelationalFields.includes(key)) {
          return {
            [feedBackRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.FeedBackWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.feedBack.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          profileId: true,
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
  const total = await prisma.feedBack.count({
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

// ! update Service ----------------------
const updateFeedBack = async (
  feedbackId: string,
  payload: Partial<IUpdateFeedBackRequest>
): Promise<FeedBack | null> => {
  const isExistFeedBack = await prisma.feedBack.findUnique({
    where: {
      feedbackId,
    },
  });

  if (!isExistFeedBack) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FeedBack Not Found !!!');
  }

  const updateFeedback = {
    feedbackSubject: payload?.feedbackSubject,
    feedbackDescription: payload?.feedbackDescription,
  };

  const result = await prisma.feedBack.update({
    where: {
      feedbackId,
    },
    data: updateFeedback,
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'FeedBack Updating Failed !!!');
  }
  return result;
};

// ! delete feedBack ----------------------

const SingleFeedbackDelete = async (
  feedbackId: string
): Promise<FeedBack | null> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isExistFeedBack = await transactionClient.feedBack.findUnique({
      where: {
        feedbackId,
      },
    });

    if (!isExistFeedBack) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Feed Back Not Found');
    }

    const feedBackDeleted = await transactionClient.feedBack.delete({
      where: {
        feedbackId,
      },
    });

    return feedBackDeleted;
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feed Back Not Deleted');
  }
  return result;
};

export const FeedBackFormService = {
  createNewFeedBackForm,
  getAllFeedBack,
  SingleFeedbackDelete,
  updateFeedBack,
};
