import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { FeedBackController } from './feedBackForm.controller';
import { FeedBackValidation } from './feedBackForm.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/add-feedback',
  auth(userRole.USER),
  validateRequest(FeedBackValidation.createFeedBack),
  FeedBackController.createNewFeedBack
);

export const FeedBackRoutes = router;
