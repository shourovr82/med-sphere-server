import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { SlotController } from './slots.controller';
import { SlotValidation } from './slots.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get('/', SlotController.getAllSlots);
router.post(
  '/create-slot',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(SlotValidation.createSlot),
  SlotController.createNewSlot
);

router.delete(
  '/:slotId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  // validateRequest(SlotValidation.createSlot),
  SlotController.deleteSlot
);

export const SlotRoutes = router;
