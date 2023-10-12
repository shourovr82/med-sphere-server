import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RatingAndReviewService } from './reviewAndRating.service';
import { IRequestUser } from '../users/user.interface';

//! slot Create

const createNewSlot = catchAsync(async (req: Request, res: Response) => {
  const profileId = (req.user as IRequestUser).profileId;
  const result = await RatingAndReviewService.createNewRatingAndReview(
    profileId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'slot created successfully!',
    data: result,
  });
});

export const SlotController = {
  createNewSlot,
};
