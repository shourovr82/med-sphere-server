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
    message: 'slot created successfully!',
    data: result,
  });
});

//! get all slots

const getAllSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await SlotService.getAllSlots();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'slot retrieved successfully!',
    data: result,
  });
});

export const SlotController = {
  createNewSlot,
  getAllSlots,
};
