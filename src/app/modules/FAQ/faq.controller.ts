import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';
import { IRequestUser } from '../users/user.interface';

//! faq Create

const createNewFaq = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const profileId = (req.user as IRequestUser).profileId;
  const result = await FaqService.createNewFaq(profileId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faq created successfully!',
    data: result,
  });
});
//! faq get

const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getAllFaqs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faq retrieved successfully!',
    data: result,
  });
});
const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { faqId } = req.params;
  const result = await FaqService.deleteFaq(faqId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faq Deleted successfully!',
    data: result,
  });
});
const updateFaqDetails = catchAsync(async (req: Request, res: Response) => {
  const { faqId } = req.params;
  console.log(faqId);
  console.log(req.params);
  const updatedData = req.body;
  console.log(
    '🚀 ~ file: faq.controller.ts:48 ~ updateFaqDetails ~ updatedData:',
    updatedData
  );

  const result = await FaqService.updateFaqDetails(faqId, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faq Updated successfully!',
    data: result,
  });
});

export const FaqController = {
  createNewFaq,
  getAllFaqs,
  deleteFaq,
  updateFaqDetails,
};
