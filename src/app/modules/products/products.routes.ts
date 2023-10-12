import express from 'express';

import auth from '../../middlewares/auth';
import { StylesController } from './products.controller';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-product',
  auth(userRole.ADMIN),
  // validateRequest(),
  StylesController.createNewStyle
);
// router.get(
//   '/',
//   auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
//   StylesController.getAllStyles
// );
// router.post(
//   '/factory-style-assign',
//   auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
//   validateRequest(StylesValidation.factoryStyleAssign),
//   StylesController.factoryStyleAssign
// );
// router.get(
//   '/get-all-style-no',
//   auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
//   StylesController.getAllStyleNumbers
// );

// router.get(
//   '/:styleNo',
//   auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
//   StylesController.getSingleStyle
// );
// router.patch(
//   '/:styleNo',
//   validateRequest(StylesValidation.updateStyle),
//   auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
//   StylesController.updateStyleInformation
// );

export const StyleRoutes = router;
