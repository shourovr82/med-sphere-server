import express from 'express';

import { userRole } from '@prisma/client';

import auth from '../../middlewares/auth';

import { CategoryController  } from './category.controller';


const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  CategoryController.createCategory
);

router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  CategoryController.getAllCategory
);



export const CategoryRoutes = router;
