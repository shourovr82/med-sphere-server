import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { FeedBackController } from './feedBackForm.controller';
import { FeedBackValidation } from './feedBackForm.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/add-feedback',
  validateRequest(FeedBackValidation.createFeedBack),
  FeedBackController.createNewFeedBack
);

router.get('/', FeedBackController.getAllFeedBack);

router.patch(
  '/:feedbackId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  FeedBackController.updateFeedBack
);

router.delete(
  '/:feedbackId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  FeedBackController.singleFeedBackDelete
);

export const FeedBackRoutes = router;
