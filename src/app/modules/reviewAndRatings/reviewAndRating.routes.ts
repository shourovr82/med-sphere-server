import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { SlotController } from './reviewAndRating.controller';
import { ReviewAndRatingValidation } from './reviewAndRating.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/add-review',
  auth(userRole.USER),
  validateRequest(ReviewAndRatingValidation.createReviewAndRating),
  SlotController.createNewSlot
);

export const ReviewAndRatingRoutes = router;
