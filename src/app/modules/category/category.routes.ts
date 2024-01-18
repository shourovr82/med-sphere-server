import express from 'express';

import { userRole } from '@prisma/client';

import auth from '../../middlewares/auth';

import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.post(
  '/create-category',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(CategoryValidation.createCategory),
  CategoryController.createCategory
);

router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  CategoryController.getAllCategory
);

router.patch(
  '/update/:categoryId',
  validateRequest(CategoryValidation.updateCategory),
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  CategoryController.updateCategory
);

router.delete(
  '/:categoryId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  CategoryController.singleCategoryDelete
);

export const CategoryRoutes = router;
