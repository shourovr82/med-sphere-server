import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { categoryFilterableFields } from './category.constants';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created Successfully',
    data: result
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await CategoryService.getAllCategory(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    meta: result.meta,
    data: result.data
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const result = await CategoryService.updateCategory(categoryId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Updated successfully',
    data: result
  });
});

const singleCategoryDelete = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const result = await CategoryService.singleDeleteCategory(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.categoryName} Deleted successfully `
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  updateCategory,
  singleCategoryDelete
};
