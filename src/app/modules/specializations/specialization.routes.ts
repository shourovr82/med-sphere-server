import express from 'express';

import { userRole } from '@prisma/client';

import auth from '../../middlewares/auth';

import { SpecializationController } from './specialization.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SpecializationValidation } from './specialization.validation';

const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(SpecializationValidation.createSpecialization),
  SpecializationController.createNewSpecialization
);

router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  SpecializationController.getAllSpecialization
);

router.patch(
  '/:specializationId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(SpecializationValidation.updateSpecialization),
  SpecializationController.updateSpecialization
);

router.delete(
  '/:specializationId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  SpecializationController.deleteSpecialization
);

export const SpecializationRoutes = router;
