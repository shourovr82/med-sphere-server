import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IRequestUser } from '../users/user.interface';
import { stylesFilterableFields } from './specialization.constants';
import { SpecializationService } from './specialization.service';

const createNewSpecialization = catchAsync(async (req: Request, res: Response) => {
  const profileId = (req.user as IRequestUser).profileId;
  const result = await SpecializationService.createSpecialization(profileId, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialization created Successfully',
    data: result,
  });

});


const getAllSpecialization = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, stylesFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecializationService.getAllSpecialization(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialization fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});


export const SpecializationController = {
  createNewSpecialization,
  getAllSpecialization
};
