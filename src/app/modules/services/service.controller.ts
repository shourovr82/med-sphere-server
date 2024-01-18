import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MedService } from './service.service';
import pick from '../../../shared/pick';
import { ServiceFilterableFields } from './service.constants';

const createNewService = catchAsync(async (req: Request, res: Response) => {
  const result = await MedService.createNewService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'service created Successfully',
    data: result
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ServiceFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await MedService.getAllServices(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services fetched successfully',
    meta: result.meta,
    data: result.data
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const result = await MedService.getSingleService(serviceId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'service retrieved successfully',
    data: result
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const result = await MedService.updateService(serviceId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service Edited successfully',
    data: result
  });
});

const SingleServiceDelete = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  await MedService.SingleServiceDelete(serviceId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'service deleted successfully'
  });
});

export const MedServiceController = {
  createNewService,
  getAllServices,
  getSingleService,
  SingleServiceDelete,
  updateService
};
