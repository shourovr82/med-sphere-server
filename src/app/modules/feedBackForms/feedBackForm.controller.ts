import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedBackFormService } from './feedBackForm.service';
import { IRequestUser } from '../users/user.interface';

//! createNewFeedBack Create

const createNewFeedBack = catchAsync(async (req: Request, res: Response) => {
  const profileId = (req.user as IRequestUser).profileId;
  const result = await FeedBackFormService.createNewFeedBackForm(
    profileId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FeedBack created successfully!',
    data: result,
  });
});

export const FeedBackController = {
  createNewFeedBack,
};
