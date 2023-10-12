import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { SlotController } from './slots.controller';
import { SlotValidation } from './slots.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.DOCTOR, userRole.SUPER_ADMIN),
  SlotController.getAllSlots
);
router.post(
  '/create-slot',
  auth(userRole.USER),
  validateRequest(SlotValidation.createSlot),
  SlotController.createNewSlot
);

export const SlotRoutes = router;
