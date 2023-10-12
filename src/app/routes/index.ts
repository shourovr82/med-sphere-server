import express from 'express';

import { UserRoutes } from '../modules/users/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { SlotRoutes } from '../modules/slots/slots.routes';
import { BlogRoutes } from '../modules/blogs/blogs.routes';
import { SpecializationRoutes } from '../modules/specializations/specialization.routes';
import { MedServiceRoutes } from '../modules/services/service.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { ReviewAndRatingRoutes } from '../modules/reviewAndRatings/reviewAndRating.routes';
import { FeedBackRoutes } from '../modules/feedBackForms/feedBackForm.routes';
import { AppointmentBookingRoutes } from '../modules/appointmentBooking/appointmentBooking.routes';
// import { AuthRoutes } from '../modules/auth/auth.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/slots',
    route: SlotRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/specialization',
    route: SpecializationRoutes,
  },
  {
    path: '/services',
    route: MedServiceRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/review-ratings',
    route: ReviewAndRatingRoutes,
  },
  {
    path: '/feedback-forms',
    route: FeedBackRoutes,
  },
  {
    path: '/appointment-booking',
    route: AppointmentBookingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
