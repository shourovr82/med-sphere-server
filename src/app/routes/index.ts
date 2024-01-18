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
import { FaqRoutes } from '../modules/FAQ/faq.routes';
import { ProductsRoutes } from '../modules/products/products.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/slots',
    route: SlotRoutes
  },
  {
    path: '/blogs',
    route: BlogRoutes
  },
  {
    path: '/specialization',
    route: SpecializationRoutes
  },
  {
    path: '/services',
    route: MedServiceRoutes
  },
  {
    path: '/categories',
    route: CategoryRoutes
  },
  {
    path: '/review-ratings',
    route: ReviewAndRatingRoutes
  },
  {
    path: '/feedbacks',
    route: FeedBackRoutes
  },
  {
    path: '/appointment-booking',
    route: AppointmentBookingRoutes
  },
  {
    path: '/faqs',
    route: FaqRoutes
  },
  {
    path: '/products',
    route: ProductsRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
