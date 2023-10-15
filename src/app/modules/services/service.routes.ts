import express from 'express';

import auth from '../../middlewares/auth';
import { MedServiceController } from './service.controller';
// import { MedServiceValidation } from './service.validation';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-service',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  MedServiceController.createNewService
);

router.get('/', MedServiceController.getAllServices);

router.get('/:serviceId', MedServiceController.getSingleService);

router.patch(
  '/:serviceId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  MedServiceController.updateService
);

router.delete(
  '/:serviceId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  MedServiceController.SingleServiceDelete
);

export const MedServiceRoutes = router;
