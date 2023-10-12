import express, { NextFunction, Request, Response } from 'express';

import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import { MedServiceController } from './service.controller';
import { MedServiceValidation } from './service.validation';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-service',
  auth(userRole.ADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = MedServiceValidation.createService.parse(
      JSON.parse(req.body.data)
    );
    return MedServiceController.createNewService(req, res, next);
  }
);
router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  MedServiceController.getAllServices
);
router.get(
  '/:serviceId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  MedServiceController.getSingleService
);

export const MedServiceRoutes = router;
