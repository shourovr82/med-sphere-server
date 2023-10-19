/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICreateReviewAndRatingReq,
  ICreateReviewAndRatingResponse,
  IUpdateReviewRequest,
} from './reviewAndRating.interface';
import { ReviewAndRatings } from '@prisma/client';

// ! Review and Rating create
const createNewRatingAndReview = async (
  profileId: string,
  payload: ICreateReviewAndRatingReq
): Promise<ICreateReviewAndRatingResponse> => {
  //
  const isExisting = await prisma.service.findUnique({
    where: {
      serviceId: payload.serviceId,
    },
  });

  if (!isExisting) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service not found');
  }

  const createdNewRatingAndReview = await prisma.reviewAndRatings.create({
    data: {
      reviewComment: payload.reviewComment,
      reviewRating: payload.reviewRating,
      serviceId: payload.serviceId,
      profileId,
    },
  });
  if (!createdNewRatingAndReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Review and rating failed to add'
    );
  }

  return createdNewRatingAndReview;
};

// ! update Service ----------------------
const updateRatingAndReview = async (
  reviewId: string,
  payload: Partial<IUpdateReviewRequest>
): Promise<ReviewAndRatings | null> => {
  const isExistReview = await prisma.reviewAndRatings.findUnique({
    where: {
      reviewId,
    },
  });

  if (!isExistReview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Found !!!');
  }

  const updateReview = {
    reviewComment: payload?.reviewComment,
    reviewRating: payload?.reviewRating,
  };

  const result = await prisma.reviewAndRatings.update({
    where: {
      reviewId,
    },
    data: updateReview,
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review sUpdating Failed !!!');
  }
  return result;
};

// ! delete Review s----------------------

const SingleRatingAndReviewDelete = async (
  reviewId: string
): Promise<ReviewAndRatings | null> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isExistFeedBack = await transactionClient.reviewAndRatings.findUnique(
      {
        where: {
          reviewId,
        },
      }
    );

    if (!isExistFeedBack) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Found');
    }

    const feedBackDeleted = await transactionClient.reviewAndRatings.delete({
      where: {
        reviewId,
      },
    });

    return feedBackDeleted;
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Deleted');
  }
  return result;
};
const getAllMyReviews = async (
  profileId: string
): Promise<ReviewAndRatings[]> => {
  //

  const result = await prisma.reviewAndRatings.findMany({
    where: {
      profile: {
        profileId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      service: {
        select: {
          serviceName: true,
        },
      },
    },
  });

  return result;
};
export const RatingAndReviewService = {
  createNewRatingAndReview,
  updateRatingAndReview,
  SingleRatingAndReviewDelete,
  getAllMyReviews,
};
