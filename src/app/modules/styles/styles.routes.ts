import express, { NextFunction, Request, Response } from 'express';

import { UserRoles } from '@prisma/client';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StylesController } from './styles.controller';
import { StylesValidation } from './styles.validation';

const router = express.Router();

router.post(
  '/create-style',
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = StylesValidation.createStyle.parse(JSON.parse(req.body.data));
    return StylesController.createNewStyle(req, res, next);
  }
);
router.get(
  '/',
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  StylesController.getAllStyles
);
router.post(
  '/factory-style-assign',
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  validateRequest(StylesValidation.factoryStyleAssign),
  StylesController.factoryStyleAssign
);
router.get(
  '/get-all-style-no',
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  StylesController.getAllStyleNumbers
);

router.get(
  '/:styleNo',
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  StylesController.getSingleStyle
);
router.patch(
  '/:styleNo',
  validateRequest(StylesValidation.updateStyle),
  auth(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPERADMIN),
  StylesController.updateStyleInformation
);

export const StyleRoutes = router;
