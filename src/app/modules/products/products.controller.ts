import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IRequestUser } from '../users/user.interface';
import { ProductsService } from './products.service';
import { ProductFilterableFields } from './products.constants';

const createNewProduct = catchAsync(async (req: Request, res: Response) => {
  const profileId = (req.user as IRequestUser).profileId;
  const result = await ProductsService.createNewProduct(profileId, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created Successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ProductFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ProductsService.getAllProducts(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductsService.getSingleProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductsService.updateProduct(productId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const singleProductDelete = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductsService.singleDeleteProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted successfully',
    data: result,
  });
});

export const ProductsController = {
  createNewProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  singleProductDelete,
};
