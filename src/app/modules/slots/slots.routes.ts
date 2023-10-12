import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { SlotController } from './slots.controller';
import { SlotValidation } from './slots.validations';

const router = express.Router();

router.post(
  '/create-slot',
  validateRequest(SlotValidation.createSlot),
  SlotController.createNewSlot
);

export const SlotRoutes = router;
