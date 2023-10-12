/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICreateFeedBackFormReq,
  ICreateFeedBackFormResponse,
} from './feedBackForm.interface';

// !feedBackForm
const createNewFeedBackForm = async (
  profileId: string,
  payload: ICreateFeedBackFormReq
): Promise<ICreateFeedBackFormResponse> => {
  //
  const isExisting = await prisma.service.findUnique({
    where: {
      serviceId: payload.serviceId,
    },
  });

  if (!isExisting) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service not found');
  }

  const createdNewFeedBack = await prisma.feedBackForm.create({
    data: {
      feedbackComment: payload.feedbackComment,
      serviceId: payload.serviceId,
      profileId,
    },
    select: {
      createdAt: true,
      feedbackComment: true,
    },
  });
  if (!createdNewFeedBack) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Review and rating failed to add'
    );
  }

  return createdNewFeedBack;
};

export const FeedBackFormService = {
  createNewFeedBackForm,
};
