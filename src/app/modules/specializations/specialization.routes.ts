import express from 'express';

import { userRole } from '@prisma/client';

import auth from '../../middlewares/auth';

import { SpecializationController } from './specialization.controller';

const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  SpecializationController.createNewSpecialization
);
router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  SpecializationController.getAllSpecialization
);

export const SpecializationRoutes = router;
