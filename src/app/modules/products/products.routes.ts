import express from 'express';

import auth from '../../middlewares/auth';

import { ProductsController } from './products.controller';

import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './products.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(ProductValidation.createProduct),
  ProductsController.createNewProduct
);
router.get('/', ProductsController.getAllProducts);

router.get('/:productId', ProductsController.getSingleProduct);

router.patch(
  '/:productId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(ProductValidation.updateProduct),
  ProductsController.updateProduct
);

router.delete(
  '/:productId',

  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.singleProductDelete
);

export const ProductsRoutes = router;
