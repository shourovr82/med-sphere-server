/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICreateReviewAndRatingReq,
  ICreateReviewAndRatingResponse,
} from './reviewAndRating.interface';

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
    select: {
      reviewComment: true,
      reviewRating: true,
      createdAt: true,
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

export const RatingAndReviewService = {
  createNewRatingAndReview,
};
