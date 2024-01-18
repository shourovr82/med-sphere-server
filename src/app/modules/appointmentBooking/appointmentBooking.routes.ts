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
router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  AppointmentBookingController.getAllAppointment
);
router.get(
  '/my-booking',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  AppointmentBookingController.getMyAppointment
);
router.patch(
  '/update/:appointmentId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  // validateRequest(AppointmentBookingValidation.createAppointmentBooking),
  AppointmentBookingController.updateAppointment
);

router.delete(
  '/:appointmentId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN),
  AppointmentBookingController.deleteAppointment
);

export const AppointmentBookingRoutes = router;
