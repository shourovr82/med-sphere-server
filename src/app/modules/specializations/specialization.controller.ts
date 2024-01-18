import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

import { SpecializationService } from './specialization.service';
import { specializationFilterableFields } from './specialization.constants';

const createNewSpecialization = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SpecializationService.createSpecialization(req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Specialization created Successfully',
      data: result
    });
  }
);

const getAllSpecialization = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, specializationFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecializationService.getAllSpecialization(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialization fetched successfully',
    meta: result.meta,
    data: result.data
  });
});

const updateSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { specializationId } = req.params;
  const result = await SpecializationService.updateSpecialization(
    specializationId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'specialization Updated successfully',
    data: result
  });
});

const deleteSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { specializationId } = req.params;
  const result = await SpecializationService.deleteSpecialization(
    specializationId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.specializationName} Deleted successfully`
  });
});

export const SpecializationController = {
  createNewSpecialization,
  getAllSpecialization,
  deleteSpecialization,
  updateSpecialization
};
