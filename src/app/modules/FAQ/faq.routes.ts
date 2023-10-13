import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get('/', FaqController.getAllFaqs);

router.post(
  '/create-faq',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(FaqValidation.createFaq),
  FaqController.createNewFaq
);
router.delete(
  '/delete/:faqId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  FaqController.deleteFaq
);
router.patch(
  '/update/:faqId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(FaqValidation.updateFaq),
  FaqController.updateFaqDetails
);

export const FaqRoutes = router;
