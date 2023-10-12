import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SlotService } from './slots.service';

//! slot Create

const createNewSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await SlotService.createNewSlot(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

export const SlotController = {
  createNewSlot,
};
