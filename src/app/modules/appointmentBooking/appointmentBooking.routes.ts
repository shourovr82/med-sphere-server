import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AppointmentBookingController } from './appointmentBooking.controller';
import { AppointmentBookingValidation } from './appointmentBooking.validations';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/add-booking',
  auth(userRole.USER),
  validateRequest(AppointmentBookingValidation.createAppointmentBooking),
  AppointmentBookingController.createNewAppointmentBooking
);

export const AppointmentBookingRoutes = router;
