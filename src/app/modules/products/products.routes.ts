import express from 'express';
import auth from '../../middlewares/auth';
import { ProductsController } from './products.controller';

import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-product',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.createNewProduct
);
router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.getAllProducts
);

router.get(
  '/:productId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.getSingleProduct
);

router.patch(
  '/:productId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.updateProduct
);

router.delete(
  '/:productId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  ProductsController.singleProductDelete
);

export const ProductsRoutes = router;
